"use client"

import React, { useEffect, useState } from 'react'
import { ArrowRight, CalendarDays, Sparkles, Users2 } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'
import { DEFAULT_CONVERSATION_ID, getDemoConversationList } from '@/lib/messages-demo'
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

      try {
        const res = await fetch('/api/messages')
        if (!res.ok) throw new Error('messages api unavailable')
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
        if (items.length) {
          setConversations(items)
          if (!selected) setSelected(items[0].id)
          return
        }
      } catch {
        // fall back to demo conversation below
      }

      const demoConversations = getDemoConversationList().map((conversation) => ({
        id: conversation.id,
        title: conversation.title,
        last_message: conversation.last_message,
        last_activity: conversation.last_activity,
        unread_count: conversation.unread_count ?? 0,
        participant_name: conversation.participant_name,
        avatar_url: conversation.avatar_url,
        is_online: conversation.is_online ?? true,
        is_typing: conversation.is_typing ?? false,
        category: conversation.category || 'mentors',
      }))

      setConversations(demoConversations)
      if (!selected) setSelected(DEFAULT_CONVERSATION_ID)
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
  const conversationRole = selectedConversation?.category === 'mentors' ? 'Mentor' : selectedConversation?.category === 'circles' ? 'Circle' : selectedConversation?.category === 'club' ? 'BIG Club' : 'Member'
  const quickActions = selectedConversation?.category === 'mentors'
    ? [
        { label: 'Schedule mentorship', description: 'Book a guided session' },
        { label: 'View profile', description: 'Explore their background' },
        { label: 'Book session', description: 'Plan a focused conversation' },
      ]
    : selectedConversation?.category === 'circles'
      ? [
          { label: 'Open circle', description: 'Jump into shared space' },
          { label: 'View members', description: 'See who is active' },
        ]
      : selectedConversation?.category === 'club'
        ? [
            { label: 'Open club', description: 'Explore community updates' },
            { label: 'Upcoming events', description: 'See what is next' },
          ]
        : [
            { label: 'View profile', description: 'See their story' },
            { label: 'Share opportunity', description: 'Pass along a useful lead' },
          ]

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(214,0,109,0.06),transparent_30%),linear-gradient(180deg,#fcfbff_0%,#f8f7ff_100%)] p-2 sm:p-6 lg:p-8">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-3 xl:grid-cols-[320px_minmax(0,1fr)_280px]">
        <Sidebar conversations={conversations} selected={selected} onSelect={setSelected} />

        <div className="min-h-[74vh]">
          {selectedConversation ? (
            <ConversationView
              conversationId={selectedConversation.id}
              currentUserId={profileId}
              title={selectedConversation.participant_name || selectedConversation.title || 'Conversation'}
              subtitle={selectedConversation.category === 'mentors' ? 'Founder & mentor' : selectedConversation.category === 'circles' ? 'Circle connection' : selectedConversation.category === 'club' ? 'BIG Club member' : 'Trusted connection'}
              role={conversationRole}
            />
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
            <Users2 className="h-4 w-4" />
            Quick actions
          </div>
          <h3 className="mt-4 text-lg font-semibold text-slate-900">Support the next step</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">Keep conversations grounded in mentorship, collaboration, and warm community connection.</p>

          <div className="mt-5 space-y-3">
            {quickActions.map((action) => (
              <button key={action.label} type="button" className="flex w-full items-center justify-between rounded-[18px] border border-slate-200 bg-slate-50 px-3 py-3 text-left transition hover:border-violet-200 hover:bg-violet-50">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{action.label}</p>
                  <p className="mt-1 text-xs text-slate-500">{action.description}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-violet-600" />
              </button>
            ))}
          </div>

          <div className="mt-5 rounded-[20px] border border-violet-100 bg-violet-50 p-4 text-sm text-slate-700">
            <div className="flex items-center gap-2 font-semibold text-violet-700">
              <CalendarDays className="h-4 w-4" />
              Community rhythm
            </div>
            <p className="mt-2">Stay close to mentors, circle moments, and BIG Club opportunities without the noise.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
