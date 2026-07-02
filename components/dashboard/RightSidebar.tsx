'use client'

import { useEffect, useState } from 'react'

export default function RightSidebar() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [upcoming, setUpcoming] = useState<any | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const nres = await fetch('/api/notifications?limit=3')
        const notificationPayload = nres.ok ? await nres.json() : { notifications: [] }
        if (mounted) setNotifications(Array.isArray(notificationPayload.notifications) ? notificationPayload.notifications : [])

        const eres = await fetch('/api/events?upcoming=1&limit=1')
        const eventPayload = eres.ok ? await eres.json() : { events: [] }
        const ev = Array.isArray(eventPayload.events) ? eventPayload.events[0] : null
        if (mounted) setUpcoming(ev)
      } catch (e) {
        if (mounted) { setNotifications([]); setUpcoming(null) }
      }
    })()
    return () => { mounted = false }
  }, [])

  return (
    <div className="space-y-4 sticky top-6">
      <div className="rounded-xl bg-white p-4 shadow-sm border">
        <p className="text-sm font-semibold">Next event</p>
        {upcoming ? (
          <div className="mt-2">
            <p className="font-medium">{upcoming.title}</p>
            <p className="text-sm text-slate-600">{upcoming.date}</p>
            <a href={`/events/${upcoming.id}`} className="text-sm text-secondary">Join</a>
          </div>
        ) : (
          <p className="mt-2 text-sm text-slate-500">No upcoming events.</p>
        )}
      </div>

      <div className="rounded-xl bg-white p-4 shadow-sm border">
        <p className="text-sm font-semibold">Unread notifications</p>
        <div className="mt-2 space-y-2">
          {notifications.length === 0 ? (
            <p className="text-sm text-slate-500">No unread notifications.</p>
          ) : (
            notifications.map((n) => (
              <div key={n.id} className="text-sm text-slate-700">
                <p className="font-medium">{n.title || n.type || 'Notification'}</p>
                {n.message ? <p>{n.message}</p> : null}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="rounded-xl bg-white p-4 shadow-sm border">
        <p className="text-sm font-semibold">Saved opportunities</p>
        <p className="mt-2 text-sm text-slate-500">{/* placeholder */}No saved items.</p>
      </div>
    </div>
  )
}
