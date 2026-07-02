'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Search,
  Bell,
  MessageCircle,
  UserCircle,
  Home,
  Users,
  CalendarDays,
  Bookmark,
  Sparkles,
  HeartPulse,
  MoreHorizontal,
  ChevronRight,
  Grid,
  Plus,
  Smile,
  BadgeCheck,
  Paperclip,
  ChevronLeft,
  Pause,
  Play,
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import type { Post } from '@/lib/db'

const navItems = [
  { label: 'Home', icon: Home, href: '/' },
  { label: 'Community', icon: Users, href: '/community' },
  { label: 'Messages', icon: MessageCircle, href: '/messages' },
  { label: 'Events', icon: CalendarDays, href: '/events' },
  { label: 'Saved', icon: Bookmark, href: '/saved' },
  { label: 'Profile', icon: UserCircle, href: '/profile' },
]

const mobileBottomNav = [
  { label: 'Home', icon: Home },
  { label: 'Community', icon: Users },
  { label: 'Academy', icon: Sparkles },
  { label: 'Circles', icon: Grid },
  { label: 'Profile', icon: UserCircle },
]

const storyItems = [
  { name: 'Your Story', label: 'Share your story', time: 'Now', category: 'Celebration', primary: true, accent: 'from-violet-700 via-fuchsia-600 to-pink-500', online: true, seen: false },
  { name: 'Sharon', label: 'Business win', time: '2h', category: 'Business Win', accent: 'from-amber-400 to-orange-500', online: true, seen: false },
  { name: 'Faith', label: 'Graduation milestone', time: 'Today', category: 'Graduation', accent: 'from-emerald-500 to-teal-500', online: false, seen: true },
  { name: 'Pauline', label: 'Launch day', time: '4h', category: 'Launch', accent: 'from-sky-500 to-cyan-500', online: true, seen: false },
  { name: 'Mercy', label: 'Funding circle', time: '6h', category: 'Funding', accent: 'from-pink-500 to-rose-500', online: false, seen: true },
  { name: 'Grace', label: 'Community retreat', time: '1d', category: 'Community', accent: 'from-violet-500 to-indigo-500', online: false, seen: false },
]

const storyBadges = [
  { label: 'Business Win', icon: '🏆' },
  { label: 'Graduation', icon: '🎓' },
  { label: 'Launch', icon: '🚀' },
  { label: 'Funding', icon: '💰' },
  { label: 'Community', icon: '❤️' },
  { label: 'Celebration', icon: '🎉' },
  { label: 'Event', icon: '🌍' },
]

const upcomingEvents = [
  { title: "Women's Retreat", location: 'Naivasha', date: '12 August' },
  { title: 'Funding Circle', location: 'Nairobi', date: '22 August' },
]

const trendingTopics = ['Business', 'Funding', 'Jobs', 'Academy', 'WomenInTech']

const suggestedMembers = [
  { name: 'Pauline', role: 'Fashion Designer', mutual: 3 },
  { name: 'Faith', role: 'Lawyer', mutual: 2 },
  { name: 'Mercy', role: 'Community Builder', mutual: 4 },
]

const notifications = [
  { title: 'Pauline liked your post', time: '2m' },
  { title: 'Sharon followed you', time: '15m' },
  { title: 'BIG invited you', time: 'Yesterday' },
  { title: 'Silas commented', time: 'Yesterday' },
  { title: 'You earned a Community Badge', time: '2d' },
]

export default function CommunityFeed() {
  const router = useRouter()
  const { isAuthenticated, loading, user } = useAuth()
  const [feedPosts, setFeedPosts] = useState<Post[]>([])
  const [draft, setDraft] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [announcementVisible, setAnnouncementVisible] = useState(true)
  const [storyComposerOpen, setStoryComposerOpen] = useState(false)
  const [storyViewerOpen, setStoryViewerOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [fabOpen, setFabOpen] = useState(false)
  const [bottomNavActive, setBottomNavActive] = useState('Community')
  const [activeStoryIndex, setActiveStoryIndex] = useState(0)
  const [storyPaused, setStoryPaused] = useState(false)
  const [composerExpanded, setComposerExpanded] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const maxChars = 1500

  useEffect(() => {
    if (composerExpanded) {
      // small timeout to allow expansion animation to settle
      setTimeout(() => textareaRef.current?.focus(), 120)
    }
  }, [composerExpanded])

  const currentUserDisplayName = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || user?.email || 'You'
  const activeStory = storyItems[activeStoryIndex] ?? storyItems[0]

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
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong while loading community posts.')
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
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to publish your post.')
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    const loadFeed = async () => {
      if (!loading && !isAuthenticated) {
        router.replace('/auth/login?redirect=/community')
        return
      }

      if (isAuthenticated) {
        await fetchFeed()
      }
    }

    void loadFeed()
  }, [isAuthenticated, loading, router])

  const openStory = (index: number) => {
    setActiveStoryIndex(index)
    setStoryViewerOpen(true)
    setStoryPaused(false)
  }

  const goToNextStory = () => {
    setActiveStoryIndex((current) => (current + 1) % storyItems.length)
    setStoryPaused(false)
  }

  const goToPreviousStory = () => {
    setActiveStoryIndex((current) => (current - 1 + storyItems.length) % storyItems.length)
    setStoryPaused(false)
  }

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-base text-slate-600">Redirecting to login…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/95 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3 px-4 py-3 md:hidden">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-3xl bg-linear-to-br from-violet-700 via-fuchsia-600 to-pink-500 text-white shadow-xl shadow-violet-200/30">
              <Grid className="h-5 w-5" />
            </div>
            <span className="text-sm font-semibold text-slate-900">BIG</span>
          </div>

          <div className="flex items-center gap-2">
            <button type="button" aria-label="Search" onClick={() => setSearchOpen(true)} className="inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-slate-100 text-slate-600 transition duration-200 hover:bg-violet-50 hover:text-violet-700 active:scale-[0.97]">
              <Search className="h-5 w-5" />
            </button>
            <button type="button" aria-label="Notifications" className="inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-slate-100 text-slate-600 transition duration-200 hover:bg-violet-50 hover:text-violet-700 active:scale-[0.97]">
              <Bell className="h-5 w-5" />
            </button>
            <button type="button" aria-label="Messages" className="inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-slate-100 text-slate-600 transition duration-200 hover:bg-violet-50 hover:text-violet-700 active:scale-[0.97]">
              <MessageCircle className="h-5 w-5" />
            </button>
            <button type="button" aria-label="Profile" className="inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-slate-100 text-slate-600 transition duration-200 hover:bg-violet-50 hover:text-violet-700 active:scale-[0.97]">
              <UserCircle className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="hidden md:flex mx-auto max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-linear-to-br from-violet-700 via-fuchsia-600 to-pink-500 text-white shadow-xl shadow-violet-200/30">
                <Grid className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold tracking-wide text-violet-700">BIG</p>
                <p className="text-sm text-slate-500">Community Hub</p>
              </div>
            </div>

            <div className="hidden items-center gap-3 xl:flex">
              <button className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:text-violet-700">Community</button>
              <button className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:text-violet-700">Academy</button>
              <button className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:text-violet-700">Circles</button>
              <button className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:text-violet-700">Events</button>
            </div>

            <div className="flex items-center gap-3">
              <button className="inline-flex h-11 w-11 items-center justify-center rounded-3xl border border-slate-200/80 bg-white text-slate-600 shadow-sm transition duration-200 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 hover:shadow-md focus-visible:outline-2 focus-visible:outline-violet-200 active:scale-[0.98]">
                <Bell className="h-5 w-5" />
              </button>
              <button className="inline-flex h-11 w-11 items-center justify-center rounded-3xl border border-slate-200/80 bg-white text-slate-600 shadow-sm transition duration-200 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 hover:shadow-md focus-visible:outline-2 focus-visible:outline-violet-200 active:scale-[0.98]">
                <MessageCircle className="h-5 w-5" />
              </button>
              <button className="inline-flex h-11 w-11 items-center justify-center rounded-3xl border border-slate-200/80 bg-white text-slate-600 shadow-sm transition duration-200 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 hover:shadow-md focus-visible:outline-2 focus-visible:outline-violet-200 active:scale-[0.98]">
                <UserCircle className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-200/70 pt-3 xl:flex-row xl:items-center xl:justify-between">
            <nav className="flex flex-wrap items-center gap-3 xl:gap-4">
              <button className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:text-violet-700">Community</button>
              <button className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:text-violet-700">Academy</button>
              <button className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:text-violet-700">Circles</button>
              <button className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:text-violet-700">Mentors</button>
              <button className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:text-violet-700">Events</button>
            </nav>

            <div className="relative w-full max-w-md xl:w-1/3">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                placeholder="Search BIG..."
                className="w-full rounded-full border border-slate-200 bg-slate-100/95 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-violet-200 focus:bg-white"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 pb-24 sm:px-6 lg:px-8 xl:pb-6">
        <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1.8fr)_320px]">
          <aside className="hidden xl:block xl:sticky xl:top-6 xl:self-start">
            <div className="space-y-4 rounded-[28px] border border-slate-200/70 bg-white p-5 shadow-sm shadow-slate-200/50">
              <div className="text-sm font-semibold text-slate-600">Quick access</div>
              <nav className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const active = item.label === 'Community'
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`group flex items-center gap-3 rounded-[24px] px-4 py-3 transition duration-200 ${
                        active ? 'bg-violet-50 text-violet-700 shadow-sm shadow-violet-100' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <span className={`flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-100 text-slate-600 transition duration-200 ${active ? 'bg-violet-100 text-violet-700' : ''}`}>
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="text-sm font-semibold">{item.label}</span>
                    </Link>
                  )
                })}
              </nav>
            </div>

            <div className="rounded-[28px] border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/50">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Community Level</p>
                  <p className="mt-1 text-sm text-slate-500">Explorer</p>
                </div>
                <HeartPulse className="h-5 w-5 text-fuchsia-500" />
              </div>
              <div className="mt-5 rounded-full bg-slate-100 p-1">
                <div className="h-3 rounded-full bg-linear-to-r from-violet-700 via-fuchsia-500 to-pink-500" style={{ width: '80%' }} />
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-500">80% complete toward Community Leader.</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li>• Complete your profile</li>
                <li>• Attend one event</li>
                <li>• Comment on five posts</li>
                <li>• Share your first story</li>
              </ul>
            </div>
          </aside>

          <section className="space-y-6">
            <div className="overflow-hidden rounded-[32px] border border-slate-200/70 bg-white p-5 shadow-sm shadow-slate-200/40 transition duration-200 hover:shadow-md">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-700">Stories</p>
                  <p className="mt-1 text-sm text-slate-500">A premium lens into wins, launches, mentors, and moments shaping BIG.</p>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-xs text-slate-600">
                  <span className="font-semibold text-violet-700">Live</span> Today
                </div>
              </div>

              <div className="mt-5 w-full overflow-x-auto pb-2">
                <div className="grid w-max grid-flow-col gap-4">
                  <button
                    type="button"
                    onClick={() => setStoryComposerOpen(true)}
                    className="group min-w-42.5 rounded-[28px] border border-violet-200 bg-linear-to-br from-violet-700 via-fuchsia-600 to-pink-500 p-4 text-left text-white shadow-xl shadow-violet-200/40 transition duration-200 hover:-translate-y-1 hover:shadow-2xl"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-xl font-semibold">
                        H
                      </div>
                      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-white/20 text-white">
                        <Plus className="h-4 w-4" />
                      </div>
                    </div>
                    <p className="mt-5 text-sm font-semibold">Your Story</p>
                    <p className="mt-2 text-xs leading-5 text-violet-50">Create a story or share an update.</p>
                  </button>

                  {storyItems.slice(1).map((story, index) => (
                    <button
                      key={story.name}
                      type="button"
                      onClick={() => openStory(index + 1)}
                      className="group min-w-42.5 rounded-[28px] border border-slate-200 bg-slate-50 p-4 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br p-0.5 shadow-sm shadow-slate-200/60">
                        <div className={`flex h-full w-full items-center justify-center rounded-full bg-white text-sm font-semibold text-slate-900 ${story.seen ? 'opacity-80' : ''}`}>
                          {story.name.charAt(0)}
                        </div>
                        {story.online ? <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white bg-emerald-500" /> : null}
                      </div>
                      <div className="mt-4">
                        <p className="text-sm font-semibold text-slate-900">{story.name}</p>
                        <p className="mt-1 text-xs text-slate-500">{story.label}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {storyBadges.map((badge) => (
                  <span key={badge.label} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
                    {badge.icon} {badge.label}
                  </span>
                ))}
              </div>
            </div>

            {announcementVisible ? (
              <div className="rounded-[32px] border border-amber-200/80 bg-amber-50 p-5 shadow-sm shadow-amber-100/70">
                <div className="flex items-center gap-3 text-sm text-slate-700">
                  <div className="flex h-11 w-11 items-center justify-center rounded-3xl bg-amber-100 text-amber-700 shadow-sm">📌</div>
                  <div>
                    <p className="font-semibold text-slate-900">Pinned by BIG</p>
                    <p className="mt-1 text-base font-semibold text-slate-900">Women&apos;s Leadership Summit</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <Link href="/events" className="inline-flex items-center gap-2 rounded-3xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                    Register
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setAnnouncementVisible(false)}
                    className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-violet-200 hover:text-violet-700"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ) : null}

            <div className="rounded-[28px] border border-slate-200/70 bg-white p-4 shadow-sm shadow-slate-200/40 sm:p-5">
              <div
                role="button"
                tabIndex={0}
                onClick={() => setComposerExpanded((value) => !value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setComposerExpanded((value) => !value)
                  }
                }}
                aria-expanded={composerExpanded}
                className="group flex w-full flex-col gap-4 rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4 transition hover:border-violet-200 hover:bg-white"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-3xl bg-linear-to-br from-pink-500 via-fuchsia-500 to-violet-700 text-base font-semibold text-white shadow-lg shadow-violet-200/20">
                      H
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Hassan</p>
                      <p className="text-sm text-slate-500">What&apos;s inspiring you today?</p>
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-2">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm shadow-slate-100/80">
                      <Smile className="h-5 w-5" />
                    </div>
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm shadow-slate-100/80">
                      <Paperclip className="h-5 w-5" />
                    </div>
                  </div>
                </div>
                <div className="rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 transition group-hover:border-violet-200">
                  Share a win, ask for advice, or inspire the BIG community...
                </div>
              </div>

              <div
                style={{ maxHeight: composerExpanded ? '520px' : '0px', transition: 'max-height 220ms ease', overflow: 'hidden' }}
                aria-hidden={!composerExpanded}
              >
                <div className="mt-4 rounded-[24px] border border-slate-200 bg-slate-50/90 p-4">
                  <div className="mb-4 rounded-[20px] bg-white p-4 shadow-sm shadow-slate-200/40">
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-3xl bg-linear-to-br from-pink-500 via-fuchsia-500 to-violet-700 text-base font-semibold text-white">
                        H
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900">Hassan</p>
                        <p className="text-sm text-slate-500">Share your next community moment.</p>
                      </div>
                    </div>
                  </div>

                  <textarea
                    ref={textareaRef}
                    value={draft}
                    onChange={(event) => {
                      if (event.target.value.length <= maxChars) setDraft(event.target.value)
                    }}
                    rows={5}
                    placeholder="Share a business win, ask for advice, celebrate another woman, post an opportunity, or inspire the BIG community..."
                    className="min-h-35 w-full rounded-[20px] border border-slate-200 bg-white px-4 py-4 text-sm leading-7 text-slate-900 outline-none transition duration-200 focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
                  />

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <button type="button" className="inline-flex h-11 items-center gap-2 rounded-3xl border border-slate-200 bg-white px-4 text-sm text-slate-600 transition hover:border-violet-200 hover:text-violet-700">
                      <Smile className="h-4 w-4 text-violet-700" />
                      Emoji
                    </button>
                    <button type="button" className="inline-flex h-11 items-center gap-2 rounded-3xl border border-slate-200 bg-white px-4 text-sm text-slate-600 transition hover:border-violet-200 hover:text-violet-700">
                      <Paperclip className="h-4 w-4 text-violet-700" />
                      Attach
                    </button>
                    <div className="ml-auto text-xs text-slate-400">{draft.length}/{maxChars}</div>
                    <button type="button" onClick={async () => { await handlePost(); setComposerExpanded(false) }} disabled={isSubmitting || !draft.trim() || draft.length > maxChars} className="inline-flex h-11 items-center justify-center rounded-3xl bg-linear-to-r from-violet-700 via-fuchsia-600 to-pink-500 px-5 text-sm font-semibold text-white shadow-lg shadow-violet-200/30 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600">
                      {isSubmitting ? 'Posting…' : 'Post'}
                    </button>
                  </div>
                </div>
              </div>

              {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}
            </div>

            <div className="space-y-5">
              {isLoading ? (
                <div className="rounded-[32px] border border-slate-200/70 bg-white p-8 text-center text-slate-500 shadow-sm shadow-slate-200/40">
                  <p className="text-base font-semibold text-slate-900">Loading community feed…</p>
                  <p className="mt-2 text-sm text-slate-500">Hang tight while we gather the latest conversations.</p>
                </div>
              ) : feedPosts.length === 0 ? (
                <div className="rounded-[32px] border border-slate-200/70 bg-white p-8 text-center text-slate-500 shadow-sm shadow-slate-200/40">
                  <p className="text-base font-semibold text-slate-900">No posts yet</p>
                  <p className="mt-2 text-sm text-slate-500">Start the conversation and inspire the community.</p>
                </div>
              ) : (
                feedPosts.map((post) => (
                  <article key={post.id} className="rounded-[32px] border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-3">
                          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-linear-to-br from-violet-600 via-fuchsia-500 to-pink-500 text-white shadow-lg shadow-violet-200/60">
                            {post.author.name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                              <span>{post.author.name}</span>
                              <BadgeCheck className="h-4 w-4 text-violet-600" />
                            </div>
                            <p className="mt-1 text-sm text-slate-500">{post.author.rank || 'Founder'} • {post.timestamp}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 transition hover:border-violet-200 hover:bg-white"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>

                      <p className="text-base leading-7 text-slate-700">{post.content}</p>

                      <div className="h-px bg-slate-200" />

                      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                        <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2">
                          <span>👏</span>
                          {post.likes || 32}
                        </span>
                        <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2">
                          <span>❤️</span>
                          {post.likes || 14}
                        </span>
                        <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2">
                          <span>💬</span>
                          {post.comments || 8}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 border-t border-slate-200 pt-4 text-sm text-slate-600">
                        <button className="inline-flex items-center gap-2 text-slate-700 transition hover:text-violet-700">
                          <Sparkles className="h-4 w-4" /> Share
                        </button>
                        <button className="inline-flex items-center gap-2 text-slate-700 transition hover:text-violet-700">
                          <Bookmark className="h-4 w-4" /> Save
                        </button>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
            <div className="lg:hidden rounded-[32px] border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/40">
              <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
                <span>Bottom Navigation</span>
                <span className="text-slate-400">Swipe</span>
              </div>
              <div className="mt-4 flex justify-between">
                {['🏠', '🔍', '➕', '💬', '👤'].map((item) => (
                  <button
                    key={item}
                    className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-100 text-lg transition duration-200 hover:bg-violet-50 hover:text-violet-700 active:scale-[0.97]"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <aside className="hidden xl:block xl:space-y-6 xl:sticky xl:top-6 xl:self-start">
            <div className="rounded-[32px] border border-slate-200 bg-white/95 p-6 shadow-md shadow-slate-200/50">
              <p className="text-sm text-slate-500">Welcome back</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">{currentUserDisplayName || 'Member'} 👋</h2>
              <div className="mt-4 rounded-3xl bg-slate-100 p-4 text-sm text-slate-700">
                <div className="flex items-center justify-between">
                  <span>Profile complete</span>
                  <span className="font-semibold text-violet-700">80%</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-2 w-4/5 rounded-full bg-linear-to-r from-violet-700 to-fuchsia-500" />
                </div>
                <button className="mt-4 w-full rounded-3xl bg-violet-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-800">Complete →</button>
              </div>
            </div>

            <div className="rounded-[32px] border border-slate-200 bg-white/95 p-6 shadow-md shadow-slate-200/50">
              <p className="text-sm font-semibold text-slate-900">Community Snapshot</p>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                  <span>Members</span>
                  <span className="font-semibold text-slate-900">4,800</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                  <span>Posts today</span>
                  <span className="font-semibold text-slate-900">128</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                  <span>Events</span>
                  <span className="font-semibold text-slate-900">5</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                  <span>Circles</span>
                  <span className="font-semibold text-slate-900">42</span>
                </div>
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
                <span className="text-xs text-slate-500">Build your crew</span>
              </div>
              <div className="mt-4 space-y-3">
                {suggestedMembers.map((member) => (
                  <div key={member.name} className="flex items-center gap-3 rounded-[28px] border border-slate-200 bg-slate-50 p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-violet-100 text-violet-700 font-semibold shadow-sm">
                      {member.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-900">{member.name}</p>
                      <p className="text-sm text-slate-500">{member.role}</p>
                      <p className="mt-2 text-xs text-slate-400">{member.mutual} mutual circles</p>
                    </div>
                    <button className="rounded-3xl border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700 transition hover:bg-violet-100">Follow</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] border border-slate-200 bg-white/95 p-6 shadow-md shadow-slate-200/50">
              <p className="text-sm font-semibold text-slate-900">Notification Center</p>
              <ul className="mt-4 space-y-4 text-sm text-slate-600">
                {notifications.map((note) => (
                  <li key={note.title} className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-900">{note.title}</p>
                        <p className="mt-1 text-xs text-slate-500">{note.time}</p>
                      </div>
                      <span className="mt-1 h-2 w-2 rounded-full bg-violet-500" />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </main>

      {searchOpen ? (
        <div className="fixed inset-0 z-60 flex items-start justify-center bg-slate-950/75 px-4 pt-24 pb-8 backdrop-blur-sm lg:hidden">
          <div className="w-full max-w-xl rounded-[32px] border border-slate-200 bg-white shadow-2xl shadow-slate-950/20">
            <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  type="search"
                  placeholder="Search BIG…"
                  className="w-full rounded-3xl border border-slate-200 bg-slate-100 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-violet-300 focus:bg-white"
                />
              </div>
              <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery('') }} className="inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-slate-100 text-slate-600 transition hover:bg-violet-50 hover:text-violet-700">
                ✕
              </button>
            </div>
            <div className="space-y-4 px-4 py-5">
              <div>
                <p className="text-sm font-semibold text-slate-900">Popular searches</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {['Community', 'Funding', 'Mentors', 'Events', 'Academy'].map((term) => (
                    <button key={term} type="button" className="rounded-full border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700">
                      {term}
                    </button>
                  ))}
                </div>
              </div>
              <div className="rounded-[28px] bg-slate-50 p-4 text-sm text-slate-600">
                Search posts, stories, events, and members across BIG.
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-t shadow-slate-200/30 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-2">
          {mobileBottomNav.map((item) => {
            const Icon = item.icon
            const active = item.label === bottomNavActive
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => setBottomNavActive(item.label)}
                className={`flex flex-1 flex-col items-center justify-center gap-1 rounded-3xl px-3 py-2 text-[11px] font-semibold transition ${
                  active ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </button>
            )
          })}
          <button
            type="button"
            onClick={() => setFabOpen((value) => !value)}
            aria-label="Create new post"
            className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-violet-700 via-fuchsia-600 to-pink-500 text-white shadow-xl shadow-violet-200/40 transition hover:scale-[0.98]"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>

      {fabOpen ? (
        <div className="fixed inset-x-0 bottom-20 z-50 flex justify-center px-4 lg:hidden">
          <div className="w-full max-w-md rounded-[32px] border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-950/15">
            <div className="grid gap-3 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => {
                  setComposerExpanded(true)
                  setFabOpen(false)
                }}
                className="flex flex-col items-center gap-2 rounded-[24px] border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-700 transition hover:bg-violet-50 hover:text-violet-700"
              >
                <Plus className="h-5 w-5" />
                New Post
              </button>
              <button
                type="button"
                onClick={() => {
                  setStoryComposerOpen(true)
                  setFabOpen(false)
                }}
                className="flex flex-col items-center gap-2 rounded-[24px] border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-700 transition hover:bg-violet-50 hover:text-violet-700"
              >
                <Sparkles className="h-5 w-5" />
                Story
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchOpen(true)
                  setFabOpen(false)
                }}
                className="flex flex-col items-center gap-2 rounded-[24px] border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-700 transition hover:bg-violet-50 hover:text-violet-700"
              >
                <Search className="h-5 w-5" />
                Search
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {storyComposerOpen ? (
        <div className="fixed inset-0 z-70 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-5xl overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-2xl shadow-slate-950/20">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-700">Share your story</p>
                <p className="mt-1 text-sm text-slate-500">Create a moment worth remembering.</p>
              </div>
              <button type="button" onClick={() => setStoryComposerOpen(false)} className="rounded-full border border-slate-200 bg-white p-2 text-slate-600 transition hover:border-violet-200 hover:text-violet-700">
                <Plus className="h-5 w-5 rotate-45" />
              </button>
            </div>

            <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="p-6">
                <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-linear-to-br from-violet-700 via-fuchsia-600 to-pink-500 text-lg font-semibold text-white">
                      H
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Good morning, Hassan</p>
                      <p className="text-sm text-slate-500">What would you like to share today?</p>
                    </div>
                  </div>

                  <textarea
                    rows={7}
                    placeholder="Celebrate a win, ask for support, or inspire another woman..."
                    className="mt-4 min-h-45 w-full rounded-[24px] border border-slate-200 bg-white px-4 py-4 text-sm leading-7 text-slate-700 outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                  />

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button type="button" className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">📷 Upload Photo</button>
                    <button type="button" className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">🎥 Upload Video</button>
                    <button type="button" className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">😊 Add Emoji</button>
                    <button type="button" className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">📍 Add Location</button>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 bg-white p-6 lg:border-l lg:border-t-0">
                <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-700">Preview story</p>
                  <div className="mt-4 rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-linear-to-br from-violet-700 via-fuchsia-600 to-pink-500 text-sm font-semibold text-white">
                          H
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">Hassan</p>
                          <p className="text-xs text-slate-500">Today • Community</p>
                        </div>
                      </div>
                      <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-700">Celebration</span>
                    </div>
                    <div className="mt-4 rounded-[24px] bg-linear-to-br from-violet-100 via-white to-fuchsia-100 p-5">
                      <p className="text-sm leading-7 text-slate-700">Celebrate a win, share a lesson, or inspire another woman to keep going.</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <label className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
                      <select className="bg-transparent outline-none">
                        <option>Category</option>
                        <option>Business Win</option>
                        <option>Graduation</option>
                        <option>Funding</option>
                      </select>
                    </label>
                    <label className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
                      <select className="bg-transparent outline-none">
                        <option>Audience</option>
                        <option>Community</option>
                        <option>Circles</option>
                        <option>Mentors</option>
                      </select>
                    </label>
                  </div>

                  <button type="button" onClick={() => setStoryComposerOpen(false)} className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-linear-to-r from-violet-700 via-fuchsia-600 to-pink-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200/40 transition hover:-translate-y-0.5 hover:shadow-xl">
                    Publish story
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {storyViewerOpen ? (
        <div className="fixed inset-0 z-80 flex items-center justify-center bg-slate-950/75 px-4 py-6 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl overflow-hidden rounded-[36px] border border-white/10 bg-slate-950 text-white shadow-2xl shadow-slate-950/30">
            <div className="absolute inset-x-0 top-0 flex gap-2 px-4 py-4">
              {storyItems.map((_, index) => (
                <div key={`${index}-progress`} className="h-1 flex-1 overflow-hidden rounded-full bg-white/20">
                  <div className={`h-full rounded-full ${index <= activeStoryIndex ? 'bg-white' : 'bg-transparent'}`} style={{ width: index === activeStoryIndex ? '70%' : '100%' }} />
                </div>
              ))}
            </div>

            <div className="flex items-start justify-between px-5 pb-4 pt-12">
              <div className="flex items-center gap-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br ${activeStory.accent} text-lg font-semibold text-white`}>
                  {activeStory.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold">{activeStory.name}</p>
                  <p className="text-xs text-slate-300">{activeStory.category} • {activeStory.time}</p>
                </div>
              </div>
              <button type="button" onClick={() => setStoryViewerOpen(false)} className="rounded-full border border-white/20 bg-white/10 p-2 text-white transition hover:bg-white/20">
                <Plus className="h-5 w-5 rotate-45" />
              </button>
            </div>

            <div className="px-5 pb-6">
              <div className="rounded-[28px] border border-white/10 bg-white/10 p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-200">Story</p>
                    <h3 className="mt-2 text-2xl font-semibold text-white">{activeStory.label}</h3>
                  </div>
                  <button type="button" onClick={() => setStoryPaused((current) => !current)} className="rounded-full border border-white/20 bg-white/10 p-2 text-white transition hover:bg-white/20">
                    {storyPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                  </button>
                </div>
                <div className="mt-6 rounded-[24px] bg-linear-to-br from-violet-600/20 via-slate-900 to-fuchsia-600/20 p-6">
                  <p className="text-base leading-8 text-slate-100">A beautiful moment from the BIG community — a win, a lesson, a milestone, and a reminder that women grow better together.</p>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button type="button" className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/20">Reply</button>
                  <button type="button" className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/20">React</button>
                  <button type="button" className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/20">Share</button>
                </div>
              </div>
            </div>

            <div className="absolute inset-y-0 left-3 flex items-center">
              <button type="button" onClick={goToPreviousStory} className="rounded-full border border-white/15 bg-white/10 p-2 text-white transition hover:bg-white/20">
                <ChevronLeft className="h-5 w-5" />
              </button>
            </div>
            <div className="absolute inset-y-0 right-3 flex items-center">
              <button type="button" onClick={goToNextStory} className="rounded-full border border-white/15 bg-white/10 p-2 text-white transition hover:bg-white/20">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
