import { useState, useEffect } from 'react'
import { dataStore } from '@/lib/store'
import { useAuth } from '@/lib/auth-context'
import { Panel } from '@/components/MetricCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Search, Send } from 'lucide-react'
import { initials } from '@/lib/utils'

export default function ParentMessagesPage() {
  const { user } = useAuth()
  const [, force] = useState(0)
  useEffect(() => dataStore.subscribe(() => force((n) => n + 1)), [])

  const messages = dataStore.getMessages()
  const users = dataStore.getUsers()
  const [selected, setSelected] = useState(messages[0]?.id ?? '')
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [to, setTo] = useState(users.find((u) => u.role === 'teacher' || u.role === 'admin')?.id ?? '')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')

  const myMessages = messages.filter((m) => m.toId === user?.id || m.fromId === user?.id)
  const current = myMessages.find((m) => m.id === selected)
  const filtered = q
    ? myMessages.filter(
        (m) =>
          m.subject.toLowerCase().includes(q.toLowerCase()) ||
          m.body.toLowerCase().includes(q.toLowerCase()),
      )
    : myMessages

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
          <p className="text-sm text-muted-foreground">Contact teachers and school administration.</p>
        </div>
        <Button onClick={() => setOpen(true)} size="sm" className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:opacity-90">
          <Send className="h-4 w-4" /> New message
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel title="Inbox" description={`${myMessages.filter((m) => !m.read && m.toId === user?.id).length} unread`} className="lg:col-span-1">
          <div className="relative mb-3">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search..." value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div className="space-y-1">
            {filtered.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => { setSelected(m.id); dataStore.markMessageRead(m.id) }}
                className={
                  'flex w-full items-start gap-3 rounded-md border p-3 text-left transition-colors ' +
                  (selected === m.id ? 'border-indigo-500 bg-indigo-500/5' : 'border-border/60 hover:border-border')
                }
              >
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-gradient-to-br from-rose-500 to-pink-600 text-white text-xs">
                    {initials(m.fromId === user?.id ? m.toName : m.fromName)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-semibold">
                      {m.fromId === user?.id ? `To: ${m.toName}` : m.fromName}
                    </span>
                    {!m.read && m.toId === user?.id ? <Badge variant="info" className="text-[9px]">NEW</Badge> : null}
                  </div>
                  <div className="truncate text-xs font-medium">{m.subject}</div>
                  <div className="line-clamp-1 text-xs text-muted-foreground">{m.body}</div>
                </div>
              </button>
            ))}
          </div>
        </Panel>

        <Panel title={current?.subject ?? 'Select a message'} description={current ? new Date(current.timestamp).toLocaleString() : ''} className="lg:col-span-2">
          {current ? (
            <div className="space-y-4">
              <div className="whitespace-pre-wrap text-sm leading-relaxed">{current.body}</div>
            </div>
          ) : (
            <div className="py-12 text-center text-sm text-muted-foreground">Select a message to read.</div>
          )}
        </Panel>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-lg border border-border bg-card p-5 shadow-lg">
            <h3 className="mb-3 text-lg font-semibold">New message</h3>
            <div className="space-y-3">
              <div>
                <Label>To</Label>
                <select className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={to} onChange={(e) => setTo(e.target.value)}>
                  {users.filter((u) => u.id !== user?.id).map((u) => (
                    <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Subject</Label>
                <Input className="mt-1" value={subject} onChange={(e) => setSubject(e.target.value)} />
              </div>
              <div>
                <Label>Message</Label>
                <Textarea className="mt-1" rows={5} value={body} onChange={(e) => setBody(e.target.value)} />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button
                onClick={() => {
                  const toUser = users.find((u) => u.id === to)
                  if (!toUser || !subject || !body) return
                  dataStore.sendMessage({
                    id: `m-${Date.now()}`,
                    fromId: user?.id ?? 'unknown',
                    fromName: user?.name ?? 'Unknown',
                    toId: toUser.id,
                    toName: toUser.name,
                    subject,
                    body,
                    read: false,
                    timestamp: new Date().toISOString(),
                  })
                  setSubject(''); setBody(''); setOpen(false)
                }}
              >Send</Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
