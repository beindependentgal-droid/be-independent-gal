"use client"

import { useEffect, useState } from 'react'

export default function DetailActions({ id, title }: { id: string; title: string }) {
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem('saved_ops') || '[]') as string[]
      setSaved(s.includes(id))
    } catch {
      setSaved(false)
    }
  }, [id])

  const toggleSave = () => {
    try {
      const s = JSON.parse(localStorage.getItem('saved_ops') || '[]') as string[]
      if (s.includes(id)) {
        const ns = s.filter((x) => x !== id)
        localStorage.setItem('saved_ops', JSON.stringify(ns))
        setSaved(false)
      } else {
        s.push(id)
        localStorage.setItem('saved_ops', JSON.stringify(s))
        setSaved(true)
      }
    } catch {
      localStorage.setItem('saved_ops', JSON.stringify([id]))
      setSaved(true)
    }
  }

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title, url })
      } catch (e) {
        // ignore
      }
    } else {
      await navigator.clipboard.writeText(url)
      // simple feedback
      // eslint-disable-next-line no-alert
      alert('Link copied to clipboard')
    }
  }

  return (
    <div className="flex gap-3">
      <a href="#apply" className="rounded-md bg-pink-600 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-700">Apply Now</a>
      <button onClick={toggleSave} className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm">{saved ? 'Saved' : 'Save'}</button>
      <button onClick={handleShare} className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm">Share</button>
    </div>
  )
}
