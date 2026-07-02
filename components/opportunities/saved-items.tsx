"use client"

import { useEffect, useState } from 'react'

export default function SavedItems() {
  const [items, setItems] = useState<string[]>([])

  useEffect(() => {
    try {
      setItems(JSON.parse(localStorage.getItem('saved_ops') || '[]'))
    } catch {
      setItems([])
    }
  }, [])

  if (!items || items.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-6 text-center text-slate-600">No saved opportunities yet.</div>
    )
  }

  return (
    <div className="space-y-3">
      {items.map((id) => (
        <div key={id} className="rounded-lg border border-slate-100 bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-900">Saved Opportunity #{id}</h3>
              <p className="text-sm text-slate-500">Details available on the opportunity page.</p>
            </div>
            <a href={`/opportunities/${id}`} className="rounded-md bg-pink-600 px-3 py-2 text-sm text-white">View</a>
          </div>
        </div>
      ))}
    </div>
  )
}
