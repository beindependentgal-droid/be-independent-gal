"use client"

import React, { useState, useRef } from 'react'

export default function Composer({ onSend }: { onSend: (text: string) => void }) {
  const [text, setText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault()
    const v = text.trim()
    if (!v) return
    onSend(v)
    setText('')
  }

  return (
    <form onSubmit={submit} className="flex items-center gap-2">
      <textarea ref={textareaRef} value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a message..." className="flex-1 border rounded px-3 py-2 text-sm resize-none" rows={2} />
      <button type="submit" className="rounded bg-violet-600 text-white px-4 py-2">Send</button>
    </form>
  )
}
