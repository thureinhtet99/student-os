import { useMemo } from 'react'
import { dataStore } from '@/lib/store'
import { Panel } from '@/components/MetricCard'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Award, TrendingDown } from 'lucide-react'
import { initials } from '@/lib/utils'
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts'

export default function PerformancePage() {
  const students = dataStore.getStudents()
  const teachers = dataStore.getTeachers()
  const subjects = ['Mathematics', 'English', 'Science', 'Social Studies', 'Computer']

  const sorted = useMemo(() => students.slice().sort((a, b) => b.gpa - a.gpa), [students])
  const top = sorted.slice(0, 3)
  const bottom = sorted.slice(-3).reverse()

  const subjectAverages = useMemo(() => {
    return subjects.map((sub) => {
      const grades = dataStore.getGrades().filter((g) => g.subject === sub)
      const avg = grades.length ? grades.reduce((s, g) => s + g.score, 0) / grades.length : 0
      return { subject: sub, avg: Math.round(avg) }
    })
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Performance</h1>
        <p className="text-sm text-muted-foreground">Student and teacher performance analytics.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel title="Top performers" description="Highest GPA this term" className="lg:col-span-2">
          <div className="space-y-2">
            {top.map((s, i) => (
              <div key={s.id} className="flex items-center gap-3 rounded-md border border-border/60 p-3">
                <div
                  className={
                    'flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white ' +
                    (i === 0 ? 'bg-amber-500' : i === 1 ? 'bg-slate-400' : 'bg-orange-400')
                  }
                >
                  #{i + 1}
                </div>
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-xs">
                    {initials(s.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">{s.name}</div>
                  <div className="truncate text-xs text-muted-foreground">{s.className}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="success">GPA {s.gpa.toFixed(2)}</Badge>
                  <span className="font-mono text-sm font-semibold">{s.performance}</span>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Subject averages" description="Across all students">
          <div className="h-64">
            <ResponsiveContainer>
              <RadarChart data={subjectAverages}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'currentColor', fontSize: 10 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={{ fill: 'currentColor', fontSize: 9 }} />
                <Radar name="Average" dataKey="avg" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
                <Tooltip
                  contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 8 }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <Panel title="Teacher performance" description="Aggregated ratings and assessment">
        <div className="rounded-md border border-border/60">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Teacher</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Performance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teachers.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-xs">
                          {initials(t.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-sm font-medium">{t.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>{t.subject}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Award className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-mono font-semibold">{t.rating.toFixed(1)}</span>
                    </div>
                  </TableCell>
                  <TableCell>{t.attendancePct}%</TableCell>
                  <TableCell>{t.experience} yrs</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        t.performance === 'Excellent'
                          ? 'success'
                          : t.performance === 'Very Good'
                            ? 'info'
                            : t.performance === 'Good'
                              ? 'secondary'
                              : 'warning'
                      }
                    >
                      {t.performance}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Panel>

      <Panel title="Needs support" description="Students requiring academic follow-up">
        <div className="space-y-2">
          {bottom.map((s) => (
            <div key={s.id} className="flex items-center gap-3 rounded-md border border-rose-500/20 bg-rose-500/5 p-3">
              <TrendingDown className="h-4 w-4 text-rose-500" />
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-gradient-to-br from-rose-500 to-rose-600 text-white text-xs">
                  {initials(s.name)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">{s.name}</div>
                <div className="truncate text-xs text-muted-foreground">{s.className}</div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="destructive">GPA {s.gpa.toFixed(2)}</Badge>
                <span className="font-mono text-sm">{s.performance}</span>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  )
}
