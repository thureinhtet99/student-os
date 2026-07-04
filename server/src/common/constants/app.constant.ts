export const APP_CONSTANT = {
  APP_NAME: 'student-os',
  APP_DESCRIPTION: 'student-os',
  API_VERSION: 'api/v1',
  API_DOCS: 'api/docs',
} as const;

export const END_POINTS = {
  // Auth
  SIGN_IN: '/auth/sign-in/email',
  SIGN_OUT: '/auth/sign-out',
  GET_SESSION: '/auth/get-session',
  LIST_SESSIONS: '/auth/list-sessions',
  LIST_ACCOUNTS: '/auth/list-accounts',
};

export const CLOUDINARY_CONSTANT = {
  CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME!,
  API_KEY: process.env.CLOUDINARY_API_KEY!,
  API_SECRET: process.env.CLOUDINARY_API_SECRET!,
  UPLOAD_PRESET: process.env.CLOUDINARY_UPLOAD_PRESET!,
  FOLDER: {
    TEACHERS: 'student-os/teachers',
    STUDENTS: 'student-os/students',
    PROFILE: 'student-os/profiles',
    DOCUMENTS: 'student-os/documents',
  },
  TRANSFORMATION: {
    PROFILE_AVATAR: 'w_200,h_200,c_fill,g_face,q_auto,f_auto',
    PROFILE_LARGE: 'w_400,h_400,c_fill,g_face,q_auto,f_auto',
    THUMBNAIL: 'w_100,h_100,c_fill,q_auto,f_auto',
    DOCUMENT: 'q_auto,f_auto',
  },
  MAX_FILE_SIZE: 2 * 1024 * 1024, // 2MB
  ALLOWED_FORMATS: ['jpg', 'jpeg', 'png', 'webp'],
  // UPLOAD_URL: `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
} as const;
