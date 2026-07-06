import { useState, useEffect, useMemo } from 'react'
import { dataStore } from '@/lib/store'
import { Panel } from '@/components/MetricCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Search, Plus, MoreHorizontal, Download, Mail } from 'lucide-react'
import { initials } from '@/lib/utils'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function StudentsPage() {
  const [, force] = useState(0)
  useEffect(() => dataStore.subscribe(() => force((n) => n + 1)), [])

  const students = dataStore.getStudents()
  const classes = dataStore.getClasses()
  const [q, setQ] = useState('')
  const [classFilter, setClassFilter] = useState<string>('all')
  const [addOpen, setAddOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', classId: classes[0]?.id ?? '', phone: '', address: '' })

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const matchQ = q ? s.name.toLowerCase().includes(q.toLowerCase()) || s.email.toLowerCase().includes(q.toLowerCase()) : true
      const matchC = classFilter === 'all' ? true : s.classId === classFilter
      return matchQ && matchC
    })
  }, [students, q, classFilter])

  const onAdd = () => {
    if (!form.name || !form.email) return
    const klass = classes.find((c) => c.id === form.classId)
    const id = `s-${Date.now()}`
    dataStore.addStudent({
      id,
      name: form.name,
      email: form.email,
      classId: form.classId,
      className: klass?.name ?? '',
      parentId: 'u-parent-1',
      parentName: '—',
      attendancePct: 100,
      feesStatus: 'paid',
      feesAmount: 1000,
      grade: 'A',
      performance: 'A',
      enrolledOn: new Date().toISOString().slice(0, 10),
      phone: form.phone,
      address: form.address,
      gpa: 3.5,
      age: 15,
    })
    setForm({ name: '', email: '', classId: classes[0]?.id ?? '', phone: '', address: '' })
    setAddOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Students</h1>
          <p className="text-sm text-muted-foreground">Manage the complete student directory.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" /> Export CSV
          </Button>
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:opacity-90">
                <Plus className="h-4 w-4" /> Add student
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add new student</DialogTitle>
              </DialogHeader>
              <div className="grid gap-3">
                <div>
                  <Label>Full name</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div>
                  <Label>Class</Label>
                  <Select value={form.classId} onValueChange={(v) => setForm({ ...form, classId: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {classes.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div>
                  <Label>Address</Label>
                  <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
                <Button onClick={onAdd}>Add student</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Panel title="All Students" description={`${filtered.length} of ${students.length} students`}>
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search by name or email..." value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <Select value={classFilter} onValueChange={setClassFilter}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All classes</SelectItem>
              {classes.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border border-border/60">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Parent</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead>Fees</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
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
                  <TableCell>{s.className}</TableCell>
                  <TableCell>
                    <div className="text-sm">{s.parentName}</div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Mail className="h-3 w-3" /> {s.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={s.attendancePct >= 95 ? 'success' : s.attendancePct >= 90 ? 'info' : 'warning'}>
                      {s.attendancePct}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={s.feesStatus === 'paid' ? 'success' : s.feesStatus === 'partial' ? 'warning' : 'destructive'}>
                      {s.feesStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono font-semibold">{s.performance}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View profile</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Send message</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
