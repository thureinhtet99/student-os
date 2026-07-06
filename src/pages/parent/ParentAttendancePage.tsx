import { useEffect, useState, useMemo } from 'react'
import { dataStore } from '@/lib/store'
import { useAuth } from '@/lib/auth-context'
import { Panel } from '@/components/MetricCard'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { ClipboardCheck, TrendingUp, TrendingDown } from 'lucide-react'
import { initials } from '@/lib/utils'

export default function ParentAttendancePage() {
  const { user } = useAuth()
  const [, force] = useState(0)
  useEffect(() => dataStore.subscribe(() => force((n) => n + 1)), [])

  const myChildren = useMemo(
    () => dataStore.getStudents().filter((s) => s.parentId === user?.id),
    [user?.id],
  )
  const [selectedChildId, setSelectedChildId] = useState(myChildren[0]?.id)
  const child = myChildren.find((c) => c.id === selectedChildId) ?? myChildren[0]

  const attendance = useMemo(
    () =>
      dataStore
        .getAttendance()
        .filter((a) => a.studentId === child.id)
        .slice()
        .sort((a, b) => b.date.localeCompare(a.date)),
    [child.id],
  )

  const present = attendance.filter((a) => a.status === 'present').length
  const absent = attendance.filter((a) => a.status === 'absent').length
  const late = attendance.filter((a) => a.status === 'late').length
  const excused = attendance.filter((a) => a.status === 'excused').length
  const total = attendance.length || 1

  const monthly = useMemo(() => {
    const map: Record<string, { month: string; present: number; absent: number; late: number }> = {}
    attendance.forEach((a) => {
      const m = a.date.slice(0, 7)
      if (!map[m]) map[m] = { month: m, present: 0, absent: 0, late: 0 }
      if (a.status === 'present') map[m].present += 1
      else if (a.status === 'absent') map[m].absent += 1
      else if (a.status === 'late') map[m].late += 1
    })
    return Object.values(map).sort((a, b) => a.month.localeCompare(b.month))
  }, [attendance])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Attendance</h1>
        <p className="text-sm text-muted-foreground">Your child's attendance history.</p>
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

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">Present</div>
              <ClipboardCheck className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">{present}</div>
            <div className="text-xs text-muted-foreground">{Math.round((present / total) * 100)}% of days</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">Absent</div>
              <TrendingDown className="h-4 w-4 text-rose-500" />
            </div>
            <div className="mt-1 text-2xl font-bold text-rose-600 dark:text-rose-400">{absent}</div>
            <div className="text-xs text-muted-foreground">{Math.round((absent / total) * 100)}% of days</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">Late</div>
              <TrendingUp className="h-4 w-4 text-amber-500" />
            </div>
            <div className="mt-1 text-2xl font-bold text-amber-600 dark:text-amber-400">{late}</div>
            <div className="text-xs text-muted-foreground">{Math.round((late / total) * 100)}% of days</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">Excused</div>
              <Badge variant="info" className="text-[9px]">OK</Badge>
            </div>
            <div className="mt-1 text-2xl font-bold">{excused}</div>
            <div className="text-xs text-muted-foreground">Approved absences</div>
          </CardContent>
        </Card>
      </div>

      <Panel title="Monthly breakdown" description="Days present vs absent by month">
        <div className="h-64">
          <ResponsiveContainer>
            <BarChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip
                contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 8 }}
              />
              <Bar dataKey="present" stackId="a" fill="#10b981" />
              <Bar dataKey="late" stackId="a" fill="#f59e0b" />
              <Bar dataKey="absent" stackId="a" fill="#ef4444" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <Panel title="Attendance log" description="Most recent first">
        <div className="rounded-md border border-border/60">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Class</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendance.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.date}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        a.status === 'present'
                          ? 'success'
                          : a.status === 'late'
                            ? 'warning'
                            : a.status === 'excused'
                              ? 'info'
                              : 'destructive'
                      }
                    >
                      {a.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{a.className}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Panel>
    </div>
  )
}
