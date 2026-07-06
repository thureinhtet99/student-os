import { useState, useEffect, useMemo } from 'react'
import { dataStore } from '@/lib/store'
import { useAuth } from '@/lib/auth-context'
import { Panel } from '@/components/MetricCard'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Save, Calendar } from 'lucide-react'
import { initials } from '@/lib/utils'

export default function TeacherAttendancePage() {
  const { user } = useAuth()
  const [, force] = useState(0)
  useEffect(() => dataStore.subscribe(() => force((n) => n + 1)), [])

  const teacher = dataStore.getTeachers().find((t) => t.email === user?.email) ?? dataStore.getTeachers()[0]
  const classes = dataStore.getClasses().filter((c) => teacher.classIds.includes(c.id))
  const students = dataStore.getStudents()
  const attendance = dataStore.getAttendance()

  const [classId, setClassId] = useState(classes[0]?.id ?? '')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [statuses, setStatuses] = useState<Record<string, 'present' | 'absent' | 'late' | 'excused'>>({})

  const classStudents = useMemo(() => students.filter((s) => s.classId === classId), [students, classId])

  useEffect(() => {
    const init: Record<string, any> = {}
    for (const s of classStudents) {
      const r = attendance.find((a) => a.studentId === s.id && a.date === date)
      init[s.id] = (r?.status as any) ?? 'present'
    }
    setStatuses(init)
  }, [classId, date, classStudents.length, attendance])

  const save = () => dataStore.setAttendanceForClass(classId, date, statuses)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Attendance</h1>
        <p className="text-sm text-muted-foreground">Mark today&apos;s attendance for your classes.</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex gap-2">
          {classes.map((c) => (
            <Button
              key={c.id}
              size="sm"
              variant={classId === c.id ? 'default' : 'outline'}
              onClick={() => setClassId(c.id)}
            >
              {c.name}
            </Button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
          />
          <Button onClick={save} size="sm"><Save className="h-4 w-4" /> Save</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Total</div>
            <div className="mt-1 text-2xl font-bold">{classStudents.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Present</div>
            <div className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {Object.values(statuses).filter((s) => s === 'present').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Absent</div>
            <div className="mt-1 text-2xl font-bold text-rose-600 dark:text-rose-400">
              {Object.values(statuses).filter((s) => s === 'absent').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Late</div>
            <div className="mt-1 text-2xl font-bold text-amber-600 dark:text-amber-400">
              {Object.values(statuses).filter((s) => s === 'late').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Panel title="Mark attendance" description={`${classStudents.length} students in ${classes.find((c) => c.id === classId)?.name ?? ''}`}>
        <div className="rounded-md border border-border/60">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead className="text-center">Present</TableHead>
                <TableHead className="text-center">Absent</TableHead>
                <TableHead className="text-center">Late</TableHead>
                <TableHead className="text-center">Excused</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classStudents.map((s) => (
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
                  {(['present', 'absent', 'late', 'excused'] as const).map((k) => (
                    <TableCell key={k} className="text-center">
                      <Checkbox
                        checked={statuses[s.id] === k}
                        onCheckedChange={() => setStatuses({ ...statuses, [s.id]: k })}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Panel>
    </div>
  )
}
