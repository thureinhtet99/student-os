import { useEffect, useState, useMemo } from 'react'
import { dataStore } from '@/lib/store'
import { useAuth } from '@/lib/auth-context'
import { MetricCard, Panel } from '@/components/MetricCard'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ClipboardCheck, TrendingUp, DollarSign, Award, Mail } from 'lucide-react'
import { initials } from '@/lib/utils'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { useNavigate } from 'react-router-dom'

export default function ParentDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [, force] = useState(0)
  useEffect(() => dataStore.subscribe(() => force((n) => n + 1)), [])

  const myChildren = useMemo(
    () => dataStore.getStudents().filter((s) => s.parentId === user?.id),
    [user?.id],
  )
  const [selectedChildId, setSelectedChildId] = useState(myChildren[0]?.id)
  const child = myChildren.find((c) => c.id === selectedChildId) ?? myChildren[0]

  const grades = dataStore.getGradesForStudent(child.id)
  const fees = dataStore.getFeesForStudent(child.id)
  const feesDue = fees.reduce((s, f) => s + (f.amount - f.paid), 0)
  const avgScore = grades.length ? Math.round(grades.reduce((s, g) => s + g.score, 0) / grades.length) : 0

  const attendance = useMemo(() => {
    const a = dataStore.getAttendance().filter((x) => x.studentId === child.id)
    return a
      .slice()
      .sort((x, y) => y.date.localeCompare(x.date))
      .slice(0, 14)
      .reverse()
      .map((x) => ({ date: x.date.slice(5), status: x.status === 'present' ? 1 : 0 }))
  }, [child.id])

  const messages = dataStore.getMessages().filter((m) => m.toId === user?.id)

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome, {user?.name?.split(' ')[0]}</h1>
          <p className="text-sm text-muted-foreground">
            Monitoring {myChildren.length} {myChildren.length === 1 ? 'child' : 'children'}
          </p>
        </div>
        <Button size="sm" className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:opacity-90" onClick={() => navigate('/app/parent/messages')}>
          <Mail className="h-4 w-4" /> Message school
        </Button>
      </div>

      {myChildren.length > 1 ? (
        <div className="flex flex-wrap gap-2">
          {myChildren.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedChildId(c.id)}
              className={
                'flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors ' +
                (selectedChildId === c.id
                  ? 'border-indigo-500 bg-indigo-500/10'
                  : 'border-border/60 hover:border-border')
              }
            >
              <Avatar className="h-6 w-6">
                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-violet-600 text-[10px] text-white">
                  {initials(c.name)}
                </AvatarFallback>
              </Avatar>
              {c.name}
            </button>
          ))}
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <MetricCard label="Attendance" value={`${child.attendancePct}%`} change="Last 14 days" icon={ClipboardCheck} tone="green" />
        <MetricCard label="Avg. score" value={`${avgScore}%`} change={`${grades.length} grades`} icon={TrendingUp} tone="blue" />
        <MetricCard label="GPA" value={child.gpa.toFixed(2)} change={child.performance} icon={Award} tone="amber" />
        <MetricCard label="Fees due" value={feesDue === 0 ? 'Clear' : `$${feesDue}`} change={`${fees.length} invoices`} icon={DollarSign} tone={feesDue === 0 ? 'teal' : 'rose'} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-violet-600 text-xl text-white">
                  {initials(child.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-lg font-bold">{child.name}</div>
                <div className="text-sm text-muted-foreground">{child.className}</div>
                <div className="mt-1 flex gap-1">
                  <Badge variant="info">Age {child.age}</Badge>
                  <Badge variant="secondary">ID {child.id}</Badge>
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-1 text-xs">
              <div className="flex justify-between"><span className="text-muted-foreground">Enrolled</span><span>{child.enrolledOn}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Performance</span><span className="font-mono font-semibold">{child.performance}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Phone</span><span>{child.phone}</span></div>
            </div>
            <Button variant="outline" className="mt-4 w-full" onClick={() => navigate('/app/parent/performance')}>
              View full details
            </Button>
          </CardContent>
        </Card>

        <Panel title="Recent attendance" description="Last 14 school days" className="lg:col-span-2">
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={attendance}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" domain={[0, 1]} ticks={[0, 1]} />
                <Tooltip
                  contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 8 }}
                />
                <Line type="monotone" dataKey="status" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
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

        <Panel title="Unread messages" description={`${messages.filter((m) => !m.read).length} new`}>
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
