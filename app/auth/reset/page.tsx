'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import FallbackImage from '@/components/ui/fallback-image'

export default function ResetPage() {
  const router = useRouter()
  const { sendPasswordReset } = useAuth()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    // Validate email
    if (!email.trim()) {
      setMessageType('error')
      setMessage('Please enter your email address')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessageType('error')
      setMessage('Please enter a valid email address')
      return
    }

    setLoading(true)
    try {
      await sendPasswordReset(email)
      setMessageType('success')
      setMessage('If an account exists, a reset email has been sent. Check your inbox.')
      setEmailSent(true)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send reset email. Please try again.'
      setMessageType('error')
      setMessage(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      {/* Left side - Form */}
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16">
        <div className="mx-auto w-full max-w-sm space-y-8">
          {/* Logo */}
          <div className="flex justify-center">
            <Link href="/">
              <FallbackImage
                src="/images/big.svg"
                alt="BIG Logo"
                width={48}
                height={48}
                fallbackSrc="/images/big-logo-placeholder.svg"
                className="h-12 w-12"
              />
            </Link>
          </div>

          {/* Header */}
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold text-gray-900">Reset Password</h1>
<p className="text-gray-600">Enter your email and we&apos;ll send you a reset link</p>
          </div>

          {emailSent ? (
            // Success state
            <div className="space-y-6 text-center py-8">
              <div className="text-5xl mb-4">📧</div>

              <h2 className="text-2xl font-bold">Check Your Email</h2>
              <p className="text-gray-600">
                We&apos;ve sent a password reset link to <span className="font-semibold">{email}</span>
              </p>

              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 space-y-3 my-6 text-left">
                <p className="font-semibold text-blue-900">What&apos;s next?</p>
                <ol className="space-y-2 text-sm text-blue-900">
                  <li className="flex gap-3">
                    <span className="font-bold">1.</span>
                    <span>Check your email inbox and spam folder</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold">2.</span>
                    <span>Click the password reset link</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold">3.</span>
                    <span>Create a new password</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold">4.</span>
                    <span>Sign in with your new password</span>
                  </li>
                </ol>
              </div>

              {/* Action buttons */}
              <div className="space-y-3 pt-4">
                <Button
                  onClick={() => window.open('https://mail.google.com', '_blank')}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold"
                >
                  Open Gmail
                </Button>

                <Button
                  onClick={() => {
                    setEmailSent(false)
                    setEmail('')
                    setMessage('')
                  }}
                  variant="outline"
                  className="w-full h-12 rounded-full font-semibold"
                >
                  Try Another Email
                </Button>

                <Button
                  onClick={() => router.push('/auth/login')}
                  variant="ghost"
                  className="w-full h-12 rounded-full font-semibold text-gray-600 hover:text-gray-900"
                >
                  Back to Sign In
                </Button>
              </div>

              {/* Help text */}
              <div className="text-center space-y-2 pt-6 border-t">
                <p className="text-xs text-gray-500">Didn&apos;t receive the email?</p>
                <p className="text-xs text-gray-500">Check your spam folder or wait a few minutes and try again.</p>
              </div>
            </div>
          ) : (
            // Form state
            <form onSubmit={handleSubmit} className="space-y-6">
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
                  required
                />
              </div>

              {/* Message */}
              {message && (
                <div
                  className={`rounded-2xl p-4 text-sm ${
                    messageType === 'success'
                      ? 'bg-green-50 border border-green-200 text-green-900'
                      : 'bg-red-50 border border-red-200 text-red-900'
                  }`}
                >
                  {message}
                </div>
              )}

              {/* Info box */}
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-sm text-blue-900">
                <p className="font-medium mb-2">Password Reset Link</p>
                <p>We&apos;ll send you a secure link to reset your password. The link will expire in 1 hour.</p>
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-full bg-secondary- hover:bg-secondary- text-white font-bold transition-colors"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>

              {/* Back to login */}
              <div className="text-center pt-4 border-t">
                <p className="text-sm text-gray-600">
                  Remember your password?{' '}
                  <Link href="/auth/login" className="text-secondary- hover:text-secondary- font-bold">
                    Sign In
                  </Link>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Right side - Hero Image */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-white p-12">
        <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden shadow-2xl">
          <FallbackImage
            src="/images/hero-women.jpg"
            alt="BIG Community"
            fill
            className="object-cover"
            fallbackSrc="/images/hero-women-placeholder.jpg"
          />
        </div>

        {/* Hero text */}
        <div className="mt-12 text-center space-y-4 max-w-md">
          <h2 className="text-2xl font-bold text-gray-900">Forgot Your Password? 🔐</h2>
          <p className="text-gray-600">
            Don&apos;t worry, it happens to everyone! We&apos;ll help you reset it in just a few steps.
          </p>
          <div className="space-y-3 pt-6">
            <div className="flex items-center gap-3 text-left">
              <div className="flex-shrink-0 w-8 h-8 bg-secondary- rounded-full flex items-center justify-center">
                <span className="text-secondary- font-bold">1</span>
              </div>
              <span className="text-gray-700">Enter your email address</span>
            </div>
            <div className="flex items-center gap-3 text-left">
              <div className="flex-shrink-0 w-8 h-8 bg-secondary- rounded-full flex items-center justify-center">
                <span className="text-secondary- font-bold">2</span>
              </div>
              <span className="text-gray-700">Check your email for a reset link</span>
            </div>
            <div className="flex items-center gap-3 text-left">
              <div className="flex-shrink-0 w-8 h-8 bg-secondary- rounded-full flex items-center justify-center">
                <span className="text-secondary- font-bold">3</span>
              </div>
              <span className="text-gray-700">Click the link and create a new password</span>
            </div>
            <div className="flex items-center gap-3 text-left">
              <div className="flex-shrink-0 w-8 h-8 bg-secondary- rounded-full flex items-center justify-center">
                <span className="text-secondary- font-bold">4</span>
              </div>
              <span className="text-gray-700">Sign in and continue</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}