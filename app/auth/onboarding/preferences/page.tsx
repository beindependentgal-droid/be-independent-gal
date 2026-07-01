'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase-client'

export default function PreferencesOnboardingPage() {
  const router = useRouter()
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [emailDigest, setEmailDigest] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = createClient()
      const session = await supabase.auth.getSession()
      const token = session.data.session?.access_token

      if (!token) {
        setError('Authentication error - please login again')
        setLoading(false)
        return
      }

      const headers = new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      })

      const response = await fetch('/api/auth/preferences', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          notifications_enabled: notificationsEnabled,
          email_digest: emailDigest,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save preferences')
      }

      // Move to circle selection
      router.push('/auth/onboarding/circles')
    } catch (err: any) {
      setError(err?.message || 'Failed to save preferences')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white py-12 px-6 sm:px-12 lg:px-16">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm text-gray-500 font-medium mb-2">STEP 2 OF 3</p>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Your Preferences</h1>
          <p className="text-lg text-gray-600">
            Choose how you'd like to stay connected with the BIG community
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-12">
          <div className="h-1 bg-gray-200 rounded-full">
            <div className="h-full w-2/3 bg-secondary- rounded-full transition-all duration-300"></div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleNext} className="space-y-8">
          {/* Notifications preference */}
          <div className="border-2 border-gray-200 rounded-2xl p-6 hover:border-gray-300 transition-colors">
            <div className="flex items-start gap-4">
              {/* Toggle */}
              <div className="flex-shrink-0 pt-1">
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={notificationsEnabled}
                    onChange={(e) => setNotificationsEnabled(e.target.checked)}
                    disabled={loading}
                    className="peer sr-only"
                  />
                  <div
                    className={`peer h-6 w-11 rounded-full border-2 transition-all ${
                      notificationsEnabled
                        ? 'border-secondary- bg-secondary-'
                        : 'border-gray-300 bg-gray-200'
                    }`}
                  ></div>
                  <div
                    className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-all ${
                      notificationsEnabled ? 'translate-x-5' : ''
                    }`}
                  ></div>
                </label>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Push Notifications</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Receive notifications about new messages, events, opportunities, and community highlights. You can manage notification types in your settings.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-block text-xs bg-blue-50 border border-blue-200 text-blue-700 rounded-full px-3 py-1">
                    📬 Messages
                  </span>
                  <span className="inline-block text-xs bg-blue-50 border border-blue-200 text-blue-700 rounded-full px-3 py-1">
                    📅 Events
                  </span>
                  <span className="inline-block text-xs bg-blue-50 border border-blue-200 text-blue-700 rounded-full px-3 py-1">
                    💼 Opportunities
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Email digest preference */}
          <div className="border-2 border-gray-200 rounded-2xl p-6 hover:border-gray-300 transition-colors">
            <div className="flex items-start gap-4">
              {/* Toggle */}
              <div className="flex-shrink-0 pt-1">
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={emailDigest}
                    onChange={(e) => setEmailDigest(e.target.checked)}
                    disabled={loading}
                    className="peer sr-only"
                  />
                  <div
                    className={`peer h-6 w-11 rounded-full border-2 transition-all ${
                      emailDigest
                        ? 'border-secondary- bg-secondary-'
                        : 'border-gray-300 bg-gray-200'
                    }`}
                  ></div>
                  <div
                    className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-all ${
                      emailDigest ? 'translate-x-5' : ''
                    }`}
                  ></div>
                </label>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Weekly Email Digest</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Get a curated summary of the week's highlights, new opportunities, upcoming events, and trending discussions in your circles. Sent every Sunday morning.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-block text-xs bg-purple-50 border border-purple-200 text-purple-700 rounded-full px-3 py-1">
                    ✨ Highlights
                  </span>
                  <span className="inline-block text-xs bg-purple-50 border border-purple-200 text-purple-700 rounded-full px-3 py-1">
                    🔥 Trending
                  </span>
                  <span className="inline-block text-xs bg-purple-50 border border-purple-200 text-purple-700 rounded-full px-3 py-1">
                    📰 Weekly Summary
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-sm text-blue-900">
            <p className="font-medium mb-2">Your preferences summary:</p>
            <ul className="space-y-1 text-sm">
              <li className="flex items-center gap-2">
                <span>{notificationsEnabled ? '✓' : '○'}</span>
                <span>Push notifications are {notificationsEnabled ? 'enabled' : 'disabled'}</span>
              </li>
              <li className="flex items-center gap-2">
                <span>{emailDigest ? '✓' : '○'}</span>
                <span>Weekly email digest is {emailDigest ? 'enabled' : 'disabled'}</span>
              </li>
            </ul>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-900">
              ⚠️ {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4 pt-6">
            <Button
              type="button"
              onClick={() => router.push('/auth/onboarding/profile')}
              disabled={loading}
              variant="outline"
              className="flex-1 h-12 rounded-full"
            >
              Back
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 h-12 rounded-full bg-secondary- hover:bg-secondary- text-white font-bold transition-colors"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="inline-block animate-spin">⚙️</span>
                  Saving...
                </span>
              ) : (
                'Continue'
              )}
            </Button>
          </div>

          {/* Help text */}
          <div className="text-center space-y-2 pt-6 border-t">
            <p className="text-sm text-gray-600">
              You can update these preferences anytime in your settings.
            </p>
            <p className="text-xs text-gray-500">
              We respect your privacy and will never share your email with third parties.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}