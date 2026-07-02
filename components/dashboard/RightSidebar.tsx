'use client'

import Link from 'next/link'
import { EventSkeleton, NotificationsSkeleton } from '@/components/ui/skeleton-loaders'
import { useDashboardLoader } from '@/lib/hooks/use-dashboard-loader'

export default function RightSidebar() {
  const { data, loading } = useDashboardLoader()
  const notifications = data?.notifications || []
  const upcomingEvent = data?.upcomingEvent

  return (
    <div className="space-y-4 sticky top-6">
      {/* Next Event */}
      <div className="rounded-xl bg-white p-4 shadow-sm border">
        <p className="text-sm font-semibold">Next event</p>
        {loading ? (
          <EventSkeleton />
        ) : upcomingEvent ? (
          <div className="mt-2">
            <p className="font-medium">{upcomingEvent.title}</p>
            <p className="text-sm text-slate-600">{new Date(upcomingEvent.date).toLocaleDateString()}</p>
            <Link href={`/events/${upcomingEvent.id}`} className="text-sm text-secondary hover:underline">
              View event
            </Link>
          </div>
        ) : (
          <p className="mt-2 text-sm text-slate-500">No upcoming events.</p>
        )}
      </div>

      {/* Notifications */}
      <div className="rounded-xl bg-white p-4 shadow-sm border">
        <p className="text-sm font-semibold">Unread notifications</p>
        {loading ? (
          <NotificationsSkeleton />
        ) : notifications.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">No unread notifications.</p>
        ) : (
          <div className="mt-2 space-y-2">
            {notifications.map((n: any) => (
              <div key={n.id} className="text-sm text-slate-700 pb-2 border-b border-slate-100 last:border-b-0">
                <p className="font-medium">{n.title || n.type || 'Notification'}</p>
                {n.message ? <p className="text-slate-600 text-xs mt-1">{n.message}</p> : null}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Saved Opportunities */}
      <div className="rounded-xl bg-white p-4 shadow-sm border">
        <p className="text-sm font-semibold">Saved opportunities</p>
        <p className="mt-2 text-sm text-slate-500">View your saved items from the Opportunities page.</p>
      </div>
    </div>
  )
}
