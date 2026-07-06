import { useState, useEffect } from 'react'
import { dataStore } from '@/lib/store'
import { Panel } from '@/components/MetricCard'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DollarSign, TrendingUp, AlertCircle, CheckCircle2, Download } from 'lucide-react'
import { formatCurrency, initials } from '@/lib/utils'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'

export default function AdminFeesPage() {
  const [, force] = useState(0)
  useEffect(() => dataStore.subscribe(() => force((n) => n + 1)), [])

  const fees = dataStore.getFees()
  const students = dataStore.getStudents()

  const totalBilled = fees.reduce((s, f) => s + f.amount, 0)
  const totalCollected = fees.reduce((s, f) => s + f.paid, 0)
  const totalDue = totalBilled - totalCollected
  const collectionPct = totalBilled ? Math.round((totalCollected / totalBilled) * 100) : 0
  const overdue = fees.filter((f) => f.status === 'due').length

  const byStatus = [
    { name: 'Paid', value: fees.filter((f) => f.status === 'paid').length, color: '#10b981' },
    { name: 'Partial', value: fees.filter((f) => f.status === 'partial').length, color: '#f59e0b' },
    { name: 'Due', value: fees.filter((f) => f.status === 'due').length, color: '#ef4444' },
  ]

  const [filter, setFilter] = useState<'all' | 'paid' | 'partial' | 'due'>('all')
  const filtered = filter === 'all' ? fees : fees.filter((f) => f.status === filter)

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Fees</h1>
          <p className="text-sm text-muted-foreground">Track tuition and other school payments.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:opacity-90">
            Send reminders
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <DollarSign className="h-3.5 w-3.5" /> Billed
            </div>
            <div className="mt-1 text-2xl font-bold">{formatCurrency(totalBilled)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle2 className="h-3.5 w-3.5" /> Collected
            </div>
            <div className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(totalCollected)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <AlertCircle className="h-3.5 w-3.5" /> Outstanding
            </div>
            <div className="mt-1 text-2xl font-bold text-rose-600 dark:text-rose-400">
              {formatCurrency(totalDue)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3.5 w-3.5" /> Collection rate
            </div>
            <div className="mt-1 text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {collectionPct}%
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel title="All transactions" description={`${filtered.length} records`} className="lg:col-span-2">
          <div className="mb-3 flex gap-2">
            {(['all', 'paid', 'partial', 'due'] as const).map((s) => (
              <Button
                key={s}
                size="sm"
                variant={filter === s ? 'default' : 'outline'}
                onClick={() => setFilter(s)}
                className="capitalize"
              >
                {s}
              </Button>
            ))}
          </div>
          <div className="rounded-md border border-border/60">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Due date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((f) => {
                  const s = students.find((x) => x.id === f.studentId)
                  return (
                    <TableRow key={f.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-xs">
                              {s ? initials(s.name) : '?'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="text-sm font-medium">{s?.name ?? '—'}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{f.description}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{f.dueDate}</TableCell>
                      <TableCell>{formatCurrency(f.amount)}</TableCell>
                      <TableCell>{formatCurrency(f.paid)}</TableCell>
                      <TableCell>
                        <Badge variant={f.status === 'paid' ? 'success' : f.status === 'partial' ? 'warning' : 'destructive'}>
                          {f.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {f.status !== 'paid' ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => dataStore.payFee(f.id, f.amount - f.paid)}
                          >
                            Mark paid
                          </Button>
                        ) : null}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </Panel>

        <Panel title="Status breakdown" description="By invoice status">
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={byStatus} dataKey="value" nameKey="name" innerRadius={50} outerRadius={88}>
                  {byStatus.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 8 }}
                />
                <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-center text-sm">
            <span className="text-muted-foreground">{overdue} invoices overdue</span>
          </div>
        </Panel>
      </div>
    </div>
  )
}
