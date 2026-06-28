# Contributing Guide

This document defines the conventions for branching, committing, and submitting changes to this project (mobile app + NestJS server).

## Table of Contents

- [Contributing Guide](#contributing-guide)
  - [Table of Contents](#table-of-contents)
  - [Branch Naming Convention](#branch-naming-convention)
    - [Scope](#scope)
    - [Type](#type)
    - [Short Description](#short-description)
    - [Examples](#examples)
  - [Commit Message Convention](#commit-message-convention)
    - [Type](#type-1)
    - [Scope](#scope-1)
    - [Summary](#summary)
    - [Body (optional)](#body-optional)
    - [Footer (optional)](#footer-optional)
    - [Examples](#examples-1)
    - [Commit Hygiene](#commit-hygiene)
  - [Pull Request Workflow](#pull-request-workflow)
  - [Code Style](#code-style)

---

## Branch Naming Convention

Branches follow the pattern:

```
<scope>/<type>/<short-description>
```

### Scope

Indicates which part of the monorepo the work belongs to:

| Scope    | Description                           |
| -------- | ------------------------------------- |
| `mobile` | Expo / React Native app               |
| `server` | NestJS backend                        |
| `client` | React frontend                        |
| `repo`   | Tooling, CI, docs, root-level configs |

### Type

| Type       | Use for                                                        |
| ---------- | -------------------------------------------------------------- |
| `ui`       | UI-only work (components, styling, layout) — no backend wiring |
| `feature`  | New functionality (UI + logic + API integration)               |
| `fix`      | Bug fixes                                                      |
| `refactor` | Code restructuring with no behavior change                     |
| `chore`    | Tooling, dependencies, config, build scripts                   |
| `docs`     | Documentation only                                             |
| `test`     | Adding or updating tests                                       |

### Short Description

- Lowercase, kebab-case
- Concise (3–5 words max)
- No issue numbers required, but may be appended if useful

### Examples

```
mobile/ui/students-screen
mobile/ui/header-avatar-size
mobile/feature/teacher-attendance-api
mobile/fix/grid-item-aspect-ratio
server/feature/students-crud-endpoints
server/fix/jwt-refresh-token-expiry
server/chore/upgrade-nestjs-v11
repo/docs/contributing-guide
```

---

## Commit Message Convention

This project follows **[Conventional Commits](https://www.conventionalcommits.org/)**.

```
<type>(<scope>): <short summary>

[optional body]

[optional footer(s)]
```

### Type

Must be one of:

| Type       | Description                                                  |
| ---------- | ------------------------------------------------------------ |
| `feat`     | A new feature                                                |
| `fix`      | A bug fix                                                    |
| `refactor` | Code change that neither fixes a bug nor adds a feature      |
| `style`    | Formatting, whitespace, missing semicolons (no logic change) |
| `docs`     | Documentation only changes                                   |
| `test`     | Adding or correcting tests                                   |
| `chore`    | Build process, dependency updates, tooling                   |
| `perf`     | Performance improvements                                     |
| `revert`   | Reverts a previous commit                                    |

### Scope

Use the same scopes as branch naming where applicable: `mobile`, `server`, `repo`, or a more specific module (e.g. `students`, `teachers`, `auth`, `header`).

### Summary

- Imperative, present tense: "add" not "added" or "adds"
- No capital letter at the start
- No period at the end
- Keep under ~72 characters

### Body (optional)

- Explain **what** and **why**, not how (the diff shows how)
- Wrap at ~100 characters
- Use bullet points for multiple changes

### Footer (optional)

- `BREAKING CHANGE: <description>` for breaking changes
- `Closes #123` / `Refs #123` to link issues

### Examples

```
feat(mobile): add fixed-height header with larger avatar

fix(mobile): correct grid item aspect ratio using onLayout measurement

The previous aspect-square approach broke when label text wrapped
to two lines, stretching the card taller than its width.

refactor(mobile): align Students screen with NativeWind/RNR conventions

chore(server): upgrade @nestjs/core and @nestjs/common to v11

docs(repo): add CONTRIBUTING.md with branch and commit conventions

feat(server): add students CRUD endpoints

Closes #42
```

### Commit Hygiene

- One logical change per commit — avoid bundling unrelated changes
- Do not commit commented-out code or `console.log` / debug statements
- Squash WIP commits before opening a PR (interactive rebase is fine)

---

## Pull Request Workflow

1. Branch off `main` using the naming convention above.
2. Keep PRs scoped to a single concern (one screen, one endpoint, one fix).
3. PR title should follow the same format as a commit message:
   ```
   feat(mobile): add subjects screen
   ```
4. PR description should include:
   - **What** changed and **why**
   - Screenshots/recordings for UI changes
   - `// TODO: wire to backend API` markers called out explicitly if mock data is still in use
5. Ensure the following pass before requesting review:
   - `pnpm lint`
   - `pnpm test` (server)
   - No `StyleSheet.create` or inline style objects introduced (mobile) unless required for shadow/elevation
6. Request review — at least one approval required before merge.
7. Squash-merge into `main` once approved.

---

## Code Style

- **Mobile**: NativeWind-first styling. No `StyleSheet.create` or inline style objects, except where NativeWind has no equivalent (e.g. shadow/elevation). Prefer existing React Native Reusables (RNR) components over custom ones; when a custom component is unavoidable, build it with `cva` and `cn()` to match RNR conventions.
- **Server**: Follow the existing ESLint + Prettier config (`pnpm lint`, `pnpm format`). Single quotes, trailing commas, per `.prettierrc`.
- Run formatters/linters before committing — do not rely on CI to catch style issues.
