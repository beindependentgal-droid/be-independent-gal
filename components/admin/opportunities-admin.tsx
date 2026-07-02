"use client"

import { useEffect, useState } from 'react'
import { getAccessToken } from '@/lib/auth-utils'

type Opportunity = {
  id: string
  title: string
  organization: string
  category?: string
  status?: string
  featured?: boolean
  featured_order?: number
  deadline?: string
  application_url?: string
  published_at?: string
}

type OpportunityCategory = {
  id: string
  name: string
  slug: string
}

export default function OpportunitiesAdmin() {
  const [items, setItems] = useState<Opportunity[]>([])
  const [categories, setCategories] = useState<OpportunityCategory[]>([])
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

  const patchItem = async (id: string, changes: Partial<Opportunity>) => {
    try {
      const token = await getAccessToken()
      const res = await fetch(`/api/opportunities/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(changes),
      })
      if (!res.ok) throw new Error('Update failed')
      const updated = await res.json()
      setItems((s) => s.map((x) => (x.id === updated.id ? updated : x)))
    } catch (e) {
      console.error(e)
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
      const body = {
        title: `New Opportunity ${Date.now()}`,
        organization: 'Admin',
        description: 'Created from admin UI',
        status: 'draft',
        featured: false,
        category: categories[0]?.name || 'General',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      }
      const res = await fetch('/api/opportunities', { method: 'POST', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify(body) })
      if (!res.ok) throw new Error('Create failed')
      const data = await res.json()
      setItems((s) => [data, ...s])
    } catch (e) {
      console.error(e)
    }
  }

  const createCategory = async () => {
    const name = window.prompt('New category name')
    if (!name) return

    try {
      const token = await getAccessToken()
      const slug = name.toLowerCase().replace(/\s+/g, '-')
      const res = await fetch('/api/opportunity-categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ name, slug }),
      })
      if (!res.ok) throw new Error('Create failed')
      const data = await res.json()
      setCategories((s) => [data, ...s])
    } catch (e) {
      console.error(e)
    }
  }

  const updateField = async (item: Opportunity, field: keyof Opportunity, label: string, transform?: (value: string) => any) => {
    const next = window.prompt(`Set ${label}`, String(item[field] ?? ''))
    if (next === null) return
    const value = transform ? transform(next) : next
    await patchItem(item.id, { [field]: value } as Partial<Opportunity>)
  }

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/opportunity-categories')
      if (!res.ok) throw new Error('Failed to load categories')
      const payload = await res.json()
      setCategories(payload || [])
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    void fetchItems()
    void fetchCategories()
  }, [])

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Opportunities (Admin)</h3>
          <p className="mt-1 text-sm text-slate-600">Manage publish state, featured order, deadlines, and categories.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          <button onClick={createCategory} className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900">New Category</button>
          <button onClick={createSample} className="rounded-md bg-pink-600 px-3 py-2 text-sm font-semibold text-white">Create Opportunity</button>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead>
            <tr className="bg-slate-50">
              <th className="px-4 py-3 text-left font-medium text-slate-700">Title</th>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Category</th>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Status</th>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Featured</th>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Deadline</th>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Order</th>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {items.map((item) => (
              <tr key={item.id} className="bg-white">
                <td className="px-4 py-3">
                  <div className="font-semibold text-slate-900">{item.title}</div>
                  <div className="text-xs text-slate-500">{item.organization}</div>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={item.category || categories[0]?.name || 'General'}
                    onChange={(e) => patchItem(item.id, { category: e.target.value })}
                    className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-sm"
                  >
                    {categories.length > 0 ? categories.map((category) => (
                      <option key={category.id} value={category.name}>{category.name}</option>
                    )) : <option value="General">General</option>}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={item.status || 'draft'}
                    onChange={(e) => patchItem(item.id, { status: e.target.value })}
                    className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-sm"
                  >
                    <option value="draft">draft</option>
                    <option value="published">published</option>
                    <option value="archived">archived</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => patchItem(item.id, { featured: !item.featured })}
                    className={`rounded-md px-2 py-1 text-xs font-semibold ${item.featured ? 'bg-pink-600 text-white' : 'bg-slate-100 text-slate-700'}`}
                  >
                    {item.featured ? 'Featured' : 'Mark Featured'}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <input
                    type="date"
                    value={item.deadline ? new Date(item.deadline).toISOString().slice(0, 10) : ''}
                    onChange={(e) => patchItem(item.id, { deadline: e.target.value ? new Date(e.target.value).toISOString() : null })}
                    className="w-full rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-sm"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    value={item.featured_order ?? ''}
                    onChange={(e) => patchItem(item.id, { featured_order: e.target.value ? Number(e.target.value) : null })}
                    className="w-full rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-sm"
                  />
                </td>
                <td className="px-4 py-3 space-y-2">
                  <button onClick={() => updateField(item, 'application_url', 'application URL')} className="inline-flex items-center rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700">Application URL</button>
                  <button onClick={() => patchItem(item.id, { status: item.status === 'published' ? 'draft' : 'published' })} className="inline-flex items-center rounded-md bg-slate-900 px-3 py-2 text-xs font-semibold text-white">
                    {item.status === 'published' ? 'Unpublish' : 'Publish'}
                  </button>
                  <button onClick={() => remove(item.id)} className="inline-flex items-center rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {loading && <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">Loading opportunities…</div>}
    </div>
  )
}
