import { useState, useEffect } from 'react'
import { dataStore } from '@/lib/store'
import { Panel } from '@/components/MetricCard'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Star, Mail, Phone, TrendingUp, GraduationCap } from 'lucide-react'
import { initials } from '@/lib/utils'

export default function TeachersPage() {
  const [, force] = useState(0)
  useEffect(() => dataStore.subscribe(() => force((n) => n + 1)), [])

  const teachers = dataStore.getTeachers()
  const classes = dataStore.getClasses()
  const avgRating = (teachers.reduce((s, t) => s + t.rating, 0) / teachers.length).toFixed(2)
  const excellent = teachers.filter((t) => t.performance === 'Excellent').length
  const totalExperience = teachers.reduce((s, t) => s + t.experience, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Teachers</h1>
          <p className="text-sm text-muted-foreground">Performance, ratings, and contact information.</p>
        </div>
        <Button size="sm" className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:opacity-90">
          Add teacher
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <div className="text-sm text-muted-foreground">Average rating</div>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-2xl font-bold">{avgRating}</span>
              <span className="text-xs text-muted-foreground">/ 5.0</span>
              <Star className="ml-auto h-5 w-5 fill-amber-400 text-amber-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-sm text-muted-foreground">Excellent performers</div>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-2xl font-bold">{excellent}</span>
              <span className="text-xs text-muted-foreground">of {teachers.length} teachers</span>
              <TrendingUp className="ml-auto h-5 w-5 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-sm text-muted-foreground">Combined experience</div>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-2xl font-bold">{totalExperience}</span>
              <span className="text-xs text-muted-foreground">years</span>
              <GraduationCap className="ml-auto h-5 w-5 text-indigo-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Panel title="All Teachers" description={`${teachers.length} on staff`}>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {teachers.map((t) => (
            <div key={t.id} className="rounded-md border border-border/60 p-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                    {initials(t.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">{t.name}</div>
                  <div className="truncate text-xs text-muted-foreground">{t.subject}</div>
                  <div className="mt-1 flex items-center gap-1 text-xs">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className={
                          i <= Math.round(t.rating)
                            ? 'h-3.5 w-3.5 fill-amber-400 text-amber-400'
                            : 'h-3.5 w-3.5 text-muted-foreground/40'
                        }
                      />
                    ))}
                    <span className="ml-1 text-muted-foreground">{t.rating.toFixed(1)}</span>
                  </div>
                </div>
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
              </div>

              <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5" /> {t.email}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5" /> {t.phone}
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <div>
                  <div className="text-xs text-muted-foreground">Classes</div>
                  <div className="text-sm font-semibold">
                    {t.classIds
                      .map((id) => classes.find((c) => c.id === id)?.name?.replace('Grade ', 'G.') ?? '—')
                      .join(', ')}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Experience</div>
                  <div className="text-sm font-semibold">{t.experience} yrs</div>
                </div>
              </div>

              <div className="mt-3">
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Attendance</span>
                  <span className="font-semibold">{t.attendancePct}%</span>
                </div>
                <Progress value={t.attendancePct} />
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  )
}
