"use client"

import React, { useMemo, useState } from 'react'

type Conversation = {
  id: string
  title?: string
  last_message?: { body?: string; sender_avatar?: string }
  last_activity?: string
}

function ConversationItem({ conv, selected, onClick }: { conv: Conversation; selected: boolean; onClick: (id: string) => void }) {
  return (
    <div onClick={() => onClick(conv.id)} className={`p-3 flex items-center gap-3 cursor-pointer ${selected ? 'bg-violet-50' : 'hover:bg-slate-50'}`}>
      <img src={conv.last_message?.sender_avatar || '/images/avatar-placeholder.png'} className="w-10 h-10 rounded-full" alt="avatar" />
      <div className="flex-1">
        <div className="flex justify-between">
          <div className="font-medium">{conv.title || 'Conversation'}</div>
          <div className="text-xs text-slate-400">{new Date(conv.last_activity).toLocaleTimeString()}</div>
        </div>
        <div className="text-sm text-slate-500 truncate">{conv.last_message?.body || 'No messages yet'}</div>
      </div>
    </div>
  )
}

export default function Sidebar({ conversations, selected, onSelect }: { conversations: Conversation[]; selected: string | null; onSelect: (id: string) => void }) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query) return conversations
    return conversations.filter((c) => (c.title || '').toLowerCase().includes(query.toLowerCase()))
  }, [conversations, query])

  return (
    <div className="bg-white rounded shadow overflow-hidden">
      <div className="p-3 border-b">
        <div className="flex items-center gap-2">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search" className="flex-1 border rounded px-3 py-2 text-sm" />
          <button className="ml-2 rounded bg-violet-600 text-white px-3 py-2">New</button>
        </div>
      </div>
      <div className="max-h-[70vh] overflow-auto">
        {filtered.map((c) => (
          <ConversationItem key={c.id} conv={c} selected={c.id === selected} onClick={onSelect} />
        ))}
      </div>
    </div>
  )
}
