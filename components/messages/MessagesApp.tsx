"use client"

import React, { useEffect, useState } from 'react'
import { HeartHandshake, Sparkles, Users2 } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'
import Sidebar from './Sidebar'
import ConversationView from './ConversationView'

type Conversation = {
  id: string
  title?: string
  last_message?: { body?: string; sender_avatar?: string }
  last_activity?: string
  unread_count?: number
  avatar_url?: string
  participant_name?: string
  is_online?: boolean
  is_typing?: boolean
  category?: 'all' | 'unread' | 'club' | 'mentors' | 'circles'
}

export default function MessagesApp() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [profileId, setProfileId] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()

    const loadConversations = async () => {
      const { data: session } = await supabase.auth.getSession()
      setProfileId(session?.session?.user?.id ?? null)
      const res = await fetch('/api/messages')
      const json = await res.json()
      const items = (json.conversations || []).map((conversation: Record<string, unknown>) => ({
        id: String(conversation.id ?? ''),
        title: typeof conversation.title === 'string' ? conversation.title : undefined,
        last_message: conversation.last_message && typeof conversation.last_message === 'object' ? conversation.last_message as { body?: string; sender_avatar?: string } : undefined,
        last_activity: conversation.last_activity ? String(conversation.last_activity) : undefined,
        unread_count: typeof conversation.unread_count === 'number' ? conversation.unread_count : 0,
        participant_name: typeof conversation.participant_name === 'string' ? conversation.participant_name : undefined,
        avatar_url: typeof conversation.avatar_url === 'string' ? conversation.avatar_url : undefined,
        is_online: true,
        is_typing: false,
        category: (conversation.category as Conversation['category']) || 'all',
      }))
      setConversations(items)
      if (!selected && items.length) setSelected(items[0].id)
    }

    void loadConversations()

    const channel = supabase.channel('conversations-global')
    channel.on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, () => {
      void loadConversations()
    })
    channel.subscribe()
    return () => void supabase.removeChannel(channel)
  }, [])

  const selectedConversation = conversations.find((conversation) => conversation.id === selected)

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(214,0,109,0.06),_transparent_30%),linear-gradient(180deg,_#fcfbff_0%,_#f8f7ff_100%)] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 xl:grid-cols-[320px_minmax(0,1fr)_280px]">
        <Sidebar conversations={conversations} selected={selected} onSelect={setSelected} />

        <div className="min-h-[74vh]">
          {selectedConversation ? (
            <ConversationView conversationId={selectedConversation.id} currentUserId={profileId} title={selectedConversation.participant_name || selectedConversation.title || 'Conversation'} />
          ) : (
            <div className="flex h-full items-center justify-center rounded-[32px] border border-dashed border-slate-300 bg-white/70 p-8 text-center text-slate-600 shadow-sm">
              <div>
                <div className="mb-3 flex justify-center text-violet-600">
                  <Sparkles className="h-6 w-6" />
                </div>
                <p className="text-lg font-semibold text-slate-900">Your premium inbox is waiting.</p>
                <p className="mt-2 text-sm">Pick a conversation to start a richer social experience.</p>
              </div>
            </div>
          )}
        </div>

        <div className="hidden rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_20px_60px_-24px_rgba(15,23,42,0.18)] xl:block">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-violet-700">
            <HeartHandshake className="h-4 w-4" />
            Social layer
          </div>
          <h3 className="mt-4 text-lg font-semibold text-slate-900">Connection-first messaging</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">This layout is now ready for presence, typing states, richer attachments, and future AI assistant features.</p>
          <div className="mt-5 rounded-[20px] border border-violet-100 bg-violet-50 p-4 text-sm text-slate-700">
            <div className="flex items-center gap-2 font-semibold text-violet-700">
              <Users2 className="h-4 w-4" />
              BIG members-only experience
            </div>
            <p className="mt-2">The next step is deeper connection integration and real-time read receipts.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
