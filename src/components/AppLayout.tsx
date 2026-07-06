import { useState, useEffect } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  LogOut,
  Moon,
  Sun,
  Search,
  Menu,
  X,
  Bell,
  GraduationCap,
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useTheme } from '@/lib/theme'
import { navByRole, roleLabels, roleHomes } from '@/lib/nav'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn, initials } from '@/lib/utils'
import { dataStore } from '@/lib/store'

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { user } = useAuth()
  if (!user) return null
  const groups = navByRole[user.role]
  return (
    <aside className="flex h-full w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/20">
          <GraduationCap className="h-5 w-5" />
        </div>
        <div>
          <div className="text-sm font-bold leading-none text-white">eSchool</div>
          <div className="mt-0.5 text-[11px] text-sidebar-foreground/60">SaaS Management</div>
        </div>
      </div>
      <Separator className="bg-sidebar-border" />
      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4 scrollbar-thin">
        {groups.map((group) => (
          <div key={group.title}>
            <div className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/50">
              {group.title}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === roleHomes[user.role]}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cn(
                      'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-sidebar-accent text-white'
                        : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-white',
                    )
                  }
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {item.badge ? (
                    <Badge variant="secondary" className="ml-auto h-5 px-1.5 text-[10px]">
                      {item.badge}
                    </Badge>
                  ) : null}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
      <Separator className="bg-sidebar-border" />
      <div className="p-3">
        <div className="rounded-md bg-sidebar-accent/60 p-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                {initials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-white">{user.name}</div>
              <div className="truncate text-[11px] text-sidebar-foreground/60">{roleLabels[user.role]}</div>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-white"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </aside>
  )
}

function Topbar({ onMenu }: { onMenu: () => void }) {
  const { user, signOut } = useAuth()
  const { theme, toggle } = useTheme()
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [results, setResults] = useState<{ id: string; name: string; to: string }[]>([])

  useEffect(() => {
    if (!q.trim()) {
      setResults([])
      return
    }
    const term = q.toLowerCase()
    const found = [
      ...dataStore.getStudents().map((s) => ({ id: s.id, name: `${s.name} · ${s.className}`, to: '/app/admin/students' })),
      ...dataStore.getTeachers().map((t) => ({ id: t.id, name: `${t.name} · ${t.subject}`, to: '/app/admin/teachers' })),
    ]
      .filter((x) => x.name.toLowerCase().includes(term))
      .slice(0, 6)
    setResults(found)
  }, [q])

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/60 bg-background/80 px-4 backdrop-blur md:px-6">
      <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenu} aria-label="Open menu">
        <Menu className="h-5 w-5" />
      </Button>
      <div className="hidden md:block">
        <div className="text-xs text-muted-foreground">Academic Year 2026</div>
        <div className="text-sm font-semibold">Welcome back, {user?.name?.split(' ')[0]}</div>
      </div>
      <div className="ml-auto flex max-w-md flex-1 items-center gap-2 sm:ml-6">
        <div className="relative w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search students, teachers, classes..."
            className="h-9 w-full pl-9"
          />
          {results.length > 0 ? (
            <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-72 overflow-auto rounded-md border border-border bg-popover p-1 shadow-lg">
              {results.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  className="block w-full rounded-sm px-3 py-2 text-left text-sm hover:bg-accent"
                  onClick={() => {
                    navigate(r.to)
                    setQ('')
                    setResults([])
                  }}
                >
                  {r.name}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
      <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
        {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-9 gap-2 px-2">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-xs">
                {user ? initials(user.name) : ''}
              </AvatarFallback>
            </Avatar>
            <div className="hidden text-left text-xs sm:block">
              <div className="font-semibold leading-tight">{user?.name}</div>
              <div className="leading-tight text-muted-foreground">{user && roleLabels[user.role]}</div>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>My account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate('/app/account')}>
            <LayoutDashboard className="h-4 w-4" /> Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/app/admin/settings')}>
            <Sun className="h-4 w-4" /> Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={async () => {
              await signOut()
              navigate('/login')
            }}
            className="text-rose-600 focus:text-rose-600"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}

export default function AppLayout() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="text-sm text-muted-foreground">Loading...</div>
      </div>
    )
  }
  if (!user) {
    navigate('/login', { replace: true })
    return null
  }

  return (
    <div className="flex min-h-screen bg-muted/20">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      {open ? (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="h-full">
            <Sidebar onNavigate={() => setOpen(false)} />
          </div>
          <button
            aria-label="Close menu"
            className="flex-1 bg-black/50"
            onClick={() => setOpen(false)}
          >
            <X className="m-4 h-5 w-5 text-white" />
          </button>
        </div>
      ) : null}
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenu={() => setOpen(true)} />
        <main className="min-w-0 flex-1 p-4 md:p-6">
          <div className="mx-auto w-full max-w-7xl animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
