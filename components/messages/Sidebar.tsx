"use client"

import React, { useMemo, useState } from 'react'
import { Archive, MessageCircleMore, Pin, Search, Sparkles } from 'lucide-react'

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

type Filter = 'all' | 'unread' | 'club' | 'mentors' | 'circles' | 'community'

function formatPreviewTime(value?: string) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

function ConversationItem({
  conv,
  selected,
  onClick,
  onPin,
  onArchive,
  pinned,
}: {
  conv: Conversation
  selected: boolean
  onClick: (id: string) => void
  onPin: (id: string) => void
  onArchive: (id: string) => void
  pinned: boolean
}) {
  const preview = conv.last_message?.body || 'Start the conversation with a warm hello.'
  const displayTitle = conv.participant_name || conv.title || 'Conversation'
  const roleLabel = conv.category === 'mentors' ? 'Mentor' : conv.category === 'circles' ? 'Circle' : conv.category === 'club' ? 'BIG Club' : conv.category === 'community' ? 'Community' : 'Member'
  const badgeTone = conv.category === 'mentors' ? 'bg-violet-100 text-violet-700' : conv.category === 'circles' ? 'bg-amber-100 text-amber-700' : conv.category === 'club' ? 'bg-pink-100 text-pink-700' : 'bg-slate-100 text-slate-600'

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onClick(conv.id)
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick(conv.id)}
      onKeyDown={handleKeyDown}
      className={`group w-full rounded-[20px] border p-3 text-left transition-all duration-200 ${selected ? 'border-violet-200 bg-violet-50/70 shadow-sm' : 'border-transparent bg-white hover:-translate-y-0.5 hover:border-violet-100 hover:bg-slate-50'}`}
    >
      <div className="flex items-start gap-3">
        <div className="relative mt-0.5 shrink-0">
          <img
            src={conv.avatar_url || conv.last_message?.sender_avatar || '/images/member-placeholder.svg'}
            className="h-11 w-11 rounded-full object-cover"
            alt={displayTitle}
          />
          {conv.is_online && <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-semibold text-slate-900">{displayTitle}</p>
                {conv.is_typing && <span className="text-xs font-medium text-violet-600">typing…</span>}
              </div>
              <div className="mt-1 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-slate-500">
                <span className={`rounded-full px-2 py-0.5 ${badgeTone}`}>{roleLabel}</span>
                {conv.is_online ? <span className="text-emerald-600">active</span> : <span>away</span>}
              </div>
            </div>
            <span className="text-[11px] text-slate-400">{formatPreviewTime(conv.last_activity)}</span>
          </div>

          <div className="mt-2 flex items-center justify-between gap-2">
            <p className="truncate text-sm text-slate-600">{preview}</p>
            <div className="flex items-center gap-2">
              {conv.unread_count && conv.unread_count > 0 ? (
                <span className="rounded-full bg-violet-600 px-2.5 py-1 text-[11px] font-semibold text-white">{conv.unread_count}</span>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onPin(conv.id)
          }}
          className={`rounded-full p-1.5 ${pinned ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-500 hover:bg-violet-50 hover:text-violet-700'}`}
          aria-label="Pin conversation"
        >
          <Pin className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onArchive(conv.id)
          }}
          className="rounded-full bg-slate-100 p-1.5 text-slate-500 hover:bg-slate-200"
          aria-label="Archive conversation"
        >
          <Archive className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}

export default function Sidebar({ conversations, selected, onSelect }: { conversations: Conversation[]; selected: string | null; onSelect: (id: string) => void }) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [pinnedIds, setPinnedIds] = useState<string[]>([])
  const [archivedIds, setArchivedIds] = useState<string[]>([])

  const filtered = useMemo(() => {
    const base = conversations.filter((conversation) => !archivedIds.includes(conversation.id))
    const search = query.trim().toLowerCase()

    return base.filter((conversation) => {
      const title = `${conversation.title || ''} ${conversation.participant_name || ''} ${conversation.last_message?.body || ''}`.toLowerCase()
      const matchesQuery = !search || title.includes(search)
      const matchesFilter = (() => {
        if (filter === 'unread') return (conversation.unread_count || 0) > 0
        if (filter === 'club') return (conversation.category || '').includes('club')
        if (filter === 'mentors') return (conversation.category || '').includes('mentor')
        if (filter === 'circles') return (conversation.category || '').includes('circle')
        if (filter === 'community') return (conversation.category || '').includes('community') || (conversation.category || '').includes('social')
        return true
      })()
      return matchesQuery && matchesFilter
    })
  }, [archivedIds, conversations, filter, query])

  const sorted = useMemo(() => {
    const pinned = filtered.filter((conversation) => pinnedIds.includes(conversation.id))
    const rest = filtered.filter((conversation) => !pinnedIds.includes(conversation.id))
    return [...pinned, ...rest]
  }, [filtered, pinnedIds])

  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_20px_60px_-24px_rgba(15,23,42,0.18)]">
      <div className="border-b border-slate-200 bg-gradient-to-r from-violet-50 to-fuchsia-50 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-700">Inbox</p>
            <h2 className="mt-1 text-lg font-semibold text-slate-900">Conversations</h2>
          </div>
          <div className="rounded-full bg-white p-2 text-violet-700 shadow-sm">
            <MessageCircleMore className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search conversations"
            className="w-full bg-transparent text-sm text-slate-700 outline-none"
          />
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {([
            { id: 'all', label: 'All' },
            { id: 'unread', label: 'Unread' },
            { id: 'mentors', label: 'Mentors' },
            { id: 'circles', label: 'Circles' },
            { id: 'club', label: 'BIG Club' },
            { id: 'community', label: 'Community' },
          ] as Array<{ id: Filter; label: string }>).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] transition ${filter === item.id ? 'bg-violet-600 text-white' : 'bg-white text-slate-600 hover:bg-violet-50 hover:text-violet-700'}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-h-[70vh] space-y-2 overflow-auto p-3">
        {sorted.length > 0 ? (
          sorted.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conv={conversation}
              selected={conversation.id === selected}
              onClick={onSelect}
              pinned={pinnedIds.includes(conversation.id)}
              onPin={(id) => setPinnedIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))}
              onArchive={(id) => setArchivedIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))}
            />
          ))
        ) : (
          <div className="rounded-[20px] border border-dashed border-slate-300 bg-slate-50 p-5 text-center text-sm text-slate-600">
            <div className="mb-2 flex justify-center text-violet-600">
              <Sparkles className="h-5 w-5" />
            </div>
            <p className="font-semibold text-slate-900">No conversations yet</p>
            <p className="mt-2 leading-6">Start connecting with mentors, circle members, and fellow BIG women.</p>
          </div>
        )}
      </div>
    </div>
  )
}
