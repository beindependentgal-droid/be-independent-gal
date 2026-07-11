'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ArrowRight,
  BellRing,
  BookOpen,
  Briefcase,
  Calendar,
  CheckCircle2,
  HandHeart,
  Home,
  Plus,
  Sparkles,
  Target,
  Users,
  Users2,
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useDashboardLoader } from '@/lib/hooks/use-dashboard-loader'
import AnalyticsCard from '@/components/dashboard/AnalyticsCard'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/community', label: 'Community', icon: Users },
  { href: '/academy', label: 'Academy', icon: BookOpen },
  { href: '/circles', label: 'Circles', icon: Users2 },
  { href: '/opportunities', label: 'Opportunities', icon: Briefcase },
  { href: '/events', label: 'Events', icon: Calendar },
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
  const { data } = useDashboardLoader()

  const profile = data?.profile
  const circles = data?.circles || []
  const upcomingEvents = data?.upcomingEvents || []
  const recentActivity = data?.recentActivity || []
  const stats = data?.stats
  const club = data?.club
  const notifications = data?.notifications || []
  const registeredEventIds = data?.registeredEventIds || []

  const firstName = profile?.first_name || profile?.full_name?.split(' ')[0] || user?.first_name || user?.email?.split('@')[0] || 'there'
  const profileCompletion = stats?.profileCompletion ?? 0
  const greeting = getGreeting()
  const streakDays = Math.max(1, Math.min(14, 2 + (stats?.circlesJoined ?? 0) + (stats?.eventsRegistered ?? 0)))

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

  const progressPercent = Math.min(100, Math.max(12, profileCompletion))
  const learningProgress = stats?.coursesCompleted ? Math.min(100, stats.coursesCompleted * 18 + 10) : 0
  const recommendedCourse = {
    title: 'Money Mastery',
    description: 'Build a strong financial foundation with lessons that support everyday independence.',
    progress: learningProgress,
    cta: learningProgress > 0 ? 'Continue learning' : 'Start lesson 1',
  }
  const communitySummary = circles.length > 0
    ? `${circles.length} circle${circles.length === 1 ? '' : 's'} joined`
    : 'You haven’t joined a Circle yet.'
  const eventSummary = upcomingEvents.length > 0
    ? `${upcomingEvents.length} event${upcomingEvents.length === 1 ? '' : 's'} coming up`
    : 'No events scheduled.'

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.08),transparent_35%),linear-gradient(180deg,#fcfbff_0%,#f8f7ff_100%)] text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <main className="space-y-6" aria-label="BIG member dashboard">
            <section className="overflow-hidden rounded-[32px] border border-slate-200/80 bg-linear-to-br from-slate-950 via-violet-950 to-fuchsia-900 p-6 text-white shadow-[0_20px_60px_-24px_rgba(15,23,42,0.35)] sm:p-8" aria-labelledby="dashboard-hero-heading">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-medium text-violet-100">
                    <Sparkles className="h-4 w-4" />
                    A home for your BIG movement
                  </div>
                  <h1 id="dashboard-hero-heading" className="mt-4 text-4xl font-extrabold tracking-tight leading-tight sm:text-5xl lg:text-6xl text-white">Welcome back, {firstName}</h1>
                  <p className="mt-3 max-w-xl text-lg text-white/90">Every small step builds your independence. Pick one thing to do today and let the momentum carry you forward.</p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link href="/academy" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-violet-100">
                      Continue learning
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link href="/events" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20">
                      Discover events
                    </Link>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[20px] border border-white/15 bg-white/10 p-4 backdrop-blur">
                    <p className="text-sm font-medium text-violet-100">BIG progress</p>
                    <p className="mt-2 text-2xl font-semibold">{progressPercent}%</p>
                  </div>
                  <div className="rounded-[20px] border border-white/15 bg-white/10 p-4 backdrop-blur">
                    <p className="text-sm font-medium text-violet-100">Streak</p>
                    <p className="mt-2 text-2xl font-semibold">{streakDays} days</p>
                  </div>
                  <div className="rounded-[20px] border border-white/15 bg-white/10 p-4 backdrop-blur">
                    <p className="text-sm font-medium text-violet-100">Circles</p>
                    <p className="mt-2 text-2xl font-semibold">{stats?.circlesJoined ?? 0}</p>
                  </div>
                  <div className="rounded-[20px] border border-white/15 bg-white/10 p-4 backdrop-blur">
                    <p className="text-sm font-medium text-violet-100">Events</p>
                    <p className="mt-2 text-2xl font-semibold">{stats?.eventsRegistered ?? 0}</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="grid gap-4 lg:grid-cols-4" aria-labelledby="dashboard-summary-heading">
              <div className="sr-only" id="dashboard-summary-heading">Dashboard quick stats</div>
              <div className="rounded-[24px] border border-slate-200/80 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-violet-50 p-2.5 text-violet-700"><Target className="h-5 w-5" /></div>
                  <div>
                    <p className="text-sm font-semibold text-slate-950">BIG progress</p>
                    <p className="text-sm text-slate-500">You are getting started</p>
                  </div>
                </div>
                <p className="mt-4 text-2xl font-semibold text-slate-950">{progressPercent}%</p>
                <p className="mt-2 text-sm text-slate-600">Complete your profile to unlock more personalized support.</p>
              </div>
              <div className="rounded-[24px] border border-slate-200/80 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-sky-50 p-2.5 text-sky-700"><BookOpen className="h-5 w-5" /></div>
                  <div>
                    <p className="text-sm font-semibold text-slate-950">Learning</p>
                    <p className="text-sm text-slate-500">Your next lesson</p>
                  </div>
                </div>
                <p className="mt-4 text-xl font-semibold text-slate-950">{recommendedCourse.title}</p>
                <p className="mt-2 text-sm text-slate-600">{learningProgress > 0 ? `${learningProgress}% complete` : 'Start lesson one today.'}</p>
              </div>
              <div className="rounded-[24px] border border-slate-200/80 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-emerald-50 p-2.5 text-emerald-700"><Users className="h-5 w-5" /></div>
                  <div>
                    <p className="text-sm font-semibold text-slate-950">Community</p>
                    <p className="text-sm text-slate-500">Stay connected</p>
                  </div>
                </div>
                <p className="mt-4 text-sm font-semibold text-slate-950">{communitySummary}</p>
                <p className="mt-2 text-sm text-slate-600">{circles.length > 0 ? 'Find the next conversation and keep growing.' : 'Join your first Circle and meet women with shared goals.'}</p>
              </div>
              <div className="rounded-[24px] border border-slate-200/80 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-amber-50 p-2.5 text-amber-700"><Calendar className="h-5 w-5" /></div>
                  <div>
                    <p className="text-sm font-semibold text-slate-950">Events</p>
                    <p className="text-sm text-slate-500">Show up for yourself</p>
                  </div>
                </div>
                <p className="mt-4 text-sm font-semibold text-slate-950">{eventSummary}</p>
                <p className="mt-2 text-sm text-slate-600">{upcomingEvents.length > 0 ? 'Reserve your place and bring your energy.' : 'Explore events designed to help you grow and connect.'}</p>
              </div>
            </section>

            <section className="mt-4" aria-label="Analytics overview">
              <AnalyticsCard
                stats={stats}
                analyticsSeries={data?.analyticsSeries}
                analyticsCounts={data?.analyticsCounts}
              />
            </section>

            <section className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="dashboard-learning-heading">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 id="dashboard-learning-heading" className="text-lg font-semibold text-slate-950">Continue learning</h2>
                  <p className="mt-1 text-sm text-slate-500">A steady course can change everything</p>
                </div>
                <Link href="/academy" className="inline-flex items-center gap-2 text-sm font-semibold text-violet-700">Open academy <ArrowRight className="h-4 w-4" /></Link>
              </div>
              <div className="mt-6 rounded-[24px] border border-violet-100 bg-violet-50 p-5">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-700">Recommended course</p>
                    <h3 className="mt-2 text-2xl font-semibold text-slate-950">{recommendedCourse.title}</h3>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{recommendedCourse.description}</p>
                  </div>
                  <div className="w-full max-w-56 rounded-[20px] border border-white/70 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between text-sm font-medium text-slate-600">
                      <span>Progress</span>
                      <span className="font-semibold text-slate-950">{recommendedCourse.progress}%</span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-linear-to-r from-violet-600 to-fuchsia-500" style={{ width: `${recommendedCourse.progress}%` }} />
                    </div>
                    <Link href="/academy" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-violet-700">
                      {recommendedCourse.cta}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]" aria-labelledby="dashboard-recommended-heading">
              <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 id="dashboard-recommended-heading" className="text-lg font-semibold text-slate-950">Recommended for you</h2>
                    <p className="text-sm text-slate-500">Made for your BIG next step</p>
                  </div>
                  <div className="rounded-full bg-violet-50 px-3 py-1 text-sm font-medium text-violet-700">Personalized</div>
                </div>
                <div className="mt-6 rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-700">Learning path</p>
                  <h3 className="mt-3 text-2xl font-semibold text-slate-950">{recommendedCourse.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">Follow a clear path to build confidence, grow your network, and strengthen your independence with practical lessons and community support.</p>
                  <Link href="/academy" className="mt-5 inline-flex items-center gap-2 rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700">
                    Start learning
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="dashboard-events-heading">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 id="dashboard-events-heading" className="text-lg font-semibold text-slate-950">Upcoming events</h2>
                    <p className="text-sm text-slate-500">The next thing to show up for</p>
                  </div>
                  <Link href="/events" className="text-sm font-semibold text-violet-700">Explore</Link>
                </div>
                <div className="mt-6 space-y-3">
                  {upcomingEvents.length > 0 ? upcomingEvents.map((event) => (
                    <div key={event.id} className="rounded-[18px] border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-900">{event.title}</p>
                          <p className="mt-1 text-sm text-slate-500">{event.date ? new Date(event.date).toLocaleDateString('en', { month: 'short', day: 'numeric' }) : 'TBD'}</p>
                        </div>
                        <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-violet-700">{registeredEventIds.includes(event.id) ? 'Registered' : 'Open'}</span>
                      </div>
                      {event.location ? <p className="mt-2 text-sm text-slate-600">{event.location}</p> : null}
                    </div>
                  )) : (
                    <div className="rounded-[18px] border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                      No events scheduled yet. Explore events and find your next space to grow.
                    </div>
                  )}
                </div>
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="dashboard-activity-heading">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 id="dashboard-activity-heading" className="text-lg font-semibold text-slate-950">Community activity</h2>
                    <p className="text-sm text-slate-500">What is moving in your circle</p>
                  </div>
                  <Link href="/community" className="text-sm font-semibold text-violet-700">View feed</Link>
                </div>
                <div className="mt-6 space-y-3">
                  {activityTimeline.length > 0 ? activityTimeline.map((item, index) => (
                    <div key={`${item.title}-${index}`} className="flex gap-3 rounded-[18px] border border-slate-200 bg-slate-50 p-4">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                        <p className="mt-1 text-sm text-slate-600">{item.description}</p>
                        <p className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-slate-400">{item.label}</p>
                      </div>
                    </div>
                  )) : (
                    <div className="rounded-[18px] border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">Your BIG journey starts today. Complete your profile or enroll in your first course to begin.</div>
                  )}
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="dashboard-notifications-heading">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 id="dashboard-notifications-heading" className="text-lg font-semibold text-slate-950">Notifications</h2>
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
            </section>
          </main>

          <aside className="hidden space-y-6 xl:block">
            <div className="sticky top-6 space-y-6">
              <section className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm" aria-labelledby="dashboard-bigclub-heading">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 id="dashboard-bigclub-heading" className="text-lg font-semibold text-slate-950">BIG Club</h2>
                    <p className="text-sm text-slate-500">Your home base for momentum</p>
                  </div>
                  <div className="rounded-full bg-violet-50 p-2 text-violet-700">
                    <HandHeart className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-5 rounded-[22px] border border-violet-100 bg-violet-50 p-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-700">Status</p>
                  <p className="mt-2 text-xl font-semibold text-slate-950">{club ? club.name : 'Not joined'}</p>
                  <div className="mt-4 space-y-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-violet-600" /> Business networking</div>
                    <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-violet-600" /> Exclusive events</div>
                    <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-violet-600" /> Leadership access</div>
                  </div>
                  <Link href="/community" className="mt-4 inline-flex items-center gap-2 rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white">Join BIG Club <ArrowRight className="h-4 w-4" /></Link>
                </div>
              </section>

              <section className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-slate-950">Today&apos;s reminder</p>
                    <p className="text-sm text-slate-500">Small actions build strong women</p>
                  </div>
                  <div className="rounded-full bg-violet-50 p-2 text-violet-700">
                    <Sparkles className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-5 rounded-[20px] border border-violet-100 bg-violet-50 p-4 text-sm leading-6 text-slate-700">
                  <p>Small actions repeated consistently build independent women.</p>
                  <p className="mt-2 font-semibold text-slate-950">— BIG</p>
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
