'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase-client'

export const dynamic = 'force-dynamic'

export default function ProfileOnboardingPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [fullName, setFullName] = useState('')
  const [bio, setBio] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setAvatarUrl(url)
    // Show preview if valid URL
    if (url.startsWith('http')) {
      setAvatarPreview(url)
    }
  }

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!fullName.trim()) {
      setError('Please enter your full name')
      return
    }

    if (fullName.trim().length < 2) {
      setError('Full name must be at least 2 characters')
      return
    }

    if (bio.length > 500) {
      setError('Bio must be less than 500 characters')
      return
    }

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

      const response = await fetch('/api/auth/profile', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          full_name: fullName.trim(),
          bio: bio.trim(),
          avatar_url: avatarUrl.trim(),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save profile')
      }

      // Move to preferences step
      router.push('/auth/onboarding/preferences')
    } catch (err: any) {
      setError(err?.message || 'Failed to save profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white py-12 px-6 sm:px-12 lg:px-16">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm text-gray-500 font-medium mb-2">STEP 1 OF 3</p>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Complete Your Profile</h1>
          <p className="text-lg text-gray-600">
            Tell us about yourself so the community can get to know you
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-12">
          <div className="h-1 bg-gray-200 rounded-full">
            <div className="h-full w-1/3 bg-pink-500 rounded-full transition-all duration-300"></div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleNext} className="space-y-8">
          {/* Avatar section */}
          <div className="flex flex-col items-center gap-6">
            {/* Avatar preview */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center overflow-hidden border-2 border-gray-200">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar preview"
                  className="w-full h-full object-cover"
                  onError={() => setAvatarPreview(null)}
                />
              ) : (
                <span className="text-4xl">👤</span>
              )}
            </div>

            {/* Avatar URL field */}
            <div className="w-full max-w-sm">
              <Label htmlFor="avatar" className="text-sm font-medium block mb-2">
                Avatar URL (Optional)
              </Label>
              <Input
                id="avatar"
                type="url"
                value={avatarUrl}
                onChange={handleAvatarChange}
                placeholder="https://example.com/avatar.jpg"
                disabled={loading}
                className="h-12 rounded-xl px-4 border border-gray-200"
              />
              <p className="text-xs text-gray-500 mt-2">
                Paste a link to an image URL. Recommended size: 500x500px
              </p>
            </div>
          </div>

          {/* Full name field */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-sm font-medium">
              Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Jane Doe"
              disabled={loading}
              className="h-12 rounded-xl px-4 border border-gray-200"
              required
              autoFocus
            />
            <p className="text-xs text-gray-500">
              This is how other members will see your name in the community
            </p>
          </div>

          {/* Bio field */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="bio" className="text-sm font-medium">
                Bio (Optional)
              </Label>
              <span className="text-xs text-gray-500">{bio.length}/500</span>
            </div>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself... What are you passionate about? What brings you to BIG?"
              disabled={loading}
              maxLength={500}
              rows={5}
              className="rounded-xl px-4 py-3 border border-gray-200 resize-none"
            />
            <p className="text-xs text-gray-500">
              Share a bit about yourself to help other members connect with you
            </p>
          </div>

          {/* Tips box */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 space-y-3">
            <p className="font-medium text-blue-900">💡 Tips for a great profile:</p>
            <ul className="space-y-2 text-sm text-blue-900">
              <li className="flex gap-2">
                <span>✓</span>
                <span>Use a professional or friendly photo as your avatar</span>
              </li>
              <li className="flex gap-2">
                <span>✓</span>
                <span>Write a bio that shows your personality and interests</span>
              </li>
              <li className="flex gap-2">
                <span>✓</span>
                <span>Mention your goals or what you're looking for in BIG</span>
              </li>
              <li className="flex gap-2">
                <span>✓</span>
                <span>Be authentic - the community values genuineness</span>
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
          <Button
            type="submit"
            disabled={loading || !fullName.trim()}
            className="w-full h-12 rounded-full bg-pink-500 hover:bg-pink-600 disabled:bg-gray-300 text-white font-bold transition-colors"
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

          {/* Help text */}
          <div className="text-center space-y-2 pt-6 border-t">
            <p className="text-sm text-gray-600">
              You can update your profile anytime in your settings.
            </p>
            <p className="text-xs text-gray-500">
              Next, we'll ask about your preferences for notifications and emails.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}