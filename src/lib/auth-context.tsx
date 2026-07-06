import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { auth, type AuthUser } from '@/lib/store'
import type { Role } from '@/lib/types'

type AuthContextValue = {
  user: AuthUser | null
  loading: boolean
  signInDemo: (role: Role) => void
  signIn: (email: string, password: string) => Promise<AuthUser | null>
  signOut: () => Promise<void>
  hasRole: (...roles: Role[]) => boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(auth.current())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = auth.subscribe((u) => {
      setUser(u)
      setLoading(false)
    })
    return () => {
      unsub()
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      signInDemo: (role) => {
        auth.signInDemo(role)
      },
      signIn: async (email, password) => {
        // Try real Firebase first, fall back to mock
        const real = await auth.signInFirebase(email, password)
        if (real) return real
        return auth.signInMock(email, password)
      },
      signOut: () => auth.signOut(),
      hasRole: (...roles) => Boolean(user && roles.includes(user.role)),
    }),
    [user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
