import { Panel } from '@/components/MetricCard'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Calendar, FileText, Plus } from 'lucide-react'

const exams = [
  { id: 'e-1', title: 'Mid-Term — Mathematics', className: 'Grade 10-A', date: '2026-07-12', time: '09:00 - 11:00', room: 'Hall A', status: 'scheduled' },
  { id: 'e-2', title: 'Final — English Literature', className: 'Grade 8-B', date: '2026-07-15', time: '13:00 - 15:00', room: 'Room 112', status: 'scheduled' },
  { id: 'e-3', title: 'Quiz — Physics', className: 'Grade 11-C', date: '2026-07-08', time: '10:30 - 11:30', room: 'Lab 02', status: 'completed' },
  { id: 'e-4', title: 'Mid-Term — Social Studies', className: 'Grade 7-A', date: '2026-07-18', time: '11:00 - 12:30', room: 'Room 101', status: 'scheduled' },
  { id: 'e-5', title: 'Practical — Chemistry', className: 'Grade 12-B', date: '2026-07-22', time: '14:00 - 16:00', room: 'Lab 03', status: 'draft' },
]

export default function ExamsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Exams</h1>
          <p className="text-sm text-muted-foreground">Schedule and manage all school examinations.</p>
        </div>
        <Button size="sm" className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:opacity-90">
          <Plus className="h-4 w-4" /> Schedule exam
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <div className="text-xs text-muted-foreground">Total exams</div>
            <div className="mt-1 text-2xl font-bold">{exams.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-xs text-muted-foreground">Scheduled</div>
            <div className="mt-1 text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {exams.filter((e) => e.status === 'scheduled').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-xs text-muted-foreground">Completed</div>
            <div className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {exams.filter((e) => e.status === 'completed').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Panel title="All exams" description={`${exams.length} records`}>
        <div className="rounded-md border border-border/60">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exam</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exams.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{e.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>{e.className}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-xs">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" /> {e.date}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{e.time}</TableCell>
                  <TableCell>{e.room}</TableCell>
                  <TableCell>
                    <Badge variant={e.status === 'completed' ? 'success' : e.status === 'scheduled' ? 'info' : 'secondary'}>
                      {e.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">Details</Button>
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
