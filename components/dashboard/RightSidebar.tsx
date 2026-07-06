'use client'

import Link from 'next/link'
import { Bell, Sparkles, Star, Trophy, Gift, CalendarDays } from 'lucide-react'
import { useDashboardLoader } from '@/lib/hooks/use-dashboard-loader'

const ROTATING_QUOTES = [
  'Small consistent steps lead to big change.',
  'You are capable of more than you know.',
  'Build your confidence by doing one thing today.',
]

export default function RightSidebar() {
  const { data, loading } = useDashboardLoader()
  const notifications = data?.notifications || []
  const upcomingEvent = data?.upcomingEvent
  const course = data?.course
  const quote = ROTATING_QUOTES[new Date().getDate() % ROTATING_QUOTES.length]

  return (
    <div className="space-y-4 sticky top-6">
      <div className="rounded-[20px] bg-white p-5 shadow-sm border border-slate-200">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Today's quote</p>
        <p className="mt-4 text-sm leading-6 text-slate-700">“{quote}”</p>
      </div>

      <div className="rounded-[20px] bg-white p-5 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">Community streak</p>
            <p className="mt-2 text-sm text-slate-600">3 days of engagement</p>
          </div>
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
            <Star className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="rounded-[20px] bg-white p-5 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">Notifications</p>
            <p className="mt-2 text-sm text-slate-600">{loading ? 'Checking for alerts…' : `${notifications.length} unread`}</p>
          </div>
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
            <Bell className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="rounded-[20px] bg-white p-5 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">New academy lesson</p>
            <p className="mt-2 text-sm text-slate-600">{course?.courses?.title ?? 'No lesson ready yet'}</p>
          </div>
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
            <Trophy className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="rounded-[20px] bg-white p-5 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">Upcoming event</p>
            <p className="mt-2 text-sm text-slate-600">{upcomingEvent?.title ?? 'Discover events near you'}</p>
          </div>
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
            <CalendarDays className="h-5 w-5" />
          </div>
        </div>
        {upcomingEvent ? (
          <Link href={`/events/${upcomingEvent.id}`} className="mt-4 inline-flex text-sm font-semibold text-violet-700 hover:underline">
            View event
          </Link>
        ) : null}
      </div>
    </div>
  )
}
