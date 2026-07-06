import { useEffect, useState } from 'react'
import { dataStore } from '@/lib/store'
import { useAuth } from '@/lib/auth-context'
import { Panel } from '@/components/MetricCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Award, TrendingUp, TrendingDown } from 'lucide-react'
import { initials } from '@/lib/utils'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

export default function TeacherPerformancePage() {
  const { user } = useAuth()
  const [, force] = useState(0)
  useEffect(() => dataStore.subscribe(() => force((n) => n + 1)), [])

  const teacher = dataStore.getTeachers().find((t) => t.email === user?.email) ?? dataStore.getTeachers()[0]
  const students = dataStore.getStudents().filter((s) => teacher.classIds.includes(s.classId))
  const sorted = [...students].sort((a, b) => b.gpa - a.gpa)
  const avgGpa = students.length ? (students.reduce((s, x) => s + x.gpa, 0) / students.length).toFixed(2) : '0.00'
  const excellent = students.filter((s) => s.gpa >= 3.5).length

  const distribution = [
    { grade: 'A+', count: students.filter((s) => s.performance === 'A+').length },
    { grade: 'A', count: students.filter((s) => s.performance === 'A').length },
    { grade: 'A-', count: students.filter((s) => s.performance === 'A-').length },
    { grade: 'B+', count: students.filter((s) => s.performance === 'B+').length },
    { grade: 'B', count: students.filter((s) => s.performance === 'B').length },
    { grade: 'C+', count: students.filter((s) => s.performance === 'C+').length },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Class performance</h1>
        <p className="text-sm text-muted-foreground">How your students are performing this term.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <div className="text-xs text-muted-foreground">Class average GPA</div>
            <div className="mt-1 text-2xl font-bold">{avgGpa}</div>
            <div className="mt-1 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-3.5 w-3.5" /> +0.12 vs last term
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-xs text-muted-foreground">High performers (≥ 3.5)</div>
            <div className="mt-1 text-2xl font-bold">{excellent}</div>
            <div className="mt-1 text-xs text-muted-foreground">
              {students.length ? Math.round((excellent / students.length) * 100) : 0}% of class
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-xs text-muted-foreground">My rating</div>
            <div className="mt-1 text-2xl font-bold">{teacher.rating.toFixed(1)} / 5</div>
            <div className="mt-1 flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
              <Award className="h-3.5 w-3.5" /> {teacher.performance}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel title="Grade distribution" description="Across your class" className="lg:col-span-1">
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={distribution}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="grade" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 8 }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Top performers" description="Highest GPA in your class" className="lg:col-span-2">
          <div className="space-y-2">
            {sorted.slice(0, 5).map((s, i) => (
              <div key={s.id} className="flex items-center gap-3 rounded-md border border-border/60 p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white">
                  #{i + 1}
                </div>
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-xs">
                    {initials(s.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">{s.name}</div>
                  <div className="truncate text-xs text-muted-foreground">{s.className}</div>
                </div>
                <Badge variant="success">GPA {s.gpa.toFixed(2)}</Badge>
                <span className="font-mono text-sm">{s.performance}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel title="Needs attention" description="Students requiring follow-up">
        <div className="space-y-2">
          {sorted.slice(-3).reverse().map((s) => (
            <div key={s.id} className="flex items-center gap-3 rounded-md border border-amber-500/20 bg-amber-500/5 p-3">
              <TrendingDown className="h-4 w-4 text-amber-600" />
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-600 text-white text-xs">
                  {initials(s.name)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">{s.name}</div>
                <div className="truncate text-xs text-muted-foreground">{s.className}</div>
              </div>
              <Badge variant="warning">GPA {s.gpa.toFixed(2)}</Badge>
              <Button size="sm" variant="outline">Plan</Button>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  )
}
