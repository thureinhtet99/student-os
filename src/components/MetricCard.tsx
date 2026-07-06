import type { LucideIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type Tone = 'blue' | 'green' | 'amber' | 'rose' | 'violet' | 'teal'

const toneClasses: Record<Tone, { ring: string; chip: string }> = {
  blue: { ring: 'from-blue-500/15', chip: 'bg-blue-500/10 text-blue-600 dark:text-blue-300' },
  green: { ring: 'from-emerald-500/15', chip: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300' },
  amber: { ring: 'from-amber-500/15', chip: 'bg-amber-500/10 text-amber-600 dark:text-amber-300' },
  rose: { ring: 'from-rose-500/15', chip: 'bg-rose-500/10 text-rose-600 dark:text-rose-300' },
  violet: { ring: 'from-violet-500/15', chip: 'bg-violet-500/10 text-violet-600 dark:text-violet-300' },
  teal: { ring: 'from-teal-500/15', chip: 'bg-teal-500/10 text-teal-600 dark:text-teal-300' },
}

export function MetricCard({
  label,
  value,
  change,
  icon: Icon,
  tone = 'blue',
}: {
  label: string
  value: string
  change?: string | number
  icon: LucideIcon
  tone?: Tone
}) {
  const t = toneClasses[tone]
  return (
    <Card className="relative overflow-hidden border-border/60">
      <div className={cn('pointer-events-none absolute inset-0 bg-gradient-to-br to-transparent', t.ring)} />
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">{label}</span>
          <span className={cn('flex h-9 w-9 items-center justify-center rounded-md', t.chip)}>
            <Icon className="h-4.5 w-4.5" />
          </span>
        </div>
        <div className="mt-3 text-2xl font-bold tracking-tight">{value}</div>
        {change ? <p className="mt-1 text-xs text-muted-foreground">{change}</p> : null}
      </CardContent>
    </Card>
  )
}

export function Panel({
  title,
  description,
  action,
  children,
  className,
}: {
  title: string
  description?: string
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <Card className={cn('border-border/60', className)}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
          {description ? <CardDescription className="mt-1">{description}</CardDescription> : null}
        </div>
        {action}
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  )
}
