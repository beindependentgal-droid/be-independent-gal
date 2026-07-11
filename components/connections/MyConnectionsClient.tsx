"use client"

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import Link from 'next/link'

type ConnRow = {
  id: string
  requester: string
  recipient: string
  status: string
  created_at: string
  other?: {
    id: string
    first_name?: string
    last_name?: string
    avatar_url?: string
    profession?: string
    city?: string
  } | null
}

export default function MyConnectionsClient({ initialConnections, currentUserId }: { initialConnections: ConnRow[]; currentUserId: string }) {
  const [connections, setConnections] = useState<ConnRow[]>(initialConnections || [])

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase.channel(`my-conns-${currentUserId}`)

    channel.on('postgres_changes', { event: '*', schema: 'public', table: 'connections' }, (payload: unknown) => {
      const ev = payload as Record<string, unknown>
      const eventType = ev.eventType as string | undefined
      const row = (ev.new as unknown) as ConnRow | undefined
      const old = (ev.old as unknown) as ConnRow | undefined
      if (eventType === 'INSERT' && row && (row.requester === currentUserId || row.recipient === currentUserId)) {
        setConnections((p) => [row, ...p])
      } else if (eventType === 'UPDATE') {
        if (row && (row.requester === currentUserId || row.recipient === currentUserId)) setConnections((p) => p.map((x) => (x.id === row.id ? row : x)))
        if (old && (old.requester === currentUserId || old.recipient === currentUserId) && row && row.status !== 'connected') setConnections((p) => p.filter((x) => x.id !== old.id))
      } else if (eventType === 'DELETE' && old && (old.requester === currentUserId || old.recipient === currentUserId)) {
        setConnections((p) => p.filter((x) => x.id !== old.id))
      }
    })

    channel.subscribe()
    return () => void supabase.removeChannel(channel)
  }, [currentUserId])

  if (!connections || connections.length === 0) return <div className="p-4 text-sm text-slate-500">No connections yet</div>

  return (
    <div className="space-y-3">
      {connections.map((c) => (
        <div key={c.id} className="flex items-center justify-between gap-3 p-3 border rounded">
          <div className="flex items-center gap-3">
            <img src={c.other?.avatar_url || '/images/member-placeholder.svg'} alt="avatar" className="w-10 h-10 rounded-full" />
            <div>
              <div className="font-medium">{c.other?.first_name} {c.other?.last_name}</div>
              <div className="text-xs text-slate-500">{c.other?.profession || c.other?.city}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/messages`} className="rounded-full bg-violet-600 px-3 py-1 text-white">Message</Link>
            <button className="rounded-full border px-3 py-1">More</button>
          </div>
        </div>
      ))}
    </div>
  )
}
