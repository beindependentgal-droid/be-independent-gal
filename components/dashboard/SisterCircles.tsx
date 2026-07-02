'use client'

import { useEffect, useState } from 'react'

export default function SisterCircles() {
  const [circles, setCircles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/circles')
        if (!res.ok) throw new Error('Failed to load circles')
        const payload = await res.json()
        if (mounted) setCircles(Array.isArray(payload.circles) ? payload.circles.slice(0, 5) : [])
      } catch (e) { if (mounted) setCircles([]) } finally { if (mounted) setLoading(false) }
    })()
    return () => { mounted = false }
  }, [])

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm border">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Sister circles</p>
        <a href="/circles" className="text-sm text-slate-600">Discover</a>
      </div>
      <div className="mt-3 space-y-3">
        {loading && <p className="text-sm text-slate-500">Loading circles…</p>}
        {!loading && circles.length === 0 && (
          <p className="text-sm text-slate-500">You are not in any circles yet. <a href="/circles" className="text-secondary">Discover circles</a></p>
        )}
        {circles.map((c) => (
          <div key={c.id} className="flex items-center justify-between">
            <div>
              <p className="font-medium">{c.name}</p>
              <p className="text-sm text-slate-600">Next: {c.next_meeting ?? 'No upcoming meetings'}</p>
            </div>
            <a href={`/circles/${c.id}/dashboard`} className="text-sm text-secondary">Open</a>
          </div>
        ))}
      </div>
    </div>
  )
}
