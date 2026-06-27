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

**Completed:** Implemented global navigation sheet inside `@/screen-wrapper`, including a custom Header component with menu and notification icons. Configured drawer navigation with `expo-router/drawer`.

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

**Completed Features:**
- Students
- Teachers
- Global Navigation Drawer

**Remaining Features to implement in the following order:**

1.  Classes
2.  Subjects
3.  Attendance
4.  Timetable
5.  Exams
6.  Results
7.  Announcements
8.  Notifications
9.  Settings
10. User Profile
11. Authentication (Sign In & Sign Up)

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
