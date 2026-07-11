"use client"

import React, { useEffect, useState } from 'react'

type Profile = {
  id: string
  first_name?: string
  last_name?: string
  avatar_url?: string
  profession?: string
  city?: string
}

export default function SuggestedMembersClient({ currentUserId }: { currentUserId: string }) {
  const [members, setMembers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/profiles/suggested')
      if (!res.ok) throw new Error('failed')
      const json = await res.json()
      setMembers(json.members || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let mounted = true
    ;(async () => {
      if (!mounted) return
      await load()
    })()
    const id = setInterval(() => void load(), 30_000)
    return () => {
      mounted = false
      clearInterval(id)
    }
  }, [currentUserId])

  if (loading) return <div className="p-4 text-sm text-slate-500">Loading…</div>
  if (!members || members.length === 0) return <div className="p-4 text-sm text-slate-500">No suggestions</div>

  return (
    <div className="space-y-3">
      {members.map((m) => (
        <div key={m.id} className="flex items-center justify-between gap-3 p-2 border rounded">
          <div className="flex items-center gap-3">
            <img src={m.avatar_url || '/images/member-placeholder.svg'} alt="avatar" className="w-10 h-10 rounded-full" />
            <div>
              <div className="font-medium">{m.first_name} {m.last_name}</div>
              <div className="text-xs text-slate-500">{m.profession || m.city}</div>
            </div>
          </div>
          <div>
            <button className="rounded-full bg-violet-600 px-3 py-1 text-white">Connect</button>
          </div>
        </div>
      ))}
    </div>
  )
}
