'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ArrowRight,
  Award,
  BellRing,
  BookOpen,
  Briefcase,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Compass,
  Flame,
  HandHeart,
  Home,
  MessageCircle,
  Plus,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Users,
  Users2,
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useDashboardLoader } from '@/lib/hooks/use-dashboard-loader'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/community', label: 'Community', icon: Users },
  { href: '/academy', label: 'Academy', icon: BookOpen },
  { href: '/circles', label: 'Circles', icon: Users2 },
  { href: '/opportunities', label: 'Opportunities', icon: Briefcase },
  { href: '/events', label: 'Events', icon: Calendar },
]

const quickActions = [
  { label: 'Create Post', icon: MessageCircle, href: '/community' },
  { label: 'Join Event', icon: Calendar, href: '/events' },
  { label: 'Browse Academy', icon: BookOpen, href: '/academy' },
  { label: 'Explore Opportunities', icon: Briefcase, href: '/opportunities' },
  { label: 'Join a Circle', icon: Users2, href: '/circles' },
  { label: 'Join BIG Club', icon: HandHeart, href: '/big-club' },
]

function formatRelativeTime(value?: string | null) {
  if (!value) return 'recently'
  const diffInMinutes = Math.round((Date.now() - new Date(value).getTime()) / 60000)
  if (diffInMinutes < 60) return `${Math.max(1, diffInMinutes)} min ago`
  if (diffInMinutes < 1440) return `${Math.round(diffInMinutes / 60)}h ago`
  if (diffInMinutes < 10080) return `${Math.round(diffInMinutes / 1440)}d ago`
  return `${Math.round(diffInMinutes / 10080)}w ago`
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good Morning'
  if (hour < 18) return 'Good Afternoon'
  return 'Good Evening'
}

export default function DashboardShell() {
  const pathname = usePathname() || '/dashboard'
  const { user } = useAuth()
  const { data, loading } = useDashboardLoader()

  const profile = data?.profile
  const upcomingEvents = data?.upcomingEvents || []
  const opportunities = data?.opportunities || []
  const communityPosts = data?.communityPosts || []
  const recentActivity = data?.recentActivity || []
  const stats = data?.stats
  const nextSteps = data?.nextSteps || []
  const goals = data?.goals || []
  const club = data?.club
  const notifications = data?.notifications || []
  const registeredEventIds = data?.registeredEventIds || []
  const lastUpdated = data?.lastUpdated

  const firstName = profile?.first_name || profile?.full_name?.split(' ')[0] || user?.first_name || user?.email?.split('@')[0] || 'there'
  const profileCompletion = stats?.profileCompletion ?? 0
  const today = new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())
  const greeting = getGreeting()

  const communityStats = [
    { label: 'Posts', value: stats?.postsCreated ?? 0, progress: Math.min(100, (stats?.postsCreated ?? 0) * 20 + 10), tone: 'from-violet-500 to-fuchsia-500' },
    { label: 'Comments', value: stats?.commentsMade ?? 0, progress: Math.min(100, (stats?.commentsMade ?? 0) * 12 + 8), tone: 'from-sky-500 to-cyan-500' },
    { label: 'Reactions', value: Math.max(8, (stats?.postsCreated ?? 0) * 3 + (stats?.commentsMade ?? 0) * 2), progress: 74, tone: 'from-amber-500 to-orange-500' },
    { label: 'Connections', value: Math.max(4, (stats?.circlesJoined ?? 0) * 3 + 2), progress: 82, tone: 'from-emerald-500 to-lime-500' },
  ]

  const learningStats = [
    { label: 'Current Course', value: stats?.coursesCompleted ? 'Financial Independence' : 'Ready to start', progress: Math.min(100, (stats?.coursesCompleted ?? 0) * 35 + 10), tone: 'from-indigo-500 to-violet-500' },
    { label: 'Progress', value: `${Math.max(10, profileCompletion - 5)}%`, progress: Math.max(12, profileCompletion - 5), tone: 'from-rose-500 to-pink-500' },
    { label: 'Certificates', value: stats?.coursesCompleted ? `${stats.coursesCompleted}` : '0', progress: Math.min(100, (stats?.coursesCompleted ?? 0) * 20), tone: 'from-slate-700 to-slate-900' },
  ]

  const growthStats = [
    { label: 'Events', value: stats?.eventsRegistered ?? 0, progress: Math.min(100, (stats?.eventsRegistered ?? 0) * 25 + 5), tone: 'from-violet-500 to-indigo-500' },
    { label: 'Circles', value: stats?.circlesJoined ?? 0, progress: Math.min(100, (stats?.circlesJoined ?? 0) * 20 + 15), tone: 'from-fuchsia-500 to-pink-500' },
    { label: 'BIG Club', value: club ? 'Joined' : 'Not joined', progress: club ? 100 : 25, tone: 'from-amber-500 to-orange-500' },
    { label: 'Volunteer', value: '0 hrs', progress: 12, tone: 'from-emerald-500 to-lime-500' },
  ]

  const activityTimeline = recentActivity.length > 0
    ? recentActivity.map((item) => ({
        label: formatRelativeTime(item.created_at),
        title: item.title,
        description: item.description,
      }))
    : [
        { label: 'Today', title: 'Completed your profile photo', description: 'A polished profile helps the right people find you.' },
        { label: 'Yesterday', title: 'Joined a circle', description: 'Your next step is to meet people who share your goals.' },
        { label: '3 days ago', title: 'Registered for an event', description: 'Showing up builds momentum and visibility.' },
        { label: 'Last week', title: 'Connected with a mentor', description: 'One strong connection can unlock new opportunities.' },
      ]

  const analyticsBars = [
    { label: 'Connections', value: Math.max(20, (stats?.circlesJoined ?? 0) * 14 + 16) },
    { label: 'Posts', value: Math.max(18, (stats?.postsCreated ?? 0) * 18 + 8) },
    { label: 'Reactions', value: Math.max(25, (stats?.commentsMade ?? 0) * 11 + 18) },
    { label: 'Events', value: Math.max(16, (stats?.eventsRegistered ?? 0) * 16 + 10) },
  ]

  const missionBoard = [
    { title: 'Complete profile', done: profileCompletion >= 70 },
    { title: 'Join BIG Club', done: Boolean(club) },
    { title: 'Make first connection', done: (stats?.circlesJoined ?? 0) > 0 || (stats?.eventsRegistered ?? 0) > 0 },
    { title: 'Publish first post', done: (stats?.postsCreated ?? 0) > 0 },
    { title: 'Join one Circle', done: (stats?.circlesJoined ?? 0) > 0 },
    { title: 'Attend one Event', done: (stats?.eventsRegistered ?? 0) > 0 },
  ]

  const recommendedActions = [
    'Complete your profile',
    'Join Nairobi BIG Club',
    'Connect with 5 women',
    'Attend Orientation',
    'Take Financial Independence Course',
  ]

  const peopleToMeet = [
    { name: 'Mercy', role: 'Community Builder', match: '92%', accent: 'from-violet-500 to-fuchsia-500' },
    { name: 'Sharon', role: 'Entrepreneur', match: '89%', accent: 'from-slate-700 to-slate-900' },
  ]

  const actionTiles = [
    { label: 'Resume Academy', href: '/academy', icon: BookOpen, tone: 'from-violet-600 to-fuchsia-600' },
    { label: 'Open Messages', href: '/messages', icon: MessageCircle, tone: 'from-sky-600 to-cyan-600' },
    { label: 'View Connections', href: '/connections', icon: Users, tone: 'from-amber-600 to-orange-600' },
    { label: 'BIG Club', href: '/community', icon: HandHeart, tone: 'from-emerald-600 to-lime-600' },
    { label: 'Opportunities', href: '/opportunities', icon: Briefcase, tone: 'from-slate-700 to-slate-900' },
    { label: 'Volunteer', href: '/community', icon: Sparkles, tone: 'from-rose-600 to-pink-600' },
    { label: 'Explore Community', href: '/community', icon: Compass, tone: 'from-indigo-600 to-violet-600' },
  ]

  const networkHighlights = [
    {
      title: notifications[0]?.message || 'Mercy accepted your connection',
      detail: 'Your circle keeps expanding with meaningful introductions.',
    },
    {
      title: 'Faith invited you to Founders Circle',
      detail: 'A warm welcome into one of the most active circles this week.',
    },
    {
      title: 'Pauline viewed your profile',
      detail: 'People are noticing your momentum and reaching out.',
    },
  ]

  const aiSuggestions = [
    'Apply for the next grant opportunity',
    'Connect with Pauline before Friday',
    'Complete Lesson 3 in Academy',
    'Attend tomorrow’s event with your circle',
  ]

  const clubRoles = ['President', 'Vice President', 'Secretary', 'Treasurer']

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.08),transparent_35%),linear-gradient(180deg,#fcfbff_0%,#f8f7ff_100%)] text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 rounded-[28px] border border-white/70 bg-white/80 px-5 py-4 shadow-[0_20px_60px_-24px_rgba(109,40,217,0.35)] backdrop-blur xl:px-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-600">BIG member dashboard</p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{greeting}, {firstName} 👋</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">Welcome back to your BIG journey. Today is another opportunity to learn, connect, grow your network and build your independence.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const active = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition ${
                      active ? 'bg-violet-600 text-white shadow-lg shadow-violet-200' : 'bg-slate-100 text-slate-700 hover:bg-violet-50 hover:text-violet-700'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <main className="space-y-6">
            <section className="rounded-[32px] border border-slate-200/80 bg-white p-6 shadow-[0_20px_60px_-24px_rgba(15,23,42,0.25)] sm:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-sm font-medium text-violet-700">
                    <Sparkles className="h-4 w-4" />
                    Your daily operating system for BIG growth
                  </div>
                  <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Welcome back to your BIG journey.</h2>
                  <p className="mt-3 text-base text-slate-600">Today is another opportunity to learn, connect, grow your network and build your independence.</p>
                  <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-600">
                    <span className="rounded-full bg-slate-100 px-3 py-2">{today}</span>
                    <span className="rounded-full bg-slate-100 px-3 py-2">{stats?.circlesJoined ?? 0} circles joined</span>
                    <span className="rounded-full bg-slate-100 px-3 py-2">{stats?.eventsRegistered ?? 0} events registered</span>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[22px] border border-violet-100 bg-linear-to-br from-violet-600 to-fuchsia-500 p-4 text-white shadow-lg shadow-violet-200">
                    <div className="flex items-center gap-2 text-sm font-medium text-violet-100">
                      <Flame className="h-4 w-4" />
                      Current Streak
                    </div>
                    <p className="mt-3 text-3xl font-semibold">8 Days</p>
                  </div>
                  <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                      <Award className="h-4 w-4 text-violet-600" />
                      Community Rank
                    </div>
                    <p className="mt-3 text-3xl font-semibold text-slate-950">Top 12%</p>
                  </div>
                  <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                      <HandHeart className="h-4 w-4 text-violet-600" />
                      BIG Club
                    </div>
                    <p className="mt-3 text-2xl font-semibold text-slate-950">{club ? 'Joined' : 'Not Joined'}</p>
                  </div>
                  <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                      <Target className="h-4 w-4 text-violet-600" />
                      Weekly Goal
                    </div>
                    <p className="mt-3 text-2xl font-semibold text-slate-950">{Math.max(10, profileCompletion - 5)}% Complete</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-slate-950">My Network</p>
                    <p className="text-sm text-slate-500">A live pulse of your most meaningful relationships</p>
                  </div>
                  <div className="rounded-full bg-violet-50 px-3 py-1 text-sm font-medium text-violet-700">{lastUpdated ? 'Live now' : 'Synced'}</div>
                </div>
                <div className="mt-6 space-y-3">
                  {networkHighlights.map((item) => (
                    <div key={item.title} className="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-start gap-3">
                        <div className="rounded-full bg-violet-100 p-2 text-violet-700">
                          <Users className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{item.title}</p>
                          <p className="mt-1 text-sm text-slate-600">{item.detail}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold text-slate-950">BIG Assistant</p>
                      <p className="text-sm text-slate-500">Your personal success coach for the day</p>
                    </div>
                    <div className="rounded-full bg-violet-50 p-2 text-violet-700">
                      <Sparkles className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-6 rounded-[24px] border border-violet-100 bg-violet-50 p-5 text-sm leading-7 text-slate-700">
                    <p className="font-semibold text-slate-950">Hi {firstName} 👋</p>
                    <p className="mt-2">Today I recommend</p>
                    <ul className="mt-3 space-y-2">
                      {aiSuggestions.map((item) => (
                        <li key={item} className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-violet-600" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold text-slate-950">BIG Club Experience</p>
                      <p className="text-sm text-slate-500">The movement becomes the home base</p>
                    </div>
                    <div className="rounded-full bg-violet-50 p-2 text-violet-700">
                      <HandHeart className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-6 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-700">BIG Club Nairobi</p>
                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      {clubRoles.map((role) => (
                        <div key={role} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700">
                          {role}
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-600">
                      <span className="rounded-full bg-white px-3 py-2">Upcoming Meeting</span>
                      <span className="rounded-full bg-white px-3 py-2">Committee</span>
                      <span className="rounded-full bg-white px-3 py-2">Projects</span>
                      <span className="rounded-full bg-white px-3 py-2">Members</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="grid gap-4 xl:grid-cols-3">
              <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold text-slate-950">Community</p>
                    <p className="text-sm text-slate-500">Momentum in your network</p>
                  </div>
                  <div className="rounded-2xl bg-violet-50 p-3 text-violet-700">
                    <Users className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-5 space-y-3">
                  {communityStats.map((item) => (
                    <div key={item.label}>
                      <div className="mb-1 flex items-center justify-between text-sm text-slate-600">
                        <span>{item.label}</span>
                        <span className="font-semibold text-slate-950">{item.value}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div className={`h-full rounded-full bg-linear-to-r ${item.tone}`} style={{ width: `${item.progress}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold text-slate-950">Learning</p>
                    <p className="text-sm text-slate-500">Your next skill unlock</p>
                  </div>
                  <div className="rounded-2xl bg-sky-50 p-3 text-sky-700">
                    <BookOpen className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-5 space-y-3">
                  {learningStats.map((item) => (
                    <div key={item.label}>
                      <div className="mb-1 flex items-center justify-between text-sm text-slate-600">
                        <span>{item.label}</span>
                        <span className="font-semibold text-slate-950">{item.value}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div className={`h-full rounded-full bg-linear-to-r ${item.tone}`} style={{ width: `${item.progress}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold text-slate-950">Growth</p>
                    <p className="text-sm text-slate-500">How your journey is expanding</p>
                  </div>
                  <div className="rounded-2xl bg-amber-50 p-3 text-amber-700">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-5 space-y-3">
                  {growthStats.map((item) => (
                    <div key={item.label}>
                      <div className="mb-1 flex items-center justify-between text-sm text-slate-600">
                        <span>{item.label}</span>
                        <span className="font-semibold text-slate-950">{item.value}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div className={`h-full rounded-full bg-linear-to-r ${item.tone}`} style={{ width: `${item.progress}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-slate-950">BIG Activity Timeline</p>
                    <p className="text-sm text-slate-500">Your moments, captured like a professional profile</p>
                  </div>
                  <div className="rounded-full bg-violet-50 px-3 py-1 text-sm font-medium text-violet-700">LinkedIn style</div>
                </div>

                <div className="mt-6 space-y-4">
                  {activityTimeline.map((item, index) => (
                    <div key={`${item.title}-${index}`} className="relative pl-6">
                      {index !== activityTimeline.length - 1 ? <div className="absolute left-1.75 top-6 h-[calc(100%+0.75rem)] w-px bg-slate-200" /> : null}
                      <div className="absolute left-0 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-violet-600" />
                      <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-700">{item.label}</p>
                        <p className="mt-2 font-semibold text-slate-900">{item.title}</p>
                        <p className="mt-1 text-sm text-slate-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-slate-950">Community Growth</p>
                    <p className="text-sm text-slate-500">Live momentum at a glance</p>
                  </div>
                  <div className="rounded-full bg-violet-50 px-3 py-1 text-sm font-medium text-violet-700">Live</div>
                </div>

                <div className="mt-6 space-y-4">
                  {analyticsBars.map((item) => (
                    <div key={item.label}>
                      <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                        <span>{item.label}</span>
                        <span className="font-semibold text-slate-950">{Math.round(item.value / 4)}%</span>
                      </div>
                      <div className="flex h-3 items-center gap-1">
                        {Array.from({ length: 12 }).map((_, index) => (
                          <div key={`${item.label}-${index}`} className={`h-full flex-1 rounded-full ${index < Math.round(item.value / 8) ? 'bg-violet-600' : 'bg-slate-200'}`} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-[32px] border border-slate-200/80 bg-linear-to-br from-slate-950 via-violet-950 to-fuchsia-900 p-6 text-white shadow-[0_20px_60px_-24px_rgba(15,23,42,0.35)]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-200">My BIG Club</p>
                    <h3 className="mt-2 text-2xl font-semibold">Premium access to the people and opportunities that matter most.</h3>
                  </div>
                  <div className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-medium">{club ? 'Active Member' : 'Not Joined'}</div>
                </div>

                <div className="mt-6 rounded-[24px] border border-white/10 bg-white/10 p-5 backdrop-blur">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-200">Status</p>
                  <p className="mt-2 text-3xl font-semibold">{club ? club.name : 'Not Joined'}</p>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {['Business Networking', 'Exclusive Events', 'Leadership Positions', 'Business Referrals', 'Club Directory'].map((benefit) => (
                      <div key={benefit} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-sm text-violet-50">
                        <CheckCircle2 className="h-4 w-4" />
                        {benefit}
                      </div>
                    ))}
                  </div>
                  <Link href="/community" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-violet-100">
                    Join BIG Club
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-slate-950">Recommended for You</p>
                    <p className="text-sm text-slate-500">Because you joined BIG recently</p>
                  </div>
                  <div className="rounded-full bg-violet-50 p-2 text-violet-700">
                    <Sparkles className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-6 space-y-3">
                  {recommendedActions.map((item) => (
                    <div key={item} className="flex items-center justify-between rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                      <span>{item}</span>
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-slate-950">Mission Board</p>
                    <p className="text-sm text-slate-500">Gamified momentum for your week</p>
                  </div>
                  <div className="rounded-full bg-violet-50 px-3 py-1 text-sm font-medium text-violet-700">+250 BIG Points</div>
                </div>

                <div className="mt-6 space-y-3">
                  {missionBoard.map((item) => (
                    <div key={item.title} className="flex items-center justify-between rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${item.done ? 'bg-violet-100 text-violet-700' : 'bg-slate-200 text-slate-600'}`}>
                          {item.done ? <CheckCircle2 className="h-4 w-4" /> : <Target className="h-4 w-4" />}
                        </div>
                        <span className="text-sm font-medium text-slate-700">{item.title}</span>
                      </div>
                      <span className={`text-xs font-semibold uppercase tracking-[0.2em] ${item.done ? 'text-violet-600' : 'text-slate-500'}`}>
                        {item.done ? 'Done' : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-slate-950">Trending Today</p>
                    <p className="text-sm text-slate-500">What is lighting up the community right now</p>
                  </div>
                  <Link href="/community" className="text-sm font-semibold text-violet-700">View feed</Link>
                </div>
                <div className="mt-6 space-y-3">
                  {['Pauline launched a boutique', 'Faith raised KSh250,000', 'Nairobi BIG Club meeting', 'New funding opportunity'].map((item) => (
                    <div key={item} className="flex items-center gap-3 rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                      <Flame className="h-4 w-4 text-orange-500" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-slate-950">People You Should Meet</p>
                    <p className="text-sm text-slate-500">High-fit connections for your next step</p>
                  </div>
                  <Link href="/connections" className="text-sm font-semibold text-violet-700">View all</Link>
                </div>
                <div className="mt-6 space-y-3">
                  {peopleToMeet.map((person) => (
                    <div key={person.name} className="flex items-center justify-between rounded-[20px] border border-slate-200 bg-slate-50 p-4">
                      <div>
                        <p className="font-semibold text-slate-900">{person.name}</p>
                        <p className="text-sm text-slate-500">{person.role}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-violet-700">{person.match} Match</p>
                        <Link href="/connections" className="mt-2 inline-flex rounded-full bg-violet-600 px-3 py-1 text-xs font-semibold text-white">Connect</Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-slate-950">Upcoming Events</p>
                    <p className="text-sm text-slate-500">Beautiful cards for the next thing to show up for</p>
                  </div>
                  <Link href="/events" className="text-sm font-semibold text-violet-700">Explore</Link>
                </div>
                <div className="mt-6 space-y-3">
                  {upcomingEvents.length > 0 ? upcomingEvents.map((event) => (
                    <div key={event.id} className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-900">{event.title}</p>
                          <p className="mt-1 text-sm text-slate-500">{event.date ? new Date(event.date).toLocaleDateString('en', { month: 'short', day: 'numeric' }) : 'TBD'}</p>
                        </div>
                        <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-violet-700">{registeredEventIds.includes(event.id) ? 'Registered' : 'Open'}</span>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
                        <span>{event.location || 'Virtual'}</span>
                        <Link href="/events" className="font-semibold text-violet-700">Reserve seat</Link>
                      </div>
                    </div>
                  )) : (
                    <div className="rounded-[20px] border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                      No upcoming events yet. Keep an eye on what is coming next.
                    </div>
                  )}
                </div>
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-slate-950">Notifications</p>
                    <p className="text-sm text-slate-500">The next best action for you</p>
                  </div>
                  <Link href="/messages" className="text-sm font-semibold text-violet-700">View all</Link>
                </div>
                <div className="mt-6 space-y-3">
                  {notifications.length > 0 ? notifications.map((item) => (
                    <div key={item.id} className="flex items-start gap-3 rounded-[16px] border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                      <BellRing className="mt-0.5 h-4 w-4 text-violet-600" />
                      <span>{item.message || item.title}</span>
                    </div>
                  )) : (
                    <div className="rounded-[16px] border border-dashed border-slate-300 bg-slate-50 p-3 text-sm text-slate-600">Your feed is quiet right now. A few meaningful actions will wake it up.</div>
                  )}
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-slate-950">BIG Insights</p>
                    <p className="text-sm text-slate-500">Your AI-guided nudge for the day</p>
                  </div>
                  <div className="rounded-full bg-violet-50 p-2 text-violet-700">
                    <Sparkles className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-6 rounded-[24px] border border-violet-100 bg-violet-50 p-5 text-sm leading-7 text-slate-700">
                  <p>You are among the most active new members.</p>
                  <p>Joining one circle could increase your network by 45%.</p>
                  <p>Women who attend two events are three times more likely to become mentors.</p>
                  <p>Complete your profile to receive better opportunity matches.</p>
                </div>
              </div>
            </section>

            <section className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-slate-950">Continue Your Journey</p>
                  <p className="text-sm text-slate-500">Large colorful cards for your next step</p>
                </div>
                <div className="rounded-full bg-violet-50 px-3 py-1 text-sm font-medium text-violet-700">Daily actions</div>
              </div>
              <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {actionTiles.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link key={item.label} href={item.href} className={`rounded-[22px] bg-linear-to-br ${item.tone} p-4 text-white shadow-sm transition hover:-translate-y-0.5`}>
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-base font-semibold">{item.label}</p>
                        <div className="rounded-full bg-white/15 p-2">
                          <Icon className="h-4 w-4" />
                        </div>
                      </div>
                      <p className="mt-4 text-sm text-white/80">Take the next step in your BIG journey.</p>
                    </Link>
                  )
                })}
              </div>
            </section>

            <section className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-slate-950">BIG Score & Badges</p>
                  <p className="text-sm text-slate-500">Progress that feels rewarding</p>
                </div>
                <div className="rounded-full bg-violet-50 px-3 py-1 text-sm font-medium text-violet-700">Level 4</div>
              </div>
              <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="rounded-[24px] border border-violet-100 bg-violet-50 p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-700">BIG Score</p>
                  <p className="mt-3 text-4xl font-semibold text-slate-950">1,240 XP</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {['Community Starter', 'Event Explorer', 'Mentor Supporter', 'Business Builder'].map((badge) => (
                    <div key={badge} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
                      <Trophy className="h-4 w-4 text-amber-500" />
                      {badge}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </main>

          <aside className="hidden space-y-6 xl:block">
            <div className="sticky top-6 space-y-6">
              <section className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-slate-950">BIG Club</p>
                    <p className="text-sm text-slate-500">Your premium home base</p>
                  </div>
                  <div className="rounded-full bg-violet-50 p-2 text-violet-700">
                    <HandHeart className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-5 rounded-[24px] border border-violet-100 bg-violet-50 p-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-700">Status</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">{club ? club.name : 'Not Joined'}</p>
                  <div className="mt-4 space-y-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-violet-600" /> Business Networking</div>
                    <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-violet-600" /> Exclusive Events</div>
                    <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-violet-600" /> Leadership Positions</div>
                  </div>
                  <Link href="/community" className="mt-4 inline-flex items-center gap-2 rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white">Join BIG Club <ArrowRight className="h-4 w-4" /></Link>
                </div>
              </section>

              <section className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-slate-950">Your Next Moves</p>
                    <p className="text-sm text-slate-500">Small steps that create momentum</p>
                  </div>
                  <div className="rounded-full bg-slate-100 p-2 text-slate-600">
                    <Compass className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-5 grid gap-2">
                  {nextSteps.length > 0 ? nextSteps.map((step) => (
                    <div key={step} className="flex items-center justify-between rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                      <span>{step}</span>
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </div>
                  )) : (
                    <div className="rounded-[16px] border border-dashed border-slate-300 bg-slate-50 p-3 text-sm text-slate-600">You are on track. Keep going.</div>
                  )}
                </div>
              </section>

              <section className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-slate-950">Quick Actions</p>
                    <p className="text-sm text-slate-500">Jump back in fast</p>
                  </div>
                  <div className="rounded-full bg-violet-50 p-2 text-violet-700">
                    <Sparkles className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-5 grid gap-2">
                  {quickActions.map((action) => {
                    const Icon = action.icon
                    return (
                      <Link key={action.label} href={action.href} className="flex items-center justify-between rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700">
                        <span className="flex items-center gap-3">
                          <Icon className="h-4 w-4" />
                          {action.label}
                        </span>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    )
                  })}
                </div>
              </section>
            </div>
          </aside>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 block border-t border-slate-200 bg-white/95 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link href="/community" className="inline-flex flex-col items-center gap-1 text-xs text-slate-700 hover:text-violet-700">
            <Users className="h-5 w-5" />
            Community
          </Link>
          <Link href="/academy" className="inline-flex flex-col items-center gap-1 text-xs text-slate-700 hover:text-violet-700">
            <BookOpen className="h-5 w-5" />
            Academy
          </Link>
          <Link href="/circles" className="inline-flex flex-col items-center gap-1 text-xs text-slate-700 hover:text-violet-700">
            <Users2 className="h-5 w-5" />
            Circles
          </Link>
          <Link href="/profile" className="inline-flex flex-col items-center gap-1 text-xs text-slate-700 hover:text-violet-700">
            <Calendar className="h-5 w-5" />
            Profile
          </Link>
        </div>
      </div>

      <Link href="/community" className="fixed bottom-20 right-4 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-violet-600 text-white shadow-xl shadow-violet-200 transition hover:scale-105" aria-label="Create post">
        <Plus className="h-6 w-6" />
      </Link>
    </div>
  )
}
