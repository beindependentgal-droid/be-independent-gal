"use client"

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'

type ReqRow = {
  id: string
  from_profile: string
  to_profile: string
  message?: string
  status: string
  created_at: string
  from_profile_data?: {
    id: string
    first_name?: string
    last_name?: string
    avatar_url?: string
    profession?: string
    city?: string
  } | null
}

export default function PendingRequestsClient({ initialPending, currentUserId }: { initialPending: ReqRow[]; currentUserId: string }) {
  const [pending, setPending] = useState<ReqRow[]>(initialPending || [])
  const [loadingIds, setLoadingIds] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase.channel(`pending-requests-${currentUserId}`)

    channel.on('postgres_changes', { event: '*', schema: 'public', table: 'connection_requests' }, (payload: unknown) => {
      const ev = payload as Record<string, unknown>
      const eventType = ev.eventType as string | undefined
      const row = (ev.new as unknown) as ReqRow | undefined
      const old = (ev.old as unknown) as ReqRow | undefined
      if (eventType === 'INSERT' && row && row.to_profile === currentUserId) {
        setPending((p) => [row, ...p])
      } else if (eventType === 'UPDATE') {
        // status changed
        if (row) setPending((p) => p.map((x) => (x.id === row.id ? row : x)))
        if (old && (old.status === 'pending') && row && row.status !== 'pending') {
          setPending((p) => p.filter((x) => x.id !== old.id))
        }
      } else if (eventType === 'DELETE' && old) {
        setPending((p) => p.filter((x) => x.id !== old.id))
      }
    })

    channel.subscribe()
    return () => void supabase.removeChannel(channel)
  }, [currentUserId])

  const accept = async (requestId: string) => {
    setLoadingIds((s) => ({ ...s, [requestId]: true }))
    try {
      const res = await fetch('/api/connections/respond', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ requestId, accept: true }) })
      if (!res.ok) throw new Error('Failed')
      setPending((p) => p.filter((x) => x.id !== requestId))
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingIds((s) => ({ ...s, [requestId]: false }))
    }
  }

  const decline = async (requestId: string) => {
    setLoadingIds((s) => ({ ...s, [requestId]: true }))
    try {
      const res = await fetch('/api/connections/respond', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ requestId, accept: false }) })
      if (!res.ok) throw new Error('Failed')
      setPending((p) => p.filter((x) => x.id !== requestId))
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingIds((s) => ({ ...s, [requestId]: false }))
    }
  }

  if (!pending || pending.length === 0) return <div className="p-4 text-sm text-slate-500">No pending requests</div>

  return (
    <div className="space-y-3">
      {pending.map((r) => (
        <div key={r.id} className="flex items-center justify-between gap-3 p-3 border rounded">
          <div className="flex items-center gap-3">
            <img src={r.from_profile_data?.avatar_url || '/images/avatar-placeholder.png'} alt="avatar" className="w-10 h-10 rounded-full" />
            <div>
              <div className="font-medium">{r.from_profile_data?.first_name} {r.from_profile_data?.last_name}</div>
              <div className="text-xs text-slate-500">{r.from_profile_data?.profession || r.from_profile_data?.city}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => accept(r.id)} disabled={!!loadingIds[r.id]} className="rounded-full bg-emerald-600 px-3 py-1 text-white">{loadingIds[r.id] ? 'Accepting…' : 'Accept'}</button>
            <button onClick={() => decline(r.id)} disabled={!!loadingIds[r.id]} className="rounded-full border px-3 py-1">Decline</button>
          </div>
        </div>
      ))}
    </div>
  )
}
