'use client'

import { useState, type FormEvent } from 'react'
import { Heart, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const presets = [500, 1000, 2500, 5000]

export function DonateWidget() {
  const [amount, setAmount] = useState<number | null>(1000)
  const [custom, setCustom] = useState('')
  const [frequency, setFrequency] = useState<'once' | 'monthly'>('once')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center rounded-2xl bg-card p-10 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Check className="h-7 w-7" />
        </span>
        <h3 className="mt-4 font-heading text-xl font-bold text-secondary">
          Thank you for your generosity!
        </h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          Your support helps more women learn, connect, grow, and rise. We&apos;ll
          email you the details to complete your donation.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl bg-card p-6 sm:p-8">
      <div className="flex rounded-full bg-muted p-1">
        {(['once', 'monthly'] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFrequency(f)}
            className={cn(
              'flex-1 rounded-full px-4 py-2 text-sm font-semibold capitalize transition-colors',
              frequency === f
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {f === 'once' ? 'One-time' : 'Monthly'}
          </button>
        ))}
      </div>

      <p className="mt-6 text-sm font-medium text-foreground">
        Choose an amount (KES)
      </p>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {presets.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => {
              setAmount(p)
              setCustom('')
            }}
            className={cn(
              'rounded-xl border-2 px-3 py-3 text-sm font-bold transition-colors',
              amount === p && !custom
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border text-foreground hover:border-primary/50',
            )}
          >
            {p.toLocaleString()}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-2">
        <Label htmlFor="custom">Or enter a custom amount</Label>
        <Input
          id="custom"
          inputMode="numeric"
          placeholder="Custom amount"
          value={custom}
          onChange={(e) => {
            setCustom(e.target.value.replace(/[^0-9]/g, ''))
            setAmount(null)
          }}
        />
      </div>

      <Button
        type="submit"
        size="lg"
        className="mt-6 w-full rounded-full bg-primary font-semibold text-primary-foreground hover:bg-primary/90"
      >
        <Heart className="mr-1 h-4 w-4" />
        Donate{' '}
        {custom
          ? `KES ${Number(custom).toLocaleString()}`
          : amount
            ? `KES ${amount.toLocaleString()}`
            : ''}
        {frequency === 'monthly' ? ' / month' : ''}
      </Button>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        Secure donation. You can cancel a monthly gift anytime.
      </p>
    </form>
  )
}
