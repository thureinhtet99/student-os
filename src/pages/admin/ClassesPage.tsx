import { useState, useEffect } from 'react'
import { dataStore } from '@/lib/store'
import { Panel } from '@/components/MetricCard'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { School, Users } from 'lucide-react'

export default function ClassesPage() {
  const [, force] = useState(0)
  useEffect(() => dataStore.subscribe(() => force((n) => n + 1)), [])

  const classes = dataStore.getClasses()
  const students = dataStore.getStudents()

  const [selected, setSelected] = useState(classes[0]?.id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Classes</h1>
        <p className="text-sm text-muted-foreground">All sections, homeroom teachers, and student rosters.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel title="All classes" description={`${classes.length} sections`} className="lg:col-span-1">
          <div className="space-y-2">
            {classes.map((c) => {
              const studentCount = students.filter((s) => s.classId === c.id).length
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelected(c.id)}
                  className={
                    'w-full rounded-md border p-3 text-left transition-colors ' +
                    (selected === c.id
                      ? 'border-indigo-500 bg-indigo-500/5'
                      : 'border-border/60 hover:border-border')
                  }
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold">{c.name}</div>
                      <div className="text-xs text-muted-foreground">Room {c.room.replace('Room ', '')}</div>
                    </div>
                    <Badge variant="secondary">{studentCount} students</Badge>
                  </div>
                </button>
              )
            })}
          </div>
        </Panel>

        <Panel
          title={selected ? (classes.find((c) => c.id === selected)?.name ?? 'Select a class') : 'Select a class'}
          description={(selected ? classes.find((c) => c.id === selected)?.homeroomTeacher : '') ?? ''}
          className="lg:col-span-2"
        >
          {selected ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Card>
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-300">
                      <School className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Room</div>
                      <div className="text-sm font-semibold">
                        {classes.find((c) => c.id === selected)?.room}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
                      <Users className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Roster size</div>
                      <div className="text-sm font-semibold">
                        {students.filter((s) => s.classId === selected).length} students
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="rounded-md border border-border/60">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Attendance</TableHead>
                      <TableHead>GPA</TableHead>
                      <TableHead>Performance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students
                      .filter((s) => s.classId === selected)
                      .map((s) => (
                        <TableRow key={s.id}>
                          <TableCell>
                            <div className="text-sm font-medium">{s.name}</div>
                            <div className="text-xs text-muted-foreground">{s.email}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={s.attendancePct >= 95 ? 'success' : s.attendancePct >= 90 ? 'info' : 'warning'}>
                              {s.attendancePct}%
                            </Badge>
                          </TableCell>
                          <TableCell>{s.gpa.toFixed(2)}</TableCell>
                          <TableCell className="font-mono font-semibold">{s.performance}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : null}
        </Panel>
      </div>
    </div>
  )
}
