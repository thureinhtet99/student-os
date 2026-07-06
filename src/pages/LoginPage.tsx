import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth-context'
import { dataStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { GraduationCap, Mail, Lock, ShieldCheck, Sparkles, Users, BookOpen } from 'lucide-react'

const demoRoles = [
  {
    role: 'admin',
    title: 'Administrator',
    email: 'admin@eschool.io',
    description: 'Full school management access',
    color: 'from-indigo-500 to-violet-600',
    icon: ShieldCheck,
  },
  {
    role: 'teacher',
    title: 'Teacher',
    email: 'sarah.wilson@eschool.io',
    description: 'Manage classes, grades, attendance',
    color: 'from-emerald-500 to-teal-600',
    icon: BookOpen,
  },
  {
    role: 'student',
    title: 'Student',
    email: 'emma.thompson@eschool.io',
    description: 'View grades, attendance, fees',
    color: 'from-amber-500 to-orange-600',
    icon: GraduationCap,
  },
  {
    role: 'parent',
    title: 'Parent',
    email: 'sarah.thompson@parent.io',
    description: 'Monitor your child\'s progress',
    color: 'from-rose-500 to-pink-600',
    icon: Users,
  },
] as const

export default function LoginPage() {
  const { user, signIn, signInDemo } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      const home = dataStore.getUsers().find((u) => u.id === user.id)?.role
      const route = home === 'admin' ? '/app/admin'
        : home === 'teacher' ? '/app/teacher'
          : home === 'parent' ? '/app/parent'
            : '/app/student'
      navigate(route, { replace: true })
    }
  }, [user, navigate])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await signIn(email, password)
    setLoading(false)
    if (!result) setError('Invalid email or password. Try a demo account below.')
  }

  const onDemo = (role: typeof demoRoles[number]['role']) => {
    signInDemo(role)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="hidden flex-col justify-between p-10 lg:flex">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <div className="text-lg font-bold">eSchool</div>
              <div className="text-xs text-muted-foreground">School Management SaaS</div>
            </div>
          </div>

          <div className="space-y-4">
            <Badge variant="info" className="gap-1">
              <Sparkles className="h-3 w-3" /> Modern · Real-time · Secure
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight">
              The complete <span className="bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent">school management</span> platform.
            </h1>
            <p className="text-base text-muted-foreground">
              Manage students, teachers, classes, attendance, grades, fees, and communication — all in one
              beautifully designed, fully responsive dashboard.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-4">
              <div className="rounded-lg border border-border/60 bg-card/60 p-3 backdrop-blur">
                <div className="text-2xl font-bold">1,200+</div>
                <div className="text-xs text-muted-foreground">Active schools</div>
              </div>
              <div className="rounded-lg border border-border/60 bg-card/60 p-3 backdrop-blur">
                <div className="text-2xl font-bold">98%</div>
                <div className="text-xs text-muted-foreground">Customer satisfaction</div>
              </div>
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            © 2026 eSchool · Privacy · Terms · Support
          </div>
        </div>

        <div className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center lg:hidden">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg">
                <GraduationCap className="h-7 w-7" />
              </div>
              <h2 className="text-2xl font-bold">eSchool</h2>
            </div>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold">Welcome back</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Sign in to your eSchool account
                </p>

                <form onSubmit={onSubmit} className="mt-5 space-y-3">
                  <div>
                    <Label className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> Email</Label>
                    <Input
                      className="mt-1"
                      type="email"
                      placeholder="you@eschool.io"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label className="flex items-center gap-1.5"><Lock className="h-3.5 w-3.5" /> Password</Label>
                    <Input
                      className="mt-1"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  {error ? (
                    <div className="rounded-md border border-rose-500/30 bg-rose-500/10 p-2 text-xs text-rose-600 dark:text-rose-400">
                      {error}
                    </div>
                  ) : null}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-indigo-500 to-violet-600 hover:opacity-90"
                  >
                    {loading ? 'Signing in...' : 'Sign in'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/60" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or try a demo</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                {demoRoles.map((d) => {
                  const Icon = d.icon
                  return (
                    <button
                      key={d.role}
                      type="button"
                      onClick={() => onDemo(d.role)}
                      className="group flex flex-col items-start gap-2 rounded-lg border border-border/60 bg-card p-3 text-left transition-colors hover:border-indigo-500/40"
                    >
                      <div className={`flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br ${d.color} text-white`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold">{d.title}</div>
                        <div className="line-clamp-1 text-[10px] text-muted-foreground">{d.description}</div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
