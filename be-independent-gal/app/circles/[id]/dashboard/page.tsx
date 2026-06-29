'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { BookOpen, Users, TrendingUp, Heart, MessageSquare, Calendar, Zap, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CircleFeed } from '@/components/circles/circle-feed'
import { CircleMembers } from '@/components/circles/circle-members'
import { CircleEvents } from '@/components/circles/circle-events'
import { CircleChallenges } from '@/components/circles/circle-challenges'
import { CircleNotifications } from '@/components/circles/circle-notifications'
import { CircleResources } from '@/components/circles/circle-resources'
import type { DashboardData } from '@/lib/db'

const circleInfo: Record<
  string,
  {
    icon: typeof BookOpen
    title: string
    color: string
  }
> = {
  learn: {
    icon: BookOpen,
    title: 'Learn Circle',
    color: 'from-blue-600 to-blue-700',
  },
  connect: {
    icon: Users,
    title: 'Connect Circle',
    color: 'from-purple-600 to-purple-700',
  },
  earn: {
    icon: TrendingUp,
    title: 'Earn Circle',
    color: 'from-emerald-600 to-emerald-700',
  },
  thrive: {
    icon: Heart,
    title: 'Thrive Circle',
    color: 'from-rose-600 to-rose-700',
  },
}

const tabs = [
  { id: 'feed', label: 'Feed', icon: MessageSquare },
  { id: 'members', label: 'Members', icon: Users },
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'resources', label: 'Resources', icon: FileText },
  { id: 'challenges', label: 'Challenges', icon: Zap },
] as const

type TabId = (typeof tabs)[number]['id']
const defaultTab: TabId = 'feed'
const validTabs: TabId[] = tabs.map((tab) => tab.id)

const welcomeMetrics = [
  {
    label: 'Active sisters',
    value: '238',
    detail: 'Engaged this week',
  },
  {
    label: 'New posts',
    value: '18',
    detail: 'Shared in the circle feed',
  },
  {
    label: 'Upcoming events',
    value: '3',
    detail: 'RSVP open now',
  },
  {
    label: 'Challenge progress',
    value: '68%',
    detail: 'Monthly completion',
  },
]

const quickActions: {
  label: string
  icon: typeof MessageSquare | typeof Users | typeof Calendar | typeof FileText
  action: TabId
}[] = [
  { label: 'Post update', icon: MessageSquare, action: 'feed' },
  { label: 'Browse members', icon: Users, action: 'members' },
  { label: 'View events', icon: Calendar, action: 'events' },
  { label: 'Open resources', icon: FileText, action: 'resources' },
]

export default function CircleDashboardPage({
  params,
}: {
  params: { id: string }
}) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const initialTab = ((): TabId => {
    const tab = searchParams.get('tab')
    return validTabs.includes(tab as TabId) ? (tab as TabId) : defaultTab
  })()

  const [activeTab, setActiveTab] = useState<TabId>(initialTab)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { id } = params

  useEffect(() => {
    const tab = searchParams.get('tab') as TabId | null
    if (tab && validTabs.includes(tab) && tab !== activeTab) {
      setActiveTab(tab)
    }
  }, [searchParams, activeTab])

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true)
      const response = await fetch(`/api/circles/${id}/dashboard`)
      if (!response.ok) {
        setDashboardData(null)
        setIsLoading(false)
        return
      }
      const data = (await response.json()) as DashboardData
      setDashboardData(data)
      setIsLoading(false)
    }

    fetchDashboardData()
  }, [id])

  const handleNewPost = async (content: string) => {
    const response = await fetch(`/api/circles/${id}/dashboard`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    })

    if (!response.ok) {
      return
    }

    const post = await response.json()
    setDashboardData((current) =>
      current
        ? {
            ...current,
            feed: [post, ...current.feed],
          }
        : current,
    )
  }

  const handleTabChange = (tab: TabId) => {
    if (tab === activeTab) return
    setActiveTab(tab)
    router.replace(`${pathname}?tab=${tab}`, { scroll: false })
  }

  const circle = circleInfo[id]
  if (!circle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Circle not found</h1>
          <Button asChild>
            <Link href="/circles">Back to circles</Link>
          </Button>
        </div>
      </div>
    )
  }

  const Icon = circle.icon

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className={`bg-gradient-to-r ${circle.color} py-12 text-white sticky top-0 z-10`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
                <Icon className="h-8 w-8" />
              </div>
              <div>
                <h1 className="font-heading text-3xl font-extrabold">
                  {circle.title}
                </h1>
                <p className="text-white/80 mt-1">Welcome back, Amina! 🌸</p>
              </div>
            </div>
            <Link
              href="/circles"
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              Change Circle
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <section className="bg-white/95 border-b border-border py-8 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/80">
                Circle dashboard
              </p>
              <h2 className="mt-3 text-3xl font-bold text-secondary">
                Run your circle with clarity and energy.
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Quickly see what matters and jump to the feed, events, or resources without losing your place.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button size="sm" className="rounded-full" onClick={() => handleTabChange('feed')}>
                Post update
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => handleTabChange('events')}
              >
                Browse events
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="border-b border-border bg-card sticky top-24 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => {
                const TabIcon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-3 text-sm font-semibold transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground'
                    }`}
                  >
                    <TabIcon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>
            <div className="flex flex-wrap gap-2">
              {quickActions.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setActiveTab(item.action)}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-3 text-sm font-medium text-foreground transition hover:border-primary hover:text-primary"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section className="bg-muted/70 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(dashboardData?.metrics ?? welcomeMetrics).map((metric) => (
              <div
                key={metric.label}
                className="rounded-3xl border border-border bg-card p-6"
              >
                <p className="text-sm font-semibold text-muted-foreground">
                  {metric.label}
                </p>
                <p className="mt-4 text-3xl font-heading font-extrabold text-secondary">
                  {metric.value}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{metric.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[minmax(260px,320px)_1fr]">
            <div className="space-y-6">
              <CircleNotifications notifications={dashboardData?.notifications ?? []} />
            </div>

            <div className="space-y-6">
              {activeTab === 'feed' && (
                <CircleFeed feed={dashboardData?.feed ?? []} onPost={handleNewPost} />
              )}
              {activeTab === 'members' && <CircleMembers />}
              {activeTab === 'events' && <CircleEvents />}
              {activeTab === 'resources' && <CircleResources />}
              {activeTab === 'challenges' && <CircleChallenges />}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      {/*
        Old content replaced by the dashboard layout above.
      */}
    </div>
  )
}
