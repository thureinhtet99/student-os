import { DrawerRoute } from "@/types/routes.types";

export const ROUTES = {
  DRAWER_ROUTES: [
    { name: "Home", path: "index", icon: "home" },
    { name: "Announcements", path: "announcement", icon: "notification" },
    { name: "Profile", path: "profile", icon: "user" },
    { name: "Students", path: "management/students/index", icon: "team" },
    { name: "Teachers", path: "management/teachers/index", icon: "idcard" },
    { name: "Classes", path: "management/classes/index", icon: "book" },
    { name: "Subjects", path: "academic/index", icon: "solution" }, // Adding Subjects to drawer
    { name: "Attendance", path: "attendance/index", icon: "check-square" }, // Assuming attendance/index
    { name: "Timetable", path: "timetable/index", icon: "calendar" }, // Assuming timetable/index
    { name: "Exams", path: "exams/index", icon: "form" }, // Assuming exams/index
    { name: "Results", path: "results/index", icon: "profile" }, // Assuming results/index
    { name: "Fees", path: "fees/index", icon: "credit-card" }, // New route for Fees
    { name: "I-Card", path: "i-card/index", icon: "idcard" }, // New route for I-Card
  ] satisfies DrawerRoute[],

  // Main Tab routes
  HOME: "/",
  EXPLORE: "/explore",
  PROFILE: "/profile",
  MODAL: "/modal",

  // Auth
  AUTH: "/(auth)",
  LOGIN: "/(auth)/login",
  REGISTER: "/(auth)/register",

  // Onboarding
  ONBOARDING: "/(onboarding)",
  ONBOARDING_WELCOME: "/(onboarding)/welcome",
  ONBOARDING_SETUP_PROFILE: "/(onboarding)/setup-profile",
  ONBOARDING_SELECT_INTEREST: "/(onboarding)/select-interest",

  // Features from file structure
  ACADEMIC: "/academic",
  ACADEMIC_DETAIL: (id: string) => `/academic/${id}`,
  ANNOUNCEMENT: "/announcement",
  MESSAGE: "/message",
  MESSAGE_DETAIL: (id: string) => `/message/${id}`,
  SEARCH: "/search",

  // Settings
  SETTINGS: "/settings",
  SETTINGS_ACCOUNT: "/settings/account",
  SETTINGS_APPEARANCE: "/settings/appearance",
  SETTINGS_NOTIFICATION: "/settings/notification",
  SETTINGS_PRIVACY: "/settings/privacy",

  // Feature Management from CLAUDE.md
  STUDENTS: "/management/students",
  STUDENTS_DETAIL: (id: string) => `/management/students/${id}`,
  TEACHERS: "/management/teachers",
  TEACHERS_DETAIL: (id: string) => `/management/teachers/${id}`,

  CLASSES: "/management/classes",
  CLASSES_DETAIL: (id: string) => `/management/classes/${id}`,
  SUBJECTS: "/management/subjects", // Renamed from ACADEMIC
  ATTENDANCE: "/management/attendance",
  ATTENDANCE_REQUEST: "/management/attendance/request", // New route for Attendance Request
  TIMETABLE: "/management/timetable",
  EXAMS: "/management/exams",
  RESULTS: "/management/results",
  FEES: "/management/fees", // New route for Fees
  I_CARD: "/management/i-card", // New route for I-Card
} as const;
