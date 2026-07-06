'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  BarChart3,
  Bell,
  Bookmark,
  BookOpen,
  Briefcase,
  CalendarDays,
  Camera,
  Heart,
  Home,
  LayoutGrid,
  MapPin,
  MessageCircle,
  Paperclip,
  Plus,
  Share2,
  Sparkles,
  User,
  Users,
  Video,
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { getAccessToken } from '@/lib/auth-utils'
import type { Event, Member, NotificationItem, Post } from '@/lib/db'

const navLinks = [
  { label: 'Home', icon: Home, href: '/community' },
  { label: 'Feed', icon: LayoutGrid, href: '/community' },
  { label: 'Academy', icon: BookOpen, href: '/academy' },
  { label: 'Circles', icon: Users, href: '/circles' },
  { label: 'Opportunities', icon: Briefcase, href: '/opportunities' },
  { label: 'Events', icon: CalendarDays, href: '/events' },
  { label: 'Mentors', icon: User, href: '/mentorship' },
  { label: 'Saved', icon: Bookmark, href: '/community?saved=1' },
]

const storyCards = [
  { name: 'Your Story', initials: 'Y', accent: 'from-violet-500 to-fuchsia-500', isYou: true },
  { name: 'Sharon', initials: 'S', accent: 'from-rose-400 to-orange-400' },
  { name: 'Faith', initials: 'F', accent: 'from-sky-500 to-cyan-500' },
  { name: 'Pauline', initials: 'P', accent: 'from-emerald-500 to-teal-500' },
  { name: 'Mercy', initials: 'M', accent: 'from-violet-600 to-pink-500' },
]

const trendingTopics = ['Funding', 'Mentorship', 'Career Growth', 'Wellness', 'WomenInTech']

const guestMemberSuggestions = [
  { name: 'Pauline', descriptor: 'Mentor and designer' },
  { name: 'Faith', descriptor: 'Founder and coach' },
  { name: 'Mercy', descriptor: 'Product leader' },
]

const bottomNav = [
  { label: 'Home', href: '/community', icon: Home },
  { label: 'Community', href: '/community', icon: Users },
  { label: 'Circles', href: '/circles', icon: LayoutGrid },
  { label: 'Academy', href: '/academy', icon: BookOpen },
  { label: 'Profile', href: '/auth/profile', icon: User },
]

type FetchOptions = RequestInit & { next?: { revalidate?: number } }

const fetchJson = async <T,>(url: string, init?: FetchOptions): Promise<T> => {
  const res = await fetch(url, init)
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}`)
  }
  return res.json()
}

export default function CommunityFeed() {
  const { user, loading: authLoading, isAuthenticated } = useAuth()
  const displayName = user?.first_name ? `${user.first_name} ${user.last_name ?? ''}`.trim() : 'Community Member'
  const [posts, setPosts] = useState<Post[]>([])
  const [eventsState, setEventsState] = useState({ data: [] as Event[], loading: true, failed: false })
  const [membersState, setMembersState] = useState({ data: [] as Member[], loading: true, failed: false })
  const [notificationsState, setNotificationsState] = useState({ data: [] as NotificationItem[], loading: true, failed: false })
  const [selectedTab, setSelectedTab] = useState('for_you')
  const [composerOpen, setComposerOpen] = useState(false)
  const [composerText, setComposerText] = useState('')
  const [feedLoading, setFeedLoading] = useState(true)
  const [isPublishing, setIsPublishing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [visiblePosts, setVisiblePosts] = useState(6)
  const [likes, setLikes] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState<Record<string, boolean>>({})
  const [stats, setStats] = useState({ posts: 0, friends: 0, circles: 5 })

  const canLoadMore = posts.length > visiblePosts
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const visibleFeed = useMemo(() => posts.slice(0, visiblePosts), [posts, visiblePosts])

  useEffect(() => {
    let active = true

    const load = async () => {
      setError(null)
      setFeedLoading(true)
      setEventsState({ data: [], loading: true, failed: false })
      setMembersState({ data: [], loading: true, failed: false })
      setNotificationsState({ data: [], loading: true, failed: false })

      try {
        const feedPromise = fetchJson<Post[]>('/api/community/feed', { cache: 'no-store' }).catch(() => [])
      const eventsPromise = fetchJson<{ events: any[] }>('/api/events?upcoming=1&pageSize=4', {
        cache: 'force-cache',
        next: { revalidate: 1800 },
      })
      const membersPromise = fetchJson<{ members: any[] }>('/api/profiles/suggested?pageSize=4', {
        cache: 'force-cache',
        next: { revalidate: 3600 },
      })
      const notificationsPromise = isAuthenticated
        ? (async () => {
            const token = await getAccessToken()
            if (!token) {
              return { notifications: [] }
            }
            return fetchJson<{ notifications: any[] }>('/api/notifications?unread=true&pageSize=4', {
              cache: 'force-cache',
              next: { revalidate: 600 },
              headers: { Authorization: `Bearer ${token}` },
            })
          })()
        : Promise.resolve({ notifications: [] })

      const [feedRes, [eventsRes, membersRes, notificationsRes]] = await Promise.all([
        feedPromise,
        Promise.allSettled([eventsPromise, membersPromise, notificationsPromise]),
      ])
      if (!active) return
        setPosts(feedRes ?? [])
        setStats({
          posts: (feedRes ?? []).length,
          friends:
            membersRes.status === 'fulfilled'
              ? (membersRes.value.members?.length ?? 0)
              : 0,
          circles: 5,
        })

        if (eventsRes.status === 'fulfilled') {
          const mappedEvents: Event[] = (eventsRes.value.events ?? []).map((event) => ({
            id: event.id,
            title: event.title ?? 'Community event',
            date: event.start_time
              ? new Date(event.start_time).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })
              : event.date ?? 'TBD',
            time: event.start_time
              ? new Date(event.start_time).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                })
              : event.time ?? 'TBD',
            location: event.location ?? 'Online',
            type: (event.type || event.status || 'meetup') as Event['type'],
            attendees: event.capacity ?? 0,
          }))
          setEventsState({ data: mappedEvents, loading: false, failed: false })
        } else {
          setEventsState({ data: [], loading: false, failed: true })
        }

        if (membersRes.status === 'fulfilled') {
          const mappedMembers: Member[] = (membersRes.value.members ?? []).map((member) => ({
            id: member.id,
            name: `${member.first_name ?? ''} ${member.last_name ?? ''}`.trim() || 'Community member',
            avatar: member.avatar_url ?? '/images/member-1.png',
            title: member.profession ?? member.bio ?? 'Community member',
            city: member.location ?? '',
            rank: member.total_points ? `Top ${member.total_points}` : 'Community member',
          }))
          setMembersState({ data: mappedMembers, loading: false, failed: false })
        } else {
          setMembersState({ data: [], loading: false, failed: true })
        }

        if (notificationsRes.status === 'fulfilled') {
          const mappedNotifications: NotificationItem[] = (notificationsRes.value.notifications ?? []).map(
            (note) => ({
              id: note.id,
              title: note.title ?? note.message ?? 'New notification',
              description: note.description ?? note.message ?? 'You have a new activity',
              time: note.created_at
                ? new Date(note.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })
                : note.time ?? 'Now',
              unread: note.read_at == null,
            }),
          )
          setNotificationsState({ data: mappedNotifications, loading: false, failed: false })
        } else {
          setNotificationsState({ data: [], loading: false, failed: !isAuthenticated })
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Unable to load community content')
        }
      } finally {
        if (active) {
          setFeedLoading(false)
        }
      }
    }

    void load()

    return () => {
      active = false
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (!loadMoreRef.current || !canLoadMore) return

    observerRef.current?.disconnect()
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) {
        setVisiblePosts((current) => Math.min(current + 6, posts.length))
      }
    })

    observerRef.current.observe(loadMoreRef.current)

    return () => observerRef.current?.disconnect()
  }, [canLoadMore, posts.length])

  const handlePublish = async () => {
    if (!composerText.trim()) return

    setIsPublishing(true)
    setError(null)

    try {
      const response = await fetch('/api/community/feed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: composerText.trim() }),
      })

      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.error || 'Unable to publish post')
      }

      const post = (await response.json()) as Post
      setPosts((current) => [post, ...current])
      setComposerText('')
      setComposerOpen(false)
      setVisiblePosts((count) => count + 1)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to publish post')
    } finally {
      setIsPublishing(false)
    }
  }

  const toggleLike = (id: string) => {
    setLikes((current) => ({ ...current, [id]: !current[id] }))
  }

  const toggleSave = (id: string) => {
    setSaved((current) => ({ ...current, [id]: !current[id] }))
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto grid min-h-screen max-w-[1500px] gap-6 px-3 py-4 sm:px-4 md:px-6 lg:grid-cols-[260px_minmax(0,1.8fr)_320px] lg:py-6">
        <aside className="hidden lg:block">
          <div className="sticky top-6 space-y-5">
            <div className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/40">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-3xl bg-violet-700 text-lg font-semibold text-white">
                  C
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Community</p>
                  <p className="text-xs text-slate-500">Your BIG activity hub</p>
                </div>
              </div>

              <nav className="mt-6 space-y-2">
                {navLinks.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="group flex items-center gap-3 rounded-3xl px-3 py-3 text-sm font-semibold text-slate-700 transition hover:bg-violet-50 hover:text-violet-700"
                    >
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-100 text-slate-600 transition group-hover:bg-violet-100 group-hover:text-violet-700">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="truncate">{item.label}</span>
                    </Link>
                  )
                })}
              </nav>

              <button
                type="button"
                onClick={() => setComposerOpen(true)}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-3xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200/30 transition hover:opacity-95"
              >
                <Plus className="h-4 w-4" />
                New Post
              </button>
            </div>

            <section className="rounded-[20px] border border-slate-200 bg-slate-50 p-5 shadow-sm shadow-slate-200/40">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-700 text-xl font-semibold text-white">
                  {user?.first_name?.charAt(0) ?? 'C'}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{user?.first_name ? `${user.first_name} ${user.last_name ?? ''}`.trim() : 'Community Member'}</p>
                  <p className="text-xs text-slate-500">Community Champion</p>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-violet-700 transition-all duration-500"
                    style={{ width: `${Math.min(100, 20 + (user?.first_name ? 30 : 0) + (user?.last_name ? 25 : 0) + (user?.email ? 20 : 0))}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Profile {Math.min(100, 20 + (user?.first_name ? 30 : 0) + (user?.last_name ? 25 : 0) + (user?.email ? 20 : 0))}% complete</span>
                  <Link href="/auth/profile" className="font-semibold text-violet-700 hover:underline">
                    Complete Profile →
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </aside>

        <main className="space-y-8">
          <section className="rounded-[20px] border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/40 sm:p-5">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-semibold text-slate-900">Stories</p>
              <button
                type="button"
                onClick={() => setComposerOpen(true)}
                className="rounded-full px-3 py-2 text-sm font-semibold text-violet-700 transition hover:bg-violet-50"
              >
                View all
              </button>
            </div>

            <div className="mt-4 flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {storyCards.map((story) => (
                <button
                  key={story.name}
                  type="button"
                  className="flex min-w-[86px] flex-col items-center gap-2 rounded-[18px] border border-slate-200 bg-white px-3 py-3 text-center transition hover:-translate-y-0.5 hover:shadow-sm"
                >
                  <div className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${story.accent} text-lg font-semibold text-white`}>
                    {story.initials}
                  </div>
                  <p className="text-xs font-semibold text-slate-900">{story.name}</p>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/40\">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-700 text-base font-semibold text-white">
                {user?.first_name?.charAt(0) ?? 'C'}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900">{displayName}</p>
                <p className="text-xs text-slate-500">What's on your mind?</p>
              </div>
            </div>

            <div className="mt-4 rounded-[24px] border border-slate-200 bg-slate-50 p-4 transition">
              <button
                type="button"
                onClick={() => setComposerOpen(true)}
                className="text-left text-sm font-medium leading-6 text-slate-600"
              >
                Share a quick thought with the community...
              </button>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <button type="button" className="inline-flex items-center gap-2 rounded-3xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-700 transition hover:border-violet-200 hover:text-violet-700">
                  <Camera className="h-4 w-4 text-slate-500" /> Photo
                </button>
                <button type="button" className="inline-flex items-center gap-2 rounded-3xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-700 transition hover:border-violet-200 hover:text-violet-700">
                  <Video className="h-4 w-4 text-slate-500" /> Video
                </button>
                <button type="button" className="inline-flex items-center gap-2 rounded-3xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-700 transition hover:border-violet-200 hover:text-violet-700">
                  <Sparkles className="h-4 w-4 text-slate-500" /> Celebration
                </button>
                <button type="button" className="inline-flex items-center gap-2 rounded-3xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-700 transition hover:border-violet-200 hover:text-violet-700">
                  <CalendarDays className="h-4 w-4 text-slate-500" /> Event
                </button>
                <button type="button" className="inline-flex items-center gap-2 rounded-3xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-700 transition hover:border-violet-200 hover:text-violet-700">
                  <Briefcase className="h-4 w-4 text-slate-500" /> Opportunity
                </button>
                <button type="button" className="inline-flex items-center gap-2 rounded-3xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-700 transition hover:border-violet-200 hover:text-violet-700">
                  <BarChart3 className="h-4 w-4 text-slate-500" /> Poll
                </button>
              </div>

              {composerOpen ? (
                <div className="mt-4 space-y-4">
                <textarea
                  value={composerText}
                  onChange={(event) => setComposerText(event.target.value)}
                  rows={4}
                  placeholder="What’s inspiring you today?"
                  className="w-full rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                />
                <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
                  <div className="flex flex-wrap gap-2">
                    <button type="button" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-violet-200 hover:text-violet-700">
                      <Paperclip className="h-4 w-4" /> Attach
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handlePublish}
                    disabled={!composerText.trim() || isPublishing}
                    className="inline-flex h-11 items-center justify-center rounded-3xl bg-violet-700 px-5 text-sm font-semibold text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
                  >
                    {isPublishing ? 'Publishing…' : 'Post'}
                  </button>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Visibility: Public</span>
                  <span>{composerText.length}/500</span>
                </div>
                </div>
              ) : null}
            </div>
            {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}
          </section>

          <section className="rounded-[20px] border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/40 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm font-semibold text-slate-900">For You</div>
              <div className="flex flex-wrap gap-2">
                {['for_you', 'following', 'trending'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setSelectedTab(tab)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      selectedTab === tab
                        ? 'bg-violet-700 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {tab === 'for_you' ? 'For You' : tab === 'following' ? 'Following' : 'Trending'}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-5">
            {feedLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="animate-pulse rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/40">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-slate-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-36 rounded-full bg-slate-200" />
                      <div className="h-3 w-28 rounded-full bg-slate-200" />
                    </div>
                  </div>
                  <div className="mt-4 space-y-3">
                    <div className="h-4 w-full rounded-full bg-slate-200" />
                    <div className="h-4 w-5/6 rounded-full bg-slate-200" />
                    <div className="h-48 w-full rounded-[18px] bg-slate-200" />
                  </div>
                </div>
              ))
            ) : visibleFeed.length === 0 ? (
              <div className="rounded-[20px] border border-slate-200 bg-slate-50 px-6 py-12 text-center">
                <p className="text-sm font-semibold text-slate-900">No posts yet</p>
                <p className="mt-2 text-sm text-slate-600">Create the first post and invite your circle into the conversation.</p>
                <button
                  type="button"
                  onClick={() => setComposerOpen(true)}
                  className="mt-5 inline-flex items-center gap-2 rounded-3xl bg-violet-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-800"
                >
                  <Plus className="h-4 w-4" />
                  Create Post
                </button>
              </div>
            ) : (
              visibleFeed.map((post) => {
                const liked = likes[post.id] ?? post.liked ?? false
                const savedPost = saved[post.id] ?? false
                return (
                  <article key={post.id} className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/40 transition hover:-translate-y-0.5 hover:shadow-md">
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-base font-semibold text-white">
                        {post.author.name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate text-sm font-semibold text-slate-900">{post.author.name}</p>
                          <span className="text-xs text-slate-500">{post.author.rank}</span>
                          <span className="text-xs text-slate-400">• {post.timestamp}</span>
                        </div>
                        <p className="mt-4 text-sm leading-7 text-slate-700">{post.content}</p>
                        {post.image ? (
                          <div className="mt-4 overflow-hidden rounded-[18px] border border-slate-200 bg-slate-100">
                            <Image
                              src={post.image}
                              alt="Post image"
                              width={900}
                              height={500}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : null}

                        <div className="mt-5 grid gap-2 border-t border-slate-100 pt-3 text-sm text-slate-600 sm:grid-cols-2">
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => toggleLike(post.id)}
                              className={`inline-flex items-center gap-2 rounded-full px-3 py-2 transition ${liked ? 'bg-violet-50 text-violet-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                            >
                              <Heart className="h-4 w-4" />
                              {liked ? post.likes + 1 : post.likes}
                            </button>
                            <button
                              type="button"
                              className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-slate-600 transition hover:bg-slate-200"
                            >
                              <MessageCircle className="h-4 w-4" />
                              {post.comments}
                            </button>
                          </div>
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-slate-600 transition hover:bg-slate-200"
                            >
                              <Share2 className="h-4 w-4" />
                              Share
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleSave(post.id)}
                              className={`inline-flex items-center gap-2 rounded-full px-3 py-2 transition ${savedPost ? 'bg-violet-50 text-violet-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                            >
                              <Bookmark className="h-4 w-4" />
                              {savedPost ? 'Saved' : 'Save'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                )
              })
            )}

            {canLoadMore && !feedLoading ? (
              <div ref={loadMoreRef} className="rounded-[20px] border border-slate-200 bg-white p-5 text-center text-sm text-slate-600">
                Loading more…
              </div>
            ) : null}
          </section>
        </main>

        <aside className="hidden lg:block">
          <div className="sticky top-6 space-y-4">
            <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/40">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Upcoming events</p>
                  <p className="text-xs text-slate-500">Don’t miss the next community moments.</p>
                </div>
                <Link href="/events" className="text-xs font-semibold text-violet-700 hover:underline">
                  View all
                </Link>
              </div>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                {eventsState.loading
                  ? Array.from({ length: 2 }).map((_, index) => (
                      <div key={index} className="animate-pulse rounded-3xl border border-slate-100 bg-slate-50 p-3">
                        <div className="h-4 w-24 rounded-full bg-slate-200" />
                        <div className="mt-3 h-3 w-32 rounded-full bg-slate-200" />
                      </div>
                    ))
                  : eventsState.data.slice(0, 2).map((event) => (
                      <div key={event.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-3">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-slate-900">{event.title}</p>
                          <span className="rounded-full bg-violet-100 px-2 py-1 text-[11px] font-semibold uppercase text-violet-700">{event.type}</span>
                        </div>
                        <p className="mt-2 text-xs text-slate-500">{event.date}</p>
                        <p className="text-xs text-slate-500">{event.location}</p>
                      </div>
                    ))}
              </div>
            </section>

            <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/40">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Trending topics</p>
                  <p className="text-xs text-slate-500">Jump into the conversations that matter.</p>
                </div>
                <Link href="/community" className="text-xs font-semibold text-violet-700 hover:underline">
                  View all
                </Link>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-sm">
                {trendingTopics.map((topic) => (
                  <span key={topic} className="rounded-full bg-gradient-to-r from-violet-50 to-fuchsia-50 px-3 py-2 text-xs font-semibold text-violet-700 shadow-sm">
                    #{topic}
                  </span>
                ))}
              </div>
            </section>

            {(!isAuthenticated || membersState.loading || membersState.data.length > 0) && (
              <section className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/40">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-900">
                    {isAuthenticated ? 'Suggested for You' : 'Suggested members'}
                  </p>
                  {isAuthenticated ? (
                    <Link href="/community" className="text-xs font-semibold text-violet-700 hover:underline">
                      View all
                    </Link>
                  ) : null}
                </div>
                <div className="mt-4 space-y-3">
                  {membersState.loading ? (
                    Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="animate-pulse rounded-3xl border border-slate-100 bg-slate-50 p-4">
                        <div className="h-4 w-24 rounded-full bg-slate-200" />
                        <div className="mt-3 h-3 w-36 rounded-full bg-slate-200" />
                        <div className="mt-2 h-3 w-20 rounded-full bg-slate-200" />
                      </div>
                    ))
                  ) : isAuthenticated ? (
                    membersState.data.map((member) => (
                      <div key={member.id} className="rounded-3xl border border-slate-100 bg-slate-50 px-4 py-4">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-100 text-sm font-semibold text-violet-700">
                              {member.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-900">{member.name}</p>
                              <p className="text-xs text-slate-500">{member.title}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            className="rounded-full bg-violet-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-violet-800"
                          >
                            Connect
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="space-y-4 rounded-3xl border border-slate-100 bg-slate-50 p-4">
                      <p className="text-sm text-slate-900">Meet inspiring women in the BIG community.</p>
                      <ul className="space-y-2 text-sm text-slate-700">
                        {guestMemberSuggestions.map((person) => (
                          <li key={person.name} className="flex items-center gap-2">
                            <span className="text-violet-700">•</span>
                            <span>{person.name}</span>
                          </li>
                        ))}
                      </ul>
                      <Link
                        href="/auth/sign-up"
                        className="inline-flex w-full items-center justify-center rounded-3xl bg-violet-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-800"
                      >
                        Join BIG
                      </Link>
                    </div>
                  )}
                </div>
              </section>
            )}

            {isAuthenticated && (notificationsState.loading || notificationsState.data.length > 0) && (
              <section className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/40">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-900">Notifications</p>
                  <Bell className="h-4 w-4 text-violet-500" />
                </div>
                <div className="mt-4 space-y-3">
                  {notificationsState.loading
                    ? Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="animate-pulse rounded-3xl border border-slate-100 bg-slate-50 px-4 py-3">
                          <div className="h-4 w-28 rounded-full bg-slate-200" />
                          <div className="mt-2 h-3 w-40 rounded-full bg-slate-200" />
                          <div className="mt-2 h-3 w-20 rounded-full bg-slate-200" />
                        </div>
                      ))
                    : notificationsState.data.map((note) => (
                        <div key={note.id} className="rounded-3xl border border-slate-100 bg-slate-50 px-4 py-3">
                          <p className="text-sm font-semibold text-slate-900">{note.title}</p>
                          <p className="mt-1 text-xs text-slate-500">{note.description}</p>
                          <p className="mt-2 text-[11px] uppercase tracking-[0.24em] text-slate-400">{note.time}</p>
                        </div>
                      ))}
                </div>
              </section>
            )}
          </div>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 p-3 shadow-[0_-10px_30px_-20px_rgba(15,23,42,0.2)] lg:hidden">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-2">
          {bottomNav.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex flex-1 flex-col items-center justify-center gap-1 rounded-3xl px-3 py-2 text-[11px] font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-violet-700"
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
          <button
            type="button"
            onClick={() => setComposerOpen(true)}
            className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-violet-700 text-white shadow-xl shadow-violet-200/40 transition hover:bg-violet-800"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
