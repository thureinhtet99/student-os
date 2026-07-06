import { useEffect, useState } from 'react'
import { dataStore } from '@/lib/store'
import { useAuth } from '@/lib/auth-context'
import { Panel } from '@/components/MetricCard'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Mail, Phone, User, Bell, Shield } from 'lucide-react'
import { initials } from '@/lib/utils'

export default function ParentSettingsPage() {
  const { user } = useAuth()
  const [, force] = useState(0)
  useEffect(() => dataStore.subscribe(() => force((n) => n + 1)), [])

  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [phone, setPhone] = useState('+1 (555) 010-3344')
  const [notifEmail, setNotifEmail] = useState(true)
  const [notifPush, setNotifPush] = useState(false)
  const [notifSms, setNotifSms] = useState(false)
  const [notifWeekly, setNotifWeekly] = useState(true)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account and preferences.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-gradient-to-br from-rose-500 to-pink-600 text-2xl text-white">
                  {initials(user?.name ?? '')}
                </AvatarFallback>
              </Avatar>
              <div className="mt-3 text-lg font-bold">{user?.name}</div>
              <div className="text-xs text-muted-foreground">{user?.email}</div>
              <Badge variant="secondary" className="mt-2 capitalize">{user?.role}</Badge>
            </div>
          </CardContent>
        </Card>

        <Panel title="Profile" description="Update your information" className="lg:col-span-2">
          <div className="space-y-3">
            <div>
              <Label className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> Full name</Label>
              <Input className="mt-1" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> Email</Label>
              <Input className="mt-1" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <Label className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> Phone</Label>
              <Input className="mt-1" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="flex justify-end">
              <Button className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:opacity-90">Save changes</Button>
            </div>
          </div>
        </Panel>
      </div>

      <Panel title="Notifications" description="Choose how you want to be updated">
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-md border border-border/60 p-3">
            <div className="flex items-center gap-3">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Email notifications</div>
                <div className="text-xs text-muted-foreground">Receive school updates via email</div>
              </div>
            </div>
            <input type="checkbox" checked={notifEmail} onChange={(e) => setNotifEmail(e.target.checked)} className="h-4 w-4" />
          </div>
          <div className="flex items-center justify-between rounded-md border border-border/60 p-3">
            <div className="flex items-center gap-3">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Push notifications</div>
                <div className="text-xs text-muted-foreground">Browser and mobile push</div>
              </div>
            </div>
            <input type="checkbox" checked={notifPush} onChange={(e) => setNotifPush(e.target.checked)} className="h-4 w-4" />
          </div>
          <div className="flex items-center justify-between rounded-md border border-border/60 p-3">
            <div className="flex items-center gap-3">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">SMS alerts</div>
                <div className="text-xs text-muted-foreground">Urgent messages via SMS</div>
              </div>
            </div>
            <input type="checkbox" checked={notifSms} onChange={(e) => setNotifSms(e.target.checked)} className="h-4 w-4" />
          </div>
          <div className="flex items-center justify-between rounded-md border border-border/60 p-3">
            <div className="flex items-center gap-3">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Weekly summary</div>
                <div className="text-xs text-muted-foreground">A digest of your child's week</div>
              </div>
            </div>
            <input type="checkbox" checked={notifWeekly} onChange={(e) => setNotifWeekly(e.target.checked)} className="h-4 w-4" />
          </div>
        </div>
      </Panel>

      <Panel title="Security" description="Account protection">
        <div className="space-y-3">
          <div className="flex items-center gap-3 rounded-md border border-border/60 p-3">
            <Shield className="h-4 w-4 text-emerald-500" />
            <div className="flex-1">
              <div className="text-sm font-medium">Role-based access</div>
              <div className="text-xs text-muted-foreground">Your access is limited to the parent role</div>
            </div>
            <Badge variant="success">Active</Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between rounded-md border border-border/60 p-3">
            <div>
              <div className="text-sm font-medium">Change password</div>
              <div className="text-xs text-muted-foreground">Update your account password</div>
            </div>
            <Button variant="outline" size="sm">Change</Button>
          </div>
          <div className="flex items-center justify-between rounded-md border border-border/60 p-3">
            <div>
              <div className="text-sm font-medium">Sign out everywhere</div>
              <div className="text-xs text-muted-foreground">Sign out of all devices</div>
            </div>
            <Button variant="outline" size="sm">Sign out</Button>
          </div>
        </div>
      </Panel>
    </div>
  )
}
