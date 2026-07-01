'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Loader, Check, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/lib/auth-context'

interface ProfileFormData {
  first_name: string
  last_name: string
  profession: string
  city: string
  bio: string
  skills: string
  interests: string
  mentoring_areas: string
  avatar_url: string
}

export default function EditProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated, loading: authLoading } = useAuth()

  const [formData, setFormData] = useState<ProfileFormData>({
    first_name: '',
    last_name: '',
    profession: '',
    city: '',
    bio: '',
    skills: '',
    interests: '',
    mentoring_areas: '',
    avatar_url: '',
  })

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [authLoading, isAuthenticated, router])

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true)
        const res = await fetch('/api/profiles/me')

        if (!res.ok) {
          throw new Error('Failed to load profile')
        }

        const profile = await res.json()
        const convertedData: ProfileFormData = {
          first_name: profile.first_name || '',
          last_name: profile.last_name || '',
          profession: profile.profession || '',
          city: profile.city || '',
          bio: profile.user_profile_extended?.bio || '',
          skills: (profile.user_profile_extended?.skills || []).join(', '),
          interests: (profile.user_profile_extended?.interests || []).join(', '),
          mentoring_areas: (profile.user_profile_extended?.mentoring_areas || []).join(', '),
          avatar_url: profile.avatar_url || '',
        }
        setFormData(convertedData)
        if (profile.avatar_url) {
          setAvatarPreview(profile.avatar_url)
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to load profile')
      } finally {
        setIsLoading(false)
      }
    }

    if (isAuthenticated && !authLoading) {
      fetchProfile()
    }
  }, [isAuthenticated, authLoading])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError(null)
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setFormData((prev) => ({
      ...prev,
      avatar_url: url,
    }))

    // Show preview if valid URL
    if (url.startsWith('http')) {
      setAvatarPreview(url)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)
    setSuccess(false)

    try {
      // Validate required fields
      if (!formData.first_name.trim() || !formData.last_name.trim()) {
        throw new Error('First name and last name are required')
      }

      const updateData = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        profession: formData.profession.trim(),
        city: formData.city.trim(),
        bio: formData.bio.trim(),
        avatar_url: formData.avatar_url.trim(),
        skills: formData.skills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        interests: formData.interests
          .split(',')
          .map((i) => i.trim())
          .filter(Boolean),
        mentoring_areas: formData.mentoring_areas
          .split(',')
          .map((m) => m.trim())
          .filter(Boolean),
      }

      const res = await fetch('/api/profiles/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Failed to update profile')
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/profile')
      }, 1500)
    } catch (err: any) {
      setError(err?.message || 'An error occurred while saving')
    } finally {
      setIsSaving(false)
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-6 sm:px-12 lg:px-16">
        <div className="max-w-2xl mx-auto">
          <div className="space-y-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-12 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 sm:px-12 lg:px-16">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 font-medium transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>

          <h1 className="text-4xl font-bold text-gray-900">Edit Profile</h1>
          <p className="text-gray-600 mt-2">Update your profile information</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-900">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl p-4 flex gap-3">
            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-green-900">Success</p>
              <p className="text-sm text-green-700">Profile updated successfully! Redirecting...</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-8 space-y-8">
          {/* Avatar Section */}
          <div className="space-y-4">
            <Label className="text-lg font-bold">Profile Picture</Label>
            <div className="flex gap-6 items-start">
              {/* Avatar Preview */}
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0 border-2 border-gray-200">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="w-full h-full object-cover"
                    onError={() => setAvatarPreview(null)}
                  />
                ) : (
                  <span className="text-3xl">👤</span>
                )}
              </div>

              {/* Avatar URL Input */}
              <div className="flex-1">
                <Label htmlFor="avatar_url" className="text-sm font-medium block mb-2">
                  Avatar URL
                </Label>
                <Input
                  id="avatar_url"
                  name="avatar_url"
                  type="url"
                  value={formData.avatar_url}
                  onChange={handleAvatarChange}
                  placeholder="https://example.com/avatar.jpg"
                  className="h-11 rounded-xl"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Paste a link to an image. Recommended size: 500x500px
                </p>
              </div>
            </div>
          </div>

          {/* Name Section */}
          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Basic Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="first_name" className="text-sm font-medium">
                  First Name *
                </Label>
                <Input
                  id="first_name"
                  name="first_name"
                  type="text"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="Jane"
                  required
                  className="h-11 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name" className="text-sm font-medium">
                  Last Name *
                </Label>
                <Input
                  id="last_name"
                  name="last_name"
                  type="text"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Doe"
                  required
                  className="h-11 rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Professional Info Section */}
          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Professional Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="profession" className="text-sm font-medium">
                  Profession
                </Label>
                <Input
                  id="profession"
                  name="profession"
                  type="text"
                  value={formData.profession}
                  onChange={handleChange}
                  placeholder="e.g., Software Engineer"
                  className="h-11 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm font-medium">
                  City / Location
                </Label>
                <Input
                  id="city"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g., Nairobi, Kenya"
                  className="h-11 rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="border-t border-gray-200 pt-8">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="bio" className="text-sm font-medium">
                  Bio
                </Label>
                <span className="text-xs text-gray-500">{formData.bio.length}/500</span>
              </div>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself, your interests, and what you're passionate about..."
                maxLength={500}
                rows={5}
                className="rounded-xl border border-gray-200 p-4 resize-none focus:outline-none focus:border-secondary-"
              />
              <p className="text-xs text-gray-500">
                Share a bit about yourself to help other members connect with you
              </p>
            </div>
          </div>

          {/* Skills & Interests Section */}
          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Skills & Interests</h2>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="skills" className="text-sm font-medium">
                  Skills (comma-separated)
                </Label>
                <Input
                  id="skills"
                  name="skills"
                  type="text"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="e.g., Leadership, Design, Marketing"
                  className="h-11 rounded-xl"
                />
                <p className="text-xs text-gray-500">
                  Separate skills with commas
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="interests" className="text-sm font-medium">
                  Interests (comma-separated)
                </Label>
                <Input
                  id="interests"
                  name="interests"
                  type="text"
                  value={formData.interests}
                  onChange={handleChange}
                  placeholder="e.g., Entrepreneurship, Tech, Personal Development"
                  className="h-11 rounded-xl"
                />
                <p className="text-xs text-gray-500">
                  What are you interested in learning or exploring?
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mentoring_areas" className="text-sm font-medium">
                  I Can Mentor In (comma-separated)
                </Label>
                <Input
                  id="mentoring_areas"
                  name="mentoring_areas"
                  type="text"
                  value={formData.mentoring_areas}
                  onChange={handleChange}
                  placeholder="e.g., Career Development, Business Planning, Public Speaking"
                  className="h-11 rounded-xl"
                />
                <p className="text-xs text-gray-500">
                  Areas where you can guide and mentor other members
                </p>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="border-t border-gray-200 pt-8 flex gap-4 justify-end">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={isSaving}
              className="px-8 py-3 rounded-full border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>

            <Button
              type="submit"
              disabled={isSaving}
              className="px-8 py-3 bg-secondary- hover:bg-secondary- disabled:bg-gray-400 text-white font-bold rounded-full h-auto flex items-center gap-2"
            >
              {isSaving && <Loader className="w-4 h-4 animate-spin" />}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}