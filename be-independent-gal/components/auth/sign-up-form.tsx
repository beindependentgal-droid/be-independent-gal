'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface SignUpFormProps {
  redirect?: string
  googleReturn?: boolean
}

function passwordStrength(pw: string) {
  if (pw.length > 10 && /[A-Z]/.test(pw) && /[0-9]/.test(pw)) return { label: 'Strong', score: 3 }
  if (pw.length >= 8) return { label: 'Medium', score: 2 }
  if (pw.length > 0) return { label: 'Weak', score: 1 }
  return { label: '', score: 0 }
}

export default function SignUpForm({ redirect = '/community', googleReturn = false }: SignUpFormProps) {
  const router = useRouter()
  const { signUp, signIn, signInWithProvider } = useAuth()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [verificationSent, setVerificationSent] = useState(false)
  const [resendMessage, setResendMessage] = useState('')

  const strength = passwordStrength(password)

  const validate = () => {
    if (!firstName.trim() || !lastName.trim()) {
      setError('Please provide your first and last name')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email')
      return false
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return false
    }
    return true
  }

  const handleGoogle = async () => {
    setError('')
    setLoading(true)
    try {
      const nextPath = `/auth/sign-up?redirect=${encodeURIComponent(redirect)}&from=google`;
      await signInWithProvider('google', nextPath)
    } catch (err: any) {
      setError(err?.message || 'Google sign-in could not be started. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setResendMessage('')

    if (!validate()) return

    setLoading(true)
    try {
      await signUp(email, password)

      // Try to sign in immediately. If confirmation required, show verification screen.
      try {
        await signIn(email, password)
        router.push(redirect)
      } catch (signInErr: any) {
        const msg = String(signInErr?.message || '').toLowerCase()
        if (msg.includes('confirm') || msg.includes('verify') || msg.includes('verification')) {
          setVerificationSent(true)
        } else {
          setError(signInErr?.message || 'Sign up succeeded but sign in failed')
        }
      }
    } catch (err: any) {
      const message = String(err?.message || '').toLowerCase()

      if (message.includes('already') || message.includes('exists') || message.includes('registered') || message.includes('user already')) {
        setError('This email is already registered. Please sign in or use a different email.')
      } else if (message.includes('rate limit')) {
        setError('Too many signup attempts right now. Please try again shortly or sign in if you already have an account.')
      } else {
        setError(err?.message || 'Sign up failed')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResendMessage('')
    setLoading(true)
    try {
      await signUp(email, password) // trigger resend if Supabase supports
      setResendMessage('Verification email resent')
    } catch (err: any) {
      setResendMessage('Failed to resend verification')
    } finally {
      setLoading(false)
    }
  }

  if (verificationSent) {
    return (
      <div className="p-6 text-center">
        <img src="/images/big.svg" alt="BIG logo" className="mx-auto h-12 w-12 rounded-full mb-4" />
        <div className="text-3xl bg-gradient-to-r from-[#4B0082] via-[#7B2CBF] to-[#F59E0B] bg-clip-text text-transparent">🎉 Welcome to BIG!</div>
        <p className="mt-4 text-sm text-foreground/70">We've sent a verification email to <strong>{email}</strong>. Please verify your email before entering the community.</p>
        <div className="mt-6 space-y-3">
          <a href={`mailto:${email}`} className="block rounded-full bg-gradient-to-r from-[#4B0082] via-[#7B2CBF] to-[#F59E0B] text-white py-3">Open Email App</a>
          <button onClick={handleResend} className="block w-full rounded-full bg-white/10 py-3">Resend Email</button>
          <button onClick={() => router.push(`/auth/login?redirect=${encodeURIComponent(redirect)}`)} className="block w-full rounded-full border border-white/10 py-3">Back to Login</button>
        </div>
        {resendMessage && <div className="mt-3 text-sm">{resendMessage}</div>}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center">
        <img
          src="/images/big.svg"
          onError={(e) => ((e.target as HTMLImageElement).src = '/images/big-logo-placeholder.svg')}
          alt="BIG logo"
          className="mx-auto h-12 w-12 rounded-full mb-3"
        />
        <div className="text-lg font-semibold bg-gradient-to-r from-[#4B0082] via-[#7B2CBF] to-[#F59E0B] bg-clip-text text-transparent">Become a BIG Member</div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Amina" className="h-14 rounded-2xl px-4" />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="W." className="h-14 rounded-2xl px-4" />
        </div>
      </div>

      <div>
        <Label htmlFor="email">Email Address</Label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@big.org" className="h-14 rounded-2xl px-4" />
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a secure password" className="h-14 rounded-2xl pr-28 px-4" />
          <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-foreground/70">{showPassword ? 'Hide' : 'Show'}</button>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <div className={`h-2 w-12 rounded ${strength.score>=1? 'bg-pink-500':'bg-slate-200'}`}></div>
            <div className={`h-2 w-12 rounded ${strength.score>=2? 'bg-[#7B2CBF]':''}`}></div>
            <div className={`h-2 w-12 rounded ${strength.score>=3? 'bg-[#F59E0B]':''}`}></div>
            <span className="ml-2 text-foreground/70">{strength.label}</span>
          </div>
          <div className="text-foreground/60">Minimum 6 characters</div>
        </div>
      </div>

      {googleReturn && (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm text-primary">
          Continuing Google sign-up. Finish creating your account to become a BIG Member.
        </div>
      )}

      {error && <div className="text-sm text-red-600">{error}</div>}

      <div className="space-y-3">
        <Button type="submit" disabled={loading} className="w-full h-14 rounded-full bg-primary text-white shadow-md transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_rgba(91,33,182,0.4)]">
          {loading ? 'Creating account...' : 'Become a BIG Member →'}
        </Button>

        <Button type="button" variant="secondary" onClick={handleGoogle} className="w-full h-14 rounded-full border border-border/20 bg-white/5 text-foreground">
          Continue with Google
        </Button>

        <div className="flex items-center gap-3">
          <hr className="flex-1 border-border/30" />
          <div className="text-sm text-foreground/60">OR</div>
          <hr className="flex-1 border-border/30" />
        </div>

        <div className="text-center text-sm">
          Already a member? <a href={`/auth/login?redirect=${encodeURIComponent(redirect)}`} className="text-[linear-gradient(90deg,#4B0082, #7B2CBF, #F59E0B)] font-medium">Sign In</a>
        </div>
      </div>
    </form>
  )
}
