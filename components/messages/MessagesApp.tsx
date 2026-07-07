"use client"

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import Sidebar from './Sidebar'
import ConversationView from './ConversationView'

type Conversation = {
  id: string
  title?: string
  last_message?: { body?: string; sender_avatar?: string }
  last_activity?: string
}

export default function MessagesApp() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [profileId, setProfileId] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    ;(async () => {
      const { data: session } = await supabase.auth.getSession()
      setProfileId(session?.session?.user?.id ?? null)
      const res = await fetch('/api/messages')
      const json = await res.json()
      setConversations(json.conversations || [])
      if (json.conversations && json.conversations.length) setSelected(json.conversations[0].id)
    })()

    const channel = supabase.channel('conversations-global')
    channel.on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, (_payload: { new?: Record<string, unknown>; old?: Record<string, unknown> }) => {
      void fetch('/api/messages').then((r) => r.json()).then((j) => setConversations(j.conversations || []))
    })
    channel.subscribe()
    return () => void supabase.removeChannel(channel)
  }, [])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4">
      <div className="lg:col-span-3">
        <Sidebar conversations={conversations} selected={selected} onSelect={setSelected} />
      </div>
      <div className="lg:col-span-6">
        {selected ? <ConversationView conversationId={selected} currentUserId={profileId} /> : <div className="p-6 text-slate-500">Select a conversation</div>}
      </div>
      <div className="lg:col-span-3 hidden lg:block">
        <div className="p-4 bg-white rounded shadow">Right sidebar (profile / actions)</div>
      </div>
    </div>
  )
}
