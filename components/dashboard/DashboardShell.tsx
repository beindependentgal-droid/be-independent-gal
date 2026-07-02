'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Users, BookOpen, Users as Users2, Briefcase, Calendar, MessageCircle, Bell, User, Settings } from 'lucide-react'
import WelcomeCard from './WelcomeCard'
import ContinueLearning from './ContinueLearning'
import CommunityActivity from './CommunityActivity'
import SisterCircles from './SisterCircles'
import Opportunities from './Opportunities'
import EventsCard from './EventsCard'
import SuggestedConnections from './SuggestedConnections'
import MotivationCard from './MotivationCard'
import RightSidebar from './RightSidebar'
import DashboardActions from './DashboardActions'

export default function DashboardShell() {
  const pathname = usePathname() || '/dashboard'

  const nav = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/community', label: 'Community', icon: Users },
    { href: '/academy', label: 'Academy', icon: BookOpen },
    { href: '/circles', label: 'Sister Circles', icon: Users2 },
    { href: '/opportunities', label: 'Opportunities', icon: Briefcase },
    { href: '/events', label: 'Events', icon: Calendar },
    { href: '/messages', label: 'Messages', icon: MessageCircle },
    { href: '/notifications', label: 'Notifications', icon: Bell },
    { href: '/auth/profile', label: 'Profile', icon: User },
    { href: '/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-12 gap-6">
          {/* Left nav */}
          <aside className="col-span-3 hidden lg:block sticky top-6 h-[calc(100vh-48px)]">
            <nav className="rounded-xl border bg-white p-4 shadow-sm sticky top-6">
              <ul className="space-y-1">
                {nav.map((n) => {
                  const ActiveIcon = n.icon as any
                  const active = pathname === n.href
                  return (
                    <li key={n.href}>
                      <Link href={n.href} className={`flex items-center gap-3 p-3 rounded-lg ${active ? 'bg-secondary/10 text-secondary' : 'text-slate-700 hover:bg-slate-100'}`}>
                        <ActiveIcon className="h-5 w-5" />
                        <span className="text-sm font-medium">{n.label}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </aside>

          {/* Main */}
          <main className="col-span-12 lg:col-span-6">
            <div className="space-y-6">
              <WelcomeCard />
              <DashboardActions />

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
            </div>
          </main>

          {/* Right */}
          <aside className="col-span-12 lg:col-span-3">
            <RightSidebar />
          </aside>
        </div>
      </div>
    </div>
  )
}
