"use client"

import { useEffect, useState } from 'react'
import OpportunityCard from './opportunity-card'

export default function OpportunitiesList({ initialFilters = {} }: { initialFilters?: Record<string, any> }) {
  const [filters, setFilters] = useState(initialFilters)
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)

  useEffect(() => {
    const abort = new AbortController()
    const load = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams({ page: String(page) })
        Object.entries(filters).forEach(([k, v]) => {
          if (v && v !== 'Any') params.set(k, String(v))
        })
        const res = await fetch(`/api/opportunities?${params.toString()}`, { signal: abort.signal })
        if (!res.ok) throw new Error('Failed to fetch')
        const payload = await res.json()
        setItems(payload.opportunities || [])
      } catch (e) {
        if ((e as any).name !== 'AbortError') console.error(e)
      } finally {
        setLoading(false)
      }
    }

    void load()
    return () => abort.abort()
  }, [filters, page])

  return (
    <div>
      <div className="space-y-4">
        {loading ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">Loading…</div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">No opportunities found.</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
            {items.map((it) => (
              <OpportunityCard key={it.id} item={it} />
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-slate-600">Page {page}</div>
        <div className="flex gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm">Prev</button>
          <button onClick={() => setPage((p) => p + 1)} className="rounded-md bg-pink-600 px-3 py-2 text-sm font-semibold text-white">Next</button>
        </div>
      </div>
    </div>
  )
}
