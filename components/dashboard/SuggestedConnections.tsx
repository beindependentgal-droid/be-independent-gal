'use client'

import { useEffect, useState } from 'react'

export default function SuggestedConnections() {
  const [people, setPeople] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/profiles/suggested')
        if (!res.ok) throw new Error('Failed to load suggestions')
        const payload = await res.json()
        if (mounted) setPeople(Array.isArray(payload.members) ? payload.members.slice(0, 4) : [])
      } catch (e) { if (mounted) setPeople([]) } finally { if (mounted) setLoading(false) }
    })()
    return () => { mounted = false }
  }, [])

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm border">
      <p className="text-sm font-semibold">Suggested connections</p>
      <div className="mt-3 space-y-3">
        {loading && <p className="text-sm text-slate-500">Finding matches…</p>}
        {!loading && people.length === 0 && <p className="text-sm text-slate-500">No suggestions right now.</p>}
        {people.map((p) => (
          <div key={p.id} className="flex items-center justify-between">
            <div>
              <p className="font-medium">{p.first_name} {p.last_name}</p>
              <p className="text-sm text-slate-600">{p.headline ?? p.profession ?? p.role ?? p.bio ?? 'Member'}</p>
            </div>
            <button className="text-secondary text-sm">Follow</button>
          </div>
        ))}
      </div>
    </div>
  )
}
