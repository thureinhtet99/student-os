# Module Alignment Task — `students`

## Objective

Bring `server/src/modules/students/` into full structural, stylistic, and
behavioral conformance with the two reference implementations:

- **`academic-years`** — canonical reference for DTO shape, Swagger decorators,
  Prisma query style, error handling, and test structure.
- **`classes`** — canonical reference for hydrated-response GET endpoints,
  flat-ID write DTOs, and reusable response DTOs across POST/GET.

Do not invent new patterns. Every deviation you fix should be justified by
pointing at the specific line/pattern in one of the two reference modules.

This is a single-module pass. Do not touch any other module.

## Before you touch anything

1. Read `server/src/modules/academic-years/` in full: controller, service,
   module, all DTOs, and both spec files.
2. Read `server/src/modules/classes/` in full, same scope.
3. Read `server/CONTRIBUTING.md` (or root `CONTRIBUTION-GUIDELINE.md`) for
   branch naming and commit conventions.
4. Read `server/src/common/academic-year-context/academic-year-context.service.ts`
   to confirm the current fallback contract:
   `dto.academicYearId ?? await this.academicYearContext.getActiveId()`.

Do not start editing target modules until you can articulate, in your own
words, why each reference file looks the way it does.

## Target module

`students` only — controller, service, module, all DTOs
(`student.dto.ts`, `create-student.dto.ts`, `update-student.dto.ts`,
`query-student-dto.ts`, `student-response.dto.ts`), and both spec files.

Do this work directly on the current branch — do not create a new branch.
One squashed commit on merge.

## Alignment checklist (apply to `students`)

### DTOs

- [ ] Request DTOs are **flat**: relations are referenced by ID
      (`studentIds: string[]`, `academicYearId: string`, etc.), never nested
      objects, on both create and update DTOs.
- [ ] Response DTOs are **fully hydrated**: nested relation objects, not bare
      IDs, matching what `classes`' `ClassResponseDto` does.
- [ ] Where a POST (201) and GET (200) return the same shape, they share one
      response DTO class — do not duplicate it.
- [ ] `academicYearId` handling follows the two-line fallback pattern
      exactly where the entity is year-scoped:
      `dto.academicYearId ?? await this.academicYearContext.getActiveId()`.
- [ ] Query/filter DTOs extend the common `QueryDto` / pagination DTO the
      same way `academic-years`' does — same param names, same decorators.
- [ ] All DTOs have complete `@ApiProperty` / `@ApiPropertyOptional` and
      `class-validator` decorators — no bare fields copied without
      validation.

### Swagger

- [ ] Controller endpoints have the full decorator set used in
      `academic-years.controller.ts` / `classes.controller.ts`:
      `@ApiOperation`, `@ApiResponse` (success + relevant error codes),
      `@ApiParam`/`@ApiQuery` where applicable.
- [ ] Any paginated list endpoint uses the `PaginatedResponse(ItemDto)`
      class-factory from `server/src/common/dto/paginated-response.dto.ts`,
      with `@ApiExtraModels` on the controller — never a raw generic.

### Prisma query style

- [ ] Reads use `select` (recursively, down through nested relations), not
      `include`, so the Prisma result shape matches the response DTO shape
      without a manual mapping/formatter step doing the heavy lifting.
- [ ] Where a formatter in `server/src/common/formatters/` already exists
      for this entity, the service uses it rather than re-implementing
      shaping logic inline. If one doesn't exist and the module needs one,
      create it following the shape of `class.formatter.ts` /
      `student.formatter.ts`.
- [ ] Many-to-many relations with any metadata use explicit join models
      (à la `ClassTeacher`), not Prisma implicit many-to-many. Flag (don't
      silently fix) any implicit m2m you find — that's a schema/migration
      change, out of scope for a pure alignment pass unless instructed.
- [ ] Cascade behavior matches the established convention:
      `SetNull` where dependent rows should survive a parent delete,
      `Restrict`/`NoAction` where deletion must be blocked until refs are
      cleared. Flag any inconsistency rather than changing schema
      unilaterally.

### Error handling

- [ ] Uses the shared `PrismaClientExceptionFilter` / `AllExceptionsFilter`
      path — no ad hoc try/catch swallowing Prisma errors inside services.
- [ ] Not-found / conflict cases throw the same Nest exception types
      (`NotFoundException`, `ConflictException`, etc.) that
      `academic-years.service.ts` throws for equivalent cases.

### Tests

- [ ] `*.service.spec.ts` and `*.controller.spec.ts` exist and mirror the
      structure/coverage of `academic-years.service.spec.ts` and
      `academic-years.controller.spec.ts` — same describe-block
      organization, same use of mocked Prisma service, same edge cases
      covered (not-found, validation failure, academic-year fallback).
- [ ] No test is deleted or weakened to make the alignment pass — if a
      behavior change breaks a test, the test should be updated to assert
      the new (correct) behavior, not removed.

### Naming & structure

- [ ] File and class naming matches the convention exactly:
      `<module>.dto.ts`, `create-<module>.dto.ts`, `update-<module>.dto.ts`,
      `query-<module>-dto.ts` or `query-<module>.dto.ts` (match whichever
      the reference modules use — check both, they may differ slightly;
      note the discrepancy if so rather than guessing).
- [ ] No dead code, no leftover TODOs from earlier scaffolding, no unused
      imports.

## Process

1. Diff `students`' DTOs/service/controller against the reference pattern.
   Write a short list of concrete deviations before changing code.
2. Fix deviations in small, reviewable commits on the branch (these get
   squashed on merge, but keep them logically separable while working).
3. Run the module's existing tests; update/extend them to cover whatever
   you changed.
4. Run `pnpm lint` and `pnpm build` (or the Makefile targets) before
   considering the branch done.
5. Squash to one commit, Conventional Commits format, e.g.:
   `refactor(server): align students module with academic-years pattern`
6. Open the PR against `development`, squash-merge per `CONTRIBUTING.md`.

## Explicitly out of scope for this pass

- Any module other than `students`.
- Schema/migration changes (new fields, new join tables, cascade behavior
  changes) — flag these as findings, don't implement them here.
- The open term/semester-layer question — not part of this alignment work.
- Mobile app wiring — backend only.

## Deliverable

Once complete on the current branch, open a squashed PR targeting the
`development` branch that brings `students` to parity with
`academic-years`/`classes`, plus a short findings note (in the PR
description) for anything you deliberately left unchanged because it needed
a schema decision rather than a pure refactor.

Once merged, delete this file.
