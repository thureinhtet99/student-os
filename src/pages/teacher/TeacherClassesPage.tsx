import { useState, useEffect, useMemo } from 'react'
import { dataStore } from '@/lib/store'
import { useAuth } from '@/lib/auth-context'
import { Panel } from '@/components/MetricCard'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Users } from 'lucide-react'
import { initials } from '@/lib/utils'

export default function TeacherClassesPage() {
  const { user } = useAuth()
  const [, force] = useState(0)
  useEffect(() => dataStore.subscribe(() => force((n) => n + 1)), [])

  const teacher = dataStore.getTeachers().find((t) => t.email === user?.email) ?? dataStore.getTeachers()[0]
  const classes = dataStore.getClasses().filter((c) => teacher.classIds.includes(c.id))
  const students = dataStore.getStudents()
  const [selected, setSelected] = useState(classes[0]?.id)

  const roster = useMemo(() => students.filter((s) => s.classId === selected), [students, selected])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My classes</h1>
        <p className="text-sm text-muted-foreground">Sections you teach and student rosters.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {classes.map((c) => (
          <Card
            key={c.id}
            className={selected === c.id ? 'cursor-pointer border-indigo-500 bg-indigo-500/5' : 'cursor-pointer'}
            onClick={() => setSelected(c.id)}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-semibold">{c.name}</div>
                  <div className="text-xs text-muted-foreground">Room {c.room.replace('Room ', '')}</div>
                </div>
                <Badge variant="secondary">
                  <Users className="mr-1 h-3 w-3" />
                  {c.studentCount}
                </Badge>
              </div>
              <div className="mt-3 text-xs text-muted-foreground">{c.homeroomTeacher}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Panel title="Class roster" description={`${roster.length} students`}>
        <div className="rounded-md border border-border/60">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead>GPA</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Fees</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roster.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-xs">
                          {initials(s.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium">{s.name}</div>
                        <div className="text-xs text-muted-foreground">{s.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={s.attendancePct >= 95 ? 'success' : s.attendancePct >= 90 ? 'info' : 'warning'}>
                      {s.attendancePct}%
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono">{s.gpa.toFixed(2)}</TableCell>
                  <TableCell className="font-mono font-semibold">{s.performance}</TableCell>
                  <TableCell>
                    <Badge variant={s.feesStatus === 'paid' ? 'success' : s.feesStatus === 'partial' ? 'warning' : 'destructive'}>
                      {s.feesStatus}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Panel>
    </div>
  )
}
