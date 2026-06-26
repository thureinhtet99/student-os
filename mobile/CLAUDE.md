## Objective

Develop the mobile application for the School Management System using Expo, React Native, NativeWind, and React Native Reusables.

---

## 1. Backend API

Before implementing any feature:

- Study the backend implementation located in the sibling `@/server` directory (outside of the mobile project).
- Learn the available API endpoints, request/response payloads, validation rules, authentication flow, and business logic.
- Reuse the existing backend APIs instead of creating assumptions about endpoints or data models.

---

## 2. UI Implementation

Implement every feature using **React Native Reusables** components.

Requirements:

- Use React Native Reusables whenever possible.
- Follow existing project architecture and coding conventions.
- Use NativeWind for styling.
- Keep components reusable and maintainable.
- Do not introduce another UI library unless absolutely necessary.

---

## 3. Global Navigation Sheet

Implement a global navigation sheet inside `@/screen-wrapper`.

Requirements:

- Display the sheet at the top of every authenticated screen.
- Exclude the following screens:
  - Sign In
  - Sign Up

- Place a navigation menu button on the left side.
- Place a notifications bell icon on the right side.
- Reference to attached image for home page,don't make dashboard-alike ui
- The navigation sheet should remain consistent across all authenticated screens.
- Add all application routes to `@/constants/routes.ts` and use that file as the single source of truth for navigation.

---

## 4. Theme

Do **not** modify the existing color palette located in:

`@/constants/theme.ts`

Requirements:

- Preserve all existing colors.
- Build the remaining UI to match the visual style established by the current Home screen.
- Maintain consistent spacing, typography, border radius, and component styling throughout the application.

---

## 5. Development Process

Implement features incrementally.

For each feature:

1. Create a dedicated Git branch.
2. Implement the feature.
3. Ensure the feature is complete before moving to the next one.

Branch naming convention:

- `mobile/feat/students`
- `mobile/feat/teachers`
- `mobile/feat/classes`
- `mobile/feat/subjects`
- `mobile/feat/attendance`
- `mobile/fix/teachers`
- `mobile/fix/students`

Do not combine multiple unrelated features into a single branch.

---

## 6. Feature Order

Implement features in the following order:

1. Dashboard
2. Students
3. Teachers
4. Grades
5. Classes
6. Subjects
7. Attendance
8. Timetable
9. Exams
10. Results
11. Announcements
12. Notifications
13. Settings
14. User Profile
15. Authentication (Sign In & Sign Up)

Authentication should be implemented **last**, after all application features have been completed.

---

## 7. Expectations

For every feature:

- Study the corresponding backend APIs before implementation.
- Build production-ready UI.
- Implement loading, empty, success, and error states.
- Ensure responsive layouts for different device sizes.
- Follow TypeScript best practices.
- Reuse components whenever possible.
- Keep the codebase clean, modular, and maintainable.
- Avoid unnecessary code duplication.
