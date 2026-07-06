import { useMemo, useEffect, useState } from 'react'
import { dataStore } from '@/lib/store'
import { useAuth } from '@/lib/auth-context'
import { MetricCard, Panel } from '@/components/MetricCard'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, GraduationCap, Star, Calendar, MessageSquare, ClipboardCheck } from 'lucide-react'
import { initials } from '@/lib/utils'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

export default function TeacherDashboard() {
  const { user } = useAuth()
  const [, force] = useState(0)
  useEffect(() => dataStore.subscribe(() => force((n) => n + 1)), [])

  const teacher = dataStore.getTeachers().find((t) => t.email === user?.email) ?? dataStore.getTeachers()[0]
  const classes = dataStore.getClasses().filter((c) => teacher.classIds.includes(c.id))
  const students = dataStore.getStudents().filter((s) => teacher.classIds.includes(s.classId))
  const grades = dataStore.getGrades().filter((g) => g.teacherId === teacher.id)
  const messages = dataStore.getMessages().filter((m) => m.toId === user?.id || m.fromId === user?.id)
  const avgScore = grades.length ? Math.round(grades.reduce((s, g) => s + g.score, 0) / grades.length) : 0

  const attendanceByDay = useMemo(() => {
    const attendance = dataStore.getAttendance()
    const myStudents = new Set(students.map((s) => s.id))
    const byDate = new Map<string, { present: number; total: number }>()
    for (const a of attendance) {
      if (!myStudents.has(a.studentId)) continue
      const e = byDate.get(a.date) ?? { present: 0, total: 0 }
      e.total += 1
      if (a.status === 'present' || a.status === 'late') e.present += 1
      byDate.set(a.date, e)
    }
    return Array.from(byDate.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-7)
      .map(([date, v]) => ({ date: date.slice(5), pct: v.total ? Math.round((v.present / v.total) * 100) : 0 }))
  }, [students])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome, {user?.name?.split(' ')[0]}</h1>
        <p className="text-sm text-muted-foreground">Here&apos;s your day at a glance.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <MetricCard label="My students" value={String(students.length)} change={`${classes.length} classes`} icon={Users} tone="blue" />
        <MetricCard label="Average score" value={`${avgScore}%`} change="Across all classes" icon={GraduationCap} tone="green" />
        <MetricCard label="Rating" value={teacher.rating.toFixed(1)} change={`${teacher.experience} yrs experience`} icon={Star} tone="amber" />
        <MetricCard label="Unread messages" value={String(messages.filter((m) => !m.read).length)} change="This week" icon={MessageSquare} tone="rose" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel title="Attendance trend" description="Past 7 school days" className="lg:col-span-2">
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={attendanceByDay}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis domain={[0, 100]} className="text-xs" />
                <Tooltip
                  contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 8 }}
                />
                <Bar dataKey="pct" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="My classes" description={`${classes.length} sections`}>
          <div className="space-y-2">
            {classes.map((c) => (
              <div key={c.id} className="rounded-md border border-border/60 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold">{c.name}</div>
                    <div className="text-xs text-muted-foreground">Room {c.room.replace('Room ', '')}</div>
                  </div>
                  <Badge variant="secondary">{c.studentCount}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel title="My students" description="Recent performance" className="lg:col-span-2">
          <div className="space-y-2">
            {students.slice(0, 6).map((s) => (
              <div key={s.id} className="flex items-center gap-3 rounded-md border border-border/60 p-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-xs">
                    {initials(s.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">{s.name}</div>
                  <div className="truncate text-xs text-muted-foreground">{s.className}</div>
                </div>
                <Badge variant={s.attendancePct >= 95 ? 'success' : 'warning'}>
                  {s.attendancePct}%
                </Badge>
                <span className="font-mono text-sm font-semibold">{s.performance}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-end">
            <Button variant="link" size="sm">View all students</Button>
          </div>
        </Panel>

        <Panel title="Quick actions" description="Common tasks">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="h-auto flex-col gap-1 py-3">
              <ClipboardCheck className="h-4 w-4" />
              <span className="text-xs">Mark attendance</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-1 py-3">
              <GraduationCap className="h-4 w-4" />
              <span className="text-xs">Add grade</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-1 py-3">
              <MessageSquare className="h-4 w-4" />
              <span className="text-xs">Message parents</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-1 py-3">
              <Calendar className="h-4 w-4" />
              <span className="text-xs">My schedule</span>
            </Button>
          </div>
        </Panel>
      </div>
    </div>
  )
}
