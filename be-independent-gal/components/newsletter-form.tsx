'use client'

import { useState, type FormEvent } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export function NewsletterForm({
  variant = 'footer',
}: {
  variant?: 'footer' | 'light'
}) {
  const [submitted, setSubmitted] = useState(false)
  const isFooter = variant === 'footer'

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <p
        className={cn(
          'flex items-center gap-2 text-sm font-medium',
          isFooter ? 'text-accent' : 'text-primary',
        )}
      >
        <Check className="h-4 w-4" /> You&apos;re in! Watch your inbox.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
      <Input
        type="email"
        required
        placeholder="Your email address"
        aria-label="Email address"
        className={cn(
          'h-11 rounded-full',
          isFooter
            ? 'border-white/20 bg-white/10 text-secondary-foreground placeholder:text-secondary-foreground/50'
            : 'bg-card',
        )}
      />
      <Button
        type="submit"
        className="h-11 shrink-0 rounded-full bg-primary px-5 font-semibold text-primary-foreground hover:bg-primary/90"
      >
        Subscribe
        <ArrowRight className="ml-1 h-4 w-4" />
      </Button>
    </form>
  )
}
