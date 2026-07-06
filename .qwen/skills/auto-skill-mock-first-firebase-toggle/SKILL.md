---
name: mock-first-firebase-toggle
description: Build a unified data store that defaults to localStorage-backed mock data and toggles to real Firebase via a single VITE_USE_FIREBASE env var. Useful for prototypes that need to run with zero config but can graduate to a real backend.
source: auto-skill
extracted_at: '2026-07-06T05:03:43.913Z'
---

# Mock-first data store with a Firebase toggle

The pattern lets a React app run out of the box with seeded mock data persisted to `localStorage`, and flip to a real backend (Firebase, Supabase, etc.) by changing one environment variable. Zero config for evaluators; one-line switch for production.

## Core architecture

```
┌─────────────────────────────────────────┐
│  React components                       │
│     │                                   │
│     ▼                                   │
│  dataStore (singleton, sync API)        │
│     │                                   │
│     ├── useFirebase() ? ── Firebase     │
│     │                   └── (Firestore) │
│     │                                   │
│     └── else ── in-memory + localStorage│
└─────────────────────────────────────────┘
```

Components never call Firebase directly. They call `dataStore.getStudents()`, `dataStore.addStudent(...)`, etc. The store decides which backend to hit.

## Environment variable

```bash
# .env
VITE_USE_FIREBASE=false   # default — mock mode
VITE_FB_API_KEY=...
VITE_FB_AUTH_DOMAIN=...
```

Read in code with `import.meta.env.VITE_USE_FIREBASE === 'true'`.

## The store skeleton

```ts
// src/lib/store.ts
import { seedUsers, seedStudents, /* ... */ } from './seed'

const USE_FIREBASE = import.meta.env.VITE_USE_FIREBASE === 'true'

class DataStore {
  private state = { users: [], students: [], /* ... */ }
  private subscribers: Set<() => void> = new Set()

  constructor() {
    if (!USE_FIREBASE) this.loadFromLocalStorage()
  }

  private loadFromLocalStorage() {
    const raw = localStorage.getItem('eschool:state')
    if (raw) this.state = JSON.parse(raw)
    else this.state = { users: seedUsers, students: seedStudents, /* ... */ }
  }

  private save() {
    if (!USE_FIREBASE) {
      localStorage.setItem('eschool:state', JSON.stringify(this.state))
    }
    this.notify()
  }

  subscribe(cb: () => void) {
    this.subscribers.add(cb)
    return () => this.subscribers.delete(cb)
  }

  private notify() { this.subscribers.forEach((cb) => cb()) }

  getStudents() { return this.state.students }
  getStudentsByClass(classId: string) {
    return this.state.students.filter((s) => s.classId === classId)
  }
  addStudent(s: Student) {
    this.state.students.push(s)
    this.save()
    if (USE_FIREBASE) firestore.collection('students').doc(s.id).set(s)
  }
  // ... etc
}

export const dataStore = new DataStore()
```

## React component subscription pattern

```tsx
function StudentsPage() {
  const [, force] = useState(0)
  useEffect(() => dataStore.subscribe(() => force((n) => n + 1)), [])
  const students = dataStore.getStudents()
  return <div>{students.map((s) => <StudentRow key={s.id} {...s} />)}</div>
}
```

The `[, force]` re-render on store mutation is the trick. No Redux, no Zustand, no context provider — just an event emitter.

## Auth handling

```ts
const signIn = async (email: string, password: string) => {
  if (USE_FIREBASE) {
    return signInWithEmailAndPassword(fbAuth, email, password)
      .then((u) => mapFbUser(u.user))
      .catch(() => null)
  }
  const user = seedUsers.find((u) => u.email === email)
  return user ?? null
}
```

The same `signIn` works in both modes — the caller doesn't care.

## Side-effecting actions

Actions that need to recompute derived state (e.g. marking attendance auto-updates `student.attendancePct`):

```ts
setAttendanceForClass(classId: string, date: string, statuses: Record<string, Status>) {
  // Update attendance rows
  Object.entries(statuses).forEach(([studentId, status]) => {
    const idx = this.state.attendance.findIndex((a) => a.studentId === studentId && a.date === date)
    if (idx >= 0) this.state.attendance[idx].status = status
    else this.state.attendance.push({ id: `${studentId}-${date}`, studentId, date, status })
  })
  // Recompute derived
  this.state.students.forEach((s) => {
    const records = this.state.attendance.filter((a) => a.studentId === s.id)
    const present = records.filter((a) => a.status === 'present').length
    s.attendancePct = records.length ? Math.round((present / records.length) * 100) : 0
  })
  this.save()
}
```

## When to use this

✅ Demos, prototypes, internal tools — the user can `pnpm dev` and see real data immediately
✅ Apps that might be deployed to environments without internet (e.g. on-prem)
✅ Staging environments that share a database vs. local-only dev

❌ Production apps with high write volume — localStorage has size limits (~5MB) and isn't a real DB
❌ Multi-user real-time collab — that's the whole point of moving to Firestore; the toggle to Firebase enables the `fbDb.collection(...).onSnapshot(...)` sync you need
