import { useEffect, useState, useMemo } from 'react'
import { dataStore } from '@/lib/store'
import { useAuth } from '@/lib/auth-context'
import { MetricCard, Panel } from '@/components/MetricCard'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { ClipboardCheck, BookOpen, TrendingUp, Award } from 'lucide-react'
import { initials } from '@/lib/utils'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { useNavigate } from 'react-router-dom'

export default function StudentDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [, force] = useState(0)
  useEffect(() => dataStore.subscribe(() => force((n) => n + 1)), [])

  const student = dataStore.getStudents().find((s) => s.email === user?.email) ?? dataStore.getStudents()[0]
  const grades = dataStore.getGradesForStudent(student.id)
  const fees = dataStore.getFeesForStudent(student.id)
  const messages = dataStore.getMessages().filter((m) => m.toId === user?.id)

  const avgScore = grades.length ? Math.round(grades.reduce((s, g) => s + g.score, 0) / grades.length) : 0
  const feesDue = fees.reduce((s, f) => s + (f.amount - f.paid), 0)

  const recent = useMemo(() => {
    const attendance = dataStore.getAttendance().filter((a) => a.studentId === student.id)
    return attendance
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 14)
      .reverse()
      .map((a) => ({ date: a.date.slice(5), status: a.status }))
  }, [student.id])

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Hi, {student.name.split(' ')[0]} 👋</h1>
          <p className="text-sm text-muted-foreground">{student.className} · Student ID {student.id}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/app/student/grades')}>
            <BookOpen className="h-4 w-4" /> View grades
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:opacity-90" onClick={() => navigate('/app/student/fees')}>
            Pay fees
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <MetricCard label="Attendance" value={`${student.attendancePct}%`} change="Last 14 days" icon={ClipboardCheck} tone="green" />
        <MetricCard label="Average score" value={`${avgScore}%`} change={`${grades.length} subjects`} icon={TrendingUp} tone="blue" />
        <MetricCard label="GPA" value={student.gpa.toFixed(2)} change={student.performance} icon={Award} tone="amber" />
        <MetricCard label="Fees due" value={feesDue === 0 ? 'Paid' : `$${feesDue}`} change={fees.length + ' invoices'} icon={Award} tone="rose" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel title="Recent attendance" description="Last 14 school days" className="lg:col-span-2">
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={recent}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" domain={[0, 1]} ticks={[0, 1]} />
                <Tooltip
                  contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 8 }}
                />
                <Line type="monotone" dataKey={(d) => (d.status === 'present' ? 1 : 0)} stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Profile" description="Quick info">
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
                  {initials(student.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-semibold">{student.name}</div>
                <div className="text-xs text-muted-foreground">{student.className}</div>
              </div>
            </div>
            <div className="rounded-md border border-border/60 p-3 text-xs space-y-1">
              <div className="flex justify-between"><span className="text-muted-foreground">Age</span><span>{student.age}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Enrolled</span><span>{student.enrolledOn}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Parent</span><span>{student.parentName}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Phone</span><span>{student.phone}</span></div>
            </div>
            <Button variant="outline" className="w-full" onClick={() => navigate('/app/student/records')}>
              View full record
            </Button>
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel title="Recent grades" description="Latest assessments">
          <div className="rounded-md border border-border/60">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Term</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Grade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {grades.slice(0, 6).map((g) => (
                  <TableRow key={g.id}>
                    <TableCell className="font-medium">{g.subject}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{g.term}</TableCell>
                    <TableCell>
                      <Badge variant={g.score >= 90 ? 'success' : g.score >= 80 ? 'info' : 'warning'}>
                        {g.score}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono font-semibold">{g.grade}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Panel>

        <Panel title="Unread messages" description={`${messages.filter((m) => !m.read).length} messages`}>
          <div className="space-y-2">
            {messages.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">No messages.</p>
            ) : (
              messages.slice(0, 4).map((m) => (
                <div key={m.id} className="rounded-md border border-border/60 p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{m.fromName}</span>
                    {!m.read ? <Badge variant="info" className="text-[9px]">NEW</Badge> : null}
                  </div>
                  <div className="text-xs text-muted-foreground">{m.subject}</div>
                  <div className="line-clamp-2 mt-1 text-sm">{m.body}</div>
                </div>
              ))
            )}
          </div>
        </Panel>
      </div>
    </div>
  )
}
