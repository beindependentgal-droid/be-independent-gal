'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { useAuth } from '@/lib/auth-context'
import Link from 'next/link'

type Status = 'not_connected' | 'request_sent' | 'request_received' | 'connected' | 'blocked' | 'loading'

export default function ConnectButton({ profileId }: { profileId: string }) {
  const { isAuthenticated } = useAuth()
  const [status, setStatus] = useState<Status>('loading')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    const fetchStatus = async () => {
      if (!isAuthenticated) {
        setStatus('not_connected')
        return
      }
      const supabase = createClient()
      const { data: sessionData } = await supabase.auth.getSession()
      const token = sessionData?.session?.access_token
      if (!token) {
        setStatus('not_connected')
        return
      }

      const res = await fetch(`/api/connections/status?otherId=${encodeURIComponent(profileId)}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json()
      if (!mounted) return
      setStatus((json.status as Status) || 'not_connected')
    }

    void fetchStatus()
    const supabase = createClient()
    const channel = supabase.channel(`conn-btn-${profileId}`)

    channel.on('postgres_changes', { event: '*', schema: 'public', table: 'connection_requests' }, (payload: unknown) => {
      const ev = payload as Record<string, unknown>
      const newRow = ev.new as Record<string, unknown> | undefined
      const oldRow = ev.old as Record<string, unknown> | undefined
      const newFrom = newRow?.from_profile as string | undefined
      const newTo = newRow?.to_profile as string | undefined
      const oldFrom = oldRow?.from_profile as string | undefined
      const oldTo = oldRow?.to_profile as string | undefined
      if (newRow && (newFrom === profileId || newTo === profileId)) {
        // fetch updated status
        void fetchStatus()
      }
      if (oldRow && (oldFrom === profileId || oldTo === profileId)) {
        void fetchStatus()
      }
    })

    channel.on('postgres_changes', { event: '*', schema: 'public', table: 'connections' }, (payload: unknown) => {
      const ev = payload as Record<string, unknown>
      const newRow = ev.new as Record<string, unknown> | undefined
      const requester = newRow?.requester as string | undefined
      const recipient = newRow?.recipient as string | undefined
      if (newRow && (requester === profileId || recipient === profileId)) {
        void fetchStatus()
      }
    })

    channel.subscribe()

    return () => {
      mounted = false
      void supabase.removeChannel(channel)
    }
  }, [profileId, isAuthenticated])

  const handleConnect = async () => {
    if (!isAuthenticated) return window.location.assign('/signin')
    setLoading(true)
    try {
      const supabase = createClient()
      const { data: sessionData } = await supabase.auth.getSession()
      const token = sessionData?.session?.access_token
      if (!token) throw new Error('Not authenticated')

      const res = await fetch('/api/connections/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ toProfileId: profileId }),
      })
      if (!res.ok) throw new Error('Failed')
      setStatus('request_sent')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async (requestId: string) => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data: sessionData } = await supabase.auth.getSession()
      const token = sessionData?.session?.access_token
      if (!token) throw new Error('Not authenticated')

      const res = await fetch('/api/connections/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ requestId, accept: true }),
      })
      if (!res.ok) throw new Error('Failed')
      setStatus('connected')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDecline = async (requestId: string) => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data: sessionData } = await supabase.auth.getSession()
      const token = sessionData?.session?.access_token
      if (!token) throw new Error('Not authenticated')

      const res = await fetch('/api/connections/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ requestId, accept: false }),
      })
      if (!res.ok) throw new Error('Failed')
      setStatus('not_connected')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') return <button className="rounded-full border px-4 py-2">Loading…</button>

  if (status === 'connected') {
    return (
      <Link href={`/messages`} className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-4 py-2 text-white font-semibold">
        Message
      </Link>
    )
  }

  if (status === 'request_sent') {
    return <button disabled className="rounded-full border px-4 py-2">Pending</button>
  }

  if (status === 'request_received') {
    // In a real flow we'd surface the request id; for now provide generic accept/decline handlers
    return (
      <div className="flex gap-2">
        <button onClick={() => handleAccept('')} className="rounded-full bg-emerald-600 px-3 py-1 text-white font-semibold">Accept</button>
        <button onClick={() => handleDecline('')} className="rounded-full border px-3 py-1">Decline</button>
      </div>
    )
  }

  if (status === 'blocked') {
    return <button disabled className="rounded-full border px-4 py-2 text-slate-500">Blocked</button>
  }

  // default not connected
  return (
    <button onClick={handleConnect} disabled={loading} className="rounded-full bg-violet-600 px-4 py-2 text-white font-semibold">
      {loading ? 'Sending…' : 'Connect'}
    </button>
  )
}
