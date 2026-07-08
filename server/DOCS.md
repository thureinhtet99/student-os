# Module Alignment — Progress Log

## Step 0 — Reference Conventions (from `academic-years`)

### File Structure (per module)
```
modules/<name>/
  <name>.controller.ts
  <name>.service.ts
  <name>.module.ts
  dto/
    <name>-response.dto.ts
    create-<name>.dto.ts
    update-<name>.dto.ts
    query-<name>.dto.ts
  <name>.controller.spec.ts   (optional)
  <name>.service.spec.ts      (optional)
```
All cross-module imports use `.js` extension (ESM).

### Controller conventions
- `@ApiTags('Plural Name')`
- `@Roles(ADMIN_ROLES | TEACHING_ROLES | ALL_AUTHENTICATED)` from `../../common/constants/role.constant.js`
- `@Controller('kebab-case-plural')`
- Each method has `@ApiOperation({ summary })` and `@ApiOkResponse({ type })` — **uses `ApiOkResponse`, not `ApiResponse`**
- `findAll` uses `@ApiPaginatedResponse(XResponseDto)` from `../../common/dto/paginated-response.dto.js` (NOT `@ApiResponse({ type: PaginatedResponseDto })`)
- `remove` returns `{ message: string }` with `@ApiOkResponse({ schema: { example: { message: 'X deleted successfully' } } })`

### DTO conventions
- All DTOs use class-validator: `@IsString`, `@IsNotEmpty`, `@IsOptional`, `@IsDateString`, `@IsBoolean`, `@IsNumber`, `@Min`, `@MaxLength`, etc.
- Numeric query params use `@Type(() => Number)` from class-transformer
- Response DTOs are pure shape classes with `@ApiProperty` (no validators, no `PickType` chains that pull validators)
- `QueryDto` from `../../common/dto/query.dto` provides `search`, `page`, `limit`; specific query DTOs `extends OmitType(QueryDto, [...])` when omitting fields
- `UpdateDto = PartialType(OmitType(CreateDto, [...immutableFields]))` from `@nestjs/swagger` + `@nestjs/mapped-types`

### Service conventions
- `@Injectable()`, takes `PrismaService` via constructor
- Uses `prisma.<model>.findUnique/findMany/create/update/delete`
- Throws `NotFoundException('X is not found')` consistently
- `create`: returns raw Prisma result (no formatter) for simple models
- `findAll`: builds `where`, `count`+`findMany` with `skip`/`take`/`orderBy`, returns `{ data, meta: { total, page, limit, totalPages } }`
- `findOne`: `findUnique({ where: { id } })`, throws if null, returns raw
- `update`: fetches existing, throws if null, calls `update`
- `remove`: fetches existing, throws if null, calls `delete`, returns `{ message: 'X deleted successfully' }`

### Module conventions
- `imports: [PrismaModule]` (NOT `DatabaseModule`)
- `controllers`, `providers`, optionally `exports: [Service]`

### Lint/Format
- `.prettierrc`: `singleQuote: true`, `trailingComma: 'all'`
- `eslint.config.mjs`: `@typescript-eslint/no-explicit-any: off`, `no-floating-promises: warn`, `no-unsafe-argument: warn`, `prettier/prettier: error`

## Step 1 — Module Inventory

| # | Module | Schema Model | Branch | Current State |
|---|--------|--------------|--------|---------------|
| ✅ | academic-years | AcademicYear | server/feat/academic-year-endpoints | **reference (complete)** |
| 1 | admins | Admin | server/feat/admin-module | mostly aligned; uses `DatabaseModule`; uses `ApiResponse`/`ApiOkResponse` mix; uses `UserResponseDto` PickType; uses checkDuplicate util; has specs |
| 2 | announcements | Announcement | server/feat/announcement-api | missing Swagger decorators; uses `DatabaseModule`; has service/formatter; missing specs |
| 3 | attendances | Attendance | server/feat/attendance-api | uses `ApiResponse` (not `ApiOkResponse`); `findAll` `@ApiResponse` wrong type; uses `DatabaseModule`; has specs |
| 4 | classes | Class | server/feat/class-api | uses `ApiResponse`; `findAll` uses raw `PaginatedResponseDto`; has specs; uses checkDuplicate pattern; has formatter |
| 5 | enrollments | Enrollment | server/feat/student-enrollment-endpoints | uses `ApiResponse`; `findAll` raw `PaginatedResponseDto`; no specs; uses `PrismaModule`; no formatter |
| 6 | exams | Exam | server/feat/exam-api | uses `ApiResponse`; `findAll` raw `PaginatedResponseDto`; has specs; uses `DatabaseModule`; has formatter |
| 7 | parents | Parent | server/feat/parent-api | missing Swagger; uses `DatabaseModule`; has formatter; has specs |
| 8 | results | Result | server/feat/result-api | uses `ApiResponse`; `findAll` raw `PaginatedResponseDto`; has specs; uses `DatabaseModule`; has formatter; DTO uses non-conventional `exam_id` (snake) |
| 9 | students | Student | server/feat/student-api | missing Swagger; uses `DatabaseModule`; has formatter; has specs |
| 10 | subjects | Subject | server/feat/subject-api | missing Swagger; uses `DatabaseModule`; has formatter; has specs |
| 11 | teachers | Teacher | server/feat/teacher-api | missing Swagger; uses `DatabaseModule`; has formatter; has specs |
| 12 | teaching-assignments | TeachingAssignment | server/feat/lesson-api | controller/service/module present; uses `ApiResponse`; `findAll` raw `PaginatedResponseDto`; uses `PrismaModule`; no specs; no formatter; only CRUD basics |

Note: Task spec mentions `ClassTeacher` model — that does **not** exist in the current `schema.prisma`. The equivalent is `TeachingAssignment` (a many-to-many join of Teacher × Subject × Class × AcademicYear). Will flag in commit.

## Step 2/3 — Per-Module Alignment Plan

For each module, the changes will be:

1. **Module file**: switch `imports: [DatabaseModule]` → `imports: [PrismaModule]` (where applicable).
2. **Controller**: replace `ApiResponse` with `ApiOkResponse`; replace raw `PaginatedResponseDto` with `@ApiPaginatedResponse`; add `@ApiTags` and `@ApiOperation` where missing.
3. **Service**: keep Prisma call patterns; switch to plain raw-return style for simple modules (drop formatter) or keep formatter for modules that genuinely expose relations (admins, students, teachers, parents). The reference module doesn't use a formatter — its response DTOs are flat and match the Prisma model directly.
4. **DTOs**: ensure `class-validator` decorators, `class-transformer` `@Type` for numbers, response DTOs are pure shape classes (no validator leakage from PickType).
5. **Specs**: ensure each module's `*.controller.spec.ts` and `*.service.spec.ts` follow academic-years' "should be defined" pattern.

## Per-Module Action Items

### 1. admins
- Add `@ApiTags('Admins')` (currently uses `UserRole.SUPER_ADMIN` directly instead of constant — align to `ADMIN_ROLES` or keep SUPER_ADMIN-only as intentional)
- Add `@ApiOperation` and `@ApiOkResponse` to all methods
- Switch `findAll` to `@ApiPaginatedResponse(AdminResponseDto)`
- Switch `imports` to `PrismaModule`
- `AdminResponseDto` extends `PickType(UserResponseDto, ...)` — leaks validators and the field `adminId!` is a non-validated shadow of `id`. Decision: make it a flat shape class with `@ApiProperty`.
- The schema's Admin model doesn't have `name`/`email` — it has `employeeCode` and a `user` relation. Formatter handles this. Keep the formatter.

### 2. announcements
- Add `@ApiTags('Announcements')`, `@ApiOperation`, `@ApiOkResponse`
- Switch to `@ApiPaginatedResponse`
- Switch `imports` to `PrismaModule`
- Add `.controller.spec.ts` and `.service.spec.ts`

### 3. attendances
- Switch `ApiResponse` → `ApiOkResponse`
- Fix `findAll` `@ApiResponse` — should be `@ApiPaginatedResponse(AttendanceResponseDto)`
- Switch `imports` to `PrismaModule`

### 4. classes
- Switch `ApiResponse` → `ApiOkResponse`
- `findAll` `@ApiResponse` → `@ApiPaginatedResponse(ClassResponseDto)`
- Switch `imports` to `PrismaModule`
- `class-response-dto.ts` returns null `createdAt`/`updatedAt` from formatter — that's a real bug (schema has both). Decision: keep formatter, fix to pass through `createdAt`/`updatedAt` from Prisma.

### 5. enrollments
- Switch `ApiResponse` → `ApiOkResponse`
- `findAll` → `@ApiPaginatedResponse(EnrollmentResponseDto)`
- Already uses `PrismaModule` ✅
- Add controller/service specs

### 6. exams
- Switch `ApiResponse` → `ApiOkResponse`
- `findAll` → `@ApiPaginatedResponse(ExamResponseDto)`
- Switch `imports` to `PrismaModule`

### 7. parents
- Add `@ApiTags('Parents')`, `@ApiOperation`, `@ApiOkResponse`
- `findAll` → `@ApiPaginatedResponse`
- Switch `imports` to `PrismaModule`

### 8. results
- Switch `ApiResponse` → `ApiOkResponse`
- `findAll` → `@ApiPaginatedResponse`
- Switch `imports` to `PrismaModule`
- **Schema divergence**: Result has denormalized `academicYearId` AND a `grade String?` field. Note this in commit message. The DTO uses `exam_id` (snake_case) — rename to `examId` to match schema.

### 9. students
- Add `@ApiTags('Students')`, `@ApiOperation`, `@ApiOkResponse`
- `findAll` → `@ApiPaginatedResponse`
- Switch `imports` to `PrismaModule`

### 10. subjects
- Add `@ApiTags('Subjects')`, `@ApiOperation`, `@ApiOkResponse`
- `findAll` → `@ApiPaginatedResponse`
- Switch `imports` to `PrismaModule`

### 11. teachers
- Add `@ApiTags('Teachers')`, `@ApiOperation`, `@ApiOkResponse`
- `findAll` → `@ApiPaginatedResponse`
- Switch `imports` to `PrismaModule`

### 12. teaching-assignments
- Switch `ApiResponse` → `ApiOkResponse`
- `findAll` → `@ApiPaginatedResponse(TeachingAssignmentResponseDto)`
- Already uses `PrismaModule` ✅
- Add controller/service specs
- **Schema divergence**: `@@unique([teacherId, subjectId, classId, academicYearId])` on TeachingAssignment — when creating, must check this compound uniqueness; service should either pre-check or let Prisma throw (Prisma error gets mapped by `PrismaClientExceptionFilter`). Decision: explicit pre-check for clean 400/409-style error.

## ⚠️ Sandbox Blocker

This `.git/` directory is mounted **read-only** (tmpfs) in the current sandbox:

```
tmpfs on /home/thurein-htet/Projects/student-os/server/.git type tmpfs (ro,...)
```

Consequences:
- ❌ `git config user.email/name` — fails
- ❌ `git checkout <branch>` — would fail (read-only)
- ❌ `git add` — would fail (read-only)
- ❌ `git commit` — would fail (read-only)

Only `git status`, `git log`, `git branch` (read-only ops) work.

**Therefore the per-module commit workflow cannot be executed here.** The DOCS.md above (which was written to the workspace, not to `.git/`) is the deliverable I can leave. To complete Steps 2/3 the user will need to:
1. Escalate this sandbox to allow `.git/` writes, **or**
2. Run the same edits + commits manually on their local checkout using the per-module plan above as a checklist.

## Done in this session
- ✅ Read `MODULE_ALIGNMENT.md` end-to-end
- ✅ Step 0: full reference study of `academic-years/` (controller, service, module, all 4 DTOs, plus `common/dto/{paginated-response,pagination-meta,query}.dto.ts`, `common/constants/role.constant.ts`, `eslint.config.mjs`, `.prettierrc`, `main.ts`, `app.module.ts`)
- ✅ Step 1: inventoried all 13 modules (12 needing work) by reading controller/service/module/DTOs for each
- ✅ Wrote `DOCS.md` with the full convention summary, inventory, and per-module action items

## Left to do (when git write is available)
For each of the 12 modules, in the order they're checked out:
1. `git checkout server/feat/<module>-<api>` (branch already exists per spec)
2. Edit files per the per-module action items in `DOCS.md`
3. `pnpm lint && pnpm format` (verify no new warnings)
4. `git add -A && git commit -m "refactor(server): align <module> with academic-years conventions"` (or `feat`/`fix` as appropriate)
5. Move to next module.

Optional: after each commit, append a 1-line entry to `DOCS.md` summarising the change and any intentional schema-driven divergences.
