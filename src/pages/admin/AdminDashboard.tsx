import { useState, useEffect, useMemo } from 'react'
import { dataStore } from '@/lib/store'
import { auth } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MetricCard, Panel } from '@/components/MetricCard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Users,
  ClipboardCheck,
  Wallet,
  Bell,
  GraduationCap,
  School,
  TrendingUp,
  ArrowUpRight,
  MessageSquare,
  FileText,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { formatCurrency } from '@/lib/utils'

export default function AdminDashboard() {
  const [, force] = useState(0)
  useEffect(() => auth.subscribe(() => force((n) => n + 1)), [])

  const students = dataStore.getStudents()
  const teachers = dataStore.getTeachers()
  const classes = dataStore.getClasses()
  const fees = dataStore.getFees()
  const attendance = dataStore.getAttendance()
  const messages = dataStore.getMessages()
  const activity = dataStore.getActivity()

  const totalStudents = students.length
  const totalTeachers = teachers.length
  const totalClasses = classes.length
  const avgAttendance = useMemo(() => {
    if (!students.length) return 0
    return Math.round(students.reduce((s, x) => s + x.attendancePct, 0) / students.length)
  }, [students])
  const totalCollected = fees.reduce((s, f) => s + f.paid, 0)
  const totalDue = fees.reduce((s, f) => s + (f.amount - f.paid), 0)
  const collectionPct = Math.round((totalCollected / (totalCollected + totalDue || 1)) * 100)
  const unread = messages.filter((m) => !m.read).length
  const overdueCount = students.filter((s) => s.feesStatus === 'due').length

  // attendance trend (last 14 days)
  const attendanceTrend = useMemo(() => {
    const byDate = new Map<string, { present: number; total: number }>()
    for (const a of attendance) {
      const e = byDate.get(a.date) ?? { present: 0, total: 0 }
      e.total += 1
      if (a.status === 'present' || a.status === 'late') e.present += 1
      byDate.set(a.date, e)
    }
    return Array.from(byDate.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-14)
      .map(([date, v]) => ({
        date: date.slice(5),
        pct: v.total ? Math.round((v.present / v.total) * 100) : 0,
      }))
  }, [attendance])

  const enrollmentTrend = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const counts = [54, 62, 70, 65, 78, 84, 91, 88, 96, 102, 112, 124]
    return months.map((m, i) => ({ month: m, students: counts[i] }))
  }, [])

  const performanceData = useMemo(() => {
    const groups = new Map<string, number>()
    for (const s of students) groups.set(s.performance, (groups.get(s.performance) ?? 0) + 1)
    return Array.from(groups.entries()).map(([name, value]) => ({ name, value }))
  }, [students])

  const pieColors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#8b5cf6', '#84cc16']

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">School Dashboard</h1>
          <p className="text-sm text-muted-foreground">A complete overview of academic year 2026.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4" /> Export
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:opacity-90">
            <Sparkles className="h-4 w-4" /> Generate report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <MetricCard label="Total Students" value={totalStudents.toLocaleString()} change={`${overdueCount} fees overdue`} icon={Users} tone="blue" />
        <MetricCard label="Attendance Today" value={`${avgAttendance}%`} change="+2.1% vs last week" icon={ClipboardCheck} tone="green" />
        <MetricCard label="Fees Collected" value={formatCurrency(totalCollected)} change={`${collectionPct}% of total billed`} icon={Wallet} tone="amber" />
        <MetricCard label="Open Alerts" value={String(unread + overdueCount)} change={`${unread} unread messages`} icon={Bell} tone="rose" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel
          title="Attendance Trend"
          description="Daily attendance percentage over the last 14 school days."
          className="lg:col-span-2"
          action={<Badge variant="success">Live</Badge>}
        >
          <div className="h-72 w-full">
            <ResponsiveContainer>
              <AreaChart data={attendanceTrend}>
                <defs>
                  <linearGradient id="g-att" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="date" stroke="currentColor" className="text-xs" />
                <YAxis domain={[60, 100]} stroke="currentColor" className="text-xs" />
                <Tooltip
                  contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 8 }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Area type="monotone" dataKey="pct" stroke="#6366f1" strokeWidth={2.5} fill="url(#g-att)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Performance Distribution" description="By letter grade">
          <div className="h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={performanceData} dataKey="value" nameKey="name" innerRadius={48} outerRadius={86} paddingAngle={3}>
                  {performanceData.map((_, i) => (
                    <Cell key={i} fill={pieColors[i % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 8 }}
                />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  wrapperStyle={{ fontSize: 11 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel title="Enrollment" description="New students by month" className="lg:col-span-2">
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={enrollmentTrend}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="month" stroke="currentColor" className="text-xs" />
                <YAxis stroke="currentColor" className="text-xs" />
                <Tooltip
                  contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 8 }}
                />
                <Bar dataKey="students" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Quick Stats" description="Snapshot of school">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-300">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Teachers</div>
                  <div className="text-xs text-muted-foreground">Active staff</div>
                </div>
              </div>
              <div className="text-xl font-bold">{totalTeachers}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
                  <School className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Classes</div>
                  <div className="text-xs text-muted-foreground">Sections running</div>
                </div>
              </div>
              <div className="text-xl font-bold">{totalClasses}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-300">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Unread messages</div>
                  <div className="text-xs text-muted-foreground">Inbox</div>
                </div>
              </div>
              <div className="text-xl font-bold">{unread}</div>
            </div>
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Fee collection</span>
                <span className="font-semibold">{collectionPct}%</span>
              </div>
              <Progress value={collectionPct} />
            </div>
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel title="Top Students" description="Highest GPA across classes" className="lg:col-span-2">
          <div className="space-y-2">
            {students
              .slice()
              .sort((a, b) => b.gpa - a.gpa)
              .slice(0, 5)
              .map((s) => (
                <div key={s.id} className="flex items-center gap-3 rounded-md border border-border/60 p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-semibold text-white">
                    {s.name
                      .split(' ')
                      .map((p) => p[0])
                      .slice(0, 2)
                      .join('')}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold">{s.name}</div>
                    <div className="truncate text-xs text-muted-foreground">
                      {s.className} · GPA {s.gpa.toFixed(2)}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <Badge variant={s.attendancePct >= 95 ? 'success' : s.attendancePct >= 90 ? 'info' : 'warning'}>
                      {s.attendancePct}% att.
                    </Badge>
                    <span className="font-mono font-semibold">{s.performance}</span>
                  </div>
                </div>
              ))}
          </div>
        </Panel>

        <Panel title="Recent Activity" description="Latest system events">
          <div className="space-y-3">
            {activity.slice(0, 6).map((a) => (
              <div key={a.id} className="flex items-start gap-3 rounded-md p-2">
                <div
                  className={
                    'mt-1 h-2 w-2 shrink-0 rounded-full ' +
                    (a.type === 'success'
                      ? 'bg-emerald-500'
                      : a.type === 'warning'
                        ? 'bg-amber-500'
                        : a.type === 'destructive'
                          ? 'bg-rose-500'
                          : 'bg-indigo-500')
                  }
                />
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{a.title}</div>
                  <div className="line-clamp-2 text-xs text-muted-foreground">{a.description}</div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Card className="border-border/60 bg-gradient-to-br from-indigo-500/5 via-violet-500/5 to-transparent">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Teacher performance</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">Quick comparison of staff performance rating.</p>
          </div>
          <Button variant="ghost" size="sm">
            View all <ChevronRight className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {teachers.slice(0, 6).map((t) => (
              <div key={t.id} className="rounded-md border border-border/60 p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-sm font-semibold text-white">
                    {t.name
                      .split(' ')
                      .map((p) => p[0])
                      .slice(0, 2)
                      .join('')}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold">{t.name}</div>
                    <div className="truncate text-xs text-muted-foreground">{t.subject}</div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <Badge
                    variant={
                      t.performance === 'Excellent'
                        ? 'success'
                        : t.performance === 'Very Good'
                          ? 'info'
                          : 'warning'
                    }
                  >
                    {t.performance}
                  </Badge>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span>Rating {t.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <Button variant="link" size="sm" className="gap-1">
              See full performance report <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
