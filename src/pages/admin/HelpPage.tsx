import { Panel } from '@/components/MetricCard'
import { Card, CardContent } from '@/components/ui/card'
import { LifeBuoy, MessageCircle, BookOpen, Mail } from 'lucide-react'

const topics = [
  { icon: BookOpen, title: 'Getting started', description: 'Walk through the dashboard and key workflows.' },
  { icon: MessageCircle, title: 'Messaging', description: 'Communicate with parents, students, and staff.' },
  { icon: Mail, title: 'Email & notifications', description: 'Manage system and user-level notifications.' },
  { icon: LifeBuoy, title: 'Contact support', description: 'Reach our support team 24/7 for help.' },
]

export default function HelpPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Help center</h1>
        <p className="text-sm text-muted-foreground">Guides, FAQs, and ways to reach support.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {topics.map((t) => (
          <Card key={t.title} className="cursor-pointer transition-colors hover:border-indigo-500">
            <CardContent className="p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-indigo-500/10 text-indigo-600">
                <t.icon className="h-4 w-4" />
              </div>
              <div className="mt-3 text-sm font-semibold">{t.title}</div>
              <p className="mt-1 text-xs text-muted-foreground">{t.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Panel title="Frequently asked" description="Common questions about eSchool SaaS">
        <div className="space-y-3 text-sm">
          {[
            { q: 'How do I add a new student?', a: 'Open Students → Add student, fill the form, and save.' },
            { q: 'Can I export attendance?', a: 'Yes — from the Attendance page, use Export to download CSV.' },
            { q: 'How do I configure Firebase?', a: 'Set VITE_USE_FIREBASE=true in .env with your Firebase credentials.' },
            { q: 'Is the system mobile-friendly?', a: 'Yes — it is fully responsive across phones, tablets, and desktop.' },
          ].map((f, i) => (
            <details key={i} className="rounded-md border border-border/60 p-3">
              <summary className="cursor-pointer font-medium">{f.q}</summary>
              <p className="mt-2 text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </Panel>
    </div>
  )
}
