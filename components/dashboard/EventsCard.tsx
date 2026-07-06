'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CalendarDays, MapPin, Clock, Sparkles } from 'lucide-react'

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
    <section className="rounded-[20px] bg-white p-5 shadow-sm border border-slate-200">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold">Upcoming events</p>
          <p className="mt-2 text-sm text-slate-500">See the next three events in your area.</p>
        </div>
        <Link href="/events" className="text-sm font-semibold text-violet-600 hover:text-violet-700">
          Discover
        </Link>
      </div>

      <div className="mt-5 space-y-4">
        {loading && <p className="text-sm text-slate-500">Loading events…</p>}
        {!loading && events.length === 0 && (
          <div className="rounded-[20px] bg-violet-50 p-5 text-sm text-slate-700">
            No events lined up yet. <Link href="/events" className="font-semibold text-violet-700 hover:underline">Discover events</Link>.
          </div>
        )}

        {events.map((e) => {
          const eventDate = e.date || e.start_date
          const date = eventDate ? new Date(eventDate) : null
          const dateLabel = date ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'TBA'
          const timeLabel = date ? date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : 'Any time'

          return (
            <div key={e.id} className="rounded-[20px] border border-slate-100 bg-slate-50 p-4 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-violet-100 text-violet-700">
                  <CalendarDays className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-950">{e.title}</p>
                  <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-600">
                    <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" /> {timeLabel}</span>
                    <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" /> {e.location ?? 'Online'}</span>
                  </div>
                </div>
                <Link href={`/events/${e.id}`} className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-violet-700">
                  <Sparkles className="h-4 w-4" /> Join
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
