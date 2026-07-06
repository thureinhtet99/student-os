import type { Role } from '@/lib/types'
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  School,
  ClipboardCheck,
  Wallet,
  MessageSquare,
  Settings,
  HelpCircle,
  BookOpen,
  Calendar,
  FileText,
  Receipt,
  TrendingUp,
  UserCircle,
  type LucideIcon,
} from 'lucide-react'

export type NavEntry = {
  label: string
  to: string
  icon: LucideIcon
  badge?: string
}

export type NavGroup = { title: string; items: NavEntry[] }

export const navByRole: Record<Role, NavGroup[]> = {
  admin: [
    {
      title: 'School',
      items: [
        { label: 'Dashboard', to: '/app/admin', icon: LayoutDashboard },
        { label: 'Students', to: '/app/admin/students', icon: Users, badge: '1.2k' },
        { label: 'Teachers', to: '/app/admin/teachers', icon: GraduationCap },
        { label: 'Classes', to: '/app/admin/classes', icon: School },
        { label: 'Attendance', to: '/app/admin/attendance', icon: ClipboardCheck },
      ],
    },
    {
      title: 'Operations',
      items: [
        { label: 'Performance', to: '/app/admin/performance', icon: TrendingUp },
        { label: 'Fees', to: '/app/admin/fees', icon: Wallet, badge: '18' },
        { label: 'Exams', to: '/app/admin/exams', icon: FileText },
        { label: 'Messages', to: '/app/admin/messages', icon: MessageSquare, badge: '6' },
      ],
    },
    {
      title: 'System',
      items: [
        { label: 'Settings', to: '/app/admin/settings', icon: Settings },
        { label: 'Help Center', to: '/app/admin/help', icon: HelpCircle },
      ],
    },
  ],
  teacher: [
    {
      title: 'Teaching',
      items: [
        { label: 'Dashboard', to: '/app/teacher', icon: LayoutDashboard },
        { label: 'My Classes', to: '/app/teacher/classes', icon: School },
        { label: 'Attendance', to: '/app/teacher/attendance', icon: ClipboardCheck },
        { label: 'Gradebook', to: '/app/teacher/gradebook', icon: BookOpen },
        { label: 'Performance', to: '/app/teacher/performance', icon: TrendingUp },
      ],
    },
    {
      title: 'Communication',
      items: [
        { label: 'Messages', to: '/app/teacher/messages', icon: MessageSquare },
        { label: 'Schedule', to: '/app/teacher/schedule', icon: Calendar },
      ],
    },
  ],
  student: [
    {
      title: 'Learning',
      items: [
        { label: 'Dashboard', to: '/app/student', icon: LayoutDashboard },
        { label: 'My Records', to: '/app/student/records', icon: UserCircle },
        { label: 'Attendance', to: '/app/student/attendance', icon: ClipboardCheck },
        { label: 'Grades', to: '/app/student/grades', icon: BookOpen },
        { label: 'Timetable', to: '/app/student/timetable', icon: Calendar },
      ],
    },
    {
      title: 'Account',
      items: [
        { label: 'Fees', to: '/app/student/fees', icon: Receipt },
        { label: 'Messages', to: '/app/student/messages', icon: MessageSquare },
      ],
    },
  ],
  parent: [
    {
      title: 'My Child',
      items: [
        { label: 'Overview', to: '/app/parent', icon: LayoutDashboard },
        { label: 'Attendance', to: '/app/parent/attendance', icon: ClipboardCheck },
        { label: 'Performance', to: '/app/parent/performance', icon: TrendingUp },
        { label: 'Fees', to: '/app/parent/fees', icon: Wallet },
        { label: 'Timetable', to: '/app/parent/timetable', icon: Calendar },
      ],
    },
    {
      title: 'Account',
      items: [
        { label: 'Messages', to: '/app/parent/messages', icon: MessageSquare, badge: '1' },
        { label: 'Settings', to: '/app/parent/settings', icon: Settings },
      ],
    },
  ],
}

export const roleLabels: Record<Role, string> = {
  admin: 'Administrator',
  teacher: 'Teacher',
  student: 'Student',
  parent: 'Parent',
}

export const roleHomes: Record<Role, string> = {
  admin: '/app/admin',
  teacher: '/app/teacher',
  student: '/app/student',
  parent: '/app/parent',
}
