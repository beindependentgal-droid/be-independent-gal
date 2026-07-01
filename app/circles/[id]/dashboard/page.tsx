'use client'

import { useEffect, useState } from 'react'
import type { ElementType } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  BookOpen,
  Users,
  TrendingUp,
  Heart,
  MessageSquare,
  Calendar,
  FileText,
  Settings,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'
import type { DashboardData } from '@/lib/db'
import { CircleFeed } from '@/components/circles/circle-feed'
import { CircleMembers } from '@/components/circles/circle-members'
import { CircleEvents } from '@/components/circles/circle-events'
import { CircleResources } from '@/components/circles/circle-resources'
import { CircleChallenges } from '@/components/circles/circle-challenges'

type TabId = 'feed' | 'members' | 'events' | 'resources' | 'challenges'

const circleInfo: Record<
  string,
  {
    title: string
    icon: ElementType
    color: string
    description: string
  }
> = {
  learn: {
    title: 'Learn Circle',
    icon: BookOpen,
    color: 'bg-blue-600',
    description: 'Develop knowledge, skills, and confidence',
  },
  connect: {
    title: 'Connect Circle',
    icon: Users,
    color: 'bg-purple-600',
    description: 'Build relationships and meaningful connections',
  },
  earn: {
    title: 'Earn Circle',
    icon: TrendingUp,
    color: 'bg-emerald-600',
    description: 'Explore opportunities and financial growth',
  },
  thrive: {
    title: 'Thrive Circle',
    icon: Heart,
    color: 'bg-rose-600',
    description: 'Focus on wellness and balanced living',
  },
}

const tabs: Array<{ id: TabId; label: string; icon: ElementType }> = [
  { id: 'feed', label: 'Circle Feed', icon: MessageSquare },
  { id: 'members', label: 'Members', icon: Users },
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'resources', label: 'Resources', icon: FileText },
  { id: 'challenges', label: 'Challenges', icon: TrendingUp },
]

const validTabs: TabId[] = ['feed', 'members', 'events', 'resources', 'challenges']
const defaultTab: TabId = 'feed'

export default function CircleDashboardPage({
  params,
}: {
  params: { id: string }
}) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const { user, isAuthenticated, loading: authLoading } = useAuth()

  const [activeTab, setActiveTab] = useState<TabId>(defaultTab)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { id } = params

  // Sync active tab with URL search params
  useEffect(() => {
    const tab = searchParams.get('tab') as TabId | null
    if (tab && validTabs.includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!isAuthenticated || authLoading) return

      setIsLoading(true)
      try {
        const response = await fetch(`/api/circles/${id}/dashboard`) // Your API endpoint
        if (!response.ok) {
          throw new Error('Failed to load dashboard data')
        }
        const data: DashboardData = await response.json()
        setDashboardData(data)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        // Handle error state appropriately, e.g., show a message to the user
      } finally {
        setIsLoading(false)
      }
    }

    if (!authLoading) {
      fetchDashboardData()
    }
  }, [id, isAuthenticated, authLoading])

  const handleTabChange = (tab: TabId) => {
    if (tab === activeTab) return
    setActiveTab(tab)
    router.replace(`${pathname}?tab=${tab}`, { scroll: false })
  }

  const handleCreatePost = async (content: string) => {
    const response = await fetch(`/api/circles/${id}/dashboard`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    })

    if (!response.ok) {
      throw new Error('Failed to create post')
    }

    const newPost = await response.json()
    setDashboardData((previous) =>
      previous
        ? {
            ...previous,
            feed: [newPost, ...(previous.feed ?? [])],
          }
        : previous,
    )
  }

  // Check if circle exists
  const circle = circleInfo[id]
  if (!circle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-6">
        <div className="text-center space-y-6 max-w-md">
          <div className="text-5xl">🔍</div>
          <h1 className="text-3xl font-bold text-gray-900">Circle not found</h1>
          <p className="text-gray-600">The circle you're looking for doesn't exist or has been removed.</p>
          <Link href="/circles">
            <Button className="bg-secondary- hover:bg-secondary- text-white font-bold rounded-full h-12 px-8">
              Back to Circles
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // Show loading spinner for auth or data fetch
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-"></div>
          <p className="text-gray-600 font-medium">Loading circle dashboard...</p>
        </div>
      </div>
    )
  }

  // Redirect unauthenticated users
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-6">
        <div className="text-center space-y-6 max-w-md">
          <div className="text-5xl">🔒</div>
          <h1 className="text-3xl font-bold text-gray-900">Access Required</h1>
          <p className="text-gray-600">You need to be signed in to view this circle.</p>
          <div className="space-y-3">
            <Link href="/auth/login" className="block">
              <Button className="w-full bg-secondary- hover:bg-secondary- text-white font-bold rounded-full h-12">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/sign-up" className="block">
              <Button variant="outline" className="w-full rounded-full h-12">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const Icon = circle.icon

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className={`${circle.color} text-white py-12 px-6 sm:px-12 lg:px-16`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Icon className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">{circle.title}</h1>
                <p className="text-white/90 text-lg">
                  Welcome back, {user?.first_name || 'Sister'}! 🌸
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href="/circles">
                <Button variant="outline" className="bg-white/20 text-white hover:bg-white/30 rounded-full h-10 px-6 text-sm font-medium">
                  Change Circle
                </Button>
              </Link>
              <Link href={`/circles/${id}/settings`}>
                <Button className="bg-white text-gray-900 hover:bg-gray-100 rounded-full h-10 px-6 text-sm font-medium flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Settings
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick description */}
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <p className="text-sm text-white/90">{circle.description}</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto py-8 px-6 sm:px-12 lg:px-16">
        {/* Navigation Tabs */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-3 mb-6">
            {tabs.map((tab) => {
              const TabIcon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                    activeTab === tab.id
                      ? `${circle.color} border-transparent bg-opacity-10 text-white`
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {(dashboardData?.metrics ?? []).map((metric, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-secondary- hover:shadow-lg transition-all">
                <p className="text-sm text-gray-600 mb-2">{metric.label}</p>
                <div className="text-3xl font-bold text-gray-900 mb-1">{metric.value}</div>
                <p className="text-xs text-gray-500">{metric.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          {activeTab === 'feed' && (
            <CircleFeed feed={dashboardData?.feed ?? []} onPost={handleCreatePost} />
          )}
          {activeTab === 'members' && <CircleMembers members={dashboardData?.members ?? []} />}
          {activeTab === 'events' && <CircleEvents events={dashboardData?.events ?? []} />}
          {activeTab === 'resources' && <CircleResources resources={dashboardData?.resources ?? []} />}
          {activeTab === 'challenges' && <CircleChallenges challenges={dashboardData?.challenges ?? []} />}
        </div>
      </div>
    </div>
  )
}