'use client'

import type { ChangeEvent } from 'react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ProfileCard } from '@/components/profiles/profile-card'
import { getAccessToken } from '@/lib/auth-utils'
import { Search, Filter, Loader, Users, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Member {
  id: string
  first_name: string
  last_name: string
  profession?: string
  city?: string
  avatar_url?: string
  member_level?: string
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
        params.append('pageSize', '50')

        const res = await fetch(`/api/directory/search?${params}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!res.ok) throw new Error('Failed to search members')

        const data = await res.json()
        setMembers(data.members || [])
      } catch (err: any) {
        setError(err?.message || 'Failed to load members')
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

  const clearFilters = () => {
    setSearchQuery('')
    setSkillFilter('')
    setMentorOnly(false)
  }

  const hasFilters = searchQuery || skillFilter || mentorOnly

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-8 px-6 sm:px-12 lg:px-16 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
              <Users className="w-8 h-8 text-secondary-" />
              Member Directory
            </h1>
            <p className="text-gray-600 mt-2">
              Connect with sisters, find mentors, and grow together
            </p>
          </div>

          {/* Search and Filters */}
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by name, profession, city..."
                value={searchQuery}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setSearchQuery(e.target.value)
                }
                className="w-full pl-10 h-12 rounded-full bg-gray-100 border-0 focus:bg-white focus:ring-2 focus:ring-pink-500"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
              {/* Skill Filter */}
              <div className="flex-1 min-w-0">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Skill
                </label>
                <select
                  value={skillFilter}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    setSkillFilter(e.target.value)
                  }
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white"
                >
                  <option value="">All skills</option>
                  <option value="leadership">Leadership</option>
                  <option value="marketing">Marketing</option>
                  <option value="design">Design</option>
                  <option value="development">Development</option>
                  <option value="business">Business</option>
                  <option value="finance">Finance</option>
                  <option value="sales">Sales</option>
                  <option value="writing">Writing</option>
                </select>
              </div>

              {/* Mentor Filter */}
              <div className="flex items-center gap-3">
                <input
                  id="mentor-filter"
                  type="checkbox"
                  checked={mentorOnly}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setMentorOnly(e.target.checked)
                  }
                  className="h-4 w-4 rounded border-gray-300 text-secondary- focus:ring-pink-500 cursor-pointer"
                />
                <label
                  htmlFor="mentor-filter"
                  className="text-sm font-medium text-gray-700 cursor-pointer"
                >
                  Mentors only 🎓
                </label>
              </div>

              {/* Clear Filters Button */}
              {hasFilters && (
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  size="sm"
                  className="h-10 px-4 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 sm:px-12 lg:px-16 py-12">
        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center mb-8">
            <p className="text-red-700 font-medium">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-full h-10 px-6"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-24">
            <div className="text-center space-y-4">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-"></div>
              <p className="text-gray-600 font-medium">Loading members...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && members.length === 0 && (
          <div className="text-center py-24">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No members found
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {hasFilters
                ? 'Try adjusting your filters to find more members'
                : 'Be the first to join the directory!'}
            </p>
            {hasFilters && (
              <Button
                onClick={clearFilters}
                className="bg-secondary- hover:bg-secondary- text-white font-bold rounded-full h-12 px-8"
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}

        {/* Members Grid */}
        {!isLoading && members.length > 0 && (
          <div className="space-y-8">
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                Found {members.length} member{members.length !== 1 ? 's' : ''}
              </h2>
              {hasFilters && (
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  size="sm"
                  className="h-10 px-4"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>

            {/* Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {members.map((member) => {
                const fullName = `${member.first_name} ${member.last_name}`

                return (
                  <div
                    key={member.id}
                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-secondary- hover:shadow-lg transition-all"
                  >
                    {/* Card Content */}
                    <div className="p-6">
                      {/* Avatar */}
                      <div className="flex justify-center mb-4">
                        {member.avatar_url ? (
                          <Image
                            src={member.avatar_url}
                            alt={fullName}
                            width={80}
                            height={80}
                            className="w-20 h-20 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                            {member.first_name.charAt(0)}
                          </div>
                        )}
                      </div>

                      {/* Name */}
                      <h3 className="text-xl font-bold text-gray-900 text-center mb-1">
                        {fullName}
                      </h3>

                      {/* Member Level */}
                      {member.member_level && (
                        <p className="text-sm text-secondary- font-semibold text-center mb-3 capitalize">
                          {member.member_level}
                        </p>
                      )}

                      {/* Profession & Location */}
                      <div className="space-y-1 text-center mb-4">
                        {member.profession && (
                          <p className="text-sm text-gray-700 font-medium">
                            {member.profession}
                          </p>
                        )}
                        {member.city && (
                          <p className="text-xs text-gray-500">📍 {member.city}</p>
                        )}
                      </div>

                      {/* Bio */}
                      {member.bio && (
                        <p className="text-sm text-gray-600 text-center mb-4 line-clamp-2">
                          {member.bio}
                        </p>
                      )}

                      {/* Skills */}
                      {member.skills && member.skills.length > 0 && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-2 justify-center">
                            {member.skills.slice(0, 3).map((skill, idx) => (
                              <span
                                key={idx}
                                className="text-xs bg-secondary- text-secondary- rounded-full px-3 py-1 font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                            {member.skills.length > 3 && (
                              <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-3 py-1 font-medium">
                                +{member.skills.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Mentor Badge */}
                      {member.is_mentor && (
                        <div className="flex justify-center mb-4">
                          <span className="text-xs bg-purple-100 text-purple-700 rounded-full px-3 py-1 font-bold">
                            🎓 Mentor
                          </span>
                        </div>
                      )}

                      {/* Points */}
                      {member.points && (
                        <p className="text-sm text-gray-600 text-center mb-4">
                          ⭐ {member.points} points
                        </p>
                      )}

                      {/* Action Buttons */}
                      <div className="space-y-3 border-t border-gray-200 pt-4">
                        <button
                          onClick={() => router.push(`/profile/${member.id}`)}
                          className="w-full px-4 py-2 text-sm font-bold text-gray-700 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                        >
                          View Profile
                        </button>

                        <button
                          onClick={() => handleMessageClick(member.id)}
                          className="w-full px-4 py-2 text-sm font-bold text-white bg-secondary- hover:bg-secondary- rounded-full transition-colors"
                        >
                          Send Message
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}