'use client'

import { useState } from 'react'
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

  // Form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // UI state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Validation
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

  // Handle email/password sign in
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validate()) return

    setLoading(true)
    try {
      await signIn(email, password)
      // Don't redirect here - let LoginScreen handle it
    } catch (err: any) {
      const message = String(err?.message || '').toLowerCase()

      if (message.includes('invalid') || message.includes('wrong') || message.includes('credentials')) {
        setError('Invalid email or password. Please try again.')
      } else if (message.includes('confirm') || message.includes('verify')) {
        setError('Please verify your email before signing in. Check your inbox for a verification link.')
      } else if (message.includes('not found')) {
        setError('No account found with this email. Please sign up first.')
      } else {
        setError(err?.message || 'Sign in failed. Please try again.')
      }
      setLoading(false)
    }
  }

  // Handle Google sign in
  const handleGoogleSignIn = async () => {
    setError('')
    setLoading(true)
    try {
      await signInWithProvider('google', redirect)
    } catch (err: any) {
      setError(err?.message || 'Google sign-in failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      {/* Header */}
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-2xl font-bold">Welcome Back</h2>
        <p className="text-gray-600">Sign in to your BIG account</p>
      </div>

      {/* Email field */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          disabled={loading}
          className="h-12 rounded-2xl px-4 border border-gray-200"
        />
      </div>

      {/* Password field */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-sm font-medium">
            Password
          </Label>
          <a
            href="/auth/forgot-password"
            className="text-sm text-pink-600 hover:text-pink-700 font-medium"
          >
            Forgot password?
          </a>
        </div>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            disabled={loading}
            className="h-12 rounded-2xl px-4 pr-24 border border-gray-200"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      {/* Google return notice */}
      {googleReturn && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-sm text-blue-900">
          <p className="font-medium mb-1">Finishing Google Sign In</p>
          <p>Complete the form below to sign in to your BIG account.</p>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-900">
          {error}
        </div>
      )}

      {/* Submit button */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full h-12 rounded-full bg-pink-500 hover:bg-pink-600 text-white font-bold transition-colors"
      >
        {loading ? 'Signing In...' : 'Sign In'}
      </Button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="px-2 bg-white text-sm text-gray-500">OR</span>
        </div>
      </div>

      {/* Google button */}
      <Button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={loading}
        variant="outline"
        className="w-full h-12 rounded-full border border-gray-300 font-semibold hover:bg-gray-50"
      >
        {loading ? 'Signing In...' : '✓ Continue with Google'}
      </Button>

      {/* Sign up link */}
      <p className="text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <a href="/auth/sign-up" className="text-pink-600 hover:text-pink-700 font-bold">
          Sign Up
        </a>
      </p>
    </form>
  )
}