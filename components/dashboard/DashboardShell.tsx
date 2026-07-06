'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Users, BookOpen, Users as Users2, Briefcase, Calendar, Sparkles, Plus } from 'lucide-react'
import WelcomeCard from './WelcomeCard'
import ContinueLearning from './ContinueLearning'
import CommunityActivity from './CommunityActivity'
import SisterCircles from './SisterCircles'
import Opportunities from './Opportunities'
import EventsCard from './EventsCard'
import SuggestedConnections from './SuggestedConnections'
import MotivationCard from './MotivationCard'
import DashboardActions from './DashboardActions'

const RightSidebar = dynamic(() => import('./RightSidebar'), {
  loading: () => (
    <div className="rounded-[20px] bg-white p-5 shadow-sm border border-slate-200 animate-pulse h-full min-h-[520px]" />
  ),
})

export default function DashboardShell() {
  const pathname = usePathname() || '/dashboard'

  const nav = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/community', label: 'Community', icon: Users },
    { href: '/academy', label: 'Academy', icon: BookOpen },
    { href: '/circles', label: 'Sister Circles', icon: Users2 },
    { href: '/opportunities', label: 'Opportunities', icon: Briefcase },
    { href: '/events', label: 'Events', icon: Calendar },
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)_360px]">
          <aside className="hidden lg:block">
            <div className="sticky top-6 space-y-6">
              <div className="rounded-[20px] bg-white p-5 shadow-soft border border-slate-200">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Navigation</p>
                <div className="mt-4 space-y-2">
                  {nav.map((item) => {
                    const ItemIcon = item.icon as any
                    const active = pathname === item.href
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`group flex items-center gap-3 rounded-2xl px-4 py-3 transition ${
                          active ? 'bg-violet-50 text-violet-700 shadow-sm' : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${active ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-500'}`}>
                          <ItemIcon className="h-5 w-5" />
                        </span>
                        <span className="text-sm font-medium">{item.label}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
          </aside>

          <main className="space-y-6">
            <div className="space-y-6">
              <WelcomeCard />
              <DashboardActions />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <ContinueLearning />
              <CommunityActivity />
              <SisterCircles />
              <Opportunities />
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <EventsCard />
              <SuggestedConnections />
              <MotivationCard />
            </div>
          </main>

          <aside className="hidden lg:block">
            <RightSidebar />
          </aside>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 block lg:hidden border-t border-slate-200 bg-white/95 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link href="/community" className="inline-flex flex-col items-center gap-1 text-xs text-slate-700 hover:text-violet-700">
            <Users className="h-5 w-5" />
            Community
          </Link>
          <Link href="/academy" className="inline-flex flex-col items-center gap-1 text-xs text-slate-700 hover:text-violet-700">
            <BookOpen className="h-5 w-5" />
            Academy
          </Link>
          <Link href="/circles" className="inline-flex flex-col items-center gap-1 text-xs text-slate-700 hover:text-violet-700">
            <Users2 className="h-5 w-5" />
            Circles
          </Link>
          <Link href="/auth/profile" className="inline-flex flex-col items-center gap-1 text-xs text-slate-700 hover:text-violet-700">
            <Calendar className="h-5 w-5" />
            Profile
          </Link>
        </div>
      </div>

      <Link
        href="/community"
        className="fixed bottom-20 right-4 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-violet-600 text-white shadow-xl shadow-violet-200 transition hover:scale-105"
        aria-label="Create post"
      >
        <Plus className="h-6 w-6" />
      </Link>
    </div>
  )
}
