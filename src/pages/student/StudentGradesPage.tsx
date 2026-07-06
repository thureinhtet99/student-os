import { useEffect, useState, useMemo } from 'react'
import { dataStore } from '@/lib/store'
import { useAuth } from '@/lib/auth-context'
import { Panel } from '@/components/MetricCard'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts'
import { Award, BookOpen } from 'lucide-react'

export default function StudentGradesPage() {
  const { user } = useAuth()
  const [, force] = useState(0)
  useEffect(() => dataStore.subscribe(() => force((n) => n + 1)), [])

  const student = dataStore.getStudents().find((s) => s.email === user?.email) ?? dataStore.getStudents()[0]
  const grades = useMemo(
    () => dataStore.getGradesForStudent(student.id).slice().sort((a, b) => (b.date ?? '').localeCompare(a.date ?? '')),
    [student.id],
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
        <h1 className="text-2xl font-bold tracking-tight">My grades</h1>
        <p className="text-sm text-muted-foreground">Assessment results and subject performance.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">Overall average</div>
              <Award className="h-4 w-4 text-indigo-500" />
            </div>
            <div className="mt-1 text-2xl font-bold">{overallAvg}%</div>
            <div className="text-xs text-muted-foreground">Across all subjects</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">GPA</div>
              <BookOpen className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="mt-1 text-2xl font-bold">{student.gpa.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground">Performance: {student.performance}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">Total assessments</div>
              <BookOpen className="h-4 w-4 text-amber-500" />
            </div>
            <div className="mt-1 text-2xl font-bold">{grades.length}</div>
            <div className="text-xs text-muted-foreground">This academic year</div>
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

        <Panel title="Assessment history" description="All grades, newest first" className="lg:col-span-2">
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
    </div>
  )
}
