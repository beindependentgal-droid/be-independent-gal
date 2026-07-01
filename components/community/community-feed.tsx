'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Search,
  Bell,
  MessageCircle,
  UserCircle,
  Home,
  Users,
  BookOpen,
  Handshake,
  Briefcase,
  Heart,
  CalendarDays,
  Bookmark,
  Settings,
  Camera,
  Film,
  BarChart3,
  CalendarPlus,
  Sparkles,
  Grid,
  HeartPulse,
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import type { Post } from '@/lib/db'

const navItems = [
  { label: 'Home', icon: Home },
  { label: 'Community', icon: Users },
  { label: 'Academy', icon: BookOpen },
  { label: 'Sister Circles', icon: Handshake },
  { label: 'Opportunities', icon: Briefcase },
  { label: 'Retreats', icon: Heart },
  { label: 'Events', icon: CalendarDays },
  { label: 'Messages', icon: MessageCircle },
  { label: 'Saved', icon: Bookmark },
  { label: 'Profile', icon: UserCircle },
  { label: 'Settings', icon: Settings },
]

const storyItems = [
  { name: 'Your Story', label: 'Share a win', primary: true },
  { name: 'Sharon', label: 'Business win' },
  { name: 'Faith', label: 'New post' },
  { name: 'Pauline', label: 'Launch day' },
  { name: 'Mercy', label: 'Workshop' },
  { name: 'Grace', label: 'Retreat' },
]

const actionItems = [
  { label: 'Photo', icon: Camera },
  { label: 'Video', icon: Film },
  { label: 'Poll', icon: BarChart3 },
  { label: 'Event', icon: CalendarPlus },
  { label: 'Opportunity', icon: Briefcase },
  { label: 'Ask Community', icon: Sparkles },
]

const placeholderPosts = [
  {
    id: 'p1',
    author: {
      name: 'Sharon Sage',
      avatar: '/images/member-1.png',
      rank: 'Founder • BIG Academy',
    },
    content: 'Today I completed my first business proposal thanks to BIG Academy. Feeling inspired and ready to coach others through their first draft.',
    timestamp: '2 hours ago',
    likes: 48,
    comments: 12,
  },
  {
    id: 'p2',
    author: {
      name: 'Pauline N.',
      avatar: '/images/member-1.png',
      rank: 'Fashion Designer',
    },
    content: 'Can anyone recommend a place in Nairobi for a small pop-up event? Looking for a warm space with great lighting and connection vibes.',
    timestamp: '5 hours ago',
    likes: 32,
    comments: 8,
  },
  {
    id: 'p3',
    author: {
      name: 'Faith A.',
      avatar: '/images/member-3.png',
      rank: 'Lawyer • Mentor',
    },
    content: 'BIG invited me to speak at the Women in Tech panel — grateful for the support and growth community.',
    timestamp: 'Yesterday',
    likes: 86,
    comments: 21,
  },
]

const upcomingEvents = [
  { title: "Women's Retreat", location: 'Naivasha', date: '12 August' },
  { title: 'Funding Circle', location: 'Nairobi', date: '22 August' },
]

const trendingTopics = ['Business', 'Funding', 'Jobs', 'Academy', 'WomenInTech']

const suggestedMembers = [
  { name: 'Pauline', role: 'Fashion Designer' },
  { name: 'Faith', role: 'Lawyer' },
  { name: 'Mercy', role: 'Community Builder' },
]

const notifications = [
  'Pauline liked your post',
  'Sharon followed you',
  'BIG invited you to an event',
  'Silas commented',
  'You earned a Community Badge',
]

export default function CommunityFeed() {
  const router = useRouter()
  const { isAuthenticated, loading } = useAuth()
  const [feedPosts, setFeedPosts] = useState<Post[]>([])
  const [draft, setDraft] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/auth/login?redirect=/community')
      return
    }

    if (isAuthenticated) {
      fetchFeed()
    }
  }, [isAuthenticated, loading, router])

  const fetchFeed = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/community/feed')
      if (!response.ok) {
        throw new Error('Unable to load community feed')
      }

      const data = (await response.json()) as Post[]
      setFeedPosts(data)
    } catch (err: any) {
      setError(err?.message || 'Something went wrong while loading community posts.')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePost = async () => {
    const content = draft.trim()
    if (!content) return

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/community/feed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.error || 'Failed to publish post')
      }

      const post = (await response.json()) as Post
      setFeedPosts((current) => [post, ...current])
      setDraft('')
    } catch (err: any) {
      setError(err?.message || 'Unable to publish your post.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-base text-slate-600">Redirecting to login…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50 to-white text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-700 to-fuchsia-500 text-white shadow-lg shadow-violet-200/30">
              <Grid className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-700">BIG</p>
              <p className="text-xs text-slate-500">Community Hub</p>
            </div>
          </div>

          <div className="flex-1">
            <div className="relative rounded-2xl border border-slate-200 bg-slate-100/80 px-4 py-2 shadow-sm shadow-slate-200/50">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                placeholder="Search BIG, people, posts, topics..."
                className="w-full border-0 bg-transparent pr-4 text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <button className="rounded-2xl p-3 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">
              <Bell className="h-5 w-5" />
            </button>
            <button className="rounded-2xl p-3 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">
              <MessageCircle className="h-5 w-5" />
            </button>
            <button className="rounded-2xl p-3 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">
              <UserCircle className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-[32px] border border-slate-200 bg-white/90 p-5 shadow-sm shadow-slate-200/50">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Active members</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">4.8K</p>
            <p className="mt-2 text-sm text-slate-500">Growing daily with high engagement</p>
          </div>
          <div className="rounded-[32px] border border-slate-200 bg-white/90 p-5 shadow-sm shadow-slate-200/50">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Posts today</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">128</p>
            <p className="mt-2 text-sm text-slate-500">Conversations, shares, and celebrations</p>
          </div>
          <div className="rounded-[32px] border border-slate-200 bg-white/90 p-5 shadow-sm shadow-slate-200/50">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Upcoming events</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">5</p>
            <p className="mt-2 text-sm text-slate-500">Workshops, retreats, and live circles</p>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1.8fr)_320px]">
          <aside className="hidden xl:block xl:sticky xl:top-6 xl:self-start">
            <div className="space-y-4 rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-md shadow-slate-200/60 backdrop-blur-sm">
              <div className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Menu</div>
              <nav className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const active = item.label === 'Community'
                  return (
                    <Link
                      key={item.label}
                      href="#"
                      className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                        active ? 'bg-violet-50 text-violet-700 shadow-sm shadow-violet-100' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 group-hover:bg-violet-50 group-hover:text-violet-700">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </nav>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-md shadow-slate-200/60 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500">Community Badges</p>
                  <p className="text-xs text-slate-400">Earned for connection and impact</p>
                </div>
                <HeartPulse className="h-5 w-5 text-fuchsia-500" />
              </div>
              <div className="mt-4 grid gap-2 text-xs text-slate-600">
                <span className="inline-flex rounded-full bg-violet-50 px-3 py-2 text-violet-700">🏅 Founding Member</span>
                <span className="inline-flex rounded-full bg-pink-50 px-3 py-2 text-pink-700">🎓 Academy Graduate</span>
                <span className="inline-flex rounded-full bg-amber-50 px-3 py-2 text-amber-700">💼 Entrepreneur</span>
              </div>
            </div>
          </aside>

          <section className="space-y-6">
            <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white/90 p-5 shadow-[0_30px_80px_-60px_rgba(99,102,241,0.45)] backdrop-blur-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-700">Stories</p>
                  <p className="mt-1 text-sm text-slate-500">Business wins, launches, events, and moments.</p>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-xs text-slate-600">
                  <span className="font-semibold text-violet-700">New</span> Today
                </div>
              </div>

              <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
                {storyItems.map((story) => (
                  <button
                    key={story.name}
                    type="button"
                    className={`min-w-[120px] rounded-3xl border px-4 py-4 text-left transition ${
                      story.primary ? 'bg-gradient-to-r from-violet-700 to-fuchsia-500 text-white shadow-xl shadow-violet-500/20' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <div className="text-sm font-semibold">{story.name}</div>
                    <div className="mt-2 text-xs text-slate-500">{story.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] border border-slate-200 bg-white/95 p-6 shadow-lg shadow-slate-200/60 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-violet-50 text-violet-700">H</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">What&apos;s on your mind?</p>
                  <p className="mt-1 text-sm text-slate-500">Share a win, ask a question, or invite the community.</p>
                </div>
              </div>

              <div className="mt-5 grid gap-4">
                <textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  rows={4}
                  placeholder="Write your post here..."
                  className="w-full resize-none rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-violet-300 focus:bg-white"
                />

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {actionItems.map((item) => {
                      const Icon = item.icon
                      return (
                        <button
                          key={item.label}
                          type="button"
                          className="flex items-center gap-2 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
                        >
                          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white text-violet-700 shadow-sm shadow-slate-200/60">
                            <Icon className="h-4 w-4" />
                          </span>
                          {item.label}
                        </button>
                      )
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={handlePost}
                    disabled={isSubmitting || !draft.trim()}
                    className="ml-auto rounded-3xl bg-violet-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {isSubmitting ? 'Publishing…' : 'Publish'}
                  </button>
                </div>

                {error ? <p className="text-sm text-red-600">{error}</p> : null}
              </div>
            </div>

            <div className="space-y-5">
              {isLoading ? (
                <div className="rounded-[32px] border border-slate-200 bg-slate-50 p-6 text-center text-slate-500">
                  Loading community feed…
                </div>
              ) : feedPosts.length === 0 ? (
                <div className="rounded-[32px] border border-slate-200 bg-slate-50 p-6 text-center text-slate-500">
                  No posts yet. Be the first to share in the community.
                </div>
              ) : (
                feedPosts.map((post) => (
                  <article key={post.id} className="rounded-[32px] border border-slate-200 bg-white/95 p-6 shadow-sm shadow-slate-200/40 transition hover:-translate-y-0.5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-violet-50 text-violet-700">
                          {post.author.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{post.author.name}</p>
                          <p className="text-sm text-slate-500">{post.author.rank}</p>
                        </div>
                      </div>
                      <span className="text-sm text-slate-500">{post.timestamp}</span>
                    </div>
                    <p className="mt-5 text-sm leading-6 text-slate-700">{post.content}</p>

                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm text-slate-600">❤️ {post.likes} Likes</div>
                      <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm text-slate-600">💬 {post.comments} Comments</div>
                      <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm text-slate-600">↗ 0 Shares</div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-200 pt-4 text-sm text-slate-600">
                      <button className="rounded-3xl px-4 py-2 text-slate-700 transition hover:bg-violet-50">Like</button>
                      <button className="rounded-3xl px-4 py-2 text-slate-700 transition hover:bg-violet-50">Comment</button>
                      <button className="rounded-3xl px-4 py-2 text-slate-700 transition hover:bg-violet-50">Share</button>
                      <button className="rounded-3xl px-4 py-2 text-slate-700 transition hover:bg-violet-50">Save</button>
                    </div>
                  </article>
                ))
              )}
            </div>
            <div className="lg:hidden rounded-[32px] border border-slate-200 bg-white/95 p-4 shadow-lg shadow-slate-200/60">
              <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
                <span>Bottom Navigation</span>
                <span className="text-slate-400">Swipe</span>
              </div>
              <div className="mt-4 flex justify-between">
                {['🏠', '🔍', '➕', '💬', '👤'].map((item) => (
                  <button key={item} className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-100 text-lg transition hover:bg-violet-50">
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">
            <div className="rounded-[32px] border border-slate-200 bg-white/95 p-6 shadow-md shadow-slate-200/50">
              <p className="text-sm text-slate-500">Welcome back</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">Hassan 👋</h2>
              <div className="mt-4 rounded-3xl bg-slate-100 p-4 text-sm text-slate-700">
                <div className="flex items-center justify-between">
                  <span>Profile complete</span>
                  <span className="font-semibold text-violet-700">80%</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-2 w-4/5 rounded-full bg-gradient-to-r from-violet-700 to-fuchsia-500" />
                </div>
                <button className="mt-4 w-full rounded-3xl bg-violet-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-800">Complete →</button>
              </div>
            </div>

            <div className="rounded-[32px] border border-slate-200 bg-white/95 p-6 shadow-md shadow-slate-200/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Upcoming Events</p>
                  <p className="text-xs text-slate-500">Stay ready for the next community moment</p>
                </div>
              </div>
              <div className="mt-5 space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <p className="font-semibold text-slate-900">{event.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{event.location}</p>
                    <div className="mt-3 flex items-center justify-between text-sm text-slate-700">
                      <span>{event.date}</span>
                      <button className="rounded-3xl bg-violet-700 px-3 py-1 text-white transition hover:bg-violet-800">Join →</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] border border-slate-200 bg-white/95 p-6 shadow-md shadow-slate-200/50">
              <p className="text-sm font-semibold text-slate-900">Trending Topics</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {trendingTopics.map((topic) => (
                  <button key={topic} className="rounded-full border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-700 transition hover:bg-violet-50 hover:text-violet-700">
                    #{topic}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] border border-slate-200 bg-white/95 p-6 shadow-md shadow-slate-200/50">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900">Suggested Members</p>
                <span className="text-xs text-slate-500">Grow your network</span>
              </div>
              <div className="mt-4 space-y-3">
                {suggestedMembers.map((member) => (
                  <div key={member.name} className="flex items-center justify-between gap-3 rounded-3xl bg-slate-50 p-4">
                    <div>
                      <p className="font-semibold text-slate-900">{member.name}</p>
                      <p className="text-sm text-slate-500">{member.role}</p>
                    </div>
                    <button className="rounded-3xl border border-violet-200 bg-violet-50 px-3 py-1 text-sm font-semibold text-violet-700 transition hover:bg-violet-100">+ Follow</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] border border-slate-200 bg-white/95 p-6 shadow-md shadow-slate-200/50">
              <p className="text-sm font-semibold text-slate-900">Notification Center</p>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                {notifications.map((note) => (
                  <li key={note} className="rounded-3xl bg-slate-50 p-4">{note}</li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
