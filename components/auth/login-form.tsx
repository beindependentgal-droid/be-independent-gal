'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Sparkles } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface LoginFormProps {
  redirect?: string
  googleReturn?: boolean
}

export default function LoginForm({ redirect = '/community', googleReturn = false }: LoginFormProps) {
  const { signIn, signInWithProvider } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const validate = () => {
    if (!email.trim()) {
      setError('Please enter your email')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address')
      return false
    }
    if (!password) {
      setError('Please enter your password')
      return false
    }
    return true
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')

    if (!validate()) return

    setLoading(true)
    try {
      await signIn(email, password)
    } catch (err: unknown) {
      const message = String(err?.message || '').toLowerCase()

      if (message.includes('invalid') || message.includes('wrong') || message.includes('credentials')) {
        setError('Invalid email or password. Please try again.')
      } else if (message.includes('confirm') || message.includes('verify')) {
        setError('Please verify your email before signing in. Check your inbox for a verification link.')
      } else if (message.includes('not found')) {
        setError('No account found with this email. Please sign up first.')
      } else {
        setError(err instanceof Error ? err.message : 'Sign in failed. Please try again.')
      }
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError('')
    setLoading(true)
    try {
      await signInWithProvider('google', redirect)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Google sign-in failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary- px-3 py-1 text-sm font-semibold text-secondary-">
          <Sparkles className="h-4 w-4" />
          Welcome back
        </div>
        <h2 className="text-2xl font-semibold text-slate-900">Sign in to BIG</h2>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          Continue your journey with learning, connection, and opportunity.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-slate-700">
          Email address
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          disabled={loading}
          className="h-12 rounded-2xl border border-slate-200 px-4"
        />
      </div>

      <div className="mt-5 space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-sm font-medium text-slate-700">
            Password
          </Label>
          <Link href="/auth/reset" className="text-sm font-semibold text-secondary- hover:text-secondary-">
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            disabled={loading}
            className="h-12 rounded-2xl border border-slate-200 px-4 pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {googleReturn ? (
        <div className="mt-5 rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900">
          <p className="font-semibold">Finishing Google sign in</p>
          <p className="mt-1">Complete the form below to access your BIG account.</p>
        </div>
      ) : null}

      {error ? (
        <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <Button
        type="submit"
        disabled={loading}
        className="mt-6 h-12 w-full rounded-full bg-secondary- font-semibold text-white hover:bg-secondary-"
      >
        {loading ? 'Signing in...' : 'Sign in'}
      </Button>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-sm text-slate-500">or</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <Button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={loading}
        variant="outline"
        className="h-12 w-full rounded-full border-slate-300 font-semibold text-slate-700 hover:bg-slate-50"
      >
        {loading ? 'Signing in...' : 'Continue with Google'}
      </Button>

      <p className="mt-6 text-center text-sm text-slate-600">
        New here?{' '}
        <Link href="/auth/sign-up" className="font-semibold text-secondary- hover:text-secondary-">
          Create an account
        </Link>
      </p>
    </form>
  )
}