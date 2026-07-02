'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Loader, Trophy, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'

interface LeaderboardEntry {
  id: string
  rank: number
  total_points: number
  user: {
    id: string
    first_name: string
    last_name: string
    avatar_url?: string
    member_level?: string
  }
}

export default function LeaderboardPage() {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, loading: authLoading } = useAuth()

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [period, setPeriod] = useState<'all_time' | 'month' | 'week'>('all_time')
  const [error, setError] = useState<string | null>(null)

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/auth/login?redirect=${encodeURIComponent(pathname ?? '/leaderboard')}`)
    }
  }, [authLoading, isAuthenticated, router, pathname])

  // Fetch leaderboard
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const res = await fetch(`/api/gamification/leaderboard?period=${period}&pageSize=50`)

        if (!res.ok) {
          throw new Error('Failed to load leaderboard')
        }

        const data = await res.json()
        setLeaderboard(data.leaderboard || [])
      } catch (err: any) {
        setError(err?.message || 'Failed to load leaderboard')
      } finally {
        setIsLoading(false)
      }
    }

    if (isAuthenticated) {
      fetchLeaderboard()
    }
  }, [period, isAuthenticated])

  const getMedalIcon = (rank: number) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return null
  }

  const getPeriodLabel = () => {
    switch (period) {
      case 'week':
        return 'This Week'
      case 'month':
        return 'This Month'
      case 'all_time':
        return 'All Time'
      default:
        return 'All Time'
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary text-white py-16 px-6 sm:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Leaderboard</h1>
            <Trophy className="w-8 h-8" />
          </div>
          <p className="text-xl text-white/90">
            See who's leading the community with their contributions and engagement
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 sm:px-12 lg:px-16 py-12">
        {/* Period Selector */}
        <div className="flex gap-3 mb-12 justify-center flex-wrap">
          {(['all_time', 'month', 'week'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-6 py-3 rounded-full font-bold transition-all ${
                period === p
                  ? 'bg-secondary- text-white shadow-lg'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-secondary-'
              }`}
            >
              {p === 'all_time' ? '🏆 All Time' : p === 'month' ? '📅 This Month' : '⚡ This Week'}
            </button>
          ))}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-center mb-8">
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
        {isLoading && !error && (
          <div className="space-y-6">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse"
              >
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && leaderboard.length === 0 && !error && (
          <div className="text-center py-16">
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-3">No entries yet</h2>
            <p className="text-gray-600 mb-8">
              Start earning points by engaging in the community!
            </p>
            <Link href="/community">
              <Button className="bg-secondary- hover:bg-secondary- text-white font-bold rounded-full h-12 px-8">
                Go to Community
              </Button>
            </Link>
          </div>
        )}

        {/* Leaderboard Content */}
        {!isLoading && leaderboard.length > 0 && !error && (
          <div className="space-y-8">
            {/* Top 3 Special Display */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {leaderboard.slice(0, 3).map((entry, idx) => {
                const medal = getMedalIcon(entry.rank)
                const isFirstPlace = entry.rank === 1

                return (
                  <Link
                    key={entry.id}
                    href={`/profile/${entry.user.id}`}
                  >
                    <div
                      className={`rounded-2xl p-8 text-center transition-all hover:shadow-xl cursor-pointer ${
                        isFirstPlace
                          ? 'bg-gradient-to-b from-yellow-400 to-yellow-300 text-gray-900 border-4 border-yellow-500 transform scale-105'
                          : idx === 1
                            ? 'bg-gradient-to-b from-gray-300 to-gray-200 text-gray-900 border-4 border-gray-400'
                            : 'bg-gradient-to-b from-orange-300 to-orange-200 text-gray-900 border-4 border-orange-400'
                      }`}
                    >
                      {/* Medal */}
                      <div className="text-6xl mb-4">{medal}</div>

                      {/* Avatar */}
                      <div className="mb-4 flex justify-center">
                        {entry.user.avatar_url ? (
                          <Image
                            src={entry.user.avatar_url}
                            alt={entry.user.first_name}
                            width={80}
                            height={80}
                            className="w-20 h-20 rounded-full object-cover border-4 border-white"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-white/50 flex items-center justify-center text-3xl font-bold">
                            {entry.user.first_name.charAt(0)}
                          </div>
                        )}
                      </div>

                      {/* Name */}
                      <h3 className="text-xl font-bold mb-1">
                        {entry.user.first_name} {entry.user.last_name}
                      </h3>

                      {/* Member Level */}
                      {entry.user.member_level && (
                        <p className="text-sm font-semibold mb-3 opacity-80">
                          {entry.user.member_level}
                        </p>
                      )}

                      {/* Points */}
                      <div className="pt-4 border-t-4 border-white/30">
                        <p className="text-4xl font-bold">{entry.total_points}</p>
                        <p className="text-sm font-semibold opacity-80">points</p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>

            {/* Rest of Leaderboard */}
            {leaderboard.length > 3 && (
              <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
                <div className="bg-primary/10 px-8 py-6 border-b-2 border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Rankings 4-{leaderboard.length}
                  </h2>
                </div>

                <div className="divide-y divide-gray-200">
                  {leaderboard.slice(3).map((entry, idx) => (
                    <Link
                      key={entry.id}
                      href={`/profile/${entry.user.id}`}
                      className="block"
                    >
                      <div className="px-8 py-6 hover:bg-secondary- transition-colors flex items-center gap-6">
                        {/* Rank */}
                        <div className="flex-shrink-0 w-12 text-center">
                          <p className="text-2xl font-bold text-gray-400">
                            #{entry.rank}
                          </p>
                        </div>

                        {/* Avatar */}
                        <div className="flex-shrink-0">
                          {entry.user.avatar_url ? (
                            <Image
                              src={entry.user.avatar_url}
                              alt={entry.user.first_name}
                              width={48}
                              height={48}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold">
                              {entry.user.first_name.charAt(0)}
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 hover:text-secondary-">
                            {entry.user.first_name} {entry.user.last_name}
                          </h4>
                          {entry.user.member_level && (
                            <p className="text-sm text-gray-500">
                              {entry.user.member_level}
                            </p>
                          )}
                        </div>

                        {/* Points */}
                        <div className="flex-shrink-0 text-right">
                          <p className="text-2xl font-bold text-secondary-">
                            ⭐ {entry.total_points}
                          </p>
                          <p className="text-xs text-gray-500">points</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* How to Earn Points */}
      <div className="bg-white border-t-2 border-gray-200 py-16 px-6 sm:px-12 lg:px-16 mt-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            How to Earn Points
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '📝',
                title: 'Create Posts',
                points: '+10 points',
                desc: 'Share updates and start conversations',
              },
              {
                icon: '💬',
                title: 'Comment',
                points: '+5 points',
                desc: 'Engage with community discussions',
              },
              {
                icon: '❤️',
                title: 'Like Posts',
                points: '+2 points',
                desc: 'Support fellow members',
              },
              {
                icon: '📅',
                title: 'Attend Events',
                points: '+25 points',
                desc: 'Participate in community events',
              },
              {
                icon: '🏆',
                title: 'Complete Challenges',
                points: '+50 points',
                desc: 'Finish monthly challenges',
              },
              {
                icon: '🎓',
                title: 'Take Courses',
                points: '+30 points',
                desc: 'Enroll in academy programs',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200 hover:border-secondary- transition-colors text-center"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-secondary- font-bold text-lg mb-3">
                  {item.points}
                </p>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}