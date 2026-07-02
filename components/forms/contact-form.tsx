'use client'

import { useState, type FormEvent } from 'react'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [subject, setSubject] = useState('')
  const [department, setDepartment] = useState('general')
  const [message, setMessage] = useState('')
  const [preferred, setPreferred] = useState<'email' | 'phone' | 'whatsapp'>('email')
  const [attachment, setAttachment] = useState<File | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name || !email || !subject || !message) {
      setError('Please complete all required fields.')
      setStatus('error')
      return
    }

    setStatus('loading')
    setError('')

    try {
      let response
      if (attachment) {
        const fd = new FormData()
        fd.append('name', name)
        fd.append('email', email)
        fd.append('phone', phone)
        fd.append('subject', subject)
        fd.append('department', department)
        fd.append('preferred', preferred)
        fd.append('message', message)
        fd.append('attachment', attachment)

        response = await fetch('/api/contact', {
          method: 'POST',
          body: fd,
        })
      } else {
        response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, phone, subject, department, preferred, message }),
        })
      }
      const result = await response.json()

      if (!response.ok) {
        setError(result?.error || 'Something went wrong. Please try again.')
        setStatus('error')
        return
      }

      setStatus('success')
    } catch {
      setError('Unable to send your message right now. Please try again later.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-border bg-card p-10 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary animate-[pulse_1.2s_infinite]"><Check className="h-7 w-7" /></span>
        <h3 className="mt-4 font-heading text-xl font-bold text-secondary">Message sent!</h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">✅ Thank you! We&apos;ve received your message and will respond within one business day.</p>
        <button
          onClick={() => {
            setName('')
            setEmail('')
            setPhone('')
            setSubject('')
            setDepartment('general')
            setPreferred('email')
            setMessage('')
            setAttachment(null)
            setStatus('idle')
          }}
          className="mt-6 text-sm text-primary underline"
        >Send another message</button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" name="name" required placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email address</Label>
          <Input id="email" name="email" type="email" required placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input id="phone" name="phone" placeholder="+254 7xx xxx xxx" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="department">Department</Label>
          <Select name="department" value={department} onValueChange={(v) => v && setDepartment(v)}>
            <SelectTrigger id="department"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General Support</SelectItem>
              <SelectItem value="membership">Membership</SelectItem>
              <SelectItem value="partnership">Partnerships</SelectItem>
              <SelectItem value="academy">Academy</SelectItem>
              <SelectItem value="events">Events</SelectItem>
              <SelectItem value="media">Media</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="sm:col-span-2 grid gap-2">
          <Label htmlFor="subject">Subject</Label>
          <Input id="subject" name="subject" required placeholder="Short subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
        </div>

        <div className="sm:col-span-2 grid gap-2">
          <Label htmlFor="message">Message</Label>
          <Textarea id="message" name="message" required rows={6} placeholder="How can we help?" value={message} onChange={(e) => setMessage(e.target.value)} />
        </div>

        <div className="sm:col-span-2 grid gap-2">
          <Label>Preferred contact method</Label>
          <div className="flex gap-4 items-center">
            <label className="inline-flex items-center gap-2">
              <input type="radio" name="preferred" checked={preferred === 'email'} onChange={() => setPreferred('email')} />
              <span className="text-sm">Email</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input type="radio" name="preferred" checked={preferred === 'phone'} onChange={() => setPreferred('phone')} />
              <span className="text-sm">Phone</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input type="radio" name="preferred" checked={preferred === 'whatsapp'} onChange={() => setPreferred('whatsapp')} />
              <span className="text-sm">WhatsApp</span>
            </label>
          </div>
        </div>

        <div className="grid gap-2 sm:col-span-2">
          <Label htmlFor="attachment">Attachment (optional)</Label>
          <input id="attachment" name="attachment" type="file" onChange={(e) => setAttachment(e.target.files?.[0] ?? null)} className="text-sm" />
        </div>
      </div>

      {status === 'error' && <p className="mt-4 text-sm text-destructive">{error}</p>}

      <div className="mt-6 flex gap-3">
        <Button type="submit" size="lg" disabled={status === 'loading'} className="flex-1 rounded-full bg-primary font-semibold text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60">{status === 'loading' ? 'Sending...' : 'Send Message'}</Button>
        <Button type="button" variant="ghost" onClick={() => { setName(''); setEmail(''); setPhone(''); setSubject(''); setDepartment('general'); setPreferred('email'); setMessage(''); setAttachment(null); setError(''); setStatus('idle'); }} className="rounded-full">Clear</Button>
      </div>
    </form>
  )
}
