'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Bookmark, Briefcase, MapPin, Sparkles } from 'lucide-react'

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
    <section className="rounded-[20px] bg-white p-5 shadow-sm border border-slate-200">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold">Recommended opportunities</p>
          <p className="mt-2 text-sm text-slate-500">Relevant roles and fellowships tailored to your goals.</p>
        </div>
        <Link href="/opportunities" className="text-sm font-semibold text-violet-600 hover:text-violet-700">
          Browse all
        </Link>
      </div>

      <div className="mt-5 space-y-4">
        {loading && <p className="text-sm text-slate-500">Loading opportunities…</p>}
        {!loading && items.length === 0 && (
          <div className="rounded-[20px] bg-violet-50 p-5 text-sm text-slate-700">
            No opportunities matching your interests yet. <Link href="/opportunities" className="font-semibold text-violet-700 hover:underline">Browse opportunities</Link>.
          </div>
        )}

        {items.map((o) => (
          <div key={o.id} className="rounded-[20px] border border-slate-100 bg-slate-50 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-950">{o.title}</p>
                <div className="flex flex-wrap gap-2 text-xs text-slate-600">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 shadow-sm"><Briefcase className="h-3.5 w-3.5" /> {o.category ?? 'Opportunity'}</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 shadow-sm"><MapPin className="h-3.5 w-3.5" /> {o.location ?? 'Remote'}</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
                  <Bookmark className="h-4 w-4" /> Save
                </button>
                <Link href={`/opportunities/${o.id}`} className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-violet-700">
                  <Sparkles className="h-4 w-4" /> Apply
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
