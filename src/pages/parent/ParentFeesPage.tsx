import { useEffect, useState, useMemo } from 'react'
import { dataStore } from '@/lib/store'
import { useAuth } from '@/lib/auth-context'
import { Panel } from '@/components/MetricCard'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts'
import { DollarSign, CheckCircle2, AlertCircle, Receipt, CreditCard } from 'lucide-react'
import { initials } from '@/lib/utils'

export default function ParentFeesPage() {
  const { user } = useAuth()
  const [, force] = useState(0)
  useEffect(() => dataStore.subscribe(() => force((n) => n + 1)), [])

  const myChildren = useMemo(
    () => dataStore.getStudents().filter((s) => s.parentId === user?.id),
    [user?.id],
  )
  const [selectedChildId, setSelectedChildId] = useState(myChildren[0]?.id)
  const child = myChildren.find((c) => c.id === selectedChildId) ?? myChildren[0]

  const fees = dataStore.getFeesForStudent(child.id)
  const totalBilled = fees.reduce((s, f) => s + f.amount, 0)
  const totalPaid = fees.reduce((s, f) => s + f.paid, 0)
  const outstanding = totalBilled - totalPaid
  const paidCount = fees.filter((f) => f.status === 'paid').length
  const partialCount = fees.filter((f) => f.status === 'partial').length
  const unpaidCount = fees.filter((f) => f.status === 'due').length

  const pieData = [
    { name: 'Paid', value: paidCount, color: '#10b981' },
    { name: 'Partial', value: partialCount, color: '#f59e0b' },
    { name: 'Unpaid', value: unpaidCount, color: '#ef4444' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Fees</h1>
        <p className="text-sm text-muted-foreground">Invoices, payment status, and history.</p>
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
              <div className="text-xs text-muted-foreground">Total billed</div>
              <Receipt className="h-4 w-4 text-indigo-500" />
            </div>
            <div className="mt-1 text-2xl font-bold">${totalBilled.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">Paid</div>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">${totalPaid.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">Outstanding</div>
              <AlertCircle className="h-4 w-4 text-rose-500" />
            </div>
            <div className="mt-1 text-2xl font-bold text-rose-600 dark:text-rose-400">${outstanding.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">Status</div>
              <DollarSign className="h-4 w-4 text-amber-500" />
            </div>
            <div className="mt-1 text-2xl font-bold">
              {outstanding === 0 ? (
                <span className="text-emerald-600 dark:text-emerald-400">Clear</span>
              ) : (
                <span className="text-amber-600 dark:text-amber-400">Due</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel title="Status breakdown" description="By invoice" className="lg:col-span-1">
          <div className="h-56">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={40}>
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 8 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 space-y-1.5 text-xs">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
                <span className="flex-1">{d.name}</span>
                <span className="font-mono font-semibold">{d.value}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Invoices" description="All fee records" className="lg:col-span-2">
          <div className="rounded-md border border-border/60">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fees.map((f) => (
                  <TableRow key={f.id}>
                    <TableCell className="font-medium">{f.description}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{f.dueDate}</TableCell>
                    <TableCell className="font-mono">${f.amount}</TableCell>
                    <TableCell className="font-mono text-emerald-600 dark:text-emerald-400">${f.paid}</TableCell>
                    <TableCell>
                      <Badge variant={f.status === 'paid' ? 'success' : f.status === 'partial' ? 'warning' : 'destructive'}>
                        {f.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {f.status !== 'paid' ? (
                        <Button size="sm" variant="outline" className="gap-1">
                          <CreditCard className="h-3.5 w-3.5" /> Pay
                        </Button>
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Panel>
      </div>
    </div>
  )
}
