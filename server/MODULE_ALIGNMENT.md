You are working in the `server/` NestJS backend of a School Management System monorepo.
The `academic-years` module is the reference implementation — fully polished, with Prisma
integration, Swagger docs, DTOs, and tests. Your job is to bring every other module up to
that same standard, one module at a time.

## Step 0 — Study the reference module first

Before touching anything else, thoroughly read every file in the `academic-years` module
(controller, service, module, DTOs, entities/mappers, any Swagger decorators, validation
pipes, error handling, and its spec/e2e tests). Extract and internalize its conventions,
including but not limited to:

- Folder/file structure and naming
- DTO structure (request/response, validation decorators from class-validator)
- Swagger decorators: @ApiTags, @ApiOperation, @ApiOkResponse (note: raw arrays use
  `@ApiOkResponse({ type: XDto, isArray: true })` at the controller level),
  @ApiExtraModels usage per-controller (not accumulated in main.ts), date fields typed
  as `string` with `format: 'date-time'`
- Prisma query patterns in the service layer (select/include shape, error handling,
  use of transactions if any)
- How relations are exposed in responses (e.g. StudentEnrollment-style join handling)
- Response wrapping/pagination pattern, if present, and note that NestJS Swagger doesn't
  support true generics — check if a class-factory pattern is used for paginated responses
- Linting/formatting conventions (this repo's eslint.config.mjs and .prettierrc —
  singleQuote, trailingComma: all)
- Test coverage style (unit + e2e) for the module

Do not proceed to Step 1 until you can summarize these conventions back concisely.

## Step 1 — Inventory the target modules

List every other module under `server/src` (or wherever modules live) that needs to be
aligned. Cross-reference against the schema models: AcademicYear (done), StudentEnrollment,
ClassTeacher, Class, Attendance, Exam, Assignment, Result — plus any others that already
exist in the codebase (e.g. Students, Teachers, Subjects if present on the server side).
Confirm the current state of each (stub-only, partially built, or mismatched conventions)
before making changes.

## Step 2 — Git workflow: strictly one branch = one commit = one module

Branches for these modules already exist. For each module:

1. Check out its existing branch (do not create a new one).
2. Make ALL changes needed to bring that module fully in line with the academic-years
   conventions — and only that module. Do not touch files belonging to other modules in
   this branch/commit.
3. Stage and create exactly ONE commit for the whole module, using Conventional Commits
   format, e.g.:
   `refactor(server): align class-teacher module with academic-years conventions`
   or `feat(server): add swagger docs to attendance module`
   (use `fix`/`feat`/`refactor` as appropriate to what was actually done)
4. Do not push. Leave each branch with its single commit for review.
5. Move to the next module's branch and repeat.

If a branch's existing work is already partially aligned, still land the remaining changes
as a single commit rather than multiple incremental commits.

## Step 3 — Per-module checklist (apply to each)

For every module, ensure:

- [ ] DTOs exist for all request/response shapes with proper class-validator decorators
- [ ] Swagger decorators applied consistently (@ApiTags, @ApiOperation, @ApiOkResponse,
      @ApiExtraModels per-controller) matching the academic-years pattern exactly
- [ ] Array responses use `isArray: true` at the controller decorator level, not wrapped
      DTOs unless the reference module does that
- [ ] Date fields typed as `string` + `format: 'date-time'`
- [ ] Many-to-many relationships use explicit join models (already the case for
      ClassTeacher) rather than implicit Prisma join tables
- [ ] Unique constraints match schema intent (e.g. compound `@@unique` where a global
      unique would be wrong — mirror the Class.name + academicYearId pattern for anything
      analogous)
- [ ] Denormalized fields (e.g. academicYearId on Result) are handled the same way in
      the service layer as the reference module
- [ ] Error handling (NotFoundException, etc.) matches the reference module's approach
- [ ] Code passes `pnpm lint` and `pnpm format` with no new warnings
- [ ] Existing tests still pass; add/update unit tests to match reference module's
      test coverage style

## Step 4 — Report back

After each module's commit, give a short summary of what changed and flag anything where
the module's requirements genuinely diverge from academic-years (e.g. Result's
denormalized academicYearId) so those intentional differences aren't mistaken for
inconsistency.

Do not restructure the academic-years module itself — it's the source of truth.
Do not squash or rewrite other branches' existing history beyond adding this one commit.
