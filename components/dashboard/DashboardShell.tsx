'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
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
  TrendingUp,
  MessageCircle,
  BadgeCheck,
  ArrowRight,
  Clock3,
  Compass,
  Target,
  HandHeart,
  Brain,
  BellRing,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/community', label: 'Community', icon: Users },
  { href: '/academy', label: 'Academy', icon: BookOpen },
  { href: '/circles', label: 'Sister Circles', icon: Users2 },
  { href: '/opportunities', label: 'Opportunities', icon: Briefcase },
  { href: '/events', label: 'Events', icon: Calendar },
]

const kpis = [
  { label: 'Community Score', value: '85', delta: '+8 this month', icon: Sparkles, tone: 'from-violet-500 to-fuchsia-500' },
  { label: 'Connections', value: '42', delta: '+5 this week', icon: Users, tone: 'from-sky-500 to-cyan-500' },
  { label: 'Events Attended', value: '8', delta: '2 upcoming', icon: Calendar, tone: 'from-amber-500 to-orange-500' },
  { label: 'Courses Completed', value: '3', delta: 'Continue learning', icon: BookOpen, tone: 'from-emerald-500 to-lime-500' },
  { label: 'Opportunities Applied', value: '6', delta: '2 pending', icon: Briefcase, tone: 'from-rose-500 to-pink-500' },
  { label: 'Volunteer Hours', value: '24 hrs', delta: 'Community impact', icon: HandHeart, tone: 'from-indigo-500 to-violet-500' },
]

const engagementData = [
  { label: 'Posts', value: 32, color: 'bg-violet-500' },
  { label: 'Comments', value: 24, color: 'bg-fuchsia-500' },
  { label: 'Reactions', value: 18, color: 'bg-sky-500' },
  { label: 'Mentorship', value: 14, color: 'bg-amber-500' },
  { label: 'Events', value: 9, color: 'bg-emerald-500' },
  { label: 'Volunteer', value: 7, color: 'bg-rose-500' },
]

const milestones = [
  { title: 'Joined BIG', date: 'Jan 2024', badge: 'Welcome' },
  { title: 'Completed first course', date: 'Feb 2024', badge: 'Growth' },
  { title: 'Joined Founders Circle', date: 'Apr 2024', badge: 'Circle' },
  { title: 'Attended Leadership Summit', date: 'Jun 2024', badge: 'Event' },
  { title: 'Mentored first member', date: 'Aug 2024', badge: 'Impact' },
  { title: 'Started community project', date: 'Nov 2024', badge: 'Leadership' },
]

const communityStats = [
  { label: 'Profile Views', value: '1.2k' },
  { label: 'Post Reach', value: '8.4k' },
  { label: 'Comments Received', value: '142' },
  { label: 'Reactions', value: '410' },
  { label: 'Followers', value: '89' },
  { label: 'Connections Made', value: '27' },
  { label: 'Mentorship Requests', value: '14' },
  { label: 'Circle Invitations', value: '6' },
]

const goals = [
  { title: 'Complete one Academy lesson', done: true },
  { title: 'Attend one event', done: true },
  { title: 'Comment on three posts', done: false },
  { title: 'Connect with one member', done: false },
  { title: 'Volunteer once', done: true },
]

const upcomingEvents = [
  {
    title: 'Founders Circle Mixer',
    date: 'Jul 12 · 6:30 PM',
    location: 'Nairobi',
    image: '/images/placeholder-event.jpg',
  },
  {
    title: 'Leadership Lab',
    date: 'Jul 18 · 10:00 AM',
    location: 'Virtual',
    image: '/images/placeholder-event.jpg',
  },
]

const opportunities = [
  { title: 'Scholarship', deadline: 'Ends in 4 days', accent: 'bg-violet-50 text-violet-700' },
  { title: 'Grant', deadline: 'Ends in 10 days', accent: 'bg-sky-50 text-sky-700' },
  { title: 'Fellowship', deadline: 'Ends in 21 days', accent: 'bg-emerald-50 text-emerald-700' },
]

const clubs = [
  { name: 'BIG Club Nairobi', members: '182 members' },
  { name: 'Founders Circle', members: '24 members' },
  { name: 'Leadership Committee', members: '11 members' },
]

const impactStats = [
  { label: 'Women Mentored', value: '128' },
  { label: 'Volunteer Hours', value: '640' },
  { label: 'Projects Joined', value: '19' },
  { label: 'Businesses Supported', value: '47' },
  { label: 'Funds Raised', value: '$84k' },
  { label: 'Events Organized', value: '22' },
]

const insights = [
  'You were 25% more active than last month.',
  'You are among the top 10% contributors in your club.',
  'You have not attended an event in 21 days.',
  'Women who joined your circle increased by 12%.',
  'Complete one Academy lesson to maintain your streak.',
]

const notifications = [
  'Upcoming meeting · Friday at 4 PM',
  'New opportunity · Fellowship opening soon',
  'Someone viewed your profile',
  'Invitation to join the committee',
  'Mentorship request from Amina',
]

const quickActions = [
  { label: 'Create Post', icon: MessageCircle },
  { label: 'Join Event', icon: Calendar },
  { label: 'Browse Academy', icon: BookOpen },
  { label: 'Explore Opportunities', icon: Briefcase },
  { label: 'Find Mentor', icon: Users2 },
  { label: 'Volunteer', icon: HandHeart },
]

export default function DashboardShell() {
  const pathname = usePathname() || '/dashboard'
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoaded(true), 650)
    return () => window.clearTimeout(timer)
  }, [])

  const today = new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(139,92,246,0.08),_transparent_35%),linear-gradient(180deg,_#fcfbff_0%,_#f8f7ff_100%)] text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 rounded-[28px] border border-white/70 bg-white/80 px-5 py-4 shadow-[0_20px_60px_-24px_rgba(109,40,217,0.35)] backdrop-blur xl:px-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-600">BIG member dashboard</p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Your growth, at a glance</h1>
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
            <section className="rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-[0_20px_60px_-24px_rgba(15,23,42,0.25)] sm:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-sm font-medium text-violet-700">
                    <Sparkles className="h-4 w-4" />
                    Welcome back
                  </div>
                  <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Good morning, Wawesh 👋</h2>
                  <p className="mt-3 text-base text-slate-600">Here is your BIG activity this week and the next step that will have the biggest impact.</p>
                  <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-600">
                    <span className="rounded-full bg-slate-100 px-3 py-2">{today}</span>
                    <span className="rounded-full bg-slate-100 px-3 py-2">42 connections</span>
                    <span className="rounded-full bg-slate-100 px-3 py-2">3 active circles</span>
                  </div>
                </div>

                <div className="rounded-[24px] border border-violet-100 bg-gradient-to-br from-violet-600 to-fuchsia-500 p-5 text-white shadow-lg shadow-violet-200">
                  <p className="text-sm font-medium text-violet-100">This week</p>
                  <p className="mt-3 text-4xl font-semibold">+18%</p>
                  <p className="mt-2 text-sm text-violet-100">You are more engaged than last week</p>
                </div>
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {kpis.map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.label} className="rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                    <div className={`inline-flex rounded-2xl bg-gradient-to-br ${item.tone} p-3 text-white`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="mt-4 flex items-end justify-between gap-3">
                      <div>
                        <p className="text-sm text-slate-500">{item.label}</p>
                        <p className="mt-1 text-2xl font-semibold text-slate-950">{item.value}</p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">{item.delta}</span>
                    </div>
                  </div>
                )
              })}
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.35fr_0.8fr]">
              <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-slate-950">Community Activity</p>
                    <p className="text-sm text-slate-500">Last 30 days</p>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-slate-100 p-1">
                    {['7 days', '30 days', '90 days', '1 year'].map((label, index) => (
                      <button
                        key={label}
                        className={`rounded-full px-3 py-1.5 text-sm font-medium ${index === 1 ? 'bg-violet-600 text-white' : 'text-slate-600 hover:bg-white'}`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {!isLoaded ? (
                  <div className="mt-6 h-60 animate-pulse rounded-[24px] bg-slate-100" />
                ) : (
                  <div className="mt-6 rounded-[24px] bg-[linear-gradient(135deg,_rgba(139,92,246,0.08),_rgba(236,72,153,0.05))] p-4">
                    <svg viewBox="0 0 320 180" className="h-60 w-full">
                      <path d="M0 145 C35 135, 55 120, 80 122 S120 132, 145 128 S190 102, 220 112 S265 132, 320 80" fill="none" stroke="#8b5cf6" strokeWidth="4" strokeLinecap="round" />
                      <path d="M0 145 C35 135, 55 120, 80 122 S120 132, 145 128 S190 102, 220 112 S265 132, 320 80 L320 180 L0 180 Z" fill="url(#lineFill)" opacity="0.25" />
                      <defs>
                        <linearGradient id="lineFill" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#8b5cf6" />
                          <stop offset="100%" stopColor="#ffffff" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
                      <span>Posts</span>
                      <span>Comments</span>
                      <span>Reactions</span>
                      <span>Event attendance</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-slate-950">Engagement Breakdown</p>
                    <p className="text-sm text-slate-500">How your energy is spread</p>
                  </div>
                  <div className="rounded-full bg-violet-50 px-3 py-1 text-sm font-medium text-violet-700">Balanced</div>
                </div>

                {!isLoaded ? (
                  <div className="mt-6 h-56 animate-pulse rounded-[24px] bg-slate-100" />
                ) : (
                  <div className="mt-6 flex flex-col gap-5">
                    <div className="flex items-center justify-center">
                      <div className="relative flex h-40 w-40 items-center justify-center rounded-full bg-[conic-gradient(#8b5cf6_0_35%,#f472b6_35%_58%,#38bdf8_58%_74%,#f59e0b_74%_86%,#10b981_86%_100%)]">
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white text-center">
                          <div>
                            <p className="text-2xl font-semibold text-slate-950">82%</p>
                            <p className="text-xs text-slate-500">active</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {engagementData.map((item) => (
                        <div key={item.label} className="flex items-center gap-3 text-sm">
                          <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                          <span className="w-24 text-slate-600">{item.label}</span>
                          <div className="flex-1 overflow-hidden rounded-full bg-slate-100">
                            <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${item.value}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
              <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-slate-950">Growth Timeline</p>
                    <p className="text-sm text-slate-500">Your BIG milestones</p>
                  </div>
                  <div className="rounded-full bg-violet-50 px-3 py-1 text-sm font-medium text-violet-700">Milestones</div>
                </div>

                <div className="mt-6 space-y-4">
                  {milestones.map((milestone, index) => (
                    <div key={milestone.title} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                          <BadgeCheck className="h-5 w-5" />
                        </div>
                        {index < milestones.length - 1 ? <div className="mt-2 h-full w-px bg-slate-200" /> : null}
                      </div>
                      <div className="flex-1 rounded-[20px] border border-slate-200 bg-slate-50 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-semibold text-slate-900">{milestone.title}</p>
                            <p className="mt-1 text-sm text-slate-500">{milestone.date}</p>
                          </div>
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">{milestone.badge}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-slate-950">Community Analytics</p>
                    <p className="text-sm text-slate-500">Meaningful signals from your network</p>
                  </div>
                  <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">Healthy</div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {communityStats.map((stat) => (
                    <div key={stat.label} className="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
                      <p className="text-sm text-slate-500">{stat.label}</p>
                      <p className="mt-2 text-xl font-semibold text-slate-950">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-slate-950">Weekly Goals</p>
                    <p className="text-sm text-slate-500">Momentum is built one small win at a time</p>
                  </div>
                  <div className="rounded-full bg-violet-50 px-3 py-1 text-sm font-medium text-violet-700">4/5 complete</div>
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
                    <p className="text-lg font-semibold text-slate-950">Upcoming Events</p>
                    <p className="text-sm text-slate-500">Reserve your seat before it fills</p>
                  </div>
                  <Link href="/events" className="text-sm font-semibold text-violet-700">View all</Link>
                </div>

                <div className="mt-6 space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.title} className="overflow-hidden rounded-[24px] border border-slate-200 bg-slate-50">
                      <div className="h-24 bg-gradient-to-r from-violet-500 to-fuchsia-500" />
                      <div className="p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-semibold text-slate-900">{event.title}</p>
                            <p className="mt-1 text-sm text-slate-500">{event.date}</p>
                            <p className="mt-1 text-sm text-slate-500">{event.location}</p>
                          </div>
                          <div className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-violet-700">2d</div>
                        </div>
                        <button className="mt-4 inline-flex items-center gap-2 rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700">
                          Register
                          <ArrowRight className="h-4 w-4" />
                        </button>
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
                    <p className="text-lg font-semibold text-slate-950">Recommended Opportunities</p>
                    <p className="text-sm text-slate-500">Your next unlock</p>
                  </div>
                  <Link href="/opportunities" className="text-sm font-semibold text-violet-700">See all</Link>
                </div>

                <div className="mt-6 grid gap-3 md:grid-cols-3">
                  {opportunities.map((opportunity) => (
                    <div key={opportunity.title} className="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
                      <div className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${opportunity.accent}`}>
                        {opportunity.title}
                      </div>
                      <p className="mt-4 text-sm text-slate-500">{opportunity.deadline}</p>
                      <button className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-700">
                        Apply
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-slate-950">My Clubs</p>
                    <p className="text-sm text-slate-500">Quick access to your circles</p>
                  </div>
                  <Link href="/circles" className="text-sm font-semibold text-violet-700">Open</Link>
                </div>

                <div className="mt-6 space-y-3">
                  {clubs.map((club) => (
                    <div key={club.name} className="flex items-center justify-between rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3">
                      <div>
                        <p className="font-semibold text-slate-900">{club.name}</p>
                        <p className="mt-1 text-sm text-slate-500">{club.members}</p>
                      </div>
                      <button className="rounded-full bg-violet-100 p-2 text-violet-700">
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
              <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-slate-950">Community Impact</p>
                    <p className="text-sm text-slate-500">Impact that compounds over time</p>
                  </div>
                  <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">Inspiring</div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {impactStats.map((item) => (
                    <div key={item.label} className="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
                      <p className="text-sm text-slate-500">{item.label}</p>
                      <p className="mt-2 text-xl font-semibold text-slate-950">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-slate-950">Personal Insights</p>
                    <p className="text-sm text-slate-500">AI-style prompts that keep you moving</p>
                  </div>
                  <div className="rounded-full bg-violet-50 px-3 py-1 text-sm font-medium text-violet-700">Smart</div>
                </div>

                <div className="mt-6 space-y-3">
                  {insights.map((insight) => (
                    <div key={insight} className="flex items-start gap-3 rounded-[20px] border border-slate-200 bg-slate-50 p-4">
                      <div className="mt-0.5 rounded-full bg-violet-100 p-2 text-violet-700">
                        <Brain className="h-4 w-4" />
                      </div>
                      <p className="text-sm text-slate-700">{insight}</p>
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
                    <p className="text-lg font-semibold text-slate-950">Notifications</p>
                    <p className="text-sm text-slate-500">Your next touchpoints</p>
                  </div>
                  <div className="rounded-full bg-violet-50 p-2 text-violet-700">
                    <BellRing className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-5 space-y-3">
                  {notifications.map((item) => (
                    <div key={item} className="flex items-start gap-3 rounded-[16px] bg-slate-50 p-3 text-sm text-slate-700">
                      <Clock3 className="mt-0.5 h-4 w-4 text-violet-600" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-violet-100 p-2 text-violet-700">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-slate-950">Community quote</p>
                    <p className="text-sm text-slate-500">A reminder to stay visible</p>
                  </div>
                </div>
                <blockquote className="mt-4 rounded-[20px] border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                  “When you show up for others, your own momentum grows faster than you expect.”
                </blockquote>
              </section>

              <section className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-slate-950">Quick actions</p>
                    <p className="text-sm text-slate-500">Jump back in fast</p>
                  </div>
                  <div className="rounded-full bg-slate-100 p-2 text-slate-600">
                    <Compass className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-5 grid gap-2">
                  {quickActions.map((action) => {
                    const Icon = action.icon
                    return (
                      <button key={action.label} className="flex items-center justify-between rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700">
                        <span className="flex items-center gap-3">
                          <Icon className="h-4 w-4" />
                          {action.label}
                        </span>
                        <ChevronRight className="h-4 w-4" />
                      </button>
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
