'use client'

import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle2, FileText, Loader2, Save, Sparkles } from 'lucide-react'
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

type ContactMethod = 'email' | 'sms' | 'both'

type FormValues = {
  fullName: string
  email: string
  role: string
  experience: string
  goals: string
  interests: string[]
  contactMethod: ContactMethod
  updates: boolean
}

const interestOptions = [
  'Mentorship',
  'Funding',
  'Community circles',
  'Workshops',
  'Leadership',
  'Networking',
]

const initialValues: FormValues = {
  fullName: '',
  email: '',
  role: '',
  experience: '',
  goals: '',
  interests: [],
  contactMethod: 'email',
  updates: true,
}

const STORAGE_KEY = 'big-google-form-draft'
const stepLabels = ['About you', 'Your goals', 'Preferences'] as const

export function GoogleForm() {
  const [values, setValues] = useState<FormValues>(() => {
    if (typeof window === 'undefined') {
      return initialValues
    }

    try {
      const rawDraft = window.localStorage.getItem(STORAGE_KEY)
      if (!rawDraft) {
        return initialValues
      }

      const parsedDraft = JSON.parse(rawDraft) as Partial<FormValues>
      return {
        ...initialValues,
        ...parsedDraft,
        interests: Array.isArray(parsedDraft.interests) ? parsedDraft.interests : initialValues.interests,
      }
    } catch {
      return initialValues
    }
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({})
  const [submitted, setSubmitted] = useState(false)
  const [step, setStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [draftStatus, setDraftStatus] = useState<'idle' | 'saved' | 'restored'>(() => {
    if (typeof window === 'undefined') {
      return 'idle'
    }

    try {
      return window.localStorage.getItem(STORAGE_KEY) ? 'restored' : 'idle'
    } catch {
      return 'idle'
    }
  })
  const [hasInteracted, setHasInteracted] = useState(false)

  useEffect(() => {
    if (!hasInteracted || submitted) {
      return
    }

    const timeout = window.setTimeout(() => {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(values))
      setDraftStatus('saved')
    }, 350)

    return () => window.clearTimeout(timeout)
  }, [values, submitted, hasInteracted])

  const progressPercent = useMemo(() => ((step + 1) / stepLabels.length) * 100, [step])

  function updateField<K extends keyof FormValues>(field: K, value: FormValues[K]) {
    setHasInteracted(true)
    setValues((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function toggleInterest(interest: string) {
    setHasInteracted(true)
    setValues((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((item) => item !== interest)
        : [...prev.interests, interest],
    }))
  }

  function validateStep(stepIndex: number) {
    const nextErrors: Partial<Record<keyof FormValues, string>> = {}

    if (stepIndex === 0) {
      if (!values.fullName.trim()) {
        nextErrors.fullName = 'Please enter your full name.'
      }

      if (!values.email.trim()) {
        nextErrors.email = 'Please enter your email address.'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        nextErrors.email = 'Please enter a valid email address.'
      }

      if (!values.role) {
        nextErrors.role = 'Please choose how you relate to BIG.'
      }
    }

    if (stepIndex === 1) {
      if (!values.experience.trim()) {
        nextErrors.experience = 'Please share a little about your background.'
      }

      if (!values.goals.trim()) {
        nextErrors.goals = 'Please tell us what you hope to gain.'
      }
    }

    setErrors(nextErrors)
    return nextErrors
  }

  function handleNext() {
    const nextErrors = validateStep(step)
    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setStep((prev) => Math.min(prev + 1, stepLabels.length - 1))
  }

  function handleBack() {
    setStep((prev) => Math.max(prev - 1, 0))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors = validateStep(step)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      setStep(0)
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const response = await fetch('/api/forms/google-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      const result = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(result?.error || 'Submission failed. Please try again.')
      }

      window.localStorage.removeItem(STORAGE_KEY)
      setSubmitted(true)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Submission failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function resetForm() {
    setSubmitted(false)
    setValues(initialValues)
    setErrors({})
    setStep(0)
    setDraftStatus('idle')
    setHasInteracted(false)
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
        <Button type="button" variant="outline" className="mt-6" onClick={resetForm}>
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
              Multi-step experience
            </div>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">
              Community Interest Form
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
              A richer intake flow with progress tracking, draft saving, and tailored follow-up options for BIG.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <p className="font-semibold text-slate-900">{step + 1} of {stepLabels.length}</p>
            <p>{stepLabels[step]}</p>
          </div>
        </div>

        <div className="mt-6">
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-pink-600 transition-all" style={{ width: `${progressPercent}%` }} />
          </div>
          <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
            <span>{stepLabels[step]}</span>
            <span className="inline-flex items-center gap-2">
              <Save className="h-4 w-4" />
              {draftStatus === 'restored' ? 'Draft restored' : draftStatus === 'saved' ? 'Draft saved locally' : 'Autosave ready'}
            </span>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          {step === 0 && (
            <>
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
                <Select value={values.role} onValueChange={(value) => updateField('role', value ?? '')}>
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
            </>
          )}

          {step === 1 && (
            <>
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

              <div className="space-y-3">
                <Label>Pick the topics you want to explore</Label>
                <div className="flex flex-wrap gap-2">
                  {interestOptions.map((interest) => {
                    const selected = values.interests.includes(interest)
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`rounded-full border px-3 py-2 text-sm font-medium transition ${selected ? 'border-pink-600 bg-pink-600 text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-pink-300 hover:text-pink-600'}`}
                      >
                        {interest}
                      </button>
                    )
                  })}
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="space-y-3">
                <Label>How should we contact you?</Label>
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    { value: 'email', label: 'Email' },
                    { value: 'sms', label: 'SMS' },
                    { value: 'both', label: 'Both' },
                  ].map((option) => (
                    <label key={option.value} className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 ${values.contactMethod === option.value ? 'border-pink-600 bg-pink-50' : 'border-slate-200 bg-white'}`}>
                      <input
                        type="radio"
                        name="contactMethod"
                        checked={values.contactMethod === option.value}
                        onChange={() => updateField('contactMethod', option.value as ContactMethod)}
                        className="h-4 w-4 border-slate-300 text-pink-600 focus:ring-pink-500"
                      />
                      <span className="text-sm font-medium text-slate-700">{option.label}</span>
                    </label>
                  ))}
                </div>
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

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <FileText className="h-4 w-4 text-pink-600" />
                  Review your answers
                </div>
                <div className="mt-3 space-y-2 text-sm leading-7 text-slate-600">
                  <p><span className="font-semibold text-slate-900">Name:</span> {values.fullName || 'Not provided'}</p>
                  <p><span className="font-semibold text-slate-900">Email:</span> {values.email || 'Not provided'}</p>
                  <p><span className="font-semibold text-slate-900">Focus areas:</span> {values.interests.length > 0 ? values.interests.join(', ') : 'None selected'}</p>
                  <p><span className="font-semibold text-slate-900">Contact preference:</span> {values.contactMethod}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
        <div>
          <p className="text-sm text-slate-600">
            Your answers are private and only shared with the BIG team.
          </p>
          {submitError ? <p className="mt-1 text-sm text-rose-600">{submitError}</p> : null}
        </div>
        <div className="flex gap-3">
          {step > 0 ? (
            <Button type="button" variant="outline" onClick={handleBack} className="rounded-full">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          ) : null}
          {step < stepLabels.length - 1 ? (
            <Button type="button" onClick={handleNext} className="rounded-full bg-pink-600 px-6 hover:bg-pink-700">
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" className="rounded-full bg-pink-600 px-6 hover:bg-pink-700" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </span>
              ) : (
                'Submit form'
              )}
            </Button>
          )}
        </div>
      </div>
    </form>
  )
}
