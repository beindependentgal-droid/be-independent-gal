import React from 'react'
import { createServerSupabase, getCurrentUserId } from '@/lib/supabase-server'
import PendingRequestsClient from '@/components/connections/PendingRequestsClient'
import SentRequestsClient from '@/components/connections/SentRequestsClient'
import MyConnectionsClient from '@/components/connections/MyConnectionsClient'
import SuggestedMembersClient from '@/components/connections/SuggestedMembersClient'

export const revalidate = 0

export default async function ConnectionsPage() {
  const supabase = await createServerSupabase()
  const userId = await getCurrentUserId()

  if (!userId) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-semibold">Connections</h1>
        <p className="text-sm text-slate-600">Please sign in to manage your connections.</p>
      </div>
    )
  }

  // load pending requests (to me)
  type RequestRow = { id: string; from_profile: string; to_profile: string; message?: string; status: string; created_at: string }
  type ConnectionRow = { id: string; requester: string; recipient: string; status: string; created_at: string }
  type Profile = { id: string; first_name?: string; last_name?: string; avatar_url?: string; profession?: string; city?: string; member_level?: string }

  const { data: pendingRows } = await supabase.from('connection_requests').select('id,from_profile,to_profile,message,status,created_at').eq('to_profile', userId).order('created_at', { ascending: false }).limit(100)
  const pendingList = (pendingRows || []) as RequestRow[]

  // load sent requests (from me)
  const { data: sentRows } = await supabase.from('connection_requests').select('id,from_profile,to_profile,message,status,created_at').eq('from_profile', userId).order('created_at', { ascending: false }).limit(100)
  const sentList = (sentRows || []) as RequestRow[]

  // load connections
  const { data: connectionsRows } = await supabase.from('connections').select('id,requester,recipient,status,created_at').or(`requester.eq.${userId},recipient.eq.${userId}`).order('created_at', { ascending: false }).limit(500)
  const connectionsList = (connectionsRows || []) as ConnectionRow[]

  // fetch profile details for involved profile ids
  const profileIds = new Set<string>()
  ;(pendingList || []).forEach((r) => { profileIds.add(r.from_profile); profileIds.add(r.to_profile) })
  ;(sentList || []).forEach((r) => { profileIds.add(r.from_profile); profileIds.add(r.to_profile) })
  ;(connectionsList || []).forEach((c) => { profileIds.add(c.requester); profileIds.add(c.recipient) })

  const ids = Array.from(profileIds).filter(Boolean)
  const { data: profiles } = await supabase.from('profiles').select('id,first_name,last_name,avatar_url,profession,city,member_level').in('id', ids).limit(1000)
  const profilesById: Record<string, Profile> = {}
  ;(profiles || []).forEach((p) => { const pr = p as Profile; profilesById[pr.id] = pr })

  const pending = pendingList.map((r) => ({ ...r, from_profile_data: profilesById[r.from_profile] || null }))
  const sent = sentList.map((r) => ({ ...r, to_profile_data: profilesById[r.to_profile] || null }))
  const connections = connectionsList.map((c) => ({
    ...c,
    other: c.requester === userId ? profilesById[c.recipient] : profilesById[c.requester],
  }))

  // suggested members will be loaded client-side via the suggestion API

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Connections</h1>
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <section>
            <h2 className="text-lg font-medium">Pending Requests</h2>
            <PendingRequestsClient initialPending={pending} currentUserId={userId} />
          </section>

          <section className="mt-6">
            <h2 className="text-lg font-medium">Sent Requests</h2>
            <SentRequestsClient initialSent={sent} currentUserId={userId} />
          </section>

          <section className="mt-6">
            <h2 className="text-lg font-medium">My Connections</h2>
            <MyConnectionsClient initialConnections={connections} currentUserId={userId} />
          </section>
        </div>

        <aside className="col-span-1">
          <h2 className="text-lg font-medium">Suggested Members</h2>
          <SuggestedMembersClient currentUserId={userId} />
        </aside>
      </div>
    </div>
  )
}
