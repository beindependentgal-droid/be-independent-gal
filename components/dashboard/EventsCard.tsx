'use client'

import { useEffect, useState } from 'react'

export default function EventsCard() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/events?upcoming=1&limit=3')
        if (!res.ok) throw new Error('Failed to load events')
        const payload = await res.json()
        if (mounted) setEvents(Array.isArray(payload.events) ? payload.events.slice(0, 3) : [])
      } catch (e) { if (mounted) setEvents([]) } finally { if (mounted) setLoading(false) }
    })()
    return () => { mounted = false }
  }, [])

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm border">
      <p className="text-sm font-semibold">Upcoming events</p>
      <div className="mt-3 space-y-3">
        {loading && <p className="text-sm text-slate-500">Loading events…</p>}
        {!loading && events.length === 0 && <p className="text-sm text-slate-500">No upcoming events.</p>}
        {events.map((e) => {
          const eventDate = e.date || e.start_date
          const dateLabel = eventDate
            ? new Date(eventDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })
            : 'TBA'

          return (
            <div key={e.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{e.title}</p>
                <p className="text-sm text-slate-600">{dateLabel} · {e.location ?? 'Online'}</p>
              </div>
              <a href={`/events/${e.id}`} className="text-sm text-secondary">Join</a>
            </div>
          )
        })}
      </div>
    </div>
  )
}
