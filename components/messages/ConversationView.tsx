"use client"

import React, { useEffect, useRef, useState } from 'react'
import { Phone, Video, MoreVertical, Clock3 } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'
import Composer from './Composer'

const PRESENCE_CHANNEL = 'messages-presence'

type Message = {
  id: string
  body: string
  created_at: string
  sender_id?: string
  conversation_id?: string
  status?: 'sent' | 'delivered' | 'seen'
  reactions?: Array<{ id: string; reaction: string; profile_id: string }>
}

function MessageBubble({ m, isOwn, onReact }: { m: Message; isOwn: boolean; onReact: (messageId: string, reaction: string) => void }) {
  return (
    <div className={`flex w-full ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] rounded-[22px] px-4 py-3 shadow-sm ${isOwn ? 'bg-violet-600 text-white' : 'bg-white text-slate-800 border border-slate-200'}`}>
        <div className="text-sm leading-6">{m.body}</div>
        <div className={`mt-2 flex items-center justify-end gap-2 text-[11px] ${isOwn ? 'text-violet-100' : 'text-slate-400'}`}>
          <span>{new Date(m.created_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span>
          {isOwn ? <span>{m.status === 'seen' ? 'Seen' : m.status === 'delivered' ? 'Delivered' : 'Sent'}</span> : null}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {['👏', '❤️', '🔥', '👍'].map((reaction) => (
            <button
              key={reaction}
              type="button"
              onClick={() => onReact(m.id, reaction)}
              className={`rounded-full border px-2 py-1 text-xs transition ${m.reactions?.some((item) => item.reaction === reaction) ? 'border-violet-200 bg-violet-100 text-violet-700' : 'border-slate-200 bg-white/80 text-slate-600 hover:border-violet-200 hover:text-violet-700'}`}
            >
              {reaction}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ConversationView({ conversationId, currentUserId, title = 'Conversation' }: { conversationId: string; currentUserId: string | null; title?: string }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [isOnline, setIsOnline] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const [lastSeen, setLastSeen] = useState('Active now')
  const [typingTimer, setTypingTimer] = useState<number | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let mounted = true
    const supabase = createClient()
    const load = async () => {
      setLoading(true)
      const res = await fetch(`/api/messages/${conversationId}`)
      const json = await res.json()
      if (!mounted) return
      const incoming = (json.messages || []).map((message: Record<string, unknown>) => ({
        id: String(message.id ?? ''),
        body: String(message.body ?? ''),
        created_at: String(message.created_at ?? new Date().toISOString()),
        sender_id: message.sender_id ? String(message.sender_id) : undefined,
        conversation_id: message.conversation_id ? String(message.conversation_id) : conversationId,
        status: 'seen' as const,
        reactions: Array.isArray(message.reactions)
          ? message.reactions.map((reaction: Record<string, unknown>) => ({
              id: String(reaction.id ?? ''),
              reaction: String(reaction.reaction ?? ''),
              profile_id: String(reaction.profile_id ?? ''),
            }))
          : [],
      }))
      setMessages(incoming.sort((left: Message, right: Message) => new Date(left.created_at).getTime() - new Date(right.created_at).getTime()))
      setLoading(false)
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 60)
    }
    void load()

    const channel = supabase.channel(`messages-${conversationId}`)
    channel.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload: { new: Record<string, unknown> }) => {
      const row = payload.new as Message
      if (row.conversation_id === conversationId) {
        setMessages((current) => [...current, { ...row, status: 'delivered' as const }])
      }
    })
    channel.subscribe()

    return () => {
      mounted = false
      void supabase.removeChannel(channel)
    }
  }, [conversationId])

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase.channel(`typing-${conversationId}`)

    channel.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, () => {
      setIsTyping(false)
    })

    channel.subscribe()
    return () => {
      void supabase.removeChannel(channel)
    }
  }, [conversationId])

  useEffect(() => {
    const timer = window.setTimeout(() => setIsOnline(true), 1200)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase.channel(`${PRESENCE_CHANNEL}-${conversationId}`)

    channel.on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState()
      const participants = Object.values(state).flat() as Array<{ user_id?: string }>
      const hasOnlineParticipants = participants.some((participant) => participant.user_id && participant.user_id !== currentUserId)
      setIsOnline(hasOnlineParticipants)
      setLastSeen(hasOnlineParticipants ? 'Active now' : 'Last seen recently')
    })

    void channel.subscribe(async () => {
      await channel.track({ user_id: currentUserId || 'anonymous', conversation_id: conversationId, online_at: new Date().toISOString() })
    })

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [conversationId, currentUserId])

  useEffect(() => {
    if (!messages.length) return
    const unreadIds = messages.filter((message) => message.sender_id !== currentUserId).map((message) => message.id)
    if (!unreadIds.length) return

    const markAsRead = async () => {
      await fetch('/api/messages/read', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId, messageIds: unreadIds }),
      })
    }

    void markAsRead()
  }, [conversationId, currentUserId, messages])

  const handleSend = async (text: string) => {
    const temp: Message = { id: `tmp-${Date.now()}`, body: text, created_at: new Date().toISOString(), sender_id: currentUserId || undefined, conversation_id: conversationId, status: 'sent' }
    setMessages((current) => [...current, temp])
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 20)

    try {
      const res = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId, text }),
      })
      if (!res.ok) throw new Error('send failed')
    } catch (err) {
      console.error(err)
    }
  }

  const handleReact = async (messageId: string, reaction: string) => {
    try {
      const response = await fetch('/api/messages/react', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId, reaction }),
      })
      if (!response.ok) throw new Error('Reaction failed')

      setMessages((current) => current.map((message) => {
        if (message.id !== messageId) return message
        const existing = message.reactions?.some((item) => item.reaction === reaction)
        if (existing) {
          return { ...message, reactions: message.reactions?.filter((item) => item.reaction !== reaction) || [] }
        }
        return {
          ...message,
          reactions: [...(message.reactions || []), { id: `${messageId}-${reaction}`, reaction, profile_id: currentUserId || 'local' }],
        }
      }))
    } catch (error) {
      console.error(error)
    }
  }

  const handleTypingChange = (typing: boolean) => {
    if (typingTimer) window.clearTimeout(typingTimer)
    setIsTyping(typing)
    if (!typing) return
    const nextTimer = window.setTimeout(() => setIsTyping(false), 1800)
    setTypingTimer(nextTimer)
  }

  return (
    <div className="flex h-[74vh] flex-col overflow-hidden rounded-[32px] border border-slate-200/80 bg-white shadow-[0_20px_60px_-24px_rgba(15,23,42,0.2)]">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-100 text-lg font-semibold text-violet-700">{title.charAt(0).toUpperCase()}</div>
          <div>
            <p className="text-sm font-semibold text-slate-900">{title}</p>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className={`h-2.5 w-2.5 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-slate-300'}`} />
              {isTyping ? 'typing…' : isOnline ? 'Active now' : lastSeen}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="rounded-full border border-slate-200 bg-slate-50 p-2.5 text-slate-600 transition hover:border-violet-200 hover:text-violet-700">
            <Phone className="h-4 w-4" />
          </button>
          <button className="rounded-full border border-slate-200 bg-slate-50 p-2.5 text-slate-600 transition hover:border-violet-200 hover:text-violet-700">
            <Video className="h-4 w-4" />
          </button>
          <button className="rounded-full border border-slate-200 bg-slate-50 p-2.5 text-slate-600 transition hover:border-violet-200 hover:text-violet-700">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-[radial-gradient(circle_at_top_left,_rgba(214,0,109,0.08),_transparent_30%),linear-gradient(180deg,_#fcfbff_0%,_#f8f7ff_100%)] px-3 py-4 sm:px-5">
        {loading ? (
          <div className="space-y-3 pt-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className={`h-16 animate-pulse rounded-[22px] ${item % 2 === 0 ? 'ml-8 bg-slate-100' : 'mr-8 bg-violet-50'}`} />
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-[24px] border border-dashed border-slate-300 bg-white/60 p-6 text-center text-sm text-slate-600">
            <div>
              <div className="mb-3 flex justify-center text-violet-600">
                <Clock3 className="h-6 w-6" />
              </div>
              <p className="font-semibold text-slate-900">Your conversation space is ready.</p>
              <p className="mt-1">Start with a warm introduction and let the momentum build.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => (
              <MessageBubble key={message.id} m={message} isOwn={message.sender_id === currentUserId} onReact={handleReact} />
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-slate-200 bg-white p-3 sm:p-4">
        <Composer onSend={handleSend} onTypingChange={handleTypingChange} />
      </div>
    </div>
  )
}
