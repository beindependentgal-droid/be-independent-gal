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

export default function SignUpForm({ redirect = '/auth/onboarding/profile', googleReturn = false }: SignUpFormProps) {
  const router = useRouter()
  const { signUp, signInWithProvider } = useAuth()

  // Form state
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // UI state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [verificationSent, setVerificationSent] = useState(false)
  const [resendMessage, setResendMessage] = useState('')

  const strength = passwordStrength(password)

  // Validation
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
    return true
  }

  // Handle email/password sign up
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setResendMessage('')

    if (!validate()) return

    setLoading(true)
    try {
      await signUp(email, password)
      // Sign up successful - show verification screen
      setVerificationSent(true)
    } catch (err: any) {
      const message = String(err?.message || '').toLowerCase()

      if (message.includes('already') || message.includes('exists') || message.includes('registered')) {
        setError('This email is already registered. Please sign in or use a different email.')
      } else if (message.includes('rate limit')) {
        setError('Too many signup attempts. Please try again in a few minutes.')
      } else {
        setError(err?.message || 'Sign up failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  // Handle Google sign up
  const handleGoogleSignUp = async () => {
    setError('')
    setLoading(true)
    try {
      await signInWithProvider('google', redirect)
    } catch (err: any) {
      setError(err?.message || 'Google sign-in failed. Please try again.')
      setLoading(false)
    }
  }

  // Handle resend verification email
  const handleResend = async () => {
    setResendMessage('')
    setLoading(true)
    try {
      await signUp(email, password)
      setResendMessage('✓ Verification email resent. Please check your inbox.')
    } catch (err: any) {
      setResendMessage('✗ Failed to resend. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Verification screen
  if (verificationSent) {
    return (
      <div className="w-full max-w-md mx-auto space-y-6 py-12 px-4">
        {/* Success icon */}
        <div className="text-center">
          <div className="text-5xl mb-4">✉️</div>
          <h2 className="text-2xl font-bold mb-2">Check Your Email</h2>
          <p className="text-gray-600">
            We've sent a verification link to <span className="font-semibold">{email}</span>
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 space-y-3">
          <p className="font-semibold text-blue-900">What's next?</p>
          <ol className="space-y-2 text-sm text-blue-900">
            <li className="flex gap-3">
              <span className="font-bold">1.</span>
              <span>Check your email inbox and spam folder</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold">2.</span>
              <span>Click the verification link in the email</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold">3.</span>
              <span>You'll be redirected to complete your profile</span>
            </li>
          </ol>
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          <Button
            onClick={() => window.open('https://mail.google.com', '_blank')}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold"
          >
            Open Gmail
          </Button>

          <Button
            onClick={handleResend}
            disabled={loading}
            variant="outline"
            className="w-full h-12 rounded-full font-semibold"
          >
            {loading ? 'Resending...' : 'Resend Verification Email'}
          </Button>

          <Button
            onClick={() => router.push('/auth/login')}
            variant="ghost"
            className="w-full h-12 rounded-full font-semibold text-gray-600 hover:text-gray-900"
          >
            Back to Sign In
          </Button>
        </div>

        {/* Resend message */}
        {resendMessage && (
          <p className={`text-center text-sm ${resendMessage.includes('✓') ? 'text-green-600' : 'text-red-600'}`}>
            {resendMessage}
          </p>
        )}

        {/* FAQ */}
        <div className="text-center space-y-2 pt-4 border-t">
          <p className="text-xs text-gray-500">Didn't receive the email?</p>
          <p className="text-xs text-gray-500">Check your spam folder or wait a few minutes before requesting a new link.</p>
        </div>
      </div>
    )
  }

  // Sign up form
  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      {/* Header */}
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-2xl font-bold">Create Your Account</h2>
        <p className="text-gray-600">Join the BIG community today</p>
      </div>

      {/* Name fields */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-sm font-medium">
            First Name
          </Label>
          <Input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Amina"
            disabled={loading}
            className="h-12 rounded-2xl px-4 border border-gray-200"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-sm font-medium">
            Last Name
          </Label>
          <Input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="W."
            disabled={loading}
            className="h-12 rounded-2xl px-4 border border-gray-200"
          />
        </div>
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
        <Label htmlFor="password" className="text-sm font-medium">
          Password
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a strong password"
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

        {/* Password strength indicator */}
        <div className="space-y-2">
          <div className="flex gap-1">
            <div className={`h-1.5 flex-1 rounded-full ${strength.score >= 1 ? 'bg-red-500' : 'bg-gray-200'}`}></div>
            <div className={`h-1.5 flex-1 rounded-full ${strength.score >= 2 ? 'bg-yellow-500' : 'bg-gray-200'}`}></div>
            <div className={`h-1.5 flex-1 rounded-full ${strength.score >= 3 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500">Minimum 6 characters</p>
            {strength.label && <p className={`text-xs font-medium ${strength.score === 3 ? 'text-green-600' : strength.score === 2 ? 'text-yellow-600' : 'text-red-600'}`}>{strength.label}</p>}
          </div>
        </div>
      </div>

      {/* Google return notice */}
      {googleReturn && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-sm text-blue-900">
          <p className="font-medium mb-1">Finishing Google Sign Up</p>
          <p>Complete the form below to create your BIG account.</p>
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
        {loading ? 'Creating Account...' : 'Create Account'}
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
        onClick={handleGoogleSignUp}
        disabled={loading}
        variant="outline"
        className="w-full h-12 rounded-full border border-gray-300 font-semibold hover:bg-gray-50"
      >
        {loading ? 'Signing Up...' : '✓ Continue with Google'}
      </Button>

      {/* Sign in link */}
      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <a href="/auth/login" className="text-pink-600 hover:text-pink-700 font-bold">
          Sign In
        </a>
      </p>
    </form>
  )
}