import { useEffect, useState } from 'react'
import { dataStore } from '@/lib/store'
import { useAuth } from '@/lib/auth-context'
import { Panel } from '@/components/MetricCard'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { initials } from '@/lib/utils'
import { Mail, Phone, Calendar, User, GraduationCap, MapPin, Heart, Award } from 'lucide-react'

export default function StudentRecordsPage() {
  const { user } = useAuth()
  const [, force] = useState(0)
  useEffect(() => dataStore.subscribe(() => force((n) => n + 1)), [])

  const student = dataStore.getStudents().find((s) => s.email === user?.email) ?? dataStore.getStudents()[0]
  const parent = dataStore.getUsers().find((u) => u.id === student.parentId)
  const grades = dataStore.getGradesForStudent(student.id)
  const fees = dataStore.getFeesForStudent(student.id)
  const attendance = dataStore.getAttendance().filter((a) => a.studentId === student.id)
  const presentCount = attendance.filter((a) => a.status === 'present').length
  const absentCount = attendance.filter((a) => a.status === 'absent').length
  const lateCount = attendance.filter((a) => a.status === 'late').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My student record</h1>
        <p className="text-sm text-muted-foreground">Complete academic and personal profile.</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-start gap-4 sm:flex-row">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-violet-600 text-2xl text-white">
                {initials(student.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="text-xl font-bold">{student.name}</div>
              <div className="text-sm text-muted-foreground">Student ID · {student.id}</div>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge variant="info">{student.className}</Badge>
                <Badge variant="success">GPA {student.gpa.toFixed(2)}</Badge>
                <Badge variant="warning">Performance {student.performance}</Badge>
                <Badge variant="secondary">Attendance {student.attendancePct}%</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel title="Personal information" description="Contact & demographics">
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Age</div>
                <div className="font-medium">{student.age} years</div>
              </div>
            </div>
            <Separator />
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Email</div>
                <div className="font-medium">{student.email}</div>
              </div>
            </div>
            <Separator />
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Phone</div>
                <div className="font-medium">{student.phone}</div>
              </div>
            </div>
            <Separator />
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Enrolled on</div>
                <div className="font-medium">{student.enrolledOn}</div>
              </div>
            </div>
            <Separator />
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Address</div>
                <div className="font-medium">123 School Lane, Springfield</div>
              </div>
            </div>
          </div>
        </Panel>

        <Panel title="Guardian" description="Parent or legal guardian">
          {parent ? (
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-gradient-to-br from-rose-500 to-pink-600 text-white">
                    {initials(parent.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">{parent.name}</div>
                  <div className="text-xs text-muted-foreground capitalize">{parent.role}</div>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div className="font-medium">{parent.email}</div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div className="font-medium">+1 (555) 010-3344</div>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <Heart className="h-4 w-4 text-muted-foreground" />
                <div className="text-xs text-muted-foreground">Primary contact & emergency</div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No guardian on file.</p>
          )}
        </Panel>

        <Panel title="Academic summary" description="Performance at a glance">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between rounded-md border border-border/60 p-2.5">
              <span className="text-muted-foreground">Current GPA</span>
              <span className="font-bold">{student.gpa.toFixed(2)} / 4.0</span>
            </div>
            <div className="flex justify-between rounded-md border border-border/60 p-2.5">
              <span className="text-muted-foreground">Performance band</span>
              <span className="font-bold">{student.performance}</span>
            </div>
            <div className="flex justify-between rounded-md border border-border/60 p-2.5">
              <span className="text-muted-foreground">Subjects studied</span>
              <span className="font-bold">{new Set(grades.map((g) => g.subject)).size}</span>
            </div>
            <div className="flex justify-between rounded-md border border-border/60 p-2.5">
              <span className="text-muted-foreground">Days present</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{presentCount}</span>
            </div>
            <div className="flex justify-between rounded-md border border-border/60 p-2.5">
              <span className="text-muted-foreground">Days absent</span>
              <span className="font-bold text-rose-600 dark:text-rose-400">{absentCount}</span>
            </div>
            <div className="flex justify-between rounded-md border border-border/60 p-2.5">
              <span className="text-muted-foreground">Days late</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">{lateCount}</span>
            </div>
            <div className="flex justify-between rounded-md border border-border/60 p-2.5">
              <span className="text-muted-foreground">Outstanding fees</span>
              <span className="font-bold">
                ${fees.reduce((s, f) => s + (f.amount - f.paid), 0)}
              </span>
            </div>
          </div>
        </Panel>
      </div>

      <Panel title="Achievements & notes" description="Academic recognition">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="flex items-center gap-3 rounded-md border border-emerald-500/20 bg-emerald-500/5 p-3">
            <GraduationCap className="h-5 w-5 text-emerald-600" />
            <div>
              <div className="text-sm font-semibold">Honor roll · Fall term</div>
              <div className="text-xs text-muted-foreground">Top 10% of class</div>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-md border border-indigo-500/20 bg-indigo-500/5 p-3">
            <Award className="h-5 w-5 text-indigo-600" />
            <div>
              <div className="text-sm font-semibold">Perfect attendance · September</div>
              <div className="text-xs text-muted-foreground">No absences, no tardies</div>
            </div>
          </div>
        </div>
      </Panel>
    </div>
  )
}
