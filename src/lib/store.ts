/**
 * Unified data store. Runs in "mock" mode (localStorage + seed) by default.
 * To enable real Firebase, set VITE_USE_FIREBASE=true in .env and provide
 * VITE_FIREBASE_* variables. The store interface is the same in both modes.
 */
import { initializeApp, type FirebaseApp } from 'firebase/app'
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  type Auth,
  type User as FbUser,
} from 'firebase/auth'
import {
  seedClasses,
  seedStudents,
  seedTeachers,
  seedAttendance,
  seedFees,
  seedGrades,
  seedActivity,
  seedMessages,
  seedUsers,
} from './seed'
import type {
  ActivityItem,
  AttendanceRecord,
  ClassRoom,
  FeeRecord,
  GradeRecord,
  Message,
  Student,
  Teacher,
  User,
} from './types'

const STORAGE_KEY = 'eschool:data:v1'
const AUTH_KEY = 'eschool:auth:v1'

type Store = {
  users: User[]
  students: Student[]
  teachers: Teacher[]
  classes: ClassRoom[]
  attendance: AttendanceRecord[]
  fees: FeeRecord[]
  grades: GradeRecord[]
  activity: ActivityItem[]
  messages: Message[]
}

const initialStore = (): Store => ({
  users: seedUsers,
  students: seedStudents,
  teachers: seedTeachers,
  classes: seedClasses,
  attendance: seedAttendance,
  fees: seedFees,
  grades: seedGrades,
  activity: seedActivity,
  messages: seedMessages,
})

const loadFromStorage = (): Store => {
  if (typeof window === 'undefined') return initialStore()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const fresh = initialStore()
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh))
      return fresh
    }
    return JSON.parse(raw) as Store
  } catch {
    return initialStore()
  }
}

const saveToStorage = (store: Store) => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

export const useFirebase = (): boolean => {
  if (typeof import.meta === 'undefined') return false
  return Boolean((import.meta as any).env?.VITE_USE_FIREBASE === 'true')
}

let fbApp: FirebaseApp | null = null
let fbAuth: Auth | null = null
let fbInitTried = false

const initFirebase = (): boolean => {
  if (fbInitTried) return Boolean(fbApp && fbAuth)
  fbInitTried = true
  try {
    const env = (import.meta as any).env
    const config = {
      apiKey: env?.VITE_FIREBASE_API_KEY,
      authDomain: env?.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: env?.VITE_FIREBASE_PROJECT_ID,
      storageBucket: env?.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: env?.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: env?.VITE_FIREBASE_APP_ID,
    }
    if (!config.apiKey || !config.projectId) return false
    fbApp = initializeApp(config)
    fbAuth = getAuth(fbApp)
    return true
  } catch (err) {
    console.warn('[firebase] init failed, falling back to mock store', err)
    return false
  }
}

let store: Store = loadFromStorage()
const subscribers = new Set<() => void>()
const notify = () => subscribers.forEach((s) => s())

const update = (mutator: (s: Store) => void) => {
  mutator(store)
  saveToStorage(store)
  if (useFirebase()) {
    // firestore sync handled by callers if/when added
  }
  notify()
}

export const dataStore = {
  getSnapshot: (): Store => store,
  subscribe: (cb: () => void) => {
    subscribers.add(cb)
    return () => {
      subscribers.delete(cb)
    }
  },
  // Students
  getStudents: (): Student[] => store.students,
  getStudent: (id: string) => store.students.find((s) => s.id === id),
  updateStudent: (id: string, patch: Partial<Student>) => {
    update((s) => {
      s.students = s.students.map((st) => (st.id === id ? { ...st, ...patch } : st))
    })
  },
  addStudent: (student: Student) => {
    update((s) => {
      s.students = [student, ...s.students]
    })
  },
  // Teachers
  getTeachers: (): Teacher[] => store.teachers,
  getTeacher: (id: string) => store.teachers.find((t) => t.id === id),
  // Classes
  getClasses: (): ClassRoom[] => store.classes,
  getClass: (id: string) => store.classes.find((c) => c.id === id),
  // Attendance
  getAttendance: (): AttendanceRecord[] => store.attendance,
  setAttendanceForClass: (classId: string, date: string, statuses: Record<string, AttendanceRecord['status']>) => {
    update((s) => {
      const studentIds = s.students.filter((st) => st.classId === classId).map((st) => st.id)
      s.attendance = s.attendance.filter(
        (a) => !(studentIds.includes(a.studentId) && a.date === date),
      )
      for (const studentId of studentIds) {
        s.attendance.push({
          id: `att-${studentId}-${date}`,
          studentId,
          date,
          status: statuses[studentId] ?? 'present',
        })
      }
      // Recompute attendancePct per student
      for (const studentId of studentIds) {
        const records = s.attendance.filter((a) => a.studentId === studentId)
        const present = records.filter((a) => a.status === 'present' || a.status === 'late').length
        const pct = records.length ? Math.round((present / records.length) * 100) : 100
        s.students = s.students.map((st) =>
          st.id === studentId ? { ...st, attendancePct: pct } : st,
        )
      }
    })
  },
  // Fees
  getFees: (): FeeRecord[] => store.fees,
  getFeesForStudent: (studentId: string) => store.fees.filter((f) => f.studentId === studentId),
  payFee: (feeId: string, amount: number) => {
    update((s) => {
      s.fees = s.fees.map((f) => {
        if (f.id !== feeId) return f
        const newPaid = Math.min(f.amount, f.paid + amount)
        return { ...f, paid: newPaid, status: newPaid >= f.amount ? 'paid' : 'partial' }
      })
    })
  },
  // Grades
  getGrades: (): GradeRecord[] => store.grades,
  getGradesForStudent: (studentId: string) => store.grades.filter((g) => g.studentId === studentId),
  addGrade: (grade: GradeRecord) => {
    update((s) => {
      s.grades = [grade, ...s.grades]
    })
  },
  // Activity
  getActivity: (): ActivityItem[] => store.activity,
  // Messages
  getMessages: (): Message[] => store.messages,
  sendMessage: (msg: Message) => {
    update((s) => {
      s.messages = [msg, ...s.messages]
    })
  },
  markMessageRead: (id: string) => {
    update((s) => {
      s.messages = s.messages.map((m) => (m.id === id ? { ...m, read: true } : m))
    })
  },
  // Users
  getUsers: (): User[] => store.users,
  getUser: (id: string) => store.users.find((u) => u.id === id),
  getUserByEmail: (email: string) => store.users.find((u) => u.email.toLowerCase() === email.toLowerCase()),
  addUser: (user: User) => {
    update((s) => {
      if (!s.users.find((u) => u.id === user.id)) s.users.push(user)
    })
  },
  resetMockData: () => {
    if (typeof window !== 'undefined') window.localStorage.removeItem(STORAGE_KEY)
    store = initialStore()
    notify()
  },
}

// ----- Auth -----

export type AuthUser = { id: string; name: string; email: string; role: User['role'] }

const readAuth = (): AuthUser | null => {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(AUTH_KEY)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

const writeAuth = (u: AuthUser | null) => {
  if (typeof window === 'undefined') return
  if (u) window.localStorage.setItem(AUTH_KEY, JSON.stringify(u))
  else window.localStorage.removeItem(AUTH_KEY)
}

export const auth = {
  current: (): AuthUser | null => readAuth(),
  signInMock: (email: string, _password: string): AuthUser | null => {
    const user = dataStore.getUserByEmail(email)
    if (!user) return null
    const u: AuthUser = { id: user.id, name: user.name, email: user.email, role: user.role }
    writeAuth(u)
    notify()
    return u
  },
  signInDemo: (role: User['role']): AuthUser => {
    const user = dataStore.getUsers().find((u) => u.role === role)
    if (!user) throw new Error('No demo user for role ' + role)
    const u: AuthUser = { id: user.id, name: user.name, email: user.email, role: user.role }
    writeAuth(u)
    notify()
    return u
  },
  signOut: async () => {
    if (useFirebase() && fbAuth) {
      try {
        await fbSignOut(fbAuth)
      } catch {
        /* ignore */
      }
    }
    writeAuth(null)
    notify()
  },
  subscribe: (cb: (u: AuthUser | null) => void) => {
    const handler = () => cb(readAuth())
    handler()
    window.addEventListener('storage', handler)
    if (useFirebase() && initFirebase() && fbAuth) {
      onAuthStateChanged(fbAuth, (fbUser: FbUser | null) => {
        if (!fbUser) {
          writeAuth(null)
          cb(null)
        }
      })
    }
    return () => {
      window.removeEventListener('storage', handler)
    }
  },
  // Real Firebase login (only used when useFirebase is true and config present)
  signInFirebase: async (email: string, password: string): Promise<AuthUser | null> => {
    if (!useFirebase() || !initFirebase() || !fbAuth) return null
    const cred = await signInWithEmailAndPassword(fbAuth, email, password)
    const user = dataStore.getUserByEmail(cred.user.email ?? email)
    if (!user) return null
    const u: AuthUser = { id: user.id, name: user.name, email: user.email, role: user.role }
    writeAuth(u)
    notify()
    return u
  },
}

// Eagerly init Firebase if configured
if (useFirebase()) initFirebase()
