import { useState, useEffect, useMemo } from 'react'
import { dataStore } from '@/lib/store'
import { useAuth } from '@/lib/auth-context'
import { Panel } from '@/components/MetricCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Plus, Save } from 'lucide-react'
import { initials } from '@/lib/utils'

export default function GradebookPage() {
  const { user } = useAuth()
  const [, force] = useState(0)
  useEffect(() => dataStore.subscribe(() => force((n) => n + 1)), [])

  const teacher = dataStore.getTeachers().find((t) => t.email === user?.email) ?? dataStore.getTeachers()[0]
  const classes = dataStore.getClasses().filter((c) => teacher.classIds.includes(c.id))
  const students = dataStore.getStudents()
  const [classId, setClassId] = useState(classes[0]?.id ?? '')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ studentId: '', subject: 'Mathematics', score: 0, term: 'Q2 2026' })

  const classStudents = useMemo(() => students.filter((s) => s.classId === classId), [students, classId])
  const grades = useMemo(() => dataStore.getGrades().filter((g) => classStudents.some((s) => s.id === g.studentId)), [classStudents])

  const gradeColor = (s: number) =>
    s >= 90 ? 'success' : s >= 80 ? 'info' : s >= 70 ? 'warning' : 'destructive'

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gradebook</h1>
          <p className="text-sm text-muted-foreground">Track student grades by class and subject.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:opacity-90">
              <Plus className="h-4 w-4" /> Add grade
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add grade entry</DialogTitle>
            </DialogHeader>
            <div className="grid gap-3">
              <div>
                <Label>Student</Label>
                <Select value={form.studentId} onValueChange={(v) => setForm({ ...form, studentId: v })}>
                  <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
                  <SelectContent>
                    {classStudents.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Subject</Label>
                <Select value={form.subject} onValueChange={(v) => setForm({ ...form, subject: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['Mathematics', 'English', 'Science', 'Social Studies', 'Computer'].map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Score</Label>
                <Input type="number" min={0} max={100} value={form.score} onChange={(e) => setForm({ ...form, score: Number(e.target.value) })} />
              </div>
              <div>
                <Label>Term</Label>
                <Input value={form.term} onChange={(e) => setForm({ ...form, term: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button
                onClick={() => {
                  if (!form.studentId) return
                  const score = form.score
                  dataStore.addGrade({
                    id: `g-${Date.now()}`,
                    studentId: form.studentId,
                    subject: form.subject,
                    term: form.term,
                    score,
                    grade: score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : 'D',
                    teacherId: teacher.id,
                  })
                  setForm({ ...form, studentId: '', score: 0 })
                  setOpen(false)
                }}
              >
                <Save className="h-4 w-4" /> Save grade
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-wrap gap-2">
        {classes.map((c) => (
          <Button key={c.id} size="sm" variant={classId === c.id ? 'default' : 'outline'} onClick={() => setClassId(c.id)}>
            {c.name}
          </Button>
        ))}
      </div>

      <Panel title="Grades" description={`${classStudents.length} students`}>
        <div className="rounded-md border border-border/60">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Mathematics</TableHead>
                <TableHead>English</TableHead>
                <TableHead>Science</TableHead>
                <TableHead>Social Studies</TableHead>
                <TableHead>Computer</TableHead>
                <TableHead>Average</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classStudents.map((s) => {
                const subjects = ['Mathematics', 'English', 'Science', 'Social Studies', 'Computer']
                const scores = subjects.map((sub) => grades.find((g) => g.studentId === s.id && g.subject === sub)?.score)
                const valid = scores.filter((x): x is number => typeof x === 'number')
                const avg = valid.length ? Math.round(valid.reduce((a, b) => a + b, 0) / valid.length) : 0
                return (
                  <TableRow key={s.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-xs">
                            {initials(s.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-sm font-medium">{s.name}</div>
                      </div>
                    </TableCell>
                    {subjects.map((sub, i) => {
                      const score = scores[i]
                      return (
                        <TableCell key={sub}>
                          {typeof score === 'number' ? (
                            <Badge variant={gradeColor(score) as any}>{score}</Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </TableCell>
                      )
                    })}
                    <TableCell className="font-mono font-semibold">{avg || '—'}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </Panel>
    </div>
  )
}
