'use client'

import { type FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
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

interface JoinFormProps {
  redirect?: string
}

export function JoinForm({ redirect = '/community' }: JoinFormProps) {
  const router = useRouter()
  const [email, setEmail] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const queryParams: string[] = []

    if (email) {
      queryParams.push(`email=${encodeURIComponent(email)}`)
    }
    queryParams.push(`redirect=${encodeURIComponent(redirect)}`)

    router.push(`/auth/sign-up?${queryParams.join('&')}`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-card p-6 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="fullName">Full name</Label>
          <Input id="fullName" name="fullName" required placeholder="Amina W." />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input id="phone" name="phone" type="tel" placeholder="+254 700 000000" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" placeholder="Nairobi, Kenya" />
        </div>
        <div className="grid gap-2 sm:col-span-2">
          <Label htmlFor="interest">I&apos;m most interested in</Label>
          <Select name="interest">
            <SelectTrigger id="interest">
              <SelectValue placeholder="Choose an area" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mentorship">Mentorship</SelectItem>
              <SelectItem value="workshops">Skills & workshops</SelectItem>
              <SelectItem value="entrepreneurship">Entrepreneurship</SelectItem>
              <SelectItem value="wellness">Wellness & self-care</SelectItem>
              <SelectItem value="community">Community & events</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2 sm:col-span-2">
          <Label htmlFor="message">Anything you&apos;d like us to know? (optional)</Label>
          <Textarea
            id="message"
            name="message"
            rows={3}
            placeholder="Tell us a little about yourself and your goals."
          />
        </div>
      </div>
      <Button
        type="submit"
        size="lg"
        className="mt-6 w-full rounded-full bg-primary font-semibold text-primary-foreground hover:bg-primary/90"
      >
        Start my membership
      </Button>
    </form>
  )
}
