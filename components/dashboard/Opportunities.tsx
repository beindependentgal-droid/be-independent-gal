'use client'

import { useEffect, useState } from 'react'

export default function Opportunities() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/opportunities?featured=true')
        if (!res.ok) throw new Error('Failed to load opportunities')
        const payload = await res.json()
        if (mounted) setItems(Array.isArray(payload.opportunities) ? payload.opportunities.slice(0, 4) : [])
      } catch (e) { if (mounted) setItems([]) } finally { if (mounted) setLoading(false) }
    })()
    return () => { mounted = false }
  }, [])

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm border">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Opportunities for you</p>
        <a href="/opportunities" className="text-sm text-slate-600">View all</a>
      </div>
      <div className="mt-3 space-y-3">
        {loading && <p className="text-sm text-slate-500">Loading opportunities…</p>}
        {!loading && items.length === 0 && <p className="text-sm text-slate-500">No opportunities right now. Check back soon.</p>}
        {items.map((o) => (
          <div key={o.id} className="flex items-center justify-between">
            <div>
              <p className="font-medium">{o.title}</p>
              <p className="text-sm text-slate-600">{o.type ?? o.category}</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="text-sm text-slate-600">Save</button>
              <a href={`/opportunities/${o.id}`} className="text-sm text-secondary">View</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
