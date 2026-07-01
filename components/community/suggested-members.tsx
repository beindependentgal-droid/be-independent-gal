'use client'

import Link from 'next/link'

const suggested = [
  { id: 's1', name: 'Zainab K.', role: 'Entrepreneur', avatar: '/placeholder.jpg' },
  { id: 's2', name: 'Grace M.', role: 'Designer', avatar: '/placeholder.jpg' },
  { id: 's3', name: 'Lydia O.', role: 'Coach', avatar: '/placeholder.jpg' },
]

export default function SuggestedMembers() {
  return (
    <div className="space-y-3">
      <h4 className="font-semibold">Suggested sisters</h4>
      <div className="grid gap-3">
        {suggested.map((s) => (
          <div key={s.id} className="flex items-center justify-between gap-3 rounded-lg bg-white/50 p-3 border border-white/10">
            <div className="flex items-center gap-3">
              <img src={s.avatar} alt="avatar" className="h-10 w-10 rounded-full object-cover" />
              <div>
                <div className="font-medium">{s.name}</div>
                <div className="text-sm text-foreground/70">{s.role}</div>
              </div>
            </div>
            <div>
              <Link href="#" className="text-sm rounded-full bg-primary px-3 py-1 text-primary-foreground">Follow</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
