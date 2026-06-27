import { AntDesign } from "@react-native-vector-icons/ant-design";

type AntDesignIconName = React.ComponentProps<typeof AntDesign>["name"];

interface DrawerRoute {
  path: string;
  name: string;
  icon: AntDesignIconName; // instead of `string`
}

export const ROUTES = {
  DRAWER_ROUTES: [
    { name: "Home", path: "index", icon: "home" },
    { name: "Announcements", path: "announcement", icon: "home" },
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
  GRADES: "/management/grades",
  CLASSES: "/management/classes",
  SUBJECTS: "/management/subjects",
  ATTENDANCE: "/management/attendance",
  TIMETABLE: "/management/timetable",
  EXAMS: "/management/exams",
  RESULTS: "/management/results",
};
