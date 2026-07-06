import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, MapPin } from 'lucide-react'

const defaultSchedule = [
  { day: 'Monday', slots: [
    { time: '08:00 - 09:00', subject: 'Mathematics', className: 'Grade 10-A', room: 'Room 204' },
    { time: '09:15 - 10:15', subject: 'Mathematics', className: 'Grade 8-B', room: 'Room 112' },
    { time: '11:00 - 12:00', subject: 'Tutorial', className: 'Grade 10-A', room: 'Room 204' },
    { time: '14:00 - 15:00', subject: 'Mathematics', className: 'Grade 8-B', room: 'Room 112' },
  ]},
  { day: 'Tuesday', slots: [
    { time: '08:00 - 09:00', subject: 'Mathematics', className: 'Grade 10-A', room: 'Room 204' },
    { time: '10:00 - 11:00', subject: 'Faculty meeting', className: 'Staff', room: 'Conf. Room' },
    { time: '13:00 - 14:00', subject: 'Mathematics', className: 'Grade 8-B', room: 'Room 112' },
  ]},
  { day: 'Wednesday', slots: [
    { time: '08:00 - 09:00', subject: 'Mathematics', className: 'Grade 10-A', room: 'Room 204' },
    { time: '09:15 - 10:15', subject: 'Mathematics', className: 'Grade 8-B', room: 'Room 112' },
    { time: '11:00 - 12:00', subject: 'Lab supervision', className: 'Grade 11-C', room: 'Lab 02' },
  ]},
  { day: 'Thursday', slots: [
    { time: '08:00 - 09:00', subject: 'Mathematics', className: 'Grade 10-A', room: 'Room 204' },
    { time: '10:00 - 11:00', subject: 'Office hours', className: 'All', room: 'Office' },
    { time: '14:00 - 15:00', subject: 'Mathematics', className: 'Grade 8-B', room: 'Room 112' },
  ]},
  { day: 'Friday', slots: [
    { time: '08:00 - 09:00', subject: 'Mathematics', className: 'Grade 10-A', room: 'Room 204' },
    { time: '09:15 - 10:15', subject: 'Mathematics', className: 'Grade 8-B', room: 'Room 112' },
    { time: '13:00 - 15:00', subject: 'Quiz prep', className: 'Grade 10-A', room: 'Room 204' },
  ]},
]

export default function TeacherSchedulePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Schedule</h1>
        <p className="text-sm text-muted-foreground">Your weekly teaching timetable.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {defaultSchedule.map((d) => (
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
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      {s.time}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{s.subject}</div>
                      <div className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" /> {s.room} · {s.className}
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
