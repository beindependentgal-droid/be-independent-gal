'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Sparkles } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface SignUpFormProps {
  redirect?: string
  googleReturn?: boolean
}

function passwordStrength(password: string) {
  if (password.length > 10 && /[A-Z]/.test(password) && /[0-9]/.test(password)) return { label: 'Strong', score: 3 }
  if (password.length >= 8) return { label: 'Medium', score: 2 }
  if (password.length > 0) return { label: 'Weak', score: 1 }
  return { label: '', score: 0 }
}

export default function SignUpForm({ redirect = '/auth/onboarding/profile', googleReturn = false }: SignUpFormProps) {
  const router = useRouter()
  const { signUp, signInWithProvider } = useAuth()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [verificationSent, setVerificationSent] = useState(false)
  const [resendMessage, setResendMessage] = useState('')

  const strength = passwordStrength(password)

  const validate = () => {
    if (!firstName.trim()) {
      setError('Please enter your first name')
      return false
    }
    if (!lastName.trim()) {
      setError('Please enter your last name')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address')
      return false
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return false
    }
    if (!acceptedTerms) {
      setError('Please accept the terms to create your account')
      return false
    }
    return true
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    setResendMessage('')

    if (!validate()) return

    setLoading(true)
    try {
      await signUp(email, password, { first_name: firstName.trim(), last_name: lastName.trim() })
      setVerificationSent(true)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err ?? '').toLowerCase()

      if (message.includes('already') || message.includes('exists') || message.includes('registered')) {
        setError('This email is already registered. Please sign in or use a different email.')
      } else if (message.includes('rate limit')) {
        setError('Too many signup attempts. Please try again in a few minutes.')
      } else {
        setError(err instanceof Error ? err.message : 'Sign up failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setError('')
    setLoading(true)
    try {
      await signInWithProvider('google', redirect)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Google sign-in failed. Please try again.')
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResendMessage('')
    setLoading(true)
    try {
      await signUp(email, password, { first_name: firstName.trim(), last_name: lastName.trim() })
      setResendMessage('✓ Verification email resent. Please check your inbox.')
    } catch {
      setResendMessage('✗ Failed to resend. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (verificationSent) {
    return (
      <div className="w-full max-w-md rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="text-center">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-secondary- text-3xl">
            ✉️
          </div>
          <h2 className="text-2xl font-semibold text-slate-900">Check your email</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            We&apos;ve sent a verification link to <span className="font-semibold text-slate-900">{email}</span>.
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-sky-200 bg-sky-50 p-4">
          <p className="font-semibold text-sky-900">What happens next?</p>
          <ol className="mt-3 space-y-2 text-sm text-sky-900">
            <li>1. Open your inbox and spam folder.</li>
            <li>2. Click the verification link.</li>
            <li>3. You&apos;ll be taken to complete your profile.</li>
          </ol>
        </div>

        <div className="mt-6 space-y-3">
          <Button onClick={() => window.open('https://mail.google.com', '_blank')} className="h-12 w-full rounded-full bg-sky-600 font-semibold text-white hover:bg-sky-700">
            Open Gmail
          </Button>
          <Button onClick={handleResend} disabled={loading} variant="outline" className="h-12 w-full rounded-full font-semibold">
            {loading ? 'Resending...' : 'Resend verification email'}
          </Button>
          <Button onClick={() => router.push('/auth/login')} variant="ghost" className="h-12 w-full rounded-full font-semibold text-slate-600 hover:text-slate-900">
            Back to sign in
          </Button>
        </div>

        {resendMessage ? (
          <p className={`mt-4 text-center text-sm ${resendMessage.includes('✓') ? 'text-emerald-600' : 'text-rose-600'}`}>
            {resendMessage}
          </p>
        ) : null}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="w-full rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary- px-3 py-1 text-sm font-semibold text-secondary-">
          <Sparkles className="h-4 w-4" />
          Join the movement
        </div>
        <h2 className="text-2xl font-semibold text-slate-900">Create your BIG account</h2>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          Bring your voice, your work, and your ambition into a supportive community.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-sm font-medium text-slate-700">
            First name
          </Label>
          <Input id="firstName" type="text" value={firstName} onChange={(event) => setFirstName(event.target.value)} placeholder="Amina" disabled={loading} className="h-12 rounded-2xl border border-slate-200 px-4" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-sm font-medium text-slate-700">
            Last name
          </Label>
          <Input id="lastName" type="text" value={lastName} onChange={(event) => setLastName(event.target.value)} placeholder="Mwangi" disabled={loading} className="h-12 rounded-2xl border border-slate-200 px-4" />
        </div>
      </div>

      <div className="mt-5 space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-slate-700">
          Email address
        </Label>
        <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" disabled={loading} className="h-12 rounded-2xl border border-slate-200 px-4" />
      </div>

      <div className="mt-5 space-y-2">
        <Label htmlFor="password" className="text-sm font-medium text-slate-700">
          Password
        </Label>
        <div className="relative">
          <Input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Create a strong password" disabled={loading} className="h-12 rounded-2xl border border-slate-200 px-4 pr-12" />
          <button type="button" onClick={() => setShowPassword((current) => !current)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" aria-label={showPassword ? 'Hide password' : 'Show password'}>
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <div className="space-y-2">
          <div className="flex gap-1">
            <div className={`h-1.5 flex-1 rounded-full ${strength.score >= 1 ? 'bg-rose-500' : 'bg-slate-200'}`} />
            <div className={`h-1.5 flex-1 rounded-full ${strength.score >= 2 ? 'bg-amber-500' : 'bg-slate-200'}`} />
            <div className={`h-1.5 flex-1 rounded-full ${strength.score >= 3 ? 'bg-emerald-500' : 'bg-slate-200'}`} />
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Minimum 6 characters</span>
            {strength.label ? <span className={strength.score === 3 ? 'font-semibold text-emerald-600' : strength.score === 2 ? 'font-semibold text-amber-600' : 'font-semibold text-rose-600'}>{strength.label}</span> : null}
          </div>
        </div>
      </div>

      {googleReturn ? (
        <div className="mt-5 rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900">
          <p className="font-semibold">Finishing Google sign up</p>
          <p className="mt-1">Complete the rest of the form to create your BIG account.</p>
        </div>
      ) : null}

      <label className="mt-5 flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        <input type="checkbox" checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.target.checked)} className="mt-1 h-4 w-4 rounded border-slate-300 text-secondary- focus:ring-secondary-" />
        <span>
          I agree to the BIG community terms and privacy policy.
        </span>
      </label>

      {error ? (
        <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <Button type="submit" disabled={loading} className="mt-6 h-12 w-full rounded-full bg-secondary- font-semibold text-white hover:bg-secondary-">
        {loading ? 'Creating account...' : 'Create account'}
      </Button>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-sm text-slate-500">or</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <Button type="button" onClick={handleGoogleSignUp} disabled={loading} variant="outline" className="h-12 w-full rounded-full border-slate-300 font-semibold text-slate-700 hover:bg-slate-50">
        {loading ? 'Creating account...' : 'Continue with Google'}
      </Button>

      <p className="mt-6 text-center text-sm text-slate-600">
        Already have an account?{' '}
        <Link href="/auth/login" className="font-semibold text-secondary- hover:text-secondary-">
          Sign in
        </Link>
      </p>
    </form>
  )
}