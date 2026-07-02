'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Bell,
  Briefcase,
  CalendarDays,
  ChevronRight,
  Grid,
  Heart,
  Home,
  MessageCircle,
  Plus,
  Search,
  Sparkles,
  UserCircle,
  Users,
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import type { Post } from '@/lib/db'

const navItems = [
  { label: 'Community', icon: Users, href: '/community' },
  { label: 'Academy', icon: Sparkles, href: '/academy' },
  { label: 'Sister Circles', icon: Grid, href: '/circles' },
  { label: 'Events', icon: CalendarDays, href: '/events' },
  { label: 'Opportunities', icon: Briefcase, href: '/opportunities' },
  { label: 'Mentors', icon: UserCircle, href: '/mentorship' },
]

const feedTabs = [
  { label: 'For You', value: 'for_you', icon: Home },
  { label: 'Following', value: 'following', icon: Users },
  { label: 'Trending', value: 'trending', icon: Sparkles },
  { label: 'Questions', value: 'question', icon: MessageCircle },
  { label: 'Celebrations', value: 'celebration', icon: Heart },
  { label: 'Opportunities', value: 'funding', icon: Briefcase },
]

type CommunityFeedPost = {
  id: string
  content?: string
  created_at?: string
  comments_count?: number
  profile?: {
    first_name?: string | null
    last_name?: string | null
    avatar_url?: string | null
    profession?: string | null
  }
  media?: Array<{ url?: string }>
  reactions?: unknown[]
}

const storyCards = [
  {
    name: 'Your Story',
    label: 'Share a win',
    avatar: 'H',
    accent: 'from-violet-700 via-fuchsia-600 to-pink-500',
    primary: true,
  },
  { name: 'Sharon', label: 'Business win', avatar: 'S', accent: 'from-amber-400 to-orange-500' },
  { name: 'Faith', label: 'Growth moment', avatar: 'F', accent: 'from-emerald-500 to-teal-500' },
  { name: 'Pauline', label: 'Launch day', avatar: 'P', accent: 'from-sky-500 to-cyan-500' },
  { name: 'Mercy', label: 'Workshop recap', avatar: 'M', accent: 'from-pink-500 to-rose-500' },
  { name: 'Grace', label: 'Circle highlight', avatar: 'G', accent: 'from-violet-500 to-indigo-500' },
  { name: 'Amina', label: 'Mentor tip', avatar: 'A', accent: 'from-fuchsia-600 to-violet-700' },
  { name: 'Nia', label: 'New opportunity', avatar: 'N', accent: 'from-indigo-500 to-cyan-500' },
]

const prompts = [
  '💜 Celebrate a win today...',
  '🤝 Ask the community for advice...',
  '🌱 What are you learning this week?',
  '🚀 Share an opportunity with another woman...',
  '✨ Inspire another member with your story...',
]

const toolbarActions = [
  { label: 'Emoji', icon: '😊' },
  { label: 'Photo', icon: '📷' },
  { label: 'Video', icon: '🎥' },
  { label: 'Attachment', icon: '📎' },
  { label: 'Location', icon: '📍' },
  { label: 'Tags', icon: '🏷' },
  { label: 'Mention', icon: '👥' },
  { label: 'Poll', icon: '🗳' },
  { label: 'Event', icon: '📅' },
  { label: 'Opportunity', icon: '🚀' },
]

const upcomingEvents = [
  { title: 'Leadership Lab', date: '12 Aug', location: 'Nairobi', type: 'Retreat' },
  { title: 'Mentor Match', date: '18 Aug', location: 'Virtual', type: 'Workshop' },
]

const trendingTopics = [
  'Funding',
  'WomenInTech',
  'Mentorship',
  'Career Growth',
  'Wellness',
]

const suggestedMembers = [
  { name: 'Pauline', role: 'Fashion Designer', circle: 'Founders Circle' },
  { name: 'Faith', role: 'Corporate Lawyer', circle: 'Mentor Circle' },
  { name: 'Mercy', role: 'Community Builder', circle: 'Growth Circle' },
]

const pinnedAnnouncement = {
  title: 'BIG Leadership Summit',
  description: 'Register now for the flagship event designed for founders, mentors, and ambitious women building together.',
  action: 'Register',
  href: '/events',
}

const bottomNav = [
  { label: 'Community', icon: Home, href: '/community' },
  { label: 'Circles', icon: Grid, href: '/circles' },
  { label: 'Events', icon: CalendarDays, href: '/events' },
  { label: 'Opportunities', icon: Briefcase, href: '/opportunities' },
  { label: 'Profile', icon: UserCircle, href: '/auth/profile' },
]

export default function CommunityFeed() {
  const router = useRouter()
  const { isAuthenticated, loading, user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [draft, setDraft] = useState('')
  const [composerOpen, setComposerOpen] = useState(false)
  const [selectedTab, setSelectedTab] = useState('for_you')
  const [promptIndex] = useState(() => Math.floor(Math.random() * prompts.length))
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [draftSaved, setDraftSaved] = useState(false)
  const [announcementVisible, setAnnouncementVisible] = useState(true)

  const currentUserName = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || user?.email || 'You'
  const placeholder = prompts[promptIndex]

  useEffect(() => {
    const loadFeed = async () => {
      if (!loading && !isAuthenticated) {
        router.replace('/auth/login?redirect=/community')
        return
      }

      if (!isAuthenticated) return

      setIsLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams()
        if (selectedTab !== 'for_you' && selectedTab !== 'following' && selectedTab !== 'trending') {
          params.set('filter', selectedTab)
        }

        const response = await fetch(`/api/community/posts?${params.toString()}`)
        if (!response.ok) {
          throw new Error('Unable to load feed')
        }

        const data = await response.json()
        const incoming = Array.isArray(data.posts) ? (data.posts as CommunityFeedPost[]) : []

        const normalized: Post[] = incoming.map((post) => ({
          id: post.id,
          author: {
            name: [post.profile?.first_name, post.profile?.last_name].filter(Boolean).join(' ') || 'Member',
            avatar: post.profile?.avatar_url || '',
            rank: post.profile?.profession || 'Member',
          },
          content: post.content || '',
          image: post.media?.[0]?.url || undefined,
          timestamp: post.created_at
            ? new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            : '',
          likes: Array.isArray(post.reactions) ? post.reactions.length : 0,
          comments: post.comments_count ?? 0,
        }))

        setPosts(normalized)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load community posts')
      } finally {
        setIsLoading(false)
      }
    }

    void loadFeed()
  }, [isAuthenticated, loading, router, selectedTab])

  const handlePublish = async () => {
    const content = draft.trim()
    if (!content) return

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, post_type: 'text', visibility: 'public', metadata: {} }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.error || 'Unable to publish post')
      }

      const data = await response.json()
      const nextPost: Post = {
        id: data.id,
        author: {
          name: [data.profile?.first_name, data.profile?.last_name].filter(Boolean).join(' ') || currentUserName,
          avatar: data.profile?.avatar_url || '',
          rank: data.profile?.profession || 'Member',
        },
        content: data.content,
        image: data.media?.[0]?.url || undefined,
        timestamp: new Date(data.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        likes: Array.isArray(data.reactions) ? data.reactions.length : 0,
        comments: data.comments_count ?? 0,
      }
      setPosts((current) => [nextPost, ...current])
      setDraft('')
      setComposerOpen(false)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to publish your post')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveDraft = () => {
    setDraftSaved(true)
    window.setTimeout(() => setDraftSaved(false), 1200)
  }

  if (loading || (!isAuthenticated && typeof window !== 'undefined')) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-slate-50">
        <p className="text-base text-slate-600">Redirecting to login…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-linear-to-br from-violet-700 via-fuchsia-600 to-pink-500 text-white shadow-xl shadow-violet-200/30">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-700">BIG Community</p>
              <p className="text-sm text-slate-600">A premium space for women to share, connect, and grow.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button type="button" className="inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-slate-100 text-slate-600 transition hover:bg-violet-50 hover:text-violet-700">
              <Search className="h-5 w-5" />
            </button>
            <button type="button" className="inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-slate-100 text-slate-600 transition hover:bg-violet-50 hover:text-violet-700">
              <Bell className="h-5 w-5" />
            </button>
            <button type="button" className="inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-slate-100 text-slate-600 transition hover:bg-violet-50 hover:text-violet-700">
              <MessageCircle className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 lg:px-8 xl:pb-24">
        <div className="grid gap-6 xl:grid-cols-[240px_minmax(0,1.75fr)_320px]">
          <aside className="hidden xl:block xl:sticky xl:top-6 xl:self-start">
            <div className="space-y-4 rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-700">Navigation</p>
              <nav className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const active = item.label === 'Community'
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`group flex items-center gap-3 rounded-[24px] px-4 py-3 text-sm font-semibold transition ${
                        active
                          ? 'bg-violet-50 text-violet-700 shadow-sm shadow-violet-100'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <span className={`flex h-11 w-11 items-center justify-center rounded-3xl bg-slate-100 text-slate-600 transition ${active ? 'bg-violet-100 text-violet-700' : ''}`}>
                        <Icon className="h-5 w-5" />
                      </span>
                      {item.label}
                    </Link>
                  )
                })}
              </nav>
            </div>
          </aside>

          <section className="space-y-6">
            <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/40">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.28em] text-violet-700">Community feed</p>
                  <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">The heart of BIG</h1>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">Connect with women who are learning, launching, mentoring, and growing together in one calm, beautiful feed.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link href="/circles" className="rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700">
                    Explore Circles
                  </Link>
                  <Link href="/opportunities" className="rounded-full bg-violet-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-800">
                    Browse Opportunities
                  </Link>
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/40">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-700">Stories</p>
                  <p className="mt-1 text-sm text-slate-500">Swipe through community moments, launches, and wins.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setComposerOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                >
                  <Sparkles className="h-4 w-4" />
                  Create Story
                </button>
              </div>

              <div className="mt-5 flex gap-4 overflow-x-auto pb-3">
                {storyCards.map((story) => (
                  <button
                    key={story.name}
                    type="button"
                    className={`min-w-[170px] rounded-[28px] border p-4 text-left transition duration-200 ${
                      story.primary
                        ? 'border-transparent bg-linear-to-br from-violet-700 via-fuchsia-600 to-pink-500 text-white shadow-xl shadow-violet-200/40'
                        : 'border-slate-200 bg-slate-50 text-slate-900 hover:-translate-y-1 hover:shadow-lg'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${story.accent} text-xl font-semibold shadow-lg shadow-slate-200/20`}>
                        {story.avatar}
                      </div>
                      {story.primary ? (
                        <span className="inline-flex h-9 items-center rounded-full bg-white/15 px-3 text-xs font-semibold text-white backdrop-blur-sm">Your Story</span>
                      ) : (
                        <span className="inline-flex h-9 items-center rounded-full bg-slate-100 px-3 text-xs font-semibold text-slate-700">{story.label}</span>
                      )}
                    </div>

                    <div className="mt-4">
                      <p className={`text-sm font-semibold ${story.primary ? 'text-white' : 'text-slate-900'}`}>{story.name}</p>
                      <p className={`mt-1 text-xs leading-5 ${story.primary ? 'text-slate-100/90' : 'text-slate-500'}`}>{story.primary ? 'Share your next community moment' : story.label}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/40">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-700">Create post</p>
                  <p className="mt-1 text-sm text-slate-500">Share a win, ask for help, celebrate another woman, or post an opportunity.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setComposerOpen((value) => !value)}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                >
                  <Plus className="h-4 w-4" />
                  {composerOpen ? 'Collapse' : 'New post'}
                </button>
              </div>

              <div className="mt-5 rounded-[28px] border border-slate-200 bg-slate-50 p-4 transition">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-linear-to-br from-violet-700 via-fuchsia-600 to-pink-500 text-white text-lg font-semibold shadow-lg shadow-violet-200/30">
                    {currentUserName.charAt(0)}
                  </div>
                  <div className="flex-1 rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 transition hover:border-violet-200 hover:text-slate-700" role="button" tabIndex={0} onClick={() => setComposerOpen(true)}>
                    {placeholder}
                  </div>
                </div>

                {composerOpen ? (
                  <div className="mt-5 space-y-4">
                    <textarea
                      value={draft}
                      onChange={(event) => setDraft(event.target.value)}
                      rows={6}
                      placeholder={placeholder}
                      className="w-full rounded-[24px] border border-slate-200 bg-white px-4 py-4 text-sm leading-7 text-slate-900 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                    />

                    <div className="grid gap-2 sm:grid-cols-2">
                      <div className="flex flex-wrap gap-2">
                        {toolbarActions.map((action) => (
                          <button
                            key={action.label}
                            type="button"
                            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                          >
                            <span>{action.icon}</span>
                            {action.label}
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <label className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
                          Visibility
                          <select className="ml-2 bg-transparent text-sm outline-none" defaultValue="public">
                            <option value="public">Public</option>
                            <option value="connections">Connections</option>
                            <option value="circles">Circles</option>
                          </select>
                        </label>
                        <button
                          type="button"
                          onClick={handleSaveDraft}
                          className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 bg-slate-100 px-4 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                        >
                          Save draft
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={handlePublish}
                        disabled={!draft.trim() || isSubmitting}
                        className="inline-flex h-12 items-center justify-center rounded-full bg-linear-to-r from-violet-700 via-fuchsia-600 to-pink-500 px-6 text-sm font-semibold text-white shadow-lg shadow-violet-200/30 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
                      >
                        {isSubmitting ? 'Publishing…' : 'Publish'}
                      </button>
                      <span className="text-sm text-slate-500">{draft.length} characters</span>
                      {draftSaved ? <span className="text-sm font-semibold text-violet-700">Draft saved</span> : null}
                    </div>
                    {error ? <p className="text-sm text-rose-600">{error}</p> : null}
                  </div>
                ) : null}
              </div>
            </div>

            {announcementVisible ? (
              <div className="rounded-[28px] border border-violet-200/80 bg-violet-50 p-5 shadow-sm shadow-violet-100/60">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-700">Pinned announcement</p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-950">{pinnedAnnouncement.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{pinnedAnnouncement.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link href={pinnedAnnouncement.href} className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                      {pinnedAnnouncement.action}
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setAnnouncementVisible(false)}
                      className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:text-violet-700"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/40">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-700">Community feed</p>
                  <p className="mt-1 text-sm text-slate-500">The latest conversations, support, and opportunities from BIG members.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {feedTabs.map((tab) => {
                    const Icon = tab.icon
                    const active = selectedTab === tab.value
                    return (
                      <button
                        key={tab.value}
                        type="button"
                        onClick={() => setSelectedTab(tab.value)}
                        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                          active ? 'bg-violet-100 text-violet-700 shadow-sm shadow-violet-100' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {tab.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="mt-5 space-y-5">
                {isLoading ? (
                  <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
                    <p className="text-base font-semibold text-slate-900">Loading posts…</p>
                    <p className="mt-2 text-sm text-slate-500">Gathering the latest stories from your community.</p>
                  </div>
                ) : posts.length === 0 ? (
                  <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-8 text-center">
                    <p className="text-base font-semibold text-slate-950">You&apos;re early! Start the first conversation and inspire another woman.</p>
                    <p className="mt-3 text-sm text-slate-600">Share a win, ask a question, or spotlight a sister today.</p>
                    <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => setComposerOpen(true)}
                        className="rounded-full bg-violet-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200/30 transition hover:bg-violet-800"
                      >
                        Create Post
                      </button>
                      <Link href="/opportunities" className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:text-violet-700">
                        Browse Opportunities
                      </Link>
                      <Link href="/circles" className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:text-violet-700">
                        Explore Sister Circles
                      </Link>
                    </div>
                  </div>
                ) : (
                  posts.map((post) => (
                    <article key={post.id} className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-linear-to-br from-violet-700 via-fuchsia-600 to-pink-500 text-white text-lg font-semibold shadow-lg shadow-violet-200/20">
                            {post.author.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-950">{post.author.name}</p>
                            <p className="mt-1 text-sm text-slate-500">{post.author.rank} • {post.timestamp}</p>
                          </div>
                        </div>
                        <button className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 transition hover:border-violet-200 hover:bg-white">
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>

                      <p className="mt-5 text-base leading-7 text-slate-700">{post.content}</p>

                      {post.image ? (
                        <div className="mt-5 overflow-hidden rounded-[28px] border border-slate-200 bg-slate-100">
                          <div className="relative h-[330px] w-full">
                            <Image src={post.image} alt="Post media" fill className="object-cover" />
                          </div>
                        </div>
                      ) : null}

                      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-4 text-sm text-slate-600">
                        <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 transition hover:border-violet-200 hover:text-violet-700">
                          <span>❤️</span>
                          Support
                        </button>
                        <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 transition hover:border-violet-200 hover:text-violet-700">
                          <span>👏</span>
                          Celebrate
                        </button>
                        <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 transition hover:border-violet-200 hover:text-violet-700">
                          <span>💬</span>
                          Comment
                        </button>
                        <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 transition hover:border-violet-200 hover:text-violet-700">
                          <span>↗</span>
                          Share
                        </button>
                        <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 transition hover:border-violet-200 hover:text-violet-700">
                          <span>🔖</span>
                          Save
                        </button>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
          </section>

          <aside className="hidden xl:block">
            <div className="space-y-6 sticky top-6">
              <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/40">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-700">Upcoming events</p>
                <div className="mt-5 space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.title} className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-950">{event.title}</p>
                          <p className="mt-1 text-sm text-slate-500">{event.location}</p>
                        </div>
                        <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-violet-700">{event.type}</span>
                      </div>
                      <p className="mt-3 text-sm text-slate-600">{event.date}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/40">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-700">Trending topics</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {trendingTopics.map((topic) => (
                    <button key={topic} className="rounded-full border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700">
                      #{topic}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/40">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-700">Suggested members</p>
                <div className="mt-4 space-y-3">
                  {suggestedMembers.map((member) => (
                    <div key={member.name} className="flex items-center gap-3 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-violet-100 text-violet-700 font-semibold shadow-sm">{member.name.charAt(0)}</div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-950">{member.name}</p>
                        <p className="text-sm text-slate-500">{member.role}</p>
                        <p className="mt-1 text-xs text-slate-400">{member.circle}</p>
                      </div>
                      <button className="rounded-full border border-violet-200 bg-violet-50 px-3 py-2 text-sm font-semibold text-violet-700 transition hover:bg-violet-100">
                        Connect
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-t shadow-slate-200/30 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-2">
          {bottomNav.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex flex-1 flex-col items-center justify-center gap-1 rounded-3xl bg-slate-100 px-3 py-2 text-[11px] font-semibold text-slate-600 transition hover:bg-violet-50 hover:text-violet-700"
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
          <button
            type="button"
            onClick={() => setComposerOpen(true)}
            className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-violet-700 via-fuchsia-600 to-pink-500 text-white shadow-xl shadow-violet-200/30 transition hover:scale-[0.98]"
          >
            <Plus className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  )
}
