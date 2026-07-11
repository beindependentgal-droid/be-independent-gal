'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Sparkles } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { sanitizeAuthError } from '@/lib/security'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface LoginFormProps {
  redirect?: string
  googleReturn?: boolean
}

const DEFAULT_AUTH_REDIRECT = '/dashboard'

export default function LoginForm({ redirect = DEFAULT_AUTH_REDIRECT, googleReturn = false }: LoginFormProps) {
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
      setError(sanitizeAuthError(err))
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError('')
    setLoading(true)
    try {
      await signInWithProvider('google', redirect)
    } catch (err: unknown) {
      setError(sanitizeAuthError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={loading}
        variant="outline"
        className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
      >
        <Sparkles className="h-4 w-4" />
        {loading ? 'Signing in...' : 'Continue with Google'}
      </Button>

      <div className="flex items-center gap-3 text-sm text-slate-400 before:block before:h-px before:flex-1 before:bg-slate-200 after:block after:h-px after:flex-1 after:bg-slate-200">
        <span>Sign in with email</span>
      </div>

      <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900">
        <div>
          <Label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            disabled={loading}
            className="mt-2 h-12 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm focus:ring-2 focus:ring-fuchsia-400 dark:border-slate-700 dark:bg-slate-950"
          />
        </div>

        <div>
          <div className="flex items-center justify-between text-sm text-slate-700 dark:text-slate-300">
            <Label htmlFor="password" className="font-semibold">
              Password
            </Label>
            <Link href="/auth/reset" className="font-semibold text-fuchsia-600 hover:text-fuchsia-700 dark:text-fuchsia-400 dark:hover:text-fuchsia-300">
              Forgot password?
            </Link>
          </div>
          <div className="relative mt-2">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              disabled={loading}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 pr-12 py-3 shadow-sm focus:ring-2 focus:ring-fuchsia-400 dark:border-slate-700 dark:bg-slate-950"
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {googleReturn ? (
        <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900 dark:border-sky-500/40 dark:bg-sky-900/10 dark:text-sky-200">
          <p className="font-semibold">Finishing Google sign in</p>
          <p className="mt-1 text-slate-600 dark:text-slate-300">Complete the form below to access your BIG account.</p>
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-400/40 dark:bg-rose-900/10 dark:text-rose-200">
          {error}
        </div>
      ) : null}

      <Button
        type="submit"
        disabled={loading}
        className="w-full rounded-full !bg-fuchsia-700 px-4 py-3 text-sm font-semibold !text-white shadow-sm shadow-fuchsia-700/30 transition hover:bg-fuchsia-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>

      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        Don&apos;t have an account?{' '}
        <Link href={`/auth/sign-up?redirect=${encodeURIComponent(redirect)}`} className="font-semibold text-fuchsia-600 hover:text-fuchsia-700 dark:text-fuchsia-400 dark:hover:text-fuchsia-300">
          Create one
        </Link>
      </p>
    </form>
  )
}
