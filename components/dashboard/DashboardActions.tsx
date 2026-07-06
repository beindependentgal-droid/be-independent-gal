'use client'

import Link from 'next/link'
import { Plus, BookOpen, Users, Briefcase, Calendar, Sparkles } from 'lucide-react'

const actions = [
  { href: '/community', label: 'Create Post', icon: Plus },
  { href: '/academy', label: 'Continue Learning', icon: BookOpen },
  { href: '/circles', label: 'Join Circle', icon: Users },
  { href: '/opportunities', label: 'Opportunities', icon: Briefcase },
  { href: '/events', label: 'Upcoming Events', icon: Calendar },
  { href: '/mentorship', label: 'Find Mentor', icon: Sparkles },
]

export default function DashboardActions() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {actions.map((action) => {
        const Icon = action.icon as any
        return (
          <Link
            key={action.href}
            href={action.href}
            className="group flex items-center gap-3 rounded-[20px] border border-slate-200 bg-white p-4 text-sm font-medium text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-violet-50"
          >
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 transition group-hover:bg-violet-200">
              <Icon className="h-5 w-5" />
            </span>
            <span>{action.label}</span>
          </Link>
        )
      })}
    </div>
  )
}
