## Objective

Develop the **UI layer** of the mobile application for the School Management System using Expo, React Native, NativeWind, and React Native Reusables.

> **Scope note:** This phase is UI-only. Backend API integration, data fetching, and business logic are out of scope here and are covered separately in `@CLAUDE.MD`. Use static/mock data where data is needed to render a screen.

---

## 1. UI Implementation

Implement every screen using **React Native Reusables** components.

Requirements:

- Use React Native Reusables whenever possible.
- Follow existing project architecture and coding conventions.
- Use NativeWind for styling.
- Keep components reusable and maintainable.
- Do not introduce another UI library unless absolutely necessary.
- Use static/mock/placeholder data to populate screens — do not wire up real API calls.

---

## 2. Global Navigation Sheet

**Completed:** Implemented global navigation sheet inside `@/screen-wrapper`, including a custom Header component with menu and notification icons. Configured drawer navigation with `expo-router/drawer`.

---

## 3. Theme

Do **not** modify the existing color palette located in:

`@/constants/theme.ts`

Requirements:

- Preserve all existing colors.
- Build the remaining UI to match the visual style established by the current Home screen.
- Maintain consistent spacing, typography, border radius, and component styling throughout the application.

---

## 4. Development Process

Implement features incrementally.

For each feature:

1. Create a dedicated Git branch.
2. Implement the UI for the feature.
3. Ensure the UI is complete before moving to the next one.

Branch naming convention:

- `mobile/ui/students`
- `mobile/ui/teachers`
- `mobile/ui/classes`
- `mobile/ui/subjects`
- `mobile/ui/attendance`
- `mobile/fix/teachers`
- `mobile/fix/students`

Do not combine multiple unrelated features into a single branch.

---

## 5. Feature Order

**Completed (UI):**

- Students
- Teachers

**Remaining UI to implement in the following order:**

1.  Subjects
2.  Attendance
3.  Timetable
4.  Exams
5.  Results
6.  Announcements
7.  Notifications
8.  Settings
9.  User Profile
10. Authentication (Sign In & Sign Up)

---

## 6. Expectations

For every screen:

- Build production-ready UI with static/mock data.
- Implement loading, empty, success, and error **UI states** as visual placeholders (no real data wiring needed yet).
- Ensure responsive layouts for different device sizes.
- Follow TypeScript best practices.
- Reuse components whenever possible.
- Keep the codebase clean, modular, and maintainable.
- Avoid unnecessary code duplication.
- Leave clear `// TODO: wire to backend API` markers where real data will later be connected, per `@CLAUDE.MD`.
