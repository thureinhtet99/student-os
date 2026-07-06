import type {
  Student,
  Teacher,
  ClassRoom,
  AttendanceRecord,
  FeeRecord,
  GradeRecord,
  ActivityItem,
  Message,
  User,
} from './types'

export const seedUsers: User[] = [
  { id: 'u-admin', name: 'Amelia Khan', email: 'amelia@eschool.app', role: 'admin' },
  { id: 'u-teacher-1', name: 'Daniel Reyes', email: 'daniel@eschool.app', role: 'teacher', classId: 'c-10a' },
  { id: 'u-teacher-2', name: 'Priya Patel', email: 'priya@eschool.app', role: 'teacher', classId: 'c-8b' },
  { id: 'u-student-1', name: 'Maya Thompson', email: 'maya@eschool.app', role: 'student', classId: 'c-10a' },
  { id: 'u-student-2', name: 'Ethan Brooks', email: 'ethan@eschool.app', role: 'student', classId: 'c-8b' },
  { id: 'u-parent-1', name: 'Sarah Thompson', email: 'sarah.t@parent.app', role: 'parent', childIds: ['s-1'] },
  { id: 'u-parent-2', name: 'David Brooks', email: 'david.b@parent.app', role: 'parent', childIds: ['s-2'] },
]

export const seedClasses: ClassRoom[] = [
  { id: 'c-7a', name: 'Grade 7-A', grade: '7', homeroomTeacher: 'Mrs. Helen Carter', studentCount: 32, room: 'Room 101' },
  { id: 'c-8b', name: 'Grade 8-B', grade: '8', homeroomTeacher: 'Mr. Daniel Reyes', studentCount: 30, room: 'Room 112' },
  { id: 'c-9c', name: 'Grade 9-C', grade: '9', homeroomTeacher: 'Ms. Priya Patel', studentCount: 28, room: 'Room 201' },
  { id: 'c-10a', name: 'Grade 10-A', grade: '10', homeroomTeacher: 'Mr. Daniel Reyes', studentCount: 34, room: 'Room 204' },
  { id: 'c-11c', name: 'Grade 11-C', grade: '11', homeroomTeacher: 'Dr. Aisha Mahmoud', studentCount: 26, room: 'Lab 02' },
  { id: 'c-12b', name: 'Grade 12-B', grade: '12', homeroomTeacher: 'Mrs. Linda Sato', studentCount: 24, room: 'Room 305' },
]

export const seedStudents: Student[] = [
  {
    id: 's-1', name: 'Maya Thompson', email: 'maya@eschool.app', classId: 'c-10a', className: 'Grade 10-A',
    parentId: 'u-parent-1', parentName: 'Sarah Thompson', attendancePct: 98, feesStatus: 'paid', feesAmount: 1200,
    grade: 'A', performance: 'A+', enrolledOn: '2023-09-01', phone: '+1 555-0123', address: '12 Oak Lane, Springfield',
    gpa: 3.9, age: 16,
  },
  {
    id: 's-2', name: 'Ethan Brooks', email: 'ethan@eschool.app', classId: 'c-8b', className: 'Grade 8-B',
    parentId: 'u-parent-2', parentName: 'David Brooks', attendancePct: 93, feesStatus: 'due', feesAmount: 950,
    grade: 'B+', performance: 'B+', enrolledOn: '2022-09-01', phone: '+1 555-0456', address: '78 Pine St, Springfield',
    gpa: 3.4, age: 14,
  },
  {
    id: 's-3', name: 'Sophia Carter', email: 'sophia@eschool.app', classId: 'c-11c', className: 'Grade 11-C',
    parentId: 'u-parent-1', parentName: 'Sarah Thompson', attendancePct: 96, feesStatus: 'paid', feesAmount: 1300,
    grade: 'A-', performance: 'A-', enrolledOn: '2021-09-01', phone: '+1 555-0789', address: '34 Maple Ave, Springfield',
    gpa: 3.7, age: 17,
  },
  {
    id: 's-4', name: 'Noah Williams', email: 'noah@eschool.app', classId: 'c-7a', className: 'Grade 7-A',
    parentId: 'u-parent-2', parentName: 'David Brooks', attendancePct: 89, feesStatus: 'partial', feesAmount: 800,
    grade: 'B', performance: 'B', enrolledOn: '2024-09-01', phone: '+1 555-1011', address: '5 Birch Rd, Springfield',
    gpa: 3.1, age: 13,
  },
  {
    id: 's-5', name: 'Olivia Hart', email: 'olivia@eschool.app', classId: 'c-9c', className: 'Grade 9-C',
    parentId: 'u-parent-1', parentName: 'Sarah Thompson', attendancePct: 97, feesStatus: 'paid', feesAmount: 1100,
    grade: 'A+', performance: 'A+', enrolledOn: '2023-09-01', phone: '+1 555-1213', address: '99 Cedar St, Springfield',
    gpa: 4.0, age: 15,
  },
  {
    id: 's-6', name: 'Liam Garcia', email: 'liam@eschool.app', classId: 'c-10a', className: 'Grade 10-A',
    parentId: 'u-parent-2', parentName: 'David Brooks', attendancePct: 91, feesStatus: 'paid', feesAmount: 1200,
    grade: 'B+', performance: 'B+', enrolledOn: '2023-09-01', phone: '+1 555-1415', address: '21 Elm Way, Springfield',
    gpa: 3.5, age: 16,
  },
  {
    id: 's-7', name: 'Ava Mitchell', email: 'ava@eschool.app', classId: 'c-12b', className: 'Grade 12-B',
    parentId: 'u-parent-1', parentName: 'Sarah Thompson', attendancePct: 99, feesStatus: 'paid', feesAmount: 1500,
    grade: 'A', performance: 'A', enrolledOn: '2020-09-01', phone: '+1 555-1617', address: '64 Spruce Cir, Springfield',
    gpa: 3.8, age: 18,
  },
  {
    id: 's-8', name: 'James Lee', email: 'james@eschool.app', classId: 'c-8b', className: 'Grade 8-B',
    parentId: 'u-parent-2', parentName: 'David Brooks', attendancePct: 85, feesStatus: 'due', feesAmount: 950,
    grade: 'C+', performance: 'C+', enrolledOn: '2022-09-01', phone: '+1 555-1819', address: '8 Walnut Pl, Springfield',
    gpa: 2.9, age: 14,
  },
]

export const seedTeachers: Teacher[] = [
  {
    id: 't-1', name: 'Daniel Reyes', email: 'daniel@eschool.app', subject: 'Mathematics',
    classIds: ['c-10a', 'c-8b'], rating: 4.8, attendancePct: 99, experience: 8, phone: '+1 555-2001',
    performance: 'Excellent',
  },
  {
    id: 't-2', name: 'Priya Patel', email: 'priya@eschool.app', subject: 'English Literature',
    classIds: ['c-9c', 'c-8b'], rating: 4.6, attendancePct: 97, experience: 6, phone: '+1 555-2002',
    performance: 'Very Good',
  },
  {
    id: 't-3', name: 'Aisha Mahmoud', email: 'aisha@eschool.app', subject: 'Physics',
    classIds: ['c-11c'], rating: 4.9, attendancePct: 98, experience: 12, phone: '+1 555-2003',
    performance: 'Excellent',
  },
  {
    id: 't-4', name: 'Helen Carter', email: 'helen@eschool.app', subject: 'Social Studies',
    classIds: ['c-7a'], rating: 4.4, attendancePct: 95, experience: 15, phone: '+1 555-2004',
    performance: 'Very Good',
  },
  {
    id: 't-5', name: 'Linda Sato', email: 'linda@eschool.app', subject: 'Chemistry',
    classIds: ['c-12b'], rating: 4.7, attendancePct: 96, experience: 10, phone: '+1 555-2005',
    performance: 'Excellent',
  },
  {
    id: 't-6', name: 'Marcus Johnson', email: 'marcus@eschool.app', subject: 'Physical Education',
    classIds: ['c-9c', 'c-10a'], rating: 4.3, attendancePct: 92, experience: 4, phone: '+1 555-2006',
    performance: 'Good',
  },
]

// Attendance for the last 14 days per student (mock history)
const today = new Date()
const fmt = (d: Date) => d.toISOString().slice(0, 10)
const daysAgo = (n: number) => {
  const d = new Date(today)
  d.setDate(d.getDate() - n)
  return fmt(d)
}

export const seedAttendance: AttendanceRecord[] = (() => {
  const records: AttendanceRecord[] = []
  const statuses: AttendanceRecord['status'][] = ['present', 'present', 'present', 'present', 'late', 'absent']
  for (const s of seedStudents) {
    for (let i = 0; i < 14; i++) {
      const idx = (s.id.charCodeAt(2) + i) % statuses.length
      records.push({
        id: `att-${s.id}-${i}`,
        studentId: s.id,
        classId: s.classId,
        className: s.className,
        date: daysAgo(i),
        status: statuses[idx],
      })
    }
  }
  return records
})()

export const seedFees: FeeRecord[] = seedStudents.flatMap((s, i) => [
  {
    id: `fee-${s.id}-tuition`, studentId: s.id, description: 'Tuition — July',
    amount: s.feesAmount, paid: s.feesStatus === 'paid' ? s.feesAmount : s.feesStatus === 'partial' ? s.feesAmount / 2 : 0,
    dueDate: daysAgo(-5), status: s.feesStatus,
  },
  {
    id: `fee-${s.id}-lab`, studentId: s.id, description: 'Laboratory Fee',
    amount: 150, paid: i % 2 === 0 ? 150 : 50,
    dueDate: daysAgo(-12), status: i % 2 === 0 ? 'paid' : 'partial',
  },
  {
    id: `fee-${s.id}-transport`, studentId: s.id, description: 'Transport Fee',
    amount: 80, paid: 80, dueDate: daysAgo(-2), status: 'paid',
  },
])

export const seedGrades: GradeRecord[] = (() => {
  const subjects = ['Mathematics', 'English', 'Science', 'Social Studies', 'Computer']
  const records: GradeRecord[] = []
  let counter = 0
  for (const s of seedStudents) {
    for (const sub of subjects) {
      const score = 60 + (counter * 7) % 40
      records.push({
        id: `g-${s.id}-${sub}`, studentId: s.id, subject: sub, term: 'Q2 2026',
        score, grade: score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : 'D',
        assessment: `${sub} Quiz ${(counter % 3) + 1}`,
        date: daysAgo(counter % 14),
        teacherId: 't-1',
      })
      counter++
    }
  }
  return records
})()

export const seedActivity: ActivityItem[] = [
  { id: 'a-1', title: 'Exam timetable published', description: 'Grade 9 final exam timetable published.', timestamp: daysAgo(0) + 'T09:14:00Z', type: 'info', actor: 'Admin' },
  { id: 'a-2', title: 'Transport routes updated', description: 'Three transport routes updated for Monday.', timestamp: daysAgo(0) + 'T08:02:00Z', type: 'success', actor: 'Operations' },
  { id: 'a-3', title: 'New admission form', description: 'Olivia Hart submitted an admission form.', timestamp: daysAgo(1) + 'T14:22:00Z', type: 'info', actor: 'Admissions' },
  { id: 'a-4', title: 'Library fine reminders', description: 'Library fine reminders sent to 14 students.', timestamp: daysAgo(1) + 'T10:45:00Z', type: 'warning', actor: 'Library' },
  { id: 'a-5', title: 'Fee overdue', description: '8 students have overdue tuition fees.', timestamp: daysAgo(2) + 'T11:30:00Z', type: 'destructive', actor: 'Finance' },
]

export const seedMessages: Message[] = [
  {
    id: 'm-1', fromId: 'u-teacher-1', fromName: 'Daniel Reyes', toId: 'u-parent-1', toName: 'Sarah Thompson',
    subject: 'Maya excellent in algebra', body: 'Hi Sarah, Maya is doing exceptionally well in algebra this term. Keep encouraging her!',
    read: false, timestamp: daysAgo(0) + 'T08:00:00Z',
  },
  {
    id: 'm-2', fromId: 'u-admin', fromName: 'Amelia Khan', toId: 'u-parent-1', toName: 'Sarah Thompson',
    subject: 'Parent-teacher meeting', body: 'Reminder: parent-teacher meeting is scheduled for Friday at 3 PM.',
    read: true, timestamp: daysAgo(2) + 'T16:30:00Z',
  },
]
