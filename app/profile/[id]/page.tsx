'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ProfileHeader } from '@/components/profiles/profile-header'
import { ActivityFeed } from '@/components/profiles/activity-feed'
import { MessageCircle, UserPlus, Award, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'
import { getAccessToken } from '@/lib/auth-utils'

interface UserProfile {
  id: string
  first_name: string
  last_name: string
  email: string
  profession?: string
  city?: string
  avatar_url?: string
  bio?: string
  member_level?: string
  points?: number
  created_at?: string
  user_profile_extended?: {
    bio: string
    skills: string[]
    interests: string[]
    mentoring_areas: string[]
  }
  badges?: any[]
}

interface Activity {
  id: string
  type: string
  title: string
  points: number
  created_at: string
}

export default function ProfilePage() {
  const params = useParams()
  const router = useRouter()
  const profileId = params.id as string
  const { user: currentUser } = useAuth()

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true)
        const token = await getAccessToken()

        // Fetch profile
        const res = await fetch(`/api/profiles/${profileId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })

        if (!res.ok) {
          throw new Error('Failed to load profile')
        }

        const profileData = await res.json()
        setProfile(profileData)

        // Fetch activities
        const activitiesRes = await fetch(`/api/profiles/${profileId}/activities`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })

        if (activitiesRes.ok) {
          const activitiesData = await activitiesRes.json()
          setActivities(activitiesData.activities || [])
        }
      } catch (err: any) {
        setError(err?.message || 'Unable to load profile')
      } finally {
        setIsLoading(false)
      }
    }

    if (profileId) {
      fetchProfile()
    }
  }, [profileId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-"></div>
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="text-center space-y-6 max-w-md">
          <div className="text-5xl">🔍</div>
          <h1 className="text-3xl font-bold text-gray-900">Profile Not Found</h1>
          <p className="text-gray-600">{error || 'Unable to load profile'}</p>
          <Button
            onClick={() => window.history.back()}
            className="bg-secondary- hover:bg-secondary- text-white font-bold rounded-full h-12 px-8"
          >
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Member'
  const isOwnProfile = currentUser?.id === profileId

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <ProfileHeader
        profile={profile}
        isOwnProfile={isOwnProfile}
        onSettingsClick={() => router.push('/profile/edit')}
      />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 sm:px-12 lg:px-16 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            {(profile.bio || (profile.user_profile_extended && (profile.user_profile_extended.interests?.length || profile.user_profile_extended.mentoring_areas?.length))) && (
              <div className="bg-white rounded-2xl border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">About</h2>

                {profile.bio ? (
                  <div className="mb-6">
                    <p className="text-gray-600 leading-relaxed">{profile.bio}</p>
                  </div>
                ) : (
                  <div className="mb-6">
                    <p className="text-gray-500 italic">No bio yet.</p>
                  </div>
                )}

                {/* Interests */}
                {profile.user_profile_extended?.interests && profile.user_profile_extended.interests.length > 0 ? (
                  <div className="mb-6">
                    <h3 className="font-bold text-gray-900 mb-3">Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.user_profile_extended.interests.map((interest, idx) => (
                        <span
                          key={idx}
                          className="bg-secondary- text-secondary- text-sm font-medium px-4 py-2 rounded-full"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mb-6">
                    <h3 className="font-bold text-gray-900 mb-3">Interests</h3>
                    <p className="text-gray-500 italic">No interests listed.</p>
                  </div>
                )}

                {/* Mentoring Areas */}
                {profile.user_profile_extended?.mentoring_areas && profile.user_profile_extended.mentoring_areas.length > 0 ? (
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3">Mentoring In</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.user_profile_extended.mentoring_areas.map((area, idx) => (
                        <span
                          key={idx}
                          className="bg-purple-100 text-purple-700 text-sm font-medium px-4 py-2 rounded-full"
                        >
                          🎓 {area}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3">Mentoring In</h3>
                    <p className="text-gray-500 italic">No mentoring areas listed.</p>
                  </div>
                )}
              </div>
            )}

            {/* Activity Feed */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
              <ActivityFeed activities={activities} />
            </div>
          </div>

          {/* Sidebar - Right */}
          <div className="lg:col-span-1 space-y-6">
            {/* Action Buttons */}
            {!isOwnProfile && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-3">
                <Button className="w-full bg-gradient-to-r from-pink-600 to-violet-700 text-white font-bold rounded-full h-11 flex items-center justify-center gap-2 shadow-lg shadow-pink-200 hover:from-violet-700 hover:to-pink-600">
                  <MessageCircle className="w-4 h-4" />
                  Send Message
                </Button>

                <Button
                  variant="outline"
                  className="w-full border-2 border-violet-300 bg-white text-violet-700 font-bold rounded-full h-11 flex items-center justify-center gap-2 hover:bg-gradient-to-r hover:from-pink-600 hover:to-violet-700 hover:text-white hover:border-transparent"
                >
                  <UserPlus className="w-4 h-4" />
                  Request Mentorship
                </Button>
              </div>
            )}

            {/* Stats Cards */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
              {/* Member Since */}
              {profile.created_at && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium">Member Since</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {new Date(profile.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                    })}
                  </p>
                </div>
              )}

              <div className="border-t border-gray-200 pt-4">
                {/* Total Points */}
                {profile.points !== undefined && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Award className="w-4 h-4" />
                      <span className="text-sm font-medium">Total Points</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">⭐ {profile.points}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Member Level Badge */}
            {profile.member_level && (
              <div className="bg-white rounded-2xl border border-border p-6 text-center">
                <p className="text-sm text-gray-600 mb-2">Member Level</p>
                <p className="text-2xl font-bold text-secondary- capitalize">{profile.member_level}</p>
              </div>
            )}

            {/* Badges */}
            {profile.badges && profile.badges.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Badges</h3>
                <div className="grid grid-cols-2 gap-3">
                  {profile.badges.map((badge, idx) => (
                    <div
                      key={idx}
                      className="text-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                      title={badge.name}
                    >
                      <span className="text-2xl">{badge.icon}</span>
                      <p className="text-xs text-gray-600 mt-1 truncate">{badge.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
