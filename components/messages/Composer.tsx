"use client"

import React, { useEffect, useRef, useState } from 'react'
import { ImagePlus, Paperclip, Send, Smile, Sparkles } from 'lucide-react'

export default function Composer({ onSend, onTypingChange }: { onSend: (text: string) => void; onTypingChange?: (typing: boolean) => void }) {
  const [text, setText] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const submit = (event?: React.FormEvent) => {
    event?.preventDefault()
    const value = text.trim()
    if (!value) return
    onSend(value)
    setText('')
    setShowEmojiPicker(false)
  }

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    textarea.style.height = '0px'
    textarea.style.height = `${Math.min(140, textarea.scrollHeight)}px`
  }, [text])

  useEffect(() => {
    onTypingChange?.(text.trim().length > 0)
  }, [text, onTypingChange])

  const insertEmoji = (emoji: string) => {
    const textarea = textareaRef.current
    if (!textarea) {
      setText((current) => `${current}${emoji}`)
      return
    }

    const start = textarea.selectionStart ?? text.length
    const end = textarea.selectionEnd ?? text.length
    const updated = `${text.slice(0, start)}${emoji}${text.slice(end)}`
    setText(updated)
    requestAnimationFrame(() => {
      textarea.focus()
      const position = start + emoji.length
      textarea.selectionStart = position
      textarea.selectionEnd = position
    })
  }

  return (
    <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-3 shadow-sm">
      <form onSubmit={submit} className="space-y-3">
        <div className="flex items-end gap-2">
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setShowEmojiPicker((current) => !current)} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-violet-200 hover:text-violet-700">
              <Smile className="h-4 w-4" />
            </button>
            <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-violet-200 hover:text-violet-700">
              <Paperclip className="h-4 w-4" />
            </button>
            <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-violet-200 hover:text-violet-700">
              <ImagePlus className="h-4 w-4" />
            </button>
          </div>

          <textarea
            ref={textareaRef}
            value={text}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
                event.preventDefault()
                submit(event as unknown as React.FormEvent)
              }
            }}
            placeholder="Write a thoughtful message…"
            className="min-h-[48px] flex-1 resize-none rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700 outline-none transition focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
            rows={1}
          />

          <button type="submit" className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-violet-600 text-white shadow-sm transition hover:bg-violet-700">
            <Send className="h-4 w-4" />
          </button>
        </div>

        {showEmojiPicker && (
          <div className="grid grid-cols-6 gap-2 rounded-[18px] border border-slate-200 bg-white p-3">
            {['😊', '😍', '💡', '🙌', '🎉', '❤️', '🔥', '👏', '🤝', '✨', '💬', '🌟'].map((emoji) => (
              <button key={emoji} type="button" onClick={() => insertEmoji(emoji)} className="rounded-full p-2 text-xl transition hover:bg-slate-100">
                {emoji}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-violet-600" />
            Press Enter to send, Shift + Enter for a new line
          </span>
          <span>Rich messaging ready for future media upload</span>
        </div>
      </form>
    </div>
  )
}
