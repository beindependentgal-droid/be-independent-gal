'use client'

import { useEffect, useState } from 'react'

export default function CommunityActivity() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/community/posts')
        if (!res.ok) throw new Error('Failed to load community activity')
        const payload = await res.json()
        if (mounted) setPosts(Array.isArray(payload.posts) ? payload.posts.slice(0, 5) : [])
      } catch (e) {
        if (mounted) setPosts([])
      } finally { if (mounted) setLoading(false) }
    })()
    return () => { mounted = false }
  }, [])

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm border">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Community activity</p>
        <a href="/community" className="text-sm text-slate-600">View Community</a>
      </div>
      <div className="mt-3 space-y-3">
        {loading && <p className="text-sm text-slate-500">Loading recent posts…</p>}
        {!loading && posts.length === 0 && <p className="text-sm text-slate-500">No recent activity. Join a circle or start a conversation.</p>}
        {posts.map((p) => (
          <article key={p.id} className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs">{p.author?.charAt?.(0) ?? 'B'}</div>
            <div>
              <p className="text-sm font-medium">{p.author}</p>
              <p className="text-sm text-slate-600">{p.text}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
