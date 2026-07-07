"use client"

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'

type SentRow = {
  id: string
  from_profile: string
  to_profile: string
  message?: string
  status: string
  created_at: string
  to_profile_data?: {
    id: string
    first_name?: string
    last_name?: string
    avatar_url?: string
    profession?: string
    city?: string
  } | null
}

export default function SentRequestsClient({ initialSent, currentUserId }: { initialSent: SentRow[]; currentUserId: string }) {
  const [sent, setSent] = useState<SentRow[]>(initialSent || [])

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase.channel(`sent-requests-${currentUserId}`)

    channel.on('postgres_changes', { event: '*', schema: 'public', table: 'connection_requests' }, (payload: unknown) => {
      const ev = payload as Record<string, unknown>
      const eventType = ev.eventType as string | undefined
      const row = (ev.new as unknown) as SentRow | undefined
      const old = (ev.old as unknown) as SentRow | undefined
      if (eventType === 'INSERT' && row && row.from_profile === currentUserId) {
        setSent((p) => [row, ...p])
      } else if (eventType === 'UPDATE') {
        if (row && row.from_profile === currentUserId) setSent((p) => p.map((x) => (x.id === row.id ? row : x)))
        if (old && old.from_profile === currentUserId && row && row.status !== 'pending') setSent((p) => p.filter((x) => x.id !== old.id))
      } else if (eventType === 'DELETE' && old && old.from_profile === currentUserId) {
        setSent((p) => p.filter((x) => x.id !== old.id))
      }
    })

    channel.subscribe()
    return () => void supabase.removeChannel(channel)
  }, [currentUserId])

  if (!sent || sent.length === 0) return <div className="p-4 text-sm text-slate-500">No sent requests</div>

  return (
    <div className="space-y-3">
      {sent.map((r) => (
        <div key={r.id} className="flex items-center justify-between gap-3 p-3 border rounded">
          <div className="flex items-center gap-3">
            <img src={r.to_profile_data?.avatar_url || '/images/avatar-placeholder.png'} alt="avatar" className="w-10 h-10 rounded-full" />
            <div>
              <div className="font-medium">{r.to_profile_data?.first_name} {r.to_profile_data?.last_name}</div>
              <div className="text-xs text-slate-500">{r.to_profile_data?.profession || r.to_profile_data?.city}</div>
            </div>
          </div>
          <div className="text-sm text-slate-500">{r.status}</div>
        </div>
      ))}
    </div>
  )
}
