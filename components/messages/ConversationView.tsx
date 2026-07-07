"use client"

import React, { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase-client'
import Composer from './Composer'

type Message = {
  id: string
  body: string
  created_at: string
  sender_id?: string
  conversation_id?: string
}

function MessageBubble({ m, isOwn }: { m: Message; isOwn: boolean }) {
  return (
    <div className={`max-w-lg p-2 rounded ${isOwn ? 'bg-violet-600 text-white ml-auto' : 'bg-white text-slate-800'}`}>
      <div className="text-sm">{m.body}</div>
      <div className="text-xs text-slate-400 mt-1">{new Date(m.created_at).toLocaleTimeString()}</div>
    </div>
  )
}

export default function ConversationView({ conversationId, currentUserId }: { conversationId: string; currentUserId: string | null }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let mounted = true
    const supabase = createClient()
    const load = async () => {
      setLoading(true)
      const res = await fetch(`/api/messages/${conversationId}`)
      const json = await res.json()
      if (!mounted) return
      setMessages(json.messages || [])
      setLoading(false)
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
    }
    void load()

    const channel = supabase.channel(`messages-${conversationId}`)
    channel.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload: { new: Record<string, unknown> }) => {
      const row = payload.new as Message
      if (row.conversation_id === conversationId) setMessages((s) => [row, ...s])
    })
    channel.subscribe()

    return () => { mounted = false; void supabase.removeChannel(channel) }
  }, [conversationId])

  const handleSend = async (text: string) => {
    // optimistic UI
    const temp = { id: `tmp-${Date.now()}`, body: text, created_at: new Date().toISOString(), sender_id: currentUserId }
    setMessages((s) => [temp as Message, ...s])
    try {
      const res = await fetch('/api/messages/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ conversationId, text }) })
      if (!res.ok) throw new Error('send failed')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="flex flex-col h-[70vh] bg-white rounded shadow p-3">
      <div className="border-b pb-3 mb-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold">Conversation</div>
            <div className="text-sm text-slate-500">Participants & presence</div>
          </div>
          <div className="text-sm text-slate-400">Online</div>
        </div>
      </div>

      <div className="flex-1 overflow-auto flex flex-col-reverse gap-3">
        <div ref={bottomRef} />
        {messages.map((m) => (
          <div key={m.id} className="w-full flex">
            <MessageBubble m={m} isOwn={m.sender_id === currentUserId} />
          </div>
        ))}
      </div>

      <div className="mt-3">
        <Composer onSend={handleSend} />
      </div>
    </div>
  )
}
