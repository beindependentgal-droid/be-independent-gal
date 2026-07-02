'use client'

import { useEffect, useState } from 'react'

const ROTATIONS = [
  { type: 'quote', text: 'Small consistent steps lead to big change.' },
  { type: 'story', text: 'A member landed a scholarship this week — celebrate wins!' },
  { type: 'reminder', text: 'Spend 15 minutes today on your course to keep momentum.' },
]

export default function MotivationCard() {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % ROTATIONS.length), 8000)
    return () => clearInterval(t)
  }, [])

  const item = ROTATIONS[idx]

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm border">
      <p className="text-sm font-semibold">Daily motivation</p>
      <div className="mt-3">
        <p className="text-sm text-slate-700">{item.text}</p>
      </div>
    </div>
  )
}
