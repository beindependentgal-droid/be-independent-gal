'use client'

import { useCallback, useEffect, useState } from 'react'
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
  X,
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import type { Post } from '@/lib/db'

const navItems = [
  { label: 'Community', icon: Users, href: '/community' },
  { label: 'Academy', icon: Sparkles, href: '/academy' },
  { label: 'Circles', icon: Grid, href: '/circles' },
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

type CommunityComment = {
  id: string
  content: string
  author: string
  timestamp: string
  replies: CommunityComment[]
}

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
  const [reactionState, setReactionState] = useState<Record<string, { liked: boolean; celebrated: boolean; saved: boolean }>>({})
  const [commentsByPost, setCommentsByPost] = useState<Record<string, Array<{ id: string; content: string; author: string; timestamp: string }>>>({})
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({})
  const [commentingPostId, setCommentingPostId] = useState<string | null>(null)
  const [commentSubmitting, setCommentSubmitting] = useState<Record<string, boolean>>({})
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({})
  const [replyingCommentId, setReplyingCommentId] = useState<string | null>(null)
  const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>({})
  const [storyViewerOpen, setStoryViewerOpen] = useState(false)
  const [activeStoryIndex, setActiveStoryIndex] = useState(0)
  const [lastUpdated, setLastUpdated] = useState('just now')
  const [touchStartX, setTouchStartX] = useState<number | null>(null)

  const currentUserName = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || user?.email || 'You'
  const placeholder = prompts[promptIndex]

  const loadFeed = useCallback(async (silent = false) => {
    if (!loading && !isAuthenticated) {
      router.replace('/auth/login?redirect=/community')
      return
    }

    if (!isAuthenticated) return

    if (!silent) {
      setIsLoading(true)
    }
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
      setLastUpdated(new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }))
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load community posts')
    } finally {
      if (!silent) {
        setIsLoading(false)
      }
    }
  }, [isAuthenticated, loading, router, selectedTab])

  useEffect(() => {
    void loadFeed(false)
  }, [loadFeed])

  useEffect(() => {
    if (!isAuthenticated || loading) return

    const interval = window.setInterval(() => {
      void loadFeed(true)
    }, 10000)

    return () => window.clearInterval(interval)
  }, [isAuthenticated, loading, loadFeed])

  useEffect(() => {
    if (!storyViewerOpen) return

    const timer = window.setTimeout(() => {
      if (activeStoryIndex >= storyCards.length - 1) {
        setStoryViewerOpen(false)
        return
      }

      setActiveStoryIndex((current) => (current + 1) % storyCards.length)
    }, 4000)

    return () => window.clearTimeout(timer)
  }, [storyViewerOpen, activeStoryIndex])

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

  const toggleExpandedPost = (postId: string) => {
    setExpandedPosts((current) => ({
      ...current,
      [postId]: !current[postId],
    }))
  }

  const openStory = (index: number) => {
    setActiveStoryIndex(index)
    setStoryViewerOpen(true)
  }

  const closeStoryViewer = () => {
    setStoryViewerOpen(false)
  }

  const goToStory = (direction: -1 | 1) => {
    const nextIndex = (activeStoryIndex + direction + storyCards.length) % storyCards.length
    setActiveStoryIndex(nextIndex)
  }

  const handleStoryTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    setTouchStartX(event.touches[0]?.clientX ?? null)
  }

  const handleStoryTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX === null) return

    const delta = (event.changedTouches[0]?.clientX ?? 0) - touchStartX
    if (delta > 60) {
      goToStory(-1)
    } else if (delta < -60) {
      goToStory(1)
    }

    setTouchStartX(null)
  }

  const toggleReaction = (postId: string, type: 'liked' | 'celebrated' | 'saved') => {
    setReactionState((current) => {
      const existing = current[postId] ?? { liked: false, celebrated: false, saved: false }
      return {
        ...current,
        [postId]: {
          ...existing,
          [type]: !existing[type],
        },
      }
    })
  }

  const getReactionCount = (postId: string, baseCount: number, type: 'liked' | 'celebrated' | 'saved') => {
    const state = reactionState[postId]
    if (!state) return baseCount
    const delta = type === 'liked' ? (state.liked ? 1 : 0) : type === 'celebrated' ? (state.celebrated ? 1 : 0) : state.saved ? 1 : 0
    return baseCount + delta
  }

  const handleAddComment = async (postId: string) => {
    const content = (commentDrafts[postId] || '').trim()
    if (!content) return

    setCommentSubmitting((current) => ({ ...current, [postId]: true }))
    setError(null)

    try {
      const response = await fetch(`/api/community/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.error || 'Unable to add comment')
      }

      const data = await response.json()
      const nextComment: CommunityComment = {
        id: data.id,
        content: data.content,
        author: currentUserName,
        timestamp: 'Just now',
        replies: [],
      }

      setCommentsByPost((current) => ({
        ...current,
        [postId]: [nextComment, ...(current[postId] || [])],
      }))
      setPosts((current) => current.map((post) => (post.id === postId ? { ...post, comments: (post.comments ?? 0) + 1 } : post)))
      setCommentDrafts((current) => ({ ...current, [postId]: '' }))
      setCommentingPostId(null)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to add comment')
    } finally {
      setCommentSubmitting((current) => ({ ...current, [postId]: false }))
    }
  }

  const handleAddReply = async (postId: string, parentCommentId: string) => {
    const content = (replyDrafts[parentCommentId] || '').trim()
    if (!content) return

    setCommentSubmitting((current) => ({ ...current, [parentCommentId]: true }))
    setError(null)

    try {
      const response = await fetch(`/api/community/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.error || 'Unable to add reply')
      }

      const data = await response.json()
      const nextReply: CommunityComment = {
        id: data.id,
        content: data.content,
        author: currentUserName,
        timestamp: 'Just now',
        replies: [],
      }

      setCommentsByPost((current) => ({
        ...current,
        [postId]: (current[postId] || []).map((comment) =>
          comment.id === parentCommentId
            ? { ...comment, replies: [nextReply, ...comment.replies] }
            : comment,
        ),
      }))
      setReplyDrafts((current) => ({ ...current, [parentCommentId]: '' }))
      setReplyingCommentId(null)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to add reply')
    } finally {
      setCommentSubmitting((current) => ({ ...current, [parentCommentId]: false }))
    }
  }

  const renderCommentThread = (comment: CommunityComment, postId: string, depth = 0) => (
    <div
      key={comment.id}
      className={`rounded-[20px] border border-slate-200 bg-white p-3 shadow-sm ${depth > 0 ? 'ml-4 border-dashed bg-slate-50' : 'bg-slate-50'}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-slate-900">{comment.author}</p>
          <p className="mt-1 text-xs text-slate-500">{comment.timestamp}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setReplyingCommentId((current) => (current === comment.id ? null : comment.id))
          }}
          className="text-xs font-semibold text-violet-700 transition hover:text-violet-800"
        >
          Reply
        </button>
      </div>
      <p className="mt-2 text-sm leading-6 text-slate-600">{comment.content}</p>

      {replyingCommentId === comment.id ? (
        <div className="mt-3 space-y-2 rounded-[18px] border border-slate-200 bg-white p-2">
          <textarea
            value={replyDrafts[comment.id] || ''}
            onChange={(event) => setReplyDrafts((current) => ({ ...current, [comment.id]: event.target.value }))}
            rows={2}
            placeholder="Add a thoughtful reply..."
            className="w-full rounded-[16px] border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-violet-300 focus:ring-3 focus:ring-violet-100"
          />
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-slate-500">Keep the thread supportive and useful.</p>
            <button
              type="button"
              onClick={() => void handleAddReply(postId, comment.id)}
              disabled={!replyDrafts[comment.id]?.trim() || (commentSubmitting[comment.id] ?? false)}
              className="rounded-full bg-violet-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {commentSubmitting[comment.id] ? 'Posting…' : 'Reply'}
            </button>
          </div>
        </div>
      ) : null}

      {comment.replies.length > 0 ? (
        <div className="mt-3 space-y-2">
          {comment.replies.map((reply) => renderCommentThread(reply, postId, depth + 1))}
        </div>
      ) : null}
    </div>
  )

  if (loading || (!isAuthenticated && typeof window !== 'undefined')) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-slate-50">
        <p className="text-base text-slate-600">Redirecting to login…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-3 py-2 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8 lg:py-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-3xl bg-linear-to-br from-violet-700 via-fuchsia-600 to-pink-500 text-white shadow-xl shadow-violet-200/30 sm:h-12 sm:w-12">
              <Users className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-violet-700 sm:text-xs sm:tracking-[0.35em]">BIG Community</p>
              <p className="hidden text-sm text-slate-600 sm:block">A premium space for women to share, connect, and grow.</p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-3xl bg-slate-100 text-slate-600 transition hover:bg-violet-50 hover:text-violet-700 sm:h-11 sm:w-11">
              <Search className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-3xl bg-slate-100 text-slate-600 transition hover:bg-violet-50 hover:text-violet-700 sm:h-11 sm:w-11">
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-3xl bg-slate-100 text-slate-600 transition hover:bg-violet-50 hover:text-violet-700 sm:h-11 sm:w-11">
              <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-3 py-4 pb-28 sm:px-4 sm:py-6 lg:px-8 lg:pb-24 xl:pb-24">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.75fr)_320px]">
          <section className="space-y-6">
            <div className="rounded-[32px] border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/40 sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-700">Stories</p>
                  <p className="mt-1 text-sm text-slate-500">Moments from the BIG community</p>
                </div>
                <button
                  type="button"
                  onClick={() => setComposerOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                >
                  <Sparkles className="h-4 w-4" />
                  New story
                </button>
              </div>

              <div className="mt-4 flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {storyCards.map((story, index) => (
                  <button
                    key={story.name}
                    type="button"
                    onClick={() => openStory(index)}
                    className="flex min-w-[76px] flex-col items-center gap-2 text-center"
                  >
                    <div className={`relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${story.accent} p-[2px]`}>
                      <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-base font-semibold text-slate-900">
                        {story.avatar}
                      </div>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold leading-4 text-slate-800">{story.name}</p>
                      {story.primary ? <p className="text-[10px] text-violet-600">Your story</p> : null}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/40 sm:p-5">
              <button
                type="button"
                onClick={() => setComposerOpen((value) => !value)}
                className="flex w-full items-start gap-3 rounded-[24px] border border-slate-200 bg-slate-50 px-3 py-3 text-left transition hover:border-violet-200 hover:bg-violet-50 sm:px-4"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-3xl bg-linear-to-br from-violet-700 via-fuchsia-600 to-pink-500 text-sm font-semibold text-white">
                  {currentUserName.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">What&apos;s inspiring you today?</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span>😊</span>
                    <span>📷</span>
                    <span>🎥</span>
                    <span>📎</span>
                    <span>📅</span>
                  </div>
                </div>
                <span className="rounded-full bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700">
                  {composerOpen ? 'Close' : 'Post'}
                </span>
              </button>

              {composerOpen ? (
                <div className="mt-4 space-y-3 sm:space-y-4">
                  <textarea
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    rows={4}
                    placeholder={placeholder}
                    className="w-full rounded-[20px] border border-slate-200 bg-white px-3 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100 sm:rounded-[24px] sm:px-4 sm:py-4 sm:leading-7"
                  />

                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    {toolbarActions.slice(0, 4).map((action) => (
                      <button
                        key={action.label}
                        type="button"
                        className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2 py-1.5 text-xs text-slate-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 sm:gap-2 sm:px-3 sm:py-2 sm:text-sm"
                      >
                        <span>{action.icon}</span>
                        <span className="hidden sm:inline">{action.label}</span>
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={handleSaveDraft}
                      className="ml-auto inline-flex h-9 items-center justify-center rounded-full border border-slate-200 bg-slate-100 px-3 text-xs font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 sm:h-11 sm:px-4 sm:text-sm"
                    >
                      Save draft
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <button
                      type="button"
                      onClick={handlePublish}
                      disabled={!draft.trim() || isSubmitting}
                      className="inline-flex h-10 flex-1 items-center justify-center rounded-full bg-linear-to-r from-violet-700 via-fuchsia-600 to-pink-500 px-4 text-xs font-semibold text-white shadow-lg shadow-violet-200/30 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 sm:h-12 sm:flex-none sm:px-6 sm:text-sm"
                    >
                      {isSubmitting ? 'Publishing…' : 'Publish'}
                    </button>
                    <span className="hidden text-xs text-slate-500 sm:inline sm:text-sm">{draft.length} characters</span>
                    {draftSaved ? <span className="text-xs font-semibold text-violet-700 sm:text-sm">Draft saved</span> : null}
                  </div>
                  {error ? <p className="text-sm text-rose-600">{error}</p> : null}
                </div>
              ) : null}
            </div>

            {announcementVisible ? (
              <div className="flex items-center justify-between gap-3 rounded-[24px] border border-violet-200/80 bg-violet-50 px-4 py-3 shadow-sm shadow-violet-100/60 sm:px-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-base">📌</div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{pinnedAnnouncement.title}</p>
                    <p className="text-xs text-slate-600">Register now</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={pinnedAnnouncement.href} className="rounded-full bg-slate-950 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
                    Register
                  </Link>
                  <button
                    type="button"
                    onClick={() => setAnnouncementVisible(false)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-violet-200 hover:text-violet-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : null}

            <div className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/40">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-violet-50 p-2 text-violet-700">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-700">Feed</p>
                    <p className="mt-1 text-sm text-slate-500">Fresh conversations from the community</p>
                  </div>
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
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 animate-pulse rounded-3xl bg-slate-200" />
                          <div className="flex-1 space-y-2">
                            <div className="h-4 w-32 animate-pulse rounded-full bg-slate-200" />
                            <div className="h-3 w-24 animate-pulse rounded-full bg-slate-100" />
                          </div>
                        </div>
                        <div className="mt-4 space-y-2">
                          <div className="h-3 w-full animate-pulse rounded-full bg-slate-200" />
                          <div className="h-3 w-5/6 animate-pulse rounded-full bg-slate-100" />
                          <div className="h-3 w-2/3 animate-pulse rounded-full bg-slate-100" />
                        </div>
                        <div className="mt-4 h-28 animate-pulse rounded-[24px] bg-slate-100" />
                      </div>
                    ))}
                  </div>
                ) : posts.length === 0 ? (
                  <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-8 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-violet-100 text-2xl">👋</div>
                    <p className="mt-4 text-lg font-semibold text-slate-950">Welcome!</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">Start the first conversation and make this space feel alive.</p>
                    <button
                      type="button"
                      onClick={() => setComposerOpen(true)}
                      className="mt-6 rounded-full bg-violet-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200/30 transition hover:bg-violet-800"
                    >
                      Create Post
                    </button>
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
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-sm font-semibold text-slate-950">{post.author.name}</p>
                              <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-700">Featured</span>
                            </div>
                            <p className="mt-1 text-sm text-slate-500">{post.author.rank} • {post.timestamp}</p>
                          </div>
                        </div>
                        <button type="button" onClick={() => toggleExpandedPost(post.id)} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 transition hover:border-violet-200 hover:bg-white">
                          {expandedPosts[post.id] ? <X className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
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

                      {expandedPosts[post.id] ? (
                        <div className="mt-4 rounded-[24px] border border-violet-100 bg-violet-50/70 p-4">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-sm font-semibold text-slate-900">Conversation thread</p>
                            <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-700">Live</span>
                          </div>
                          <p className="mt-2 text-sm leading-6 text-slate-600">This thread is open for support, collaboration, and community response in real time.</p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-violet-700">✨ New replies</span>
                            <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700">💬 Threaded comments</span>
                            <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700">📱 Swipe ready</span>
                          </div>
                        </div>
                      ) : null}

                      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-200 pt-3 text-xs text-slate-600 sm:gap-3 sm:pt-4 sm:text-sm">
                        <button type="button" onClick={() => toggleReaction(post.id, 'liked')} className={`inline-flex items-center gap-1 rounded-full border px-2 py-1.5 transition duration-200 active:scale-95 sm:gap-2 sm:px-4 sm:py-2 ${reactionState[post.id]?.liked ? 'border-violet-200 bg-violet-50 text-violet-700 shadow-sm shadow-violet-100 animate-pulse' : 'border-slate-200 bg-slate-50 hover:border-violet-200 hover:text-violet-700'}`}>
                          <span>{reactionState[post.id]?.liked ? '💜' : '🤍'}</span>
                          <span>{getReactionCount(post.id, post.likes ?? 0, 'liked')}</span>
                        </button>
                        <button type="button" onClick={() => toggleReaction(post.id, 'celebrated')} className={`inline-flex items-center gap-1 rounded-full border px-2 py-1.5 transition duration-200 active:scale-95 sm:gap-2 sm:px-4 sm:py-2 ${reactionState[post.id]?.celebrated ? 'border-amber-200 bg-amber-50 text-amber-700 shadow-sm shadow-amber-100 animate-pulse' : 'border-slate-200 bg-slate-50 hover:border-violet-200 hover:text-violet-700'}`}>
                          <span>{reactionState[post.id]?.celebrated ? '👏' : '🙌'}</span>
                          <span>{getReactionCount(post.id, post.comments ?? 0, 'celebrated')}</span>
                        </button>
                        <button type="button" onClick={() => setCommentingPostId(commentingPostId === post.id ? null : post.id)} className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-1.5 transition duration-200 hover:border-violet-200 hover:text-violet-700 active:scale-95 sm:gap-2 sm:px-4 sm:py-2">
                          <span>💬</span>
                          <span>{post.comments ?? 0}</span>
                        </button>
                        <button type="button" className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-1.5 transition duration-200 hover:border-violet-200 hover:text-violet-700 active:scale-95 sm:gap-2 sm:px-4 sm:py-2">
                          <span>↗</span>
                          <span>Share</span>
                        </button>
                        <button type="button" onClick={() => toggleReaction(post.id, 'saved')} className={`inline-flex items-center gap-1 rounded-full border px-2 py-1.5 transition duration-200 active:scale-95 sm:gap-2 sm:px-4 sm:py-2 ${reactionState[post.id]?.saved ? 'border-emerald-200 bg-emerald-50 text-emerald-700 shadow-sm shadow-emerald-100 animate-pulse' : 'border-slate-200 bg-slate-50 hover:border-violet-200 hover:text-violet-700'}`}>
                          <span>{reactionState[post.id]?.saved ? '🔖' : '📝'}</span>
                          <span>{reactionState[post.id]?.saved ? 'Saved' : 'Save'}</span>
                        </button>
                      </div>

                      {commentingPostId === post.id ? (
                        <div className="mt-4 space-y-3 rounded-[24px] border border-slate-200 bg-slate-50 p-3">
                          <div className="flex items-start gap-2">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-violet-700 via-fuchsia-600 to-pink-500 text-sm font-semibold text-white">
                              {currentUserName.charAt(0)}
                            </div>
                            <textarea
                              value={commentDrafts[post.id] || ''}
                              onChange={(event) => setCommentDrafts((current) => ({ ...current, [post.id]: event.target.value }))}
                              rows={3}
                              placeholder="Write a thoughtful comment..."
                              className="w-full rounded-[18px] border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-violet-300 focus:ring-3 focus:ring-violet-100"
                            />
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs text-slate-500">Comments are posted to the community feed.</p>
                            <button
                              type="button"
                              onClick={() => void handleAddComment(post.id)}
                              disabled={!commentDrafts[post.id]?.trim() || (commentSubmitting[post.id] ?? false)}
                              className="rounded-full bg-violet-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                            >
                              {commentSubmitting[post.id] ? 'Posting…' : 'Comment'}
                            </button>
                          </div>
                        </div>
                      ) : null}

                      {(commentsByPost[post.id] || []).length > 0 ? (
                        <div className="mt-4 space-y-2">
                          {(commentsByPost[post.id] || []).slice(0, 3).map((comment) => renderCommentThread(comment, post.id))}
                        </div>
                      ) : null}
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

      {storyViewerOpen ? (
        <div className="fixed inset-0 z-[70] bg-slate-950/95" onClick={closeStoryViewer}>
          <div className="relative flex h-full w-full flex-col" onClick={(event) => event.stopPropagation()} onTouchStart={handleStoryTouchStart} onTouchEnd={handleStoryTouchEnd}>
            <div className={`relative flex-1 bg-linear-to-br ${storyCards[activeStoryIndex].accent} p-4 text-white sm:p-6`}>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/25 to-transparent" />
              <div className="relative flex h-full flex-col">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-lg font-semibold backdrop-blur-sm">
                      {storyCards[activeStoryIndex].avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{storyCards[activeStoryIndex].name}</p>
                      <p className="text-xs text-white/80">{storyCards[activeStoryIndex].label}</p>
                    </div>
                  </div>
                  <button type="button" onClick={closeStoryViewer} className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition hover:bg-white/25">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-4 flex gap-2">
                  {storyCards.map((story, index) => (
                    <div key={story.name} className={`h-1.5 flex-1 rounded-full ${index === activeStoryIndex ? 'bg-white' : 'bg-white/30'}`} />
                  ))}
                </div>

                <div className="flex flex-1 items-end">
                  <div className="w-full max-w-2xl rounded-[28px] border border-white/20 bg-white/10 p-5 backdrop-blur-sm sm:p-6">
                    <p className="text-2xl font-semibold sm:text-3xl">{storyCards[activeStoryIndex].name}</p>
                    <p className="mt-3 text-sm leading-8 text-white/90 sm:text-base">A warm moment from the BIG community — swipe or wait to move through stories, celebrate wins, and discover what women are building right now.</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      <span className="rounded-full bg-white/15 px-3 py-1.5 text-sm font-semibold">✨ Inspiring</span>
                      <span className="rounded-full bg-white/15 px-3 py-1.5 text-sm font-semibold">💬 Community highlight</span>
                      <span className="rounded-full bg-white/15 px-3 py-1.5 text-sm font-semibold">📱 Swipe ready</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/10 bg-slate-950/60 px-4 py-4 text-white backdrop-blur-sm sm:px-6">
              <button type="button" onClick={() => goToStory(-1)} className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10">
                Previous
              </button>
              <p className="text-sm font-semibold text-white/80">Swipe or wait to explore</p>
              <button type="button" onClick={() => goToStory(1)} className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10">
                Next
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-2 py-2 shadow-t shadow-slate-200/30 backdrop-blur-xl sm:px-4 sm:py-3 lg:hidden">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-1 sm:gap-2">
          {bottomNav.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex flex-1 flex-col items-center justify-center gap-0.5 rounded-3xl bg-slate-100 px-2 py-1.5 text-[10px] font-semibold text-slate-600 transition hover:bg-violet-50 hover:text-violet-700 sm:gap-1 sm:px-3 sm:py-2 sm:text-[11px]"
              >
                <Icon className="h-5 w-5" />
                <span className="text-center">{item.label}</span>
              </Link>
            )
          })}
          <button
            type="button"
            onClick={() => setComposerOpen(true)}
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-violet-700 via-fuchsia-600 to-pink-500 text-white shadow-xl shadow-violet-200/30 transition hover:scale-[0.98] sm:h-14 sm:w-14"
          >
            <Plus className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>
      </div>
    </div>
  )
}
