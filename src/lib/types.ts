export type Role = 'admin' | 'teacher' | 'student' | 'parent'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  avatarColor?: string
  childIds?: string[] // for parents
  classId?: string // for students/teacher
}

export interface Student {
  id: string
  name: string
  email: string
  classId: string
  className: string
  parentId: string
  parentName: string
  attendancePct: number
  feesStatus: 'paid' | 'partial' | 'due'
  feesAmount: number
  grade: string
  performance: 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D' | 'F'
  enrolledOn: string
  phone: string
  address: string
  gpa: number
  age: number
}

export interface Teacher {
  id: string
  name: string
  email: string
  subject: string
  classIds: string[]
  rating: number
  attendancePct: number
  experience: number
  phone: string
  performance: 'Excellent' | 'Very Good' | 'Good' | 'Average' | 'Needs Improvement'
}

export interface ClassRoom {
  id: string
  name: string
  grade: string
  homeroomTeacher: string
  studentCount: number
  room: string
}

export interface AttendanceRecord {
  id: string
  studentId: string
  classId?: string
  className?: string
  date: string
  status: 'present' | 'absent' | 'late' | 'excused'
}

export interface FeeRecord {
  id: string
  studentId: string
  description: string
  amount: number
  paid: number
  dueDate: string
  status: 'paid' | 'partial' | 'due'
}

export interface GradeRecord {
  id: string
  studentId: string
  subject: string
  assessment?: string
  term: string
  score: number
  grade: string
  date?: string
  teacherId: string
}

export interface ActivityItem {
  id: string
  title: string
  description: string
  timestamp: string
  type: 'info' | 'success' | 'warning' | 'destructive'
  actor: string
}

export interface Message {
  id: string
  fromId: string
  fromName: string
  toId: string
  toName: string
  subject: string
  body: string
  read: boolean
  timestamp: string
}
