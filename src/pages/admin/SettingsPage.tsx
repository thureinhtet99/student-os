import { Panel } from '@/components/MetricCard'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTheme } from '@/lib/theme'
import { Sun, Moon, Bell, Shield, User, Mail, RotateCcw } from 'lucide-react'
import { dataStore } from '@/lib/store'
import { Badge } from '@/components/ui/badge'

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const teachers = dataStore.getTeachers()
  const students = dataStore.getStudents()
  const classes = dataStore.getClasses()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage school preferences, security, and integrations.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel title="Profile" description="School administrator profile">
          <div className="space-y-3">
            <div>
              <Label>Full name</Label>
              <Input defaultValue="Amelia Khan" />
            </div>
            <div>
              <Label>Email</Label>
              <Input defaultValue="amelia@eschool.app" />
            </div>
            <div>
              <Label>Phone</Label>
              <Input defaultValue="+1 555-1000" />
            </div>
            <Button>Save profile</Button>
          </div>
        </Panel>

        <Panel title="Appearance" description="Customize the look and feel">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                onClick={() => setTheme('light')}
                className="w-full"
              >
                <Sun className="h-4 w-4" /> Light
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                onClick={() => setTheme('dark')}
                className="w-full"
              >
                <Moon className="h-4 w-4" /> Dark
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              The dashboard adapts automatically to your preference. Both themes are fully accessible.
            </p>
          </div>
        </Panel>

        <Panel title="Notifications" description="Email and push preferences">
          <div className="space-y-3 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-input" />
              <Mail className="h-4 w-4" /> Email digest
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-input" />
              <Bell className="h-4 w-4" /> Push notifications
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="h-4 w-4 rounded border-input" />
              <User className="h-4 w-4" /> Parent reply alerts
            </label>
            <Button variant="outline">Save preferences</Button>
          </div>
        </Panel>
      </div>

      <Panel title="Security" description="Access control and audit log">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600">
                <Shield className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-semibold">Role-based access</div>
                <div className="text-xs text-muted-foreground">4 roles, 8 permissions</div>
              </div>
              <Badge variant="success" className="ml-auto">Active</Badge>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-indigo-500/10 text-indigo-600">
                <User className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-semibold">Two-factor auth</div>
                <div className="text-xs text-muted-foreground">Available for all admins</div>
              </div>
              <Button variant="outline" size="sm" className="ml-auto">Enable</Button>
            </CardContent>
          </Card>
        </div>
      </Panel>

      <Panel title="Data" description="Reset and export options">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button variant="outline" onClick={() => dataStore.resetMockData()}>
            <RotateCcw className="h-4 w-4" /> Reset mock data
          </Button>
          <p className="text-xs text-muted-foreground sm:ml-2">
            Restores seed data for {students.length} students, {teachers.length} teachers, {classes.length} classes.
          </p>
        </div>
      </Panel>
    </div>
  )
}
