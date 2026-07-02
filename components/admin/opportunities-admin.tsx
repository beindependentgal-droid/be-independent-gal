"use client"

import { useEffect, useState } from 'react'
import { getAccessToken } from '@/lib/auth-utils'

type Op = { id: string; title: string; organization: string }

export default function OpportunitiesAdmin() {
  const [items, setItems] = useState<Op[]>([])
  const [loading, setLoading] = useState(false)

  const fetchItems = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/opportunities')
      if (!res.ok) throw new Error('Failed')
      const payload = await res.json()
      setItems(payload.opportunities || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const remove = async (id: string) => {
    try {
      const token = await getAccessToken()
      const res = await fetch(`/api/opportunities/${id}`, { method: 'DELETE', headers: token ? { Authorization: `Bearer ${token}` } : {} })
      if (!res.ok) throw new Error('Delete failed')
      setItems((s) => s.filter((i) => i.id !== id))
    } catch (e) {
      console.error(e)
    }
  }

  const createSample = async () => {
    try {
      const token = await getAccessToken()
      const body = { title: `New Opportunity ${Date.now()}`, organization: 'Admin', description: 'Created from admin UI' }
      const res = await fetch('/api/opportunities', { method: 'POST', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify(body) })
      if (!res.ok) throw new Error('Create failed')
      const data = await res.json()
      setItems((s) => [data, ...s])
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    void fetchItems()
  }, [])

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Opportunities (Admin)</h3>
        <div className="flex gap-2">
          <button onClick={createSample} className="rounded-md bg-pink-600 px-3 py-2 text-sm font-semibold text-white">Create</button>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {items.map((it) => (
          <div key={it.id} className="flex items-center justify-between rounded-md border border-slate-100 bg-slate-50 p-3">
            <div>
              <div className="font-semibold text-slate-900">{it.title}</div>
              <div className="text-sm text-slate-600">{it.organization}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={async () => {
                const next = window.prompt('Edit title', it.title)
                if (!next) return
                try {
                  const token = await getAccessToken()
                  const res = await fetch(`/api/opportunities/${it.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify({ title: next }) })
                  if (!res.ok) throw new Error('Update failed')
                  const updated = await res.json()
                  setItems((s) => s.map((x) => x.id === updated.id ? updated : x))
                } catch (e) {
                  console.error(e)
                }
              }} className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm">Edit</button>
              <button onClick={() => remove(it.id)} className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
