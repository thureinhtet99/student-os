import { useEffect, useState, useMemo } from 'react'
import { dataStore } from '@/lib/store'
import { useAuth } from '@/lib/auth-context'
import { Panel } from '@/components/MetricCard'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Award, BookOpen, TrendingUp } from 'lucide-react'
import { initials } from '@/lib/utils'

export default function ParentPerformancePage() {
  const { user } = useAuth()
  const [, force] = useState(0)
  useEffect(() => dataStore.subscribe(() => force((n) => n + 1)), [])

  const myChildren = useMemo(
    () => dataStore.getStudents().filter((s) => s.parentId === user?.id),
    [user?.id],
  )
  const [selectedChildId, setSelectedChildId] = useState(myChildren[0]?.id)
  const child = myChildren.find((c) => c.id === selectedChildId) ?? myChildren[0]

  const grades = useMemo(
    () => dataStore.getGradesForStudent(child.id).slice().sort((a, b) => (b.date ?? '').localeCompare(a.date ?? '')),
    [child.id],
  )
  const bySubject = useMemo(() => {
    const map: Record<string, number[]> = {}
    grades.forEach((g) => {
      if (!map[g.subject]) map[g.subject] = []
      map[g.subject].push(g.score)
    })
    return Object.entries(map).map(([subject, scores]) => ({
      subject,
      average: Math.round(scores.reduce((s, x) => s + x, 0) / scores.length),
    }))
  }, [grades])

  const overallAvg = grades.length ? Math.round(grades.reduce((s, g) => s + g.score, 0) / grades.length) : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Performance</h1>
        <p className="text-sm text-muted-foreground">Your child's academic performance.</p>
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
                (selectedChildId === c.id ? 'border-indigo-500 bg-indigo-500/10' : 'border-border/60 hover:border-border')
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
                <Badge variant="success">GPA {child.gpa.toFixed(2)}</Badge>
                <Badge variant="warning">Performance {child.performance}</Badge>
                <Badge variant="info">Rank in class</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">Overall average</div>
              <Award className="h-4 w-4 text-indigo-500" />
            </div>
            <div className="mt-1 text-2xl font-bold">{overallAvg}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">GPA</div>
              <BookOpen className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="mt-1 text-2xl font-bold">{child.gpa.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">Trend</div>
              <TrendingUp className="h-4 w-4 text-amber-500" />
            </div>
            <div className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">+5%</div>
            <div className="text-xs text-muted-foreground">vs last term</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel title="Subject performance" description="Average by subject" className="lg:col-span-1">
          <div className="h-72">
            <ResponsiveContainer>
              <RadarChart data={bySubject}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="subject" className="text-xs" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} className="text-xs" />
                <Radar dataKey="average" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
                <Tooltip
                  contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 8 }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Subject averages" description="Comparison" className="lg:col-span-2">
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={bySubject} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis type="number" domain={[0, 100]} className="text-xs" />
                <YAxis dataKey="subject" type="category" className="text-xs" width={100} />
                <Tooltip
                  contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 8 }}
                />
                <Bar dataKey="average" fill="#6366f1" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <Panel title="Assessment history" description="All grades, newest first">
        <div className="rounded-md border border-border/60">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Assessment</TableHead>
                <TableHead>Term</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Grade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {grades.map((g) => (
                <TableRow key={g.id}>
                  <TableCell className="font-medium">{g.subject}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{g.assessment}</TableCell>
                  <TableCell className="text-xs">{g.term}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{g.date}</TableCell>
                  <TableCell>
                    <Badge variant={g.score >= 90 ? 'success' : g.score >= 80 ? 'info' : g.score >= 70 ? 'warning' : 'destructive'}>
                      {g.score}%
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono font-bold">{g.grade}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Panel>
    </div>
  )
}
