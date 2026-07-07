'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  Users,
  BookOpen,
  Users as Users2,
  Briefcase,
  Calendar,
  Sparkles,
  Plus,
  MessageCircle,
  ArrowRight,
  Clock3,
  Compass,
  Target,
  BellRing,
  ChevronRight,
  CheckCircle2,
  HandHeart,
  Award,
} from 'lucide-react'
import { useDashboardLoader } from '@/lib/hooks/use-dashboard-loader'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/community', label: 'Community', icon: Users },
  { href: '/academy', label: 'Academy', icon: BookOpen },
  { href: '/circles', label: 'Sister Circles', icon: Users2 },
  { href: '/opportunities', label: 'Opportunities', icon: Briefcase },
  { href: '/events', label: 'Events', icon: Calendar },
]

const quickActions = [
  { label: 'Create Post', icon: MessageCircle, href: '/community' },
  { label: 'Join Event', icon: Calendar, href: '/events' },
  { label: 'Browse Academy', icon: BookOpen, href: '/academy' },
  { label: 'Explore Opportunities', icon: Briefcase, href: '/opportunities' },
  { label: 'Join a Circle', icon: Users2, href: '/circles' },
  { label: 'Volunteer', icon: HandHeart, href: '/get-involved' },
]

function computeProfileCompletion(profile: { [key: string]: unknown } | null | undefined) {
  if (!profile) return 0
  const fields = ['full_name', 'avatar_url', 'bio', 'skills', 'interests']
  const filled = fields.reduce((acc, field) => (profile[field] ? acc + 1 : acc), 0)
  return Math.round((filled / fields.length) * 100)
}

function formatRelativeTime(value?: string | null) {
  if (!value) return 'recently'
  const diffInMinutes = Math.round((Date.now() - new Date(value).getTime()) / 60000)
  if (diffInMinutes < 60) return `${Math.max(1, diffInMinutes)} min ago`
  if (diffInMinutes < 1440) return `${Math.round(diffInMinutes / 60)}h ago`
  if (diffInMinutes < 10080) return `${Math.round(diffInMinutes / 1440)}d ago`
  return `${Math.round(diffInMinutes / 10080)}w ago`
}

export default function DashboardShell() {
  const pathname = usePathname() || '/dashboard'
  const { data, loading } = useDashboardLoader()

  const profile = data?.profile
  const circles = data?.circles || []
  const upcomingEvent = data?.upcomingEvent
  const opportunities = data?.opportunities || []
  const course = data?.course
  const communityPosts = data?.communityPosts || []
  const recentActivity = data?.recentActivity || []
  const stats = data?.stats || {}

  const firstName = profile?.first_name || profile?.full_name?.split(' ')[0] || 'there'
  const profileCompletion = computeProfileCompletion(profile)
  const today = new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())
  const club = circles[0]

  const goals = [
    { title: 'Complete one Academy lesson', done: Boolean(course) },
    { title: 'Attend one event', done: Boolean(upcomingEvent) },
    { title: 'Comment on three posts', done: Number(stats.commentsMade || 0) >= 3 },
    { title: 'Join a Sister Circle', done: Number(stats.circlesJoined || 0) >= 1 },
    { title: 'Apply for an opportunity', done: Number(stats.eventsRegistered || 0) >= 1 },
  ]

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(139,92,246,0.08),_transparent_35%),linear-gradient(180deg,_#fcfbff_0%,_#f8f7ff_100%)] text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 rounded-[28px] border border-white/70 bg-white/80 px-5 py-4 shadow-[0_20px_60px_-24px_rgba(109,40,217,0.35)] backdrop-blur xl:px-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-600">BIG member dashboard</p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Welcome Back, {firstName} 👋</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">Here&apos;s what&apos;s happening in your BIG journey today.</p>
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

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <main className="space-y-6">
            <section className="rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-[0_20px_60px_-24px_rgba(15,23,42,0.25)] sm:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-sm font-medium text-violet-700">
                    <Sparkles className="h-4 w-4" />
                    Your community, your growth, your impact
                  </div>
                  <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Good to see you back.</h2>
                  <p className="mt-3 text-base text-slate-600">Keep the momentum going with a clear view of what you have done and what is next.</p>
                  <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-600">
                    <span className="rounded-full bg-slate-100 px-3 py-2">{today}</span>
                    <span className="rounded-full bg-slate-100 px-3 py-2">{stats.circlesJoined || 0} circles joined</span>
                    <span className="rounded-full bg-slate-100 px-3 py-2">{stats.eventsRegistered || 0} events registered</span>
                  </div>
                </div>

                <div className="rounded-[24px] border border-violet-100 bg-gradient-to-br from-violet-600 to-fuchsia-500 p-5 text-white shadow-lg shadow-violet-200">
                  <p className="text-sm font-medium text-violet-100">Profile progress</p>
                  <p className="mt-3 text-4xl font-semibold">{profileCompletion}%</p>
                  <p className="mt-2 text-sm text-violet-100">Complete your profile to unlock more connections</p>
                </div>
              </div>
            </section>

            <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {[
                { label: 'Posts Created', value: stats.postsCreated ?? 0, icon: MessageCircle, tone: 'from-violet-500 to-fuchsia-500' },
                { label: 'Comments Made', value: stats.commentsMade ?? 0, icon: MessageCircle, tone: 'from-sky-500 to-cyan-500' },
                { label: 'Circles Joined', value: stats.circlesJoined ?? 0, icon: Users2, tone: 'from-amber-500 to-orange-500' },
                { label: 'Events Registered', value: stats.eventsRegistered ?? 0, icon: Calendar, tone: 'from-emerald-500 to-lime-500' },
                { label: 'Courses Completed', value: stats.coursesCompleted ?? 0, icon: BookOpen, tone: 'from-indigo-500 to-violet-500' },
                { label: 'Profile Completion', value: `${profileCompletion}%`, icon: Award, tone: 'from-rose-500 to-pink-500' },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.label} className="rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                    <div className={`inline-flex rounded-2xl bg-gradient-to-br ${item.tone} p-3 text-white`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="mt-4 text-sm text-slate-500">{item.label}</p>
                    <p className="mt-1 text-2xl font-semibold text-slate-950">{item.value}</p>
                  </div>
                )
              })}
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-slate-950">Recent Activity</p>
                    <p className="text-sm text-slate-500">What you have done lately</p>
                  </div>
                  <div className="rounded-full bg-violet-50 px-3 py-1 text-sm font-medium text-violet-700">Live</div>
                </div>

                <div className="mt-6 space-y-3">
                  {loading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((item) => (
                        <div key={item} className="h-16 animate-pulse rounded-[20px] bg-slate-100" />
                      ))}
                    </div>
                  ) : recentActivity.length > 0 ? (
                    recentActivity.map((item) => (
                      <div key={`${item.title}-${item.created_at}`} className="flex items-start gap-3 rounded-[20px] border border-slate-200 bg-slate-50 p-4">
                        <div className="rounded-full bg-violet-100 p-2 text-violet-700">
                          <Clock3 className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-slate-900">{item.title}</p>
                          <p className="mt-1 text-sm text-slate-600">{item.description}</p>
                        </div>
                        <span className="text-sm text-slate-500">{formatRelativeTime(item.created_at)}</span>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[20px] border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                      Start by creating your first post or joining a circle.
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-slate-950">Upcoming Events</p>
                    <p className="text-sm text-slate-500">Reserve your spot before it fills</p>
                  </div>
                  <Link href="/events" className="text-sm font-semibold text-violet-700">View all</Link>
                </div>

                {loading ? (
                  <div className="mt-6 h-24 animate-pulse rounded-[20px] bg-slate-100" />
                ) : upcomingEvent ? (
                  <div className="mt-6 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                    <div className="h-24 rounded-[20px] bg-gradient-to-r from-violet-500 to-fuchsia-500" />
                    <div className="mt-4">
                      <p className="font-semibold text-slate-900">{upcomingEvent.title}</p>
                      <p className="mt-1 text-sm text-slate-500">{new Date(upcomingEvent.date).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      <p className="mt-1 text-sm text-slate-500">{upcomingEvent.location || 'Virtual'}</p>
                      <button className="mt-4 inline-flex items-center gap-2 rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700">
                        Register
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 rounded-[20px] border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                    There are no upcoming events yet. Keep an eye on the calendar for new opportunities.
                  </div>
                )}
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-slate-950">BIG Club Membership</p>
                    <p className="text-sm text-slate-500">Your home base in the BIG ecosystem</p>
                  </div>
                  <Link href="/circles" className="text-sm font-semibold text-violet-700">View club</Link>
                </div>

                {club ? (
                  <div className="mt-6 rounded-[24px] border border-violet-100 bg-violet-50 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-lg font-semibold text-slate-950">{club.name}</p>
                        <p className="mt-1 text-sm text-slate-600">You are an active member of this circle</p>
                      </div>
                      <div className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-violet-700">Active</div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                      <Calendar className="h-4 w-4 text-violet-600" />
                      Next meeting: {upcomingEvent?.title || 'Join the next BIG session'}
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 rounded-[20px] border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                    Join your first circle to start building the community around you.
                  </div>
                )}
              </div>

              <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-slate-950">Recommended Opportunities</p>
                    <p className="text-sm text-slate-500">Good next moves for you</p>
                  </div>
                  <Link href="/opportunities" className="text-sm font-semibold text-violet-700">See all</Link>
                </div>

                <div className="mt-6 grid gap-3">
                  {loading ? (
                    <div className="h-20 animate-pulse rounded-[20px] bg-slate-100" />
                  ) : opportunities.length > 0 ? (
                    opportunities.map((opportunity: { id: string; title: string; category?: string | null }) => (
                      <div key={opportunity.id} className="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-semibold text-slate-900">{opportunity.title}</p>
                            <p className="mt-1 text-sm text-slate-500">{opportunity.category || 'Featured opportunity'}</p>
                          </div>
                          <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-violet-700">Open</span>
                        </div>
                        <button className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-700">
                          Apply
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[20px] border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                      New opportunities will appear here as they are added to BIG.
                    </div>
                  )}
                </div>
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-slate-950">Weekly Goals</p>
                    <p className="text-sm text-slate-500">Small wins that build real momentum</p>
                  </div>
                  <div className="rounded-full bg-violet-50 px-3 py-1 text-sm font-medium text-violet-700">{goals.filter((goal) => goal.done).length}/{goals.length} complete</div>
                </div>

                <div className="mt-6 space-y-3">
                  {goals.map((goal) => (
                    <div key={goal.title} className="flex items-center justify-between rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${goal.done ? 'bg-violet-100 text-violet-700' : 'bg-slate-200 text-slate-600'}`}>
                          {goal.done ? <CheckCircle2 className="h-4 w-4" /> : <Target className="h-4 w-4" />}
                        </div>
                        <span className="text-sm font-medium text-slate-700">{goal.title}</span>
                      </div>
                      <span className={`text-xs font-semibold uppercase tracking-[0.2em] ${goal.done ? 'text-violet-600' : 'text-slate-500'}`}>
                        {goal.done ? 'Done' : 'Next'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-slate-950">Community Feed Preview</p>
                    <p className="text-sm text-slate-500">Your latest posts and updates</p>
                  </div>
                  <Link href="/community" className="text-sm font-semibold text-violet-700">Open feed</Link>
                </div>

                <div className="mt-6 space-y-3">
                  {loading ? (
                    <div className="space-y-3">
                      {[1, 2].map((item) => (
                        <div key={item} className="h-16 animate-pulse rounded-[20px] bg-slate-100" />
                      ))}
                    </div>
                  ) : communityPosts.length > 0 ? (
                    communityPosts.map((post: { id: string; content?: string | null; created_at?: string | null }) => (
                      <div key={post.id} className="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm text-slate-700">{post.content?.slice(0, 120) || 'Shared an update'}</p>
                        <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-500">{formatRelativeTime(post.created_at)}</p>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[20px] border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                      Start your first community post to spark conversation.
                    </div>
                  )}
                </div>
              </div>
            </section>
          </main>

          <aside className="hidden space-y-6 xl:block">
            <div className="sticky top-6 space-y-6">
              <section className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-slate-950">Notifications</p>
                    <p className="text-sm text-slate-500">What needs your attention</p>
                  </div>
                  <div className="rounded-full bg-violet-50 p-2 text-violet-700">
                    <BellRing className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-5 space-y-3">
                  {data?.notifications?.length ? (
                    data.notifications.map((item: { id: string; message?: string | null; title?: string | null }) => (
                      <div key={item.id} className="flex items-start gap-3 rounded-[16px] bg-slate-50 p-3 text-sm text-slate-700">
                        <Clock3 className="mt-0.5 h-4 w-4 text-violet-600" />
                        <span>{item.message || item.title}</span>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[16px] bg-slate-50 p-3 text-sm text-slate-600">
                      You are all caught up.
                    </div>
                  )}
                </div>
              </section>

              <section className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-slate-950">Recommended Next Steps</p>
                    <p className="text-sm text-slate-500">Small actions that move you forward</p>
                  </div>
                  <div className="rounded-full bg-slate-100 p-2 text-slate-600">
                    <Compass className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-5 grid gap-2">
                  {[
                    'Complete your profile',
                    'Join a Sister Circle',
                    'Register for an upcoming event',
                    'Continue your Academy course',
                    'Apply for an opportunity',
                  ].map((step) => (
                    <div key={step} className="flex items-center justify-between rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                      <span>{step}</span>
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </div>
                  ))}
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
          <Link href="/auth/profile" className="inline-flex flex-col items-center gap-1 text-xs text-slate-700 hover:text-violet-700">
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
