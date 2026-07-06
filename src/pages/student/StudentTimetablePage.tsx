import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, MapPin } from 'lucide-react'

const schedule = [
  {
    day: 'Monday',
    slots: [
      { time: '08:00 - 09:00', subject: 'Mathematics', teacher: 'Ms. Sarah Wilson', room: 'Room 204' },
      { time: '09:15 - 10:15', subject: 'English Literature', teacher: 'Mr. James Brown', room: 'Room 108' },
      { time: '10:30 - 11:30', subject: 'Physics', teacher: 'Dr. Emily Chen', room: 'Lab 02' },
      { time: '13:00 - 14:00', subject: 'History', teacher: 'Mr. Robert Lee', room: 'Room 215' },
    ],
  },
  {
    day: 'Tuesday',
    slots: [
      { time: '08:00 - 09:00', subject: 'Chemistry', teacher: 'Dr. Emily Chen', room: 'Lab 01' },
      { time: '09:15 - 10:15', subject: 'Mathematics', teacher: 'Ms. Sarah Wilson', room: 'Room 204' },
      { time: '11:00 - 12:00', subject: 'Physical Education', teacher: 'Coach Davis', room: 'Gym' },
      { time: '14:00 - 15:00', subject: 'English Literature', teacher: 'Mr. James Brown', room: 'Room 108' },
    ],
  },
  {
    day: 'Wednesday',
    slots: [
      { time: '08:00 - 09:00', subject: 'Mathematics', teacher: 'Ms. Sarah Wilson', room: 'Room 204' },
      { time: '09:15 - 10:15', subject: 'Biology', teacher: 'Dr. Priya Patel', room: 'Lab 03' },
      { time: '11:00 - 12:00', subject: 'History', teacher: 'Mr. Robert Lee', room: 'Room 215' },
      { time: '13:00 - 14:00', subject: 'Art', teacher: 'Ms. Laura Kim', room: 'Studio' },
    ],
  },
  {
    day: 'Thursday',
    slots: [
      { time: '08:00 - 09:00', subject: 'Physics', teacher: 'Dr. Emily Chen', room: 'Lab 02' },
      { time: '09:15 - 10:15', subject: 'English Literature', teacher: 'Mr. James Brown', room: 'Room 108' },
      { time: '11:00 - 12:00', subject: 'Mathematics', teacher: 'Ms. Sarah Wilson', room: 'Room 204' },
      { time: '14:00 - 15:00', subject: 'Computer Science', teacher: 'Mr. Alex Park', room: 'Lab 04' },
    ],
  },
  {
    day: 'Friday',
    slots: [
      { time: '08:00 - 09:00', subject: 'Chemistry', teacher: 'Dr. Emily Chen', room: 'Lab 01' },
      { time: '09:15 - 10:15', subject: 'Biology', teacher: 'Dr. Priya Patel', room: 'Lab 03' },
      { time: '11:00 - 12:00', subject: 'Music', teacher: 'Ms. Olivia Stone', room: 'Music Room' },
      { time: '13:00 - 15:00', subject: 'Assembly & Clubs', teacher: '—', room: 'Hall' },
    ],
  },
]

const subjectColor = (s: string) => {
  const colors = [
    'from-indigo-500 to-violet-600',
    'from-emerald-500 to-teal-600',
    'from-amber-500 to-orange-600',
    'from-rose-500 to-pink-600',
    'from-cyan-500 to-blue-600',
    'from-fuchsia-500 to-purple-600',
  ]
  let hash = 0
  for (let i = 0; i < s.length; i += 1) hash = (hash * 31 + s.charCodeAt(i)) >>> 0
  return colors[hash % colors.length]
}

export default function StudentTimetablePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My timetable</h1>
        <p className="text-sm text-muted-foreground">Your weekly class schedule.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {schedule.map((d) => (
          <Card key={d.day}>
            <CardContent className="p-5">
              <div className="mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-indigo-500" />
                <span className="text-sm font-semibold">{d.day}</span>
                <Badge variant="secondary" className="ml-auto">{d.slots.length} classes</Badge>
              </div>
              <div className="space-y-2">
                {d.slots.map((s, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-md border border-border/60 p-2.5">
                    <div
                      className={`h-10 w-1 rounded-full bg-gradient-to-b ${subjectColor(s.subject)}`}
                    />
                    <div className="flex flex-1 items-center gap-3">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        {s.time}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium">{s.subject}</div>
                        <div className="flex items-center gap-2 truncate text-xs text-muted-foreground">
                          <span>{s.teacher}</span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {s.room}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
