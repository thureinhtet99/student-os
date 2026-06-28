## Objective

Develop the **UI layer** of the mobile application for the School Management System using Expo, React Native, **NativeWind**, and **React Native Reusables**.

> **Scope note:** This phase is UI-only. Backend API integration, data fetching, and business logic are out of scope here and are covered separately in `@CLAUDE.MD`. Use static/mock data where data is needed to render a screen.

---

## 1. UI Implementation

**NativeWind and React Native Reusables are the primary tools for all UI work.** Every screen and component must be built on top of them by default.

Requirements:

- **React Native Reusables first:** before building any custom component, check if a React Native Reusables primitive (Button, Card, Sheet, Dialog, Input, Select, Tabs, Avatar, Badge, Skeleton, etc.) already covers the need. Use it instead of writing a custom one.
- **NativeWind for all styling:** style exclusively with NativeWind utility classes (`className`). Do not use `StyleSheet.create`, inline `style={{ ... }}` objects, or third-party styling libraries — except for values NativeWind cannot express (e.g. complex animations), which should be the exception, not the norm.
- Only build a custom component when no React Native Reusables primitive fits the need — and when you do, compose it the same way RNR components are composed (using `cva`/`class-variance-authority` variants, `cn()` for class merging, and NativeWind classes), so it feels native to the existing component set.
- Follow existing project architecture and coding conventions.
- Keep components reusable and maintainable.
- Do not introduce another UI library (e.g. styled-components, Tamagui, Paper, UI Kitten) unless absolutely necessary — and only after confirming RNR truly cannot cover the case.
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
- Map all colors through NativeWind theme tokens / Tailwind config rather than hardcoding hex values in components.
- Build the remaining UI to match the visual style established by the current Home screen.
- Maintain consistent spacing, typography, border radius, and component styling throughout the application — relying on NativeWind's spacing/typography scale and React Native Reusables' built-in variants rather than ad-hoc values.

---

## 4. Development Process

Implement features incrementally.

For each feature:

1. Create a dedicated Git branch.
2. Implement the UI for the feature using NativeWind + React Native Reusables as described above.
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

_but still need to fix — bring these in line with the NativeWind + React Native Reusables conventions above (replace any `StyleSheet.create`/inline styles or non-RNR components found in these screens)._

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

- Build production-ready UI with static/mock data, using NativeWind + React Native Reusables as the default toolkit.
- Implement loading, empty, success, and error **UI states** as visual placeholders (use RNR's `Skeleton`/loading patterns where available; no real data wiring needed yet).
- Ensure responsive layouts for different device sizes using NativeWind's responsive utilities.
- Follow TypeScript best practices.
- Reuse components whenever possible — prefer composing existing React Native Reusables components over writing new ones.
- Keep the codebase clean, modular, and maintainable.
- Avoid unnecessary code duplication.
- Avoid raw `StyleSheet.create`/inline style objects unless NativeWind genuinely cannot express the requirement.
- Leave clear `// TODO: wire to backend API` markers where real data will later be connected, per `@CLAUDE.MD`.
