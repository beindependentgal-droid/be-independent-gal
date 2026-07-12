"use client"

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Mic, MicOff, Phone, PhoneOff, MoreVertical, Clock3, CheckCheck, Check, CircleEllipsis, Search } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'
import { appendDemoMessage, createDemoReply, getDemoConversationMessages, saveDemoConversationMessages } from '@/lib/messages-demo'
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
  edited?: boolean
}

function MessageBubble({
  m,
  isOwn,
  onReact,
  onEdit,
  onDelete,
  editing,
  editDraft,
  onEditDraftChange,
  onSaveEdit,
  onCancelEdit,
}: {
  m: Message
  isOwn: boolean
  onReact: (messageId: string, reaction: string) => void
  onEdit: (messageId: string, currentBody: string) => void
  onDelete: (messageId: string) => void
  editing: boolean
  editDraft: string
  onEditDraftChange: (value: string) => void
  onSaveEdit: (messageId: string) => void
  onCancelEdit: () => void
}) {
  const statusIcon = isOwn ? (
    m.status === 'seen' ? <CheckCheck className="h-3.5 w-3.5" /> : m.status === 'delivered' ? <CheckCheck className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5" />
  ) : null

  return (
    <div className={`group/message flex w-full ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] rounded-[22px] px-4 py-3 shadow-sm transition-all duration-200 ${isOwn ? 'bg-violet-600 text-white' : 'border border-slate-200 bg-white text-slate-800'}`}>
        {isOwn && !editing ? (
          <div className="mb-2 flex items-center justify-end gap-1 opacity-0 transition group-hover/message:opacity-100">
            <button type="button" onClick={() => onEdit(m.id, m.body)} className="rounded-full px-2 py-1 text-[11px] font-medium text-violet-100 transition hover:bg-white/10">
              Edit
            </button>
            <button type="button" onClick={() => onDelete(m.id)} className="rounded-full px-2 py-1 text-[11px] font-medium text-rose-100 transition hover:bg-white/10">
              Delete
            </button>
          </div>
        ) : null}

        {editing ? (
          <div className="space-y-2">
            <textarea
              value={editDraft}
              onChange={(event) => onEditDraftChange(event.target.value)}
              rows={3}
              className="w-full resize-none rounded-[16px] border border-white/30 bg-white/95 px-3 py-2 text-sm text-slate-800 outline-none ring-0"
            />
            <div className="flex items-center justify-end gap-2">
              <button type="button" onClick={onCancelEdit} className="rounded-full px-2.5 py-1 text-[11px] font-medium text-slate-600 transition hover:bg-slate-100">
                Cancel
              </button>
              <button type="button" onClick={() => onSaveEdit(m.id)} className="rounded-full bg-violet-600 px-2.5 py-1 text-[11px] font-medium text-white transition hover:bg-violet-700">
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="text-sm leading-6">{m.body}</div>
        )}
        <div className={`mt-2 flex items-center justify-end gap-2 text-[11px] ${isOwn ? 'text-violet-100' : 'text-slate-400'}`}>
          <span>{new Date(m.created_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span>
          {isOwn ? (
            <span className="flex items-center gap-1">
              {statusIcon}
              <span className="font-medium">{m.status === 'seen' ? 'Seen' : m.status === 'delivered' ? 'Delivered' : 'Sent'}</span>
            </span>
          ) : null}
          {m.edited ? <span className="font-medium">• Edited</span> : null}
        </div>
        {!editing ? (
          <div className="mt-3 flex translate-y-1 flex-wrap gap-2 opacity-0 transition-all duration-200 group-hover/message:translate-y-0 group-hover/message:opacity-100">
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
        ) : null}
      </div>
    </div>
  )
}

export default function ConversationView({ conversationId, currentUserId, title = 'Conversation', subtitle = 'Trusted conversation', role = 'Member' }: { conversationId: string; currentUserId: string | null; title?: string; subtitle?: string; role?: string }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [isOnline, setIsOnline] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const [lastSeen, setLastSeen] = useState('Active now')
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editDraft, setEditDraft] = useState('')
  const [isInCall, setIsInCall] = useState(false)
  const [callStatus, setCallStatus] = useState<'connecting' | 'connected'>('connecting')
  const [isMuted, setIsMuted] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const typingTimerRef = useRef<number | null>(null)
  const callTimerRef = useRef<number | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const presenceChannelRef = useRef<{ track?: (payload: Record<string, unknown>) => Promise<unknown>; untrack?: () => Promise<unknown> } | null>(null)

  useEffect(() => {
    let mounted = true
    const supabase = createClient()
    const load = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/messages/${conversationId}`)
        if (!res.ok) throw new Error('messages detail unavailable')
        const json = await res.json()
        if (!mounted) return
        const incoming = (json.messages || []).map((message: Record<string, unknown>) => ({
          id: String(message.id ?? ''),
          body: String(message.body ?? ''),
          created_at: String(message.created_at ?? new Date().toISOString()),
          sender_id: message.sender_id ? String(message.sender_id) : undefined,
          conversation_id: message.conversation_id ? String(message.conversation_id) : conversationId,
          status: 'seen' as const,
          edited: Boolean(message.edited),
          reactions: Array.isArray(message.reactions)
            ? message.reactions.map((reaction: Record<string, unknown>) => ({
                id: String(reaction.id ?? ''),
                reaction: String(reaction.reaction ?? ''),
                profile_id: String(reaction.profile_id ?? ''),
              }))
            : [],
        }))
        const sorted = incoming.sort((left: Message, right: Message) => new Date(left.created_at).getTime() - new Date(right.created_at).getTime())
        setMessages(sorted)
        saveDemoConversationMessages(conversationId, sorted)
      } catch {
        const demoMessages = getDemoConversationMessages(conversationId)
        if (!mounted) return
        setMessages(demoMessages)
      } finally {
        if (mounted) setLoading(false)
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 60)
      }
    }
    void load()

    const channel = supabase.channel(`messages-${conversationId}`)
    channel.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload: { new: Record<string, unknown> }) => {
      const row = payload.new as Message
      if (row.conversation_id === conversationId) {
        setMessages((current) => [...current, { ...row, status: 'delivered' as const, edited: false }])
      }
    })
    channel.subscribe()

    return () => {
      mounted = false
      void supabase.removeChannel(channel)
    }
  }, [conversationId])

  useEffect(() => {
    const timer = window.setTimeout(() => setIsOnline(true), 1200)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    return () => {
      if (callTimerRef.current !== null) {
        window.clearInterval(callTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase.channel(`${PRESENCE_CHANNEL}-${conversationId}`, {
      config: { presence: { key: currentUserId || 'anonymous' } },
    })

    channel.on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState() as Record<string, Array<{ user_id?: string; typing?: boolean }>>
      const participants = Object.values(state).flat()
      const typingPeers = participants.filter((participant) => participant.user_id && participant.user_id !== currentUserId && participant.typing)
      const hasOnlineParticipants = participants.some((participant) => participant.user_id && participant.user_id !== currentUserId)
      setIsOnline(hasOnlineParticipants)
      setIsTyping(typingPeers.length > 0)
      setLastSeen(typingPeers.length > 0 ? 'typing…' : hasOnlineParticipants ? 'Active now' : 'Last seen recently')
    })

    void channel.subscribe(async (status: string) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({
          user_id: currentUserId || 'anonymous',
          conversation_id: conversationId,
          online_at: new Date().toISOString(),
          typing: false,
        })
      }
    })

    presenceChannelRef.current = channel

    return () => {
      void channel.untrack?.()
      void supabase.removeChannel(channel)
      presenceChannelRef.current = null
    }
  }, [conversationId, currentUserId])

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase.channel(`message-reads-${conversationId}`)

    channel.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'message_reads' }, (payload: { new: Record<string, unknown> }) => {
      const row = payload.new as { message_id?: string; profile_id?: string }
      if (!row.message_id || !row.profile_id || row.profile_id === currentUserId) return
      setMessages((current) => current.map((message) => message.id === row.message_id && message.sender_id === currentUserId ? { ...message, status: 'seen' as const } : message))
    })

    channel.subscribe()

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
    const temp: Message = { id: `tmp-${Date.now()}`, body: text, created_at: new Date().toISOString(), sender_id: currentUserId || 'demo-user', conversation_id: conversationId, status: 'sent' }
    const nextMessages = [...messages, temp]
    setMessages(nextMessages)
    appendDemoMessage(conversationId, temp)
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 20)

    try {
      const res = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId, text }),
      })
      if (!res.ok) throw new Error('send failed')
      setMessages((current) => current.map((message) => message.id === temp.id ? { ...message, status: 'delivered' as const } : message))
    } catch {
      const reply = createDemoReply(text, conversationId)
      const updatedMessages = [...nextMessages, reply]
      setMessages(updatedMessages)
      saveDemoConversationMessages(conversationId, updatedMessages)
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 20)
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

  const handleEditMessage = async (messageId: string, newBody: string) => {
    const trimmed = newBody.trim()
    if (!trimmed) return

    const previous = messages.find((message) => message.id === messageId)
    if (!previous) return

    const nextMessages = messages.map((message) => (message.id === messageId ? { ...message, body: trimmed, edited: true } : message))
    setMessages(nextMessages)
    setEditingMessageId(null)
    setEditDraft('')
    saveDemoConversationMessages(conversationId, nextMessages)

    if (!currentUserId || currentUserId === 'demo-user') return

    try {
      const response = await fetch('/api/messages/edit', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId, newBody: trimmed }),
      })
      if (!response.ok) throw new Error('Edit failed')
    } catch (error) {
      console.error(error)
      setMessages(messages.map((message) => (message.id === messageId ? previous : message)))
    }
  }

  const handleDeleteMessage = async (messageId: string) => {
    const confirmed = window.confirm('Delete this message?')
    if (!confirmed) return

    const nextMessages = messages.filter((message) => message.id !== messageId)
    setMessages(nextMessages)
    saveDemoConversationMessages(conversationId, nextMessages)

    if (!currentUserId || currentUserId === 'demo-user') return

    try {
      const response = await fetch(`/api/messages/message/${messageId}?mode=for_me`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Delete failed')
    } catch (error) {
      console.error(error)
      setMessages(messages)
    }
  }

  const handleCall = () => {
    if (isInCall) {
      setIsInCall(false)
      setCallStatus('connecting')
      setIsMuted(false)
      setCallDuration(0)
      if (callTimerRef.current !== null) {
        window.clearInterval(callTimerRef.current)
        callTimerRef.current = null
      }
      return
    }

    setIsInCall(true)
    setCallStatus('connecting')
    setIsMuted(false)
    setCallDuration(0)

    if (callTimerRef.current !== null) {
      window.clearInterval(callTimerRef.current)
    }

    window.setTimeout(() => {
      setCallStatus('connected')
      callTimerRef.current = window.setInterval(() => {
        setCallDuration((current) => current + 1)
      }, 1000)
    }, 900)
  }

  const handleTypingChange = useCallback((typing: boolean) => {
    if (typingTimerRef.current !== null) {
      window.clearTimeout(typingTimerRef.current)
      typingTimerRef.current = null
    }

    setIsTyping((current) => (current === typing ? current : typing))

    const channel = presenceChannelRef.current
    if (channel?.track) {
      void channel.track({
        user_id: currentUserId || 'anonymous',
        conversation_id: conversationId,
        online_at: new Date().toISOString(),
        typing,
      })
    }

    if (!typing) return

    typingTimerRef.current = window.setTimeout(() => {
      setIsTyping(false)
      typingTimerRef.current = null
      if (channel?.track) {
        void channel.track({
          user_id: currentUserId || 'anonymous',
          conversation_id: conversationId,
          online_at: new Date().toISOString(),
          typing: false,
        })
      }
    }, 1800)
  }, [conversationId, currentUserId])

  const groupedMessages = messages.reduce<Array<{ day: string; items: Message[] }>>((acc, message) => {
    const day = new Date(message.created_at).toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })
    const current = acc[acc.length - 1]
    if (current && current.day === day) {
      current.items.push(message)
      return acc
    }
    acc.push({ day, items: [message] })
    return acc
  }, [])

  return (
    <div className="relative flex h-[calc(100dvh-8rem)] flex-col overflow-hidden rounded-[32px] border border-slate-200/80 bg-white shadow-[0_20px_60px_-24px_rgba(15,23,42,0.2)] sm:h-[74vh]">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 px-3 py-3 backdrop-blur sm:px-6 sm:py-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 text-base font-semibold text-violet-700 sm:h-11 sm:w-11 sm:text-lg">{title.charAt(0).toUpperCase()}</div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate text-sm font-semibold text-slate-900">{title}</p>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.2em] text-slate-600">{role}</span>
            </div>
            <p className="truncate text-sm text-slate-500">{subtitle}</p>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                {isOnline && !isTyping ? <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/60" /> : null}
              </span>
              {isTyping ? (
                <span className="flex items-center gap-1 text-violet-600">
                  <CircleEllipsis className="h-3.5 w-3.5 animate-pulse" />
                  typing…
                </span>
              ) : isOnline ? (
                'Active now'
              ) : (
                lastSeen
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button className="rounded-full border border-slate-200 bg-slate-50 p-2 text-slate-600 transition hover:border-violet-200 hover:text-violet-700 sm:p-2.5" aria-label="Search conversation">
            <Search className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleCall}
            className="rounded-full border border-slate-200 bg-slate-50 p-2 text-slate-600 transition hover:border-violet-200 hover:text-violet-700 sm:p-2.5"
            aria-label="Call"
          >
            <Phone className="h-4 w-4" />
          </button>
          <button className="rounded-full border border-slate-200 bg-slate-50 p-2 text-slate-600 transition hover:border-violet-200 hover:text-violet-700 sm:p-2.5" aria-label="More actions">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>

      {isInCall ? (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/35 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[30px] border border-white/60 bg-white p-6 shadow-[0_24px_80px_-20px_rgba(15,23,42,0.35)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-600">In-app call</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900">{title}</h3>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                <Phone className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-6 flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 text-xl font-semibold text-white">
                {title.charAt(0).toUpperCase()}
              </div>
              <p className="mt-4 text-lg font-semibold text-slate-900">{title}</p>
              <p className="mt-1 text-sm text-slate-500">{callStatus === 'connecting' ? 'Connecting your call…' : `Connected • ${Math.floor(callDuration / 60).toString().padStart(2, '0')}:${(callDuration % 60).toString().padStart(2, '0')}`}</p>
            </div>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsMuted((current) => !current)}
                className={`rounded-full border p-3 transition ${isMuted ? 'border-rose-200 bg-rose-50 text-rose-600' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-violet-200 hover:text-violet-700'}`}
                aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}
              >
                {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>
              <button
                type="button"
                onClick={handleCall}
                className="rounded-full bg-rose-600 p-3 text-white transition hover:bg-rose-700"
                aria-label="End call"
              >
                <PhoneOff className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex-1 overflow-auto bg-[radial-gradient(circle_at_top_left,rgba(214,0,109,0.08),transparent_30%),linear-gradient(180deg,#fcfbff_0%,#f8f7ff_100%)] px-2 py-3 sm:px-5 sm:py-4">
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
          <div className="space-y-4">
            {groupedMessages.map((group) => (
              <div key={group.day} className="space-y-3">
                <div className="flex justify-center">
                  <span className="rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">{group.day}</span>
                </div>
                {group.items.map((message) => (
                  <MessageBubble
                    key={message.id}
                    m={message}
                    isOwn={message.sender_id === currentUserId}
                    onReact={handleReact}
                    onEdit={(messageId, currentBody) => {
                      setEditingMessageId(messageId)
                      setEditDraft(currentBody)
                    }}
                    onDelete={handleDeleteMessage}
                    editing={editingMessageId === message.id}
                    editDraft={editDraft}
                    onEditDraftChange={setEditDraft}
                    onSaveEdit={(messageId) => void handleEditMessage(messageId, editDraft)}
                    onCancelEdit={() => {
                      setEditingMessageId(null)
                      setEditDraft('')
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-slate-200 bg-white p-2.5 sm:p-4">
        <Composer onSend={handleSend} onTypingChange={handleTypingChange} />
      </div>
    </div>
  )
}
