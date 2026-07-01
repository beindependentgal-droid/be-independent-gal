'use client'

import { useState, type FormEvent } from 'react'
import { CheckCircle2, Sparkles } from 'lucide-react'
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

type FormValues = {
  fullName: string
  email: string
  role: string
  experience: string
  goals: string
  updates: boolean
}

const initialValues: FormValues = {
  fullName: '',
  email: '',
  role: '',
  experience: '',
  goals: '',
  updates: true,
}

export function GoogleForm() {
  const [values, setValues] = useState<FormValues>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({})
  const [submitted, setSubmitted] = useState(false)

  function updateField<K extends keyof FormValues>(field: K, value: FormValues[K]) {
    setValues((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function validate(valuesToCheck: FormValues) {
    const nextErrors: Partial<Record<keyof FormValues, string>> = {}

    if (!valuesToCheck.fullName.trim()) {
      nextErrors.fullName = 'Please enter your full name.'
    }

    if (!valuesToCheck.email.trim()) {
      nextErrors.email = 'Please enter your email address.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valuesToCheck.email)) {
      nextErrors.email = 'Please enter a valid email address.'
    }

    if (!valuesToCheck.role) {
      nextErrors.role = 'Please choose how you relate to BIG.'
    }

    if (!valuesToCheck.experience.trim()) {
      nextErrors.experience = 'Please share a little about your background.'
    }

    if (!valuesToCheck.goals.trim()) {
      nextErrors.goals = 'Please tell us what you hope to gain.'
    }

    return nextErrors
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors = validate(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="rounded-[28px] border border-emerald-200 bg-emerald-50 p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h2 className="mt-5 text-2xl font-semibold text-slate-900">
          Thanks for sharing your story.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600">
          Your response has been captured. We will keep you posted with updates, opportunities, and community invites that match your goals.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-6"
          onClick={() => {
            setSubmitted(false)
            setValues(initialValues)
            setErrors({})
          }}
        >
          Submit another response
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-pink-100 px-3 py-1 text-sm font-semibold text-pink-700">
              <Sparkles className="h-4 w-4" />
              Google Forms-inspired
            </div>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">
              Community Interest Form
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
              Tell us a little about yourself so we can connect you with the right circles, programs, and opportunities.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <p className="font-semibold text-slate-900">6 questions</p>
            <p>Quick and easy</p>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full name</Label>
            <Input
              id="fullName"
              value={values.fullName}
              onChange={(event) => updateField('fullName', event.target.value)}
              placeholder="Amina Mwangi"
            />
            {errors.fullName ? <p className="text-sm text-rose-600">{errors.fullName}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              value={values.email}
              onChange={(event) => updateField('email', event.target.value)}
              placeholder="you@example.com"
            />
            {errors.email ? <p className="text-sm text-rose-600">{errors.email}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">How do you relate to BIG?</Label>
            <Select
              value={values.role}
              onValueChange={(value) => updateField('role', value ?? '')}
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Choose one" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="founder">Founder or entrepreneur</SelectItem>
                <SelectItem value="student">Student or early career professional</SelectItem>
                <SelectItem value="creative">Creative professional</SelectItem>
                <SelectItem value="mentor">Mentor or supporter</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.role ? <p className="text-sm text-rose-600">{errors.role}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience">What experience or strengths would you like to share?</Label>
            <Textarea
              id="experience"
              rows={4}
              value={values.experience}
              onChange={(event) => updateField('experience', event.target.value)}
              placeholder="Tell us about your background, skills, or areas of expertise."
            />
            {errors.experience ? <p className="text-sm text-rose-600">{errors.experience}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="goals">What do you hope to gain from BIG?</Label>
            <Textarea
              id="goals"
              rows={4}
              value={values.goals}
              onChange={(event) => updateField('goals', event.target.value)}
              placeholder="For example: mentorship, funding opportunities, community, or confidence."
            />
            {errors.goals ? <p className="text-sm text-rose-600">{errors.goals}</p> : null}
          </div>

          <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <input
              type="checkbox"
              checked={values.updates}
              onChange={(event) => updateField('updates', event.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-pink-600 focus:ring-pink-500"
            />
            <span className="text-sm leading-7 text-slate-600">
              Yes, keep me updated with events, learning opportunities, and community invitations.
            </span>
          </label>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-600">
          Your answers are private and only shared with the BIG team.
        </p>
        <Button type="submit" className="rounded-full bg-pink-600 px-6 hover:bg-pink-700">
          Submit form
        </Button>
      </div>
    </form>
  )
}
