'use client'

import { useEffect, useState } from 'react'

export default function ContinueLearning() {
  const [course, setCourse] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/academy/current')
        if (!res.ok) throw new Error('no')
        const json = await res.json()
        if (mounted) setCourse(json)
      } catch (e) {
        if (mounted) setCourse(null)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  if (loading) return <div className="rounded-xl bg-white p-4 shadow-sm border h-28">Loading learning…</div>

  if (!course) {
    return (
      <div className="rounded-xl bg-white p-4 shadow-sm border">
        <p className="text-sm font-semibold">Continue learning</p>
        <p className="mt-2 text-sm text-slate-600">No active course. <a href="/academy" className="text-secondary font-medium">Explore Academy</a></p>
      </div>
    )
  }

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm border">
      <p className="text-sm font-semibold">Continue learning</p>
      <h3 className="mt-2 font-semibold">{course.title}</h3>
      <div className="mt-3 h-2 w-full bg-slate-100 rounded-full">
        <div style={{ width: `${Math.round((course.progress || 0) * 100)}%` }} className="h-2 bg-secondary rounded-full" />
      </div>
      <div className="mt-3 flex items-center gap-3">
        <a href={`/academy/${course.id}`} className="rounded-full bg-secondary text-white px-4 py-2 text-sm">Resume Learning</a>
        <a href="/academy" className="text-sm text-slate-600">Browse courses</a>
      </div>
    </div>
  )
}
