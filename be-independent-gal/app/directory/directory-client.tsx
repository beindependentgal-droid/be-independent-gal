'use client'

import type { ChangeEvent } from 'react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProfileCard } from '@/components/profiles/profile-card'
import { getAccessToken } from '@/lib/auth-utils'
import { Search, Filter, Loader } from 'lucide-react'

interface Member {
  id: string
  full_name: string
  profession?: string
  city?: string
  avatar_url?: string
  level?: string
  points?: number
  bio?: string
  skills?: string[]
  is_mentor?: boolean
  badges?: any[]
}

export default function DirectoryClient() {
  const router = useRouter()
  const [members, setMembers] = useState<Member[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [skillFilter, setSkillFilter] = useState('')
  const [mentorOnly, setMentorOnly] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const searchMembers = async () => {
      try {
        setIsLoading(true)
        const token = await getAccessToken()

        if (!token) {
          setIsLoading(false)
          router.replace('/auth/login?redirect=/directory')
          return
        }

        setError(null)

        const params = new URLSearchParams()
        if (searchQuery) params.append('q', searchQuery)
        if (skillFilter) params.append('skill', skillFilter)
        if (mentorOnly) params.append('mentor', 'true')
        params.append('pageSize', '20')

        const res = await fetch(`/api/directory/search?${params}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!res.ok) throw new Error('Failed to search members')

        const data = await res.json()
        setMembers(data.members || [])
      } catch (err: any) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    const debounceTimer = setTimeout(() => {
      searchMembers()
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchQuery, skillFilter, mentorOnly, router])

  const handleMessageClick = (userId: string) => {
    router.push(`/messages?start=${userId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Member Directory</h1>
          <p className="text-gray-600">
            Connect with sisters, find mentors, and grow together
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, profession, or skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <Filter className="h-4 w-4 text-gray-400" />
                  Filter by Skill
                </label>
                <input
                  type="text"
                  placeholder="e.g., Python, Leadership"
                  value={skillFilter}
                  onChange={(e) => setSkillFilter(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>

              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={mentorOnly}
                    onChange={(e) => setMentorOnly(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Mentors only 🎓
                  </span>
                </label>
              </div>

              <div className="flex items-end justify-end">
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSkillFilter('')
                    setMentorOnly(false)
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-lg bg-red-50 text-red-700 mb-6">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="h-8 w-8 animate-spin text-brand" />
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No members found
            </h3>
            <p className="text-gray-600">
              {searchQuery || skillFilter ? 'Try adjusting your filters' : 'Be the first to join!'}
            </p>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Found {members.length} member{members.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {members.map((member) => (
                <div key={member.id} className="flex flex-col">
                  <ProfileCard
                    userId={member.id}
                    name={member.full_name}
                    profession={member.profession}
                    city={member.city}
                    avatar={member.avatar_url}
                    level={member.level}
                    points={member.points}
                    bio={member.bio}
                    badges={member.badges}
                    isMentor={member.is_mentor}
                  />
                  <button
                    onClick={() => handleMessageClick(member.id)}
                    className="mt-2 px-4 py-2 text-sm font-medium text-brand border border-brand rounded-lg hover:bg-brand/5 transition-colors"
                  >
                    Send Message
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
