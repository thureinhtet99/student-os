# Agent Task: Centralized Academic Year Context

## Context

This is a NestJS backend (`server/`) using Prisma + pnpm, in a monorepo with a mobile app (Expo/React Native) and a web app (Vite/React). We follow a strict workflow:

- **One git branch per module/feature, one squashed commit per branch.**
- Branch naming: `<scope>/<type>/<short-description>` — scope is `server`, `mobile`, or `repo`; type follows Conventional Commits (`feat`, `fix`, `refactor`, etc.).
- Commit messages follow **Conventional Commits**.
- The `academic-years` module is the **canonical reference implementation** for DTOs, Swagger decorators, Prisma usage, error handling, test coverage, and linting. Match its patterns exactly — don't invent new conventions.
- Swagger: class-factory pattern for `PaginatedResponse(itemType)`, per-controller `@ApiExtraModels()`, `isArray: true` on `@ApiOkResponse` for raw arrays, `PaginationMetaDto` for pagination metadata.

## Goal

Right now, every module that needs an `academicYearId` (Class, Enrollment, TeachingAssignment, Attendance, Exam, Result) requires the caller to pass it explicitly. We want a **centralized "active academic year" context** so:

1. The frontend can set a global "session year" (like a header dropdown showing available years, with the current one marked as default), and every subsequent API call is implicitly scoped to that year via an `x-academic-year-id` header.
2. If no header is sent, requests fall back to whichever `AcademicYear` row has `isCurrent = true`.
3. Callers can still explicitly pass `academicYearId` in a DTO/query to override — this is not a hard global-only restriction, just a smart default with fallback resolution.

The `AcademicYear` model already exists in `schema.prisma` with an `isCurrent` boolean.

## Work Breakdown (execute as separate branches, in this order)

---

### Branch 1 — `server/feat/academic-year-context`

Create a shared, request-scoped context module that resolves the active academic year for the current request.

**Files to create** under `src/common/academic-year/`:

- `academic-year-context.service.ts`
- `academic-year-context.module.ts`

**Requirements:**

- `AcademicYearContextService` is `@Injectable({ scope: Scope.REQUEST })`, injects `REQUEST` (from `@nestjs/core`) and `PrismaService`.
- Exposes `async getActiveId(): Promise<string>`:
  1. Reads header `x-academic-year-id` (export this string as a named constant `ACADEMIC_YEAR_HEADER` so it isn't a magic string anywhere else in the codebase).
  2. If present, validate the id exists in `academic_years` via `findUnique`. If it doesn't exist, throw `NotFoundException` with a clear message referencing the header name.
  3. If absent, query `academicYear.findFirst({ where: { isCurrent: true } })`. If none exists, throw `NotFoundException` explaining that no year is marked current and no header was provided.
  4. Cache the resolved id on the instance for the lifetime of the request (it's request-scoped, so this is safe) to avoid resolving twice in the same request.
- `AcademicYearContextModule` is `@Global()`, imports `PrismaModule`, provides and exports `AcademicYearContextService`. Register it in `AppModule.imports` (one-time addition — call this out explicitly in the PR/commit description since it touches `app.module.ts`, which other branches also touch).

**Tests:** Follow the `academic-years` module's existing test conventions. Cover:

- Resolves from header when present and valid.
- Throws `NotFoundException` when header id doesn't exist.
- Falls back to `isCurrent: true` row when no header.
- Throws `NotFoundException` when no header and no current year exists.
- Caches the result — verify Prisma is only queried once even if `getActiveId()` is called twice within the same (mocked) request scope.

**Commit:** `feat(server): add request-scoped academic year context resolver`

---

### Branch 2 — `server/feat/academic-years-set-current`

Extend the existing `academic-years` module (service + controller) with the ability to mark a year as current, and to fetch the current one directly.

**Service additions:**

- `setCurrent(id: string): Promise<AcademicYear>` — verify the id exists (reuse whatever `findOneOrThrow`-style helper the module already has; if none exists, follow the module's existing not-found error pattern). Inside a `prisma.$transaction`, first `updateMany({ where: { isCurrent: true }, data: { isCurrent: false } })`, then `update({ where: { id }, data: { isCurrent: true } })`, returning the updated row.
- `getCurrent(): Promise<AcademicYear>` — `findFirst({ where: { isCurrent: true } })`; throw the module's standard not-found error if none exists.

**Controller additions** (match existing Swagger decorator style in this controller exactly):

- `PATCH /academic-years/:id/set-current` → calls `setCurrent`. `@ApiOperation`, `@ApiOkResponse({ type: AcademicYearResponseDto })`.
- `GET /academic-years/current` → calls `getCurrent`. **Route ordering matters** — this static route must be declared _before_ any `GET /academic-years/:id` route in the controller, or Nest will try to match `"current"` as an `:id` param.

**Also add a migration note (do not auto-generate a migration that changes indexes) in the PR description** flagging that Prisma cannot express a partial unique index, and that a DB-level guard for "only one `isCurrent = true` row" would need a manual SQL addition to a migration:

```sql
CREATE UNIQUE INDEX academic_years_one_current_idx ON academic_years ((true)) WHERE "isCurrent" = true;
```

Do not add this automatically — just leave the note. The app-level transaction in `setCurrent` is the enforced guarantee for now.

**Tests:** cover `setCurrent` (including that it un-sets any previously current year) and `getCurrent` (including the not-found case), following existing module test patterns.

**Commit:** `feat(server): add set-current and get-current endpoints to academic-years module`

---

### Branch 3 — `server/feat/class-academic-year-default`

Wire the `Class` module onto the context resolver as the first consumer (this becomes the template for later modules).

**Changes:**

- In `CreateClassDto`, make `academicYearId` optional (`@IsOptional() @IsString()`), update its `@ApiPropertyOptional` description to state it defaults to the active academic year when omitted.
- In `ClassesService`, inject `AcademicYearContextService`. In `create()`:
  ```ts
  const academicYearId =
    dto.academicYearId ?? (await this.academicYearContext.getActiveId());
  ```
- In the list/query DTO for `findAll`, keep `academicYearId` as an optional filter — same fallback pattern (explicit query param wins, else active context). Don't force every list call through the header; the query param override must keep working for admins deliberately browsing another year.
- Do **not** change the `@@unique([name, academicYearId])` constraint or anything else in `schema.prisma`.

**Tests:** add/update service tests to cover:

- `create()` uses `dto.academicYearId` when explicitly provided (context resolver not called, or called and ignored — assert via mock that the explicit value wins).
- `create()` falls back to `academicYearContext.getActiveId()` when omitted.
- `findAll()` same override/fallback behavior for the query filter.

**Commit:** `feat(server): default Class academicYearId to active academic year context`

---

### Branches 4+ — repeat the Branch 3 pattern per remaining module

One branch each, same two-line pattern (`dto.academicYearId ?? await this.academicYearContext.getActiveId()`) applied to `create` (and `findAll` filters where applicable):

1. `server/feat/enrollment-academic-year-default`
2. `server/feat/teaching-assignment-academic-year-default`
3. `server/feat/attendance-academic-year-default`
4. `server/feat/exam-academic-year-default`
5. `server/feat/result-academic-year-default`

For each: inject `AcademicYearContextService`, apply the fallback in `create`, keep any existing `academicYearId` query filters overridable, add/update tests mirroring Branch 3, and use commit message `feat(server): default <Module> academicYearId to active academic year context`.

## Constraints / Things Not To Do

- Do not touch `mobile/` or the web app in any of these branches — backend only.
- Do not modify `schema.prisma` (no new fields, no new migrations) — `isCurrent` already exists.
- Do not remove the ability to pass an explicit `academicYearId` anywhere — this is an additive default, not a breaking change.
- Do not add the partial unique index migration automatically — flag it in the PR description only, as noted above.
- Match the `academic-years` module's existing file layout, DTO validation style, error classes, and test structure exactly. If something in this prompt conflicts with an established pattern in that module, follow the module's existing pattern and note the deviation in your summary.
- Each branch should be independently reviewable and buildable — Branch 1 must land (or at least exist) before Branches 2–8 can compile, since they all depend on `AcademicYearContextService`.

## Definition of Done (per branch)

- `pnpm lint` and `pnpm test` pass.
- New/changed public methods have Swagger decorators matching the reference module.
- Squashed into a single commit on the branch, Conventional Commits format, as specified above.
- Short PR/commit description summarizing what changed and calling out the two flags above (the `AppModule` import in Branch 1, and the manual index SQL note in Branch 2).
