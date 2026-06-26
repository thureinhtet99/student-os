export const ROUTES = {
  // Main Tab routes
  HOME: '/',
  EXPLORE: '/explore',
  PROFILE: '/profile',
  MODAL: '/modal',

  // Auth
  AUTH: '/(auth)',
  LOGIN: '/(auth)/login',
  REGISTER: '/(auth)/register',

  // Onboarding
  ONBOARDING: '/(onboarding)',
  ONBOARDING_WELCOME: '/(onboarding)/welcome',
  ONBOARDING_SETUP_PROFILE: '/(onboarding)/setup-profile',
  ONBOARDING_SELECT_INTEREST: '/(onboarding)/select-interest',

  // Features from file structure
  ACADEMIC: '/academic',
  ACADEMIC_DETAIL: (id: string) => `/academic/${id}`,
  ANNOUNCEMENT: '/announcement',
  MESSAGE: '/message',
  MESSAGE_DETAIL: (id: string) => `/message/${id}`,
  SEARCH: '/search',

  // Settings
  SETTINGS: '/settings',
  SETTINGS_ACCOUNT: '/settings/account',
  SETTINGS_APPEARANCE: '/settings/appearance',
  SETTINGS_NOTIFICATION: '/settings/notification',
  SETTINGS_PRIVACY: '/settings/privacy',

  // Feature Management from CLAUDE.md
  STUDENTS: '/management/students',
  TEACHERS: '/management/teachers',
  GRADES: '/management/grades',
  CLASSES: '/management/classes',
  SUBJECTS: '/management/subjects',
  ATTENDANCE: '/management/attendance',
  TIMETABLE: '/management/timetable',
  EXAMS: '/management/exams',
  RESULTS: '/management/results',
};
