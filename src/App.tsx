import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/lib/auth-context'
import { ThemeProvider } from '@/lib/theme'
import AppLayout from '@/components/AppLayout'
import LoginPage from '@/pages/LoginPage'
import type { Role } from '@/lib/types'

// Admin
import AdminDashboard from '@/pages/admin/AdminDashboard'
import StudentsPage from '@/pages/admin/StudentsPage'
import TeachersPage from '@/pages/admin/TeachersPage'
import ClassesPage from '@/pages/admin/ClassesPage'
import AdminFeesPage from '@/pages/admin/AdminFeesPage'
import PerformancePage from '@/pages/admin/PerformancePage'
import MessagesPage from '@/pages/admin/MessagesPage'
import AdminAttendancePage from '@/pages/admin/AdminAttendancePage'
import SettingsPage from '@/pages/admin/SettingsPage'
import HelpPage from '@/pages/admin/HelpPage'
import ExamsPage from '@/pages/admin/ExamsPage'

// Teacher
import TeacherDashboard from '@/pages/teacher/TeacherDashboard'
import TeacherClassesPage from '@/pages/teacher/TeacherClassesPage'
import TeacherAttendancePage from '@/pages/teacher/TeacherAttendancePage'
import GradebookPage from '@/pages/teacher/GradebookPage'
import TeacherSchedulePage from '@/pages/teacher/TeacherSchedulePage'
import TeacherMessagesPage from '@/pages/teacher/TeacherMessagesPage'
import TeacherPerformancePage from '@/pages/teacher/TeacherPerformancePage'

// Student
import StudentDashboard from '@/pages/student/StudentDashboard'
import StudentRecordsPage from '@/pages/student/StudentRecordsPage'
import StudentAttendancePage from '@/pages/student/StudentAttendancePage'
import StudentGradesPage from '@/pages/student/StudentGradesPage'
import StudentTimetablePage from '@/pages/student/StudentTimetablePage'
import StudentFeesPage from '@/pages/student/StudentFeesPage'
import StudentMessagesPage from '@/pages/student/StudentMessagesPage'

// Parent
import ParentDashboard from '@/pages/parent/ParentDashboard'
import ParentAttendancePage from '@/pages/parent/ParentAttendancePage'
import ParentPerformancePage from '@/pages/parent/ParentPerformancePage'
import ParentFeesPage from '@/pages/parent/ParentFeesPage'
import ParentTimetablePage from '@/pages/parent/ParentTimetablePage'
import ParentMessagesPage from '@/pages/parent/ParentMessagesPage'
import ParentSettingsPage from '@/pages/parent/ParentSettingsPage'

function AuthGate({ roles }: { roles: Role[] }) {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-sm text-muted-foreground">Loading…</div>
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace />
  if (!roles.includes(user.role)) {
    const home =
      user.role === 'admin' ? '/app/admin'
        : user.role === 'teacher' ? '/app/teacher'
          : user.role === 'parent' ? '/app/parent'
            : '/app/student'
    return <Navigate to={home} replace />
  }
  return <Outlet />
}

function RoleHome() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  const home =
    user.role === 'admin' ? '/app/admin'
      : user.role === 'teacher' ? '/app/teacher'
        : user.role === 'parent' ? '/app/parent'
          : '/app/student'
  return <Navigate to={home} replace />
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<RoleHome />} />

            <Route element={<AuthGate roles={['admin']} />}>
              <Route path="/app" element={<AppLayout />}>
                <Route path="admin" element={<AdminDashboard />} />
                <Route path="admin/students" element={<StudentsPage />} />
                <Route path="admin/teachers" element={<TeachersPage />} />
                <Route path="admin/classes" element={<ClassesPage />} />
                <Route path="admin/attendance" element={<AdminAttendancePage />} />
                <Route path="admin/fees" element={<AdminFeesPage />} />
                <Route path="admin/performance" element={<PerformancePage />} />
                <Route path="admin/messages" element={<MessagesPage />} />
                <Route path="admin/exams" element={<ExamsPage />} />
                <Route path="admin/settings" element={<SettingsPage />} />
                <Route path="admin/help" element={<HelpPage />} />
              </Route>
            </Route>

            <Route element={<AuthGate roles={['teacher']} />}>
              <Route path="/app" element={<AppLayout />}>
                <Route path="teacher" element={<TeacherDashboard />} />
                <Route path="teacher/classes" element={<TeacherClassesPage />} />
                <Route path="teacher/attendance" element={<TeacherAttendancePage />} />
                <Route path="teacher/gradebook" element={<GradebookPage />} />
                <Route path="teacher/schedule" element={<TeacherSchedulePage />} />
                <Route path="teacher/messages" element={<TeacherMessagesPage />} />
                <Route path="teacher/performance" element={<TeacherPerformancePage />} />
              </Route>
            </Route>

            <Route element={<AuthGate roles={['student']} />}>
              <Route path="/app" element={<AppLayout />}>
                <Route path="student" element={<StudentDashboard />} />
                <Route path="student/records" element={<StudentRecordsPage />} />
                <Route path="student/attendance" element={<StudentAttendancePage />} />
                <Route path="student/grades" element={<StudentGradesPage />} />
                <Route path="student/timetable" element={<StudentTimetablePage />} />
                <Route path="student/fees" element={<StudentFeesPage />} />
                <Route path="student/messages" element={<StudentMessagesPage />} />
              </Route>
            </Route>

            <Route element={<AuthGate roles={['parent']} />}>
              <Route path="/app" element={<AppLayout />}>
                <Route path="parent" element={<ParentDashboard />} />
                <Route path="parent/attendance" element={<ParentAttendancePage />} />
                <Route path="parent/performance" element={<ParentPerformancePage />} />
                <Route path="parent/fees" element={<ParentFeesPage />} />
                <Route path="parent/timetable" element={<ParentTimetablePage />} />
                <Route path="parent/messages" element={<ParentMessagesPage />} />
                <Route path="parent/settings" element={<ParentSettingsPage />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
