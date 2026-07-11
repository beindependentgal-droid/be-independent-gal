'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { type ChangeEvent, type DragEvent, useEffect, useMemo, useRef, useState } from 'react'
import {
  BarChart3,
  Bell,
  Bookmark,
  BookOpen,
  Briefcase,
  CalendarDays,
  Camera,
  Compass,
  Gift,
  GraduationCap,
  Heart,
  Home,
  LayoutGrid,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Paperclip,
  Plus,
  Search,
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

const buildStoryCards = (user: { first_name?: string; last_name?: string } | null | undefined, members: Member[]) => {
  const profileName = [user?.first_name, user?.last_name].filter(Boolean).join(' ').trim() || 'You'
  const entries = members.slice(0, 4).map((member, index) => ({
    name: member.name,
    image: member.avatar || '/images/member-1.png',
    live: index === 1 || index === 3,
    accent: index % 2 === 0 ? 'from-violet-500 to-fuchsia-500' : 'from-sky-500 to-cyan-500',
  }))

  return [
    { name: profileName === 'You' ? 'Your Story' : profileName, image: '/images/member-1.png', live: false, accent: 'from-violet-500 to-fuchsia-500', isYou: true },
    ...entries,
  ].slice(0, 5)
}

const mapCommunityPost = (post: any): Post => {
  const profile = post.profile ?? {}
  const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(' ').trim() || 'Community member'
  const avatar = profile.avatar_url || post.author?.avatar || '/images/member-1.png'
  const rank = profile.profession || post.author?.rank || 'Community member'
  const text = `${post.content ?? ''} ${fullName}`.toLowerCase()
  const image = post.image || post.media?.[0]?.url || undefined

  return {
    id: post.id,
    author: {
      name: fullName,
      avatar,
      rank,
    },
    content: post.content ?? '',
    image,
    timestamp: post.created_at
      ? new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      : post.timestamp ?? 'Recently posted',
    likes: Number(post.likes ?? post.reaction_summary?.['❤️'] ?? 0),
    comments: Number(post.comments ?? post.comments_count ?? 0),
    liked: Boolean(post.liked ?? false),
  }
}

const getPostMedia = (post: Post) => {
  const text = `${post.content ?? ''} ${post.author.name ?? ''}`.toLowerCase()

  if (post.image) {
    return { type: 'image' as const, src: post.image }
  }

  if (/(video|live|session|podcast|webinar|watch)/.test(text)) {
    return { type: 'video' as const, src: '/images/member-1.png' }
  }

  return null
}

const getAuthorAvatar = (name: string, fallback?: string) => {
  if (fallback) return fallback

  const normalized = name.toLowerCase()
  if (normalized.includes('you') || normalized.includes('wawesh')) return '/images/member-1.png'
  if (normalized.includes('faith') || normalized.includes('sharon')) return '/images/member-2.png'
  if (normalized.includes('pauline') || normalized.includes('mercy')) return '/images/member-3.png'
  return '/images/female1.jpg'
}

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
  const pathname = usePathname()
  const displayName = user?.first_name ? `${user.first_name} ${user.last_name ?? ''}`.trim() : 'Community Member'
  const [posts, setPosts] = useState<Post[]>([])
  const [eventsState, setEventsState] = useState({ data: [] as Event[], loading: true, failed: false })
  const [membersState, setMembersState] = useState({ data: [] as Member[], loading: true, failed: false })
  const [notificationsState, setNotificationsState] = useState({ data: [] as NotificationItem[], loading: true, failed: false })
  const [selectedTab, setSelectedTab] = useState('for_you')
  const [composerOpen, setComposerOpen] = useState(false)
  const [composerText, setComposerText] = useState('')
  const [composerVisibility, setComposerVisibility] = useState<'public' | 'circle' | 'private'>('public')
  const [attachedMedia, setAttachedMedia] = useState<Array<{ type: 'image' | 'video'; src: string; name: string }>>([])
  const [isDraggingFiles, setIsDraggingFiles] = useState(false)
  const [showDraftRestore, setShowDraftRestore] = useState(false)
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false)
  const [isMobileView, setIsMobileView] = useState(false)
  const [draftText, setDraftText] = useState<string | null>(null)
  const [storyComposerOpen, setStoryComposerOpen] = useState(false)
  const [storyText, setStoryText] = useState('')
  const [storyPhotoPreview, setStoryPhotoPreview] = useState<string | null>(null)
  const [storyPhotoName, setStoryPhotoName] = useState('')
  const [feedLoading, setFeedLoading] = useState(true)
  const [isPublishing, setIsPublishing] = useState(false)
  const [isUpdatingPost, setIsUpdatingPost] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [visiblePosts, setVisiblePosts] = useState(6)
  const [likes, setLikes] = useState<Record<string, boolean>>({})
  const [editingPostId, setEditingPostId] = useState<string | null>(null)
  const [editingPostText, setEditingPostText] = useState('')
  const [menuPostId, setMenuPostId] = useState<string | null>(null)
  const [saved, setSaved] = useState<Record<string, boolean>>({})
  const [stats, setStats] = useState({ posts: 0, friends: 0, circles: 5 })
  const [localStories, setLocalStories] = useState<Array<{ name: string; image: string; live: boolean; accent: string; isYou?: boolean; preview?: string }>>([])
  const [activeStory, setActiveStory] = useState<{ name: string; image: string; preview?: string } | null>(null)
  const [viewedStories, setViewedStories] = useState<string[]>([])

  const canLoadMore = posts.length > visiblePosts
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const composerRef = useRef<HTMLDivElement | null>(null)
  const imageInputRef = useRef<HTMLInputElement | null>(null)
  const storyInputRef = useRef<HTMLInputElement | null>(null)
  const videoInputRef = useRef<HTMLInputElement | null>(null)
  const COMPOSER_DRAFT_KEY = 'big-community-composer-draft'

  const visibleFeed = useMemo(() => posts.slice(0, visiblePosts), [posts, visiblePosts])
  const activePath = pathname?.split('?')[0] ?? '/community'
  const isNavActive = (href: string) => href === '/community' ? activePath === '/community' : activePath === href
  const profileCompletion = Math.min(100, 28 + (user?.first_name ? 28 : 0) + (user?.last_name ? 24 : 0) + (user?.email ? 20 : 0))
  const storyCards = useMemo(() => {
    const baseStories = buildStoryCards(user, membersState.data)
    return [...localStories, ...baseStories].slice(0, 6)
  }, [user, membersState.data, localStories])

  const openStory = (story: { name: string; image: string; preview?: string }) => {
    setActiveStory(story)
    setViewedStories((current) => (current.includes(story.name) ? current : [...current, story.name]))
  }

  const quickActions = [
    { label: 'Camera', icon: Camera, className: 'from-emerald-500/15 to-emerald-500/5 text-emerald-700' },
    { label: 'Video', icon: Video, className: 'from-rose-500/15 to-rose-500/5 text-rose-700' },
    { label: 'Celebration', icon: Gift, className: 'from-amber-500/15 to-amber-500/5 text-amber-700' },
    { label: 'Event', icon: CalendarDays, className: 'from-violet-500/15 to-violet-500/5 text-violet-700' },
    { label: 'Opportunity', icon: Briefcase, className: 'from-orange-500/15 to-orange-500/5 text-orange-700' },
    { label: 'Poll', icon: BarChart3, className: 'from-sky-500/15 to-sky-500/5 text-sky-700' },
  ]

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedDraft = window.localStorage.getItem(COMPOSER_DRAFT_KEY)
      if (savedDraft) {
        setDraftText(savedDraft)
      }

      const updateMobileView = () => setIsMobileView(window.innerWidth < 768)
      updateMobileView()
      window.addEventListener('resize', updateMobileView)
      return () => window.removeEventListener('resize', updateMobileView)
    }
  }, [COMPOSER_DRAFT_KEY])

  useEffect(() => {
    if (typeof window === 'undefined') return

    if (composerText.trim()) {
      window.localStorage.setItem(COMPOSER_DRAFT_KEY, composerText.trim())
      setDraftText(composerText.trim())
    }
  }, [composerText, COMPOSER_DRAFT_KEY])

  useEffect(() => {
    if (!composerOpen) return
    textareaRef.current?.focus()
  }, [composerOpen])

  useEffect(() => {
    if (!composerOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault()
        void handlePublish()
      }

      if (event.key === 'Escape' && !composerText.trim()) {
        event.preventDefault()
        collapseComposer()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [composerOpen, composerText])

  useEffect(() => {
    if (!composerOpen) return

    const handlePointerDown = (event: MouseEvent) => {
      if (composerRef.current && !composerRef.current.contains(event.target as Node)) {
        if (composerText.trim()) {
          setShowDiscardConfirm(true)
        } else {
          collapseComposer()
        }
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [composerOpen, composerText])

  useEffect(() => {
    if (!menuPostId) return

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node | null
      if (target && !(target instanceof Element)) return
      if (target instanceof Element && target.closest('[data-post-menu]')) return
      setMenuPostId(null)
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [menuPostId])

  useEffect(() => {
    const element = textareaRef.current
    if (!element) return
    element.style.height = 'auto'
    element.style.height = `${Math.min(element.scrollHeight, 240)}px`
  }, [composerText])

  useEffect(() => {
    let active = true

    const load = async () => {
      setError(null)
      setFeedLoading(true)
      setEventsState({ data: [], loading: true, failed: false })
      setMembersState({ data: [], loading: true, failed: false })
      setNotificationsState({ data: [], loading: true, failed: false })

      try {
        const feedPromise = fetchJson<{ posts: any[]; count: number }>('/api/community/posts?pageSize=8', { cache: 'no-store' }).catch(() => ({ posts: [], count: 0 }))
      const eventsPromise = (async () => {
        try {
          return await fetchJson<{ events: any[] }>('/api/events?upcoming=1&pageSize=4', {
            cache: 'force-cache',
            next: { revalidate: 1800 },
          })
        } catch (error) {
          return { events: [] }
        }
      })()
      const membersPromise = (async () => {
        try {
          return await fetchJson<{ members: any[] }>('/api/profiles/suggested?pageSize=4', {
            cache: 'force-cache',
            next: { revalidate: 3600 },
          })
        } catch (error) {
          return { members: [] }
        }
      })()
      const notificationsPromise = isAuthenticated
        ? (async () => {
            const token = await getAccessToken()
            if (!token) {
              return { notifications: [] }
            }

            try {
              const response = await fetch('/api/notifications?unread=true&pageSize=4', {
                cache: 'force-cache',
                next: { revalidate: 600 },
                headers: { Authorization: `Bearer ${token}` },
              })

              if (!response.ok) {
                if (response.status === 401) {
                  return { notifications: [] }
                }
                throw new Error(`Failed to fetch notifications: ${response.status}`)
              }

              return await response.json()
            } catch (error) {
              return { notifications: [] }
            }
          })()
        : Promise.resolve({ notifications: [] })

      const [feedRes, [eventsRes, membersRes, notificationsRes]] = await Promise.all([
        feedPromise,
        Promise.allSettled([eventsPromise, membersPromise, notificationsPromise]),
      ])
      if (!active) return
        const mappedFeed = (feedRes.posts ?? []).map(mapCommunityPost)
        setPosts(mappedFeed)
        setStats({
          posts: feedRes.count ?? mappedFeed.length,
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

  const collapseComposer = () => {
    setComposerOpen(false)
    setShowDiscardConfirm(false)
    setShowDraftRestore(false)
    setIsDraggingFiles(false)
  }

  const clearComposerState = () => {
    setComposerText('')
    setComposerVisibility('public')
    setAttachedMedia([])
    setShowDiscardConfirm(false)
    setShowDraftRestore(false)
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(COMPOSER_DRAFT_KEY)
    }
    setDraftText(null)
  }

  const openComposer = () => {
    setComposerOpen(true)
    if (!composerText.trim() && draftText) {
      setShowDraftRestore(true)
    }
  }

  const handleRestoreDraft = () => {
    if (draftText) {
      setComposerText(draftText)
    }
    setShowDraftRestore(false)
    setDraftText(null)
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(COMPOSER_DRAFT_KEY)
    }
    setTimeout(() => textareaRef.current?.focus(), 50)
  }

  const handleDiscardDraft = () => {
    setShowDraftRestore(false)
    setDraftText(null)
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(COMPOSER_DRAFT_KEY)
    }
  }

  const handlePublish = async () => {
    if (!composerText.trim()) return

    setIsPublishing(true)
    setError(null)

    try {
      const response = await fetch('/api/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: composerText.trim(), post_type: 'text', visibility: composerVisibility }),
      })

      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.error || 'Unable to publish post')
      }

      const post = (await response.json()) as any
      const newPost = mapCommunityPost({
        ...post,
        content: post.content ?? composerText.trim(),
        created_at: post.created_at ?? new Date().toISOString(),
        profile: {
          first_name: user?.first_name ?? null,
          last_name: user?.last_name ?? null,
          avatar_url: undefined,
          profession: null,
        },
      })
      setPosts((current) => [newPost, ...current])
      clearComposerState()
      setComposerOpen(false)
      setVisiblePosts((count) => count + 1)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to publish post')
    } finally {
      setIsPublishing(false)
    }
  }

  const insertComposerMarker = (marker: string) => {
    setComposerText((current) => `${current}${current ? '\n' : ''}${marker}`)
    setTimeout(() => textareaRef.current?.focus(), 50)
  }

  const handleMediaSelection = async (files: FileList | File[], type: 'image' | 'video') => {
    const selectedFiles = Array.from(files).slice(0, 4)
    const nextMedia = await Promise.all(
      selectedFiles.map((file) => {
        if (type === 'image') {
          return new Promise<{ type: 'image' | 'video'; src: string; name: string }>((resolve) => {
            const reader = new FileReader()
            reader.onload = () => resolve({ type: 'image', src: reader.result as string, name: file.name })
            reader.readAsDataURL(file)
          })
        }

        return Promise.resolve({ type: 'video' as const, src: URL.createObjectURL(file), name: file.name })
      }),
    )

    setAttachedMedia((current) => [...current, ...nextMedia].slice(0, 4))
  }

  const handleImageInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      await handleMediaSelection(event.target.files, 'image')
    }
    event.target.value = ''
  }

  const handleVideoInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      await handleMediaSelection(event.target.files, 'video')
    }
    event.target.value = ''
  }

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDraggingFiles(true)
  }

  const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDraggingFiles(false)
    const files = event.dataTransfer.files
    if (!files.length) return

    const imageFiles = Array.from(files).filter((file) => file.type.startsWith('image/'))
    const videoFiles = Array.from(files).filter((file) => file.type.startsWith('video/'))

    if (imageFiles.length) {
      await handleMediaSelection(imageFiles, 'image')
    }
    if (videoFiles.length) {
      await handleMediaSelection(videoFiles, 'video')
    }
  }

  const toggleLike = (id: string) => {
    setLikes((current) => ({ ...current, [id]: !current[id] }))
  }

  const toggleSave = (id: string) => {
    setSaved((current) => ({ ...current, [id]: !current[id] }))
  }

  const startEditingPost = (post: Post) => {
    setEditingPostId(post.id)
    setEditingPostText(post.content)
    setMenuPostId(null)
  }

  const cancelEditingPost = () => {
    setEditingPostId(null)
    setEditingPostText('')
  }

  const handleUpdatePost = async (postId: string) => {
    if (!editingPostText.trim()) return

    setIsUpdatingPost(true)
    setError(null)

    try {
      const response = await fetch(`/api/community/posts/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editingPostText.trim(), post_type: 'text', visibility: 'public' }),
      })

      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.error || 'Unable to update post')
      }

      setPosts((current) => current.map((post) => (post.id === postId ? { ...post, content: editingPostText.trim(), timestamp: 'Updated just now' } : post)))
      cancelEditingPost()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update post')
    } finally {
      setIsUpdatingPost(false)
    }
  }

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm('Delete this post?')) return

    setError(null)

    try {
      const response = await fetch(`/api/community/posts/${postId}`, { method: 'DELETE' })
      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.error || 'Unable to delete post')
      }

      setPosts((current) => current.filter((post) => post.id !== postId))
      setMenuPostId(null)
      cancelEditingPost()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete post')
    }
  }

  const handleStoryPhotoSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setStoryPhotoPreview(reader.result as string)
      setStoryPhotoName(file.name)
    }
    reader.readAsDataURL(file)
    event.target.value = ''
  }

  const handlePublishStory = () => {
    if (!storyPhotoPreview) return

    const newStory = {
      name: displayName || 'You',
      image: storyPhotoPreview,
      live: false,
      accent: 'from-violet-500 to-fuchsia-500',
      isYou: true,
      preview: 'Photo story',
    }

    setLocalStories((current) => [newStory, ...current])
    setStoryText('')
    setStoryPhotoPreview(null)
    setStoryPhotoName('')
    setStoryComposerOpen(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-3 py-4 pb-24 sm:px-4 md:px-6 lg:grid-cols-[240px_minmax(0,1fr)_320px] lg:gap-8 lg:px-8 lg:py-6">
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-4">
            <div className="rounded-[24px] border border-slate-200/80 bg-white p-4 shadow-[0_18px_50px_-25px_rgba(15,23,42,0.25)]">
              <nav className="space-y-1.5">
                {navLinks.map((item) => {
                  const Icon = item.icon
                  const active = isNavActive(item.href)
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={`group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition-all duration-300 ${active ? 'bg-violet-50 text-violet-700 shadow-sm' : 'text-slate-600 hover:-translate-y-0.5 hover:bg-violet-50 hover:text-violet-700'}`}
                    >
                      <span className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl transition ${active ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-600 group-hover:bg-violet-100 group-hover:text-violet-700'}`}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </nav>

              <button
                type="button"
                onClick={() => setComposerOpen(true)}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200/60 transition hover:scale-[1.01] hover:bg-violet-700"
              >
                <Plus className="h-4 w-4" />
                New Post
              </button>
            </div>

            <section className="rounded-[24px] border border-slate-200/80 bg-white p-4 shadow-[0_18px_50px_-25px_rgba(15,23,42,0.25)]">
              <div className="flex items-center gap-3">
                <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 via-fuchsia-500 to-pink-500 text-lg font-semibold text-white">
                  {user?.first_name?.charAt(0) ?? 'C'}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{displayName}</p>
                  <p className="text-xs text-slate-500">Community level · 3</p>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Profile progress</span>
                  <span className="font-semibold text-violet-700">{profileCompletion}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 transition-all duration-500" style={{ width: `${profileCompletion}%` }} />
                </div>
                <Link href="/auth/profile" className="mt-3 inline-flex items-center text-sm font-semibold text-violet-700 transition hover:text-violet-800">
                  View Profile
                </Link>
              </div>
            </section>
          </div>
        </aside>

        <main className="space-y-6">
          <section className="rounded-[26px] border border-slate-200/80 bg-white p-4 shadow-[0_18px_50px_-25px_rgba(15,23,42,0.25)] sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-slate-900">Stories</p>
                <p className="text-sm text-slate-500">Moments from your circle.</p>
              </div>
              <button type="button" onClick={() => setStoryComposerOpen(true)} className="rounded-full px-3 py-2 text-sm font-semibold text-violet-700 transition hover:bg-violet-50">
                Post Story
              </button>
            </div>

            {storyComposerOpen ? (
              <div className="mt-4 space-y-3 rounded-[20px] border border-slate-200 bg-slate-50 p-4">
                <div className="rounded-[18px] border border-dashed border-slate-300 bg-white p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Upload a photo story</p>
                      <p className="text-sm text-slate-500">Stories can only be shared as photos.</p>
                    </div>
                    <button type="button" onClick={() => storyInputRef.current?.click()} className="rounded-full bg-violet-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-800">
                      Choose photo
                    </button>
                  </div>

                  {storyPhotoPreview ? (
                    <div className="mt-4 overflow-hidden rounded-[16px] border border-slate-200">
                      <img src={storyPhotoPreview} alt={storyPhotoName || 'Selected story photo'} className="h-56 w-full object-cover" />
                    </div>
                  ) : (
                    <div className="mt-4 flex min-h-[160px] items-center justify-center rounded-[16px] border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500">
                      Select a photo to publish as your story.
                    </div>
                  )}

                  {storyPhotoName ? <p className="mt-3 text-xs text-slate-500">Selected: {storyPhotoName}</p> : null}
                </div>

                <input ref={storyInputRef} type="file" accept="image/*" hidden onChange={handleStoryPhotoSelection} />

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-slate-500">Photo stories only</span>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => { setStoryComposerOpen(false); setStoryPhotoPreview(null); setStoryPhotoName(''); setStoryText('') }} className="rounded-full bg-white px-3 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:text-violet-700">
                      Cancel
                    </button>
                    <button type="button" onClick={handlePublishStory} disabled={!storyPhotoPreview} className="rounded-full bg-violet-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:bg-slate-300">
                      Publish story
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="mt-5 flex gap-3 overflow-x-auto pb-3 sm:gap-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {storyCards.map((story, index) => (
                <button
                  key={`${story.name}-${index}`}
                  type="button"
                  onClick={() => openStory({ name: story.name, image: story.image, preview: story.preview })}
                  className="group flex min-w-[96px] flex-col items-center gap-2 rounded-[20px] px-2.5 py-3 text-center transition duration-300 hover:-translate-y-1"
                >
                  <div className="relative">
                    <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${story.accent} ${story.live ? 'animate-pulse' : ''}`} />
                    <div className={`relative m-[2px] flex h-16 w-16 overflow-hidden rounded-full border-2 bg-slate-100 ${viewedStories.includes(story.name) ? 'border-slate-300 opacity-70' : 'border-white'}`}>
                      <Image src={story.image} alt={story.name} width={64} height={64} className="h-full w-full object-cover" />
                    </div>
                    {story.live ? <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white bg-rose-500" /> : null}
                  </div>
                  <div className="flex flex-col items-center">
                    <p className={`text-xs font-semibold ${viewedStories.includes(story.name) ? 'text-slate-500' : 'text-slate-900'}`}>{story.name}</p>
                    {story.preview ? <p className={`mt-1 max-w-[84px] truncate text-[10px] ${viewedStories.includes(story.name) ? 'text-slate-400' : 'text-slate-500'}`}>{story.preview}</p> : null}
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section ref={composerRef} className="rounded-[26px] border border-slate-200/80 bg-white p-4 shadow-[0_18px_50px_-25px_rgba(15,23,42,0.25)] sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500 text-base font-semibold text-white">
                {user?.first_name?.charAt(0) ?? 'C'}
              </div>
              <button
                type="button"
                onClick={openComposer}
                className="flex min-w-0 flex-1 items-center rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-500 transition hover:border-violet-200 hover:bg-violet-50/60"
              >
                <span className="text-sm text-slate-400">What&apos;s inspiring you today?</span>
              </button>
            </div>

            {showDraftRestore && draftText ? (
              <div className="mt-4 rounded-[20px] border border-violet-200 bg-violet-50 p-4">
                <p className="text-sm font-semibold text-violet-800">Restore your draft?</p>
                <p className="mt-1 text-sm text-violet-700">We found a saved draft from your last session.</p>
                <div className="mt-3 flex items-center gap-2">
                  <button type="button" onClick={handleRestoreDraft} className="rounded-full bg-violet-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-800">Restore</button>
                  <button type="button" onClick={handleDiscardDraft} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:text-violet-700">Discard</button>
                </div>
              </div>
            ) : null}

            {showDiscardConfirm ? (
              <div className="mt-4 rounded-[20px] border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Discard this post?</p>
                <div className="mt-3 flex items-center gap-2">
                  <button type="button" onClick={() => setShowDiscardConfirm(false)} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:text-violet-700">Continue Editing</button>
                  <button type="button" onClick={() => { clearComposerState(); collapseComposer() }} className="rounded-full bg-violet-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-800">Discard</button>
                </div>
              </div>
            ) : null}

            <div className={`overflow-hidden transition-all duration-300 ease-out ${composerOpen ? 'mt-4 max-h-[900px] opacity-100' : 'mt-0 max-h-0 opacity-0'}`}>
              <div className={`rounded-[22px] border border-slate-200 bg-slate-50 p-4 ${isMobileView ? 'space-y-4' : 'space-y-4'}`} onDragOver={handleDragOver} onDrop={handleDrop}>
                <div className="flex flex-wrap gap-2">
                  {quickActions.map((action) => {
                    const Icon = action.icon
                    return (
                      <button
                        key={action.label}
                        type="button"
                        onClick={() => insertComposerMarker(action.label)}
                        className={`flex items-center gap-2 rounded-full border border-transparent bg-gradient-to-r px-3 py-2 text-sm font-semibold transition duration-300 hover:-translate-y-0.5 hover:shadow-sm ${action.className}`}
                      >
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/80">
                          <Icon className="h-4 w-4" />
                        </span>
                        {action.label}
                      </button>
                    )
                  })}
                </div>

                <textarea
                  ref={textareaRef}
                  value={composerText}
                  onChange={(event) => setComposerText(event.target.value)}
                  rows={isMobileView ? 8 : 5}
                  placeholder="What’s inspiring you today?"
                  className="min-h-[120px] w-full resize-none rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                />

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <button type="button" onClick={() => imageInputRef.current?.click()} className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:text-violet-700">
                      <Camera className="h-4 w-4" /> Photo
                    </button>
                    <button type="button" onClick={() => videoInputRef.current?.click()} className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:text-violet-700">
                      <Video className="h-4 w-4" /> Video
                    </button>
                    <button type="button" className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:text-violet-700">
                      <Sparkles className="h-4 w-4" /> Emoji
                    </button>
                    <button type="button" className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:text-violet-700">
                      <Paperclip className="h-4 w-4" /> Attach
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600">
                      <select value={composerVisibility} onChange={(event) => setComposerVisibility(event.target.value as 'public' | 'circle' | 'private')} className="bg-transparent outline-none">
                        <option value="public">Public</option>
                        <option value="circle">Circle</option>
                        <option value="private">Private</option>
                      </select>
                    </label>
                    <button type="button" onClick={collapseComposer} className="rounded-full bg-white px-3 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:text-violet-700">Cancel</button>
                    <button type="button" onClick={handlePublish} disabled={!composerText.trim() || isPublishing} className="rounded-full bg-violet-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:bg-slate-300">{isPublishing ? 'Publishing…' : 'Publish'}</button>
                  </div>
                </div>

                {attachedMedia.length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {attachedMedia.map((media, index) => (
                      <div key={`${media.name}-${index}`} className="overflow-hidden rounded-[18px] border border-slate-200 bg-white">
                        {media.type === 'image' ? (
                          <img src={media.src} alt={media.name} className="h-36 w-full object-cover" />
                        ) : (
                          <video src={media.src} controls className="h-36 w-full object-cover" />
                        )}
                      </div>
                    ))}
                  </div>
                ) : null}

                {isDraggingFiles ? <p className="text-sm text-violet-700">Drop files to upload</p> : null}

                <input ref={imageInputRef} type="file" accept="image/*" multiple hidden onChange={handleImageInputChange} />
                <input ref={videoInputRef} type="file" accept="video/*" multiple hidden onChange={handleVideoInputChange} />
              </div>
            </div>
          </section>

          {activeStory ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-3 py-4 backdrop-blur-sm">
              <div className="relative w-full max-w-2xl overflow-hidden rounded-[28px] border border-white/10 bg-slate-900 shadow-2xl">
                <button type="button" onClick={() => setActiveStory(null)} className="absolute right-3 top-3 z-10 rounded-full bg-white/15 px-3 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/25">
                  Close
                </button>
                <img src={activeStory.image} alt={activeStory.name} className="h-[70vh] w-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent px-5 py-5 text-white">
                  <p className="text-lg font-semibold">{activeStory.name}</p>
                  {activeStory.preview ? <p className="mt-1 text-sm text-slate-200">{activeStory.preview}</p> : null}
                </div>
              </div>
            </div>
          ) : null}

          <section className="rounded-[26px] border border-slate-200/80 bg-white p-4 shadow-[0_18px_50px_-25px_rgba(15,23,42,0.25)] sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-slate-900">Community feed</p>
                <p className="text-sm text-slate-500">Fresh stories from women building together.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {['for_you', 'following', 'trending'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setSelectedTab(tab)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      selectedTab === tab ? 'bg-violet-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
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
                <div key={index} className="animate-pulse rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_50px_-25px_rgba(15,23,42,0.25)]">
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
              <div className="rounded-[26px] border border-slate-200/80 bg-white px-6 py-12 text-center shadow-[0_18px_50px_-25px_rgba(15,23,42,0.25)]">
                <p className="text-sm font-semibold text-slate-900">No posts yet</p>
                <p className="mt-2 text-sm text-slate-600">Create the first post and invite your circle into the conversation.</p>
                <button type="button" onClick={() => setComposerOpen(true)} className="mt-5 inline-flex items-center gap-2 rounded-full bg-violet-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-800">
                  <Plus className="h-4 w-4" /> Create Post
                </button>
              </div>
            ) : (
              visibleFeed.map((post) => {
                const liked = likes[post.id] ?? post.liked ?? false
                const savedPost = saved[post.id] ?? false
                const media = getPostMedia(post)
                const avatarSrc = getAuthorAvatar(post.author.name, post.author.avatar)
                return (
                  <article key={post.id} className="rounded-[26px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_50px_-25px_rgba(15,23,42,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-24px_rgba(124,58,237,0.35)] sm:p-6">
                    <div className="flex items-start gap-3">
                      <div className="relative h-12 w-12 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                        <Image src={avatarSrc} alt={post.author.name} width={48} height={48} className="h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="truncate text-sm font-semibold text-slate-900">{post.author.name}</p>
                              <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-700">{post.author.rank}</span>
                            </div>
                            <p className="mt-1 text-xs text-slate-500">{post.timestamp}</p>
                          </div>
                          <div className="relative ml-auto shrink-0" data-post-menu>
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation()
                                setMenuPostId((current) => (current === post.id ? null : post.id))
                              }}
                              className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                            {menuPostId === post.id ? (
                              <div className="absolute right-0 top-10 z-20 w-[9rem] rounded-2xl border border-slate-200 bg-white p-2 shadow-lg sm:w-36" data-post-menu>
                                <button
                                  type="button"
                                  onClick={(event) => {
                                    event.stopPropagation()
                                    startEditingPost(post)
                                  }}
                                  className="flex w-full items-center rounded-xl px-3 py-2 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={(event) => {
                                    event.stopPropagation()
                                    void handleDeletePost(post.id)
                                  }}
                                  className="mt-1 flex w-full items-center rounded-xl px-3 py-2 text-left text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                                >
                                  Delete
                                </button>
                              </div>
                            ) : null}
                          </div>
                        </div>
                        {editingPostId === post.id ? (
                          <div className="mt-4 rounded-[20px] border border-slate-200 bg-slate-50 p-3">
                            <textarea
                              value={editingPostText}
                              onChange={(event) => setEditingPostText(event.target.value)}
                              rows={4}
                              className="w-full rounded-[16px] border border-slate-200 bg-white px-3 py-2 text-sm leading-6 text-slate-900 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                            />
                            <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
                              <button type="button" onClick={cancelEditingPost} className="rounded-full bg-white px-3 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:text-violet-700">Cancel</button>
                              <button type="button" onClick={() => void handleUpdatePost(post.id)} disabled={!editingPostText.trim() || isUpdatingPost} className="rounded-full bg-violet-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:bg-slate-300">
                                {isUpdatingPost ? 'Saving…' : 'Save'}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="mt-3 text-sm leading-7 text-slate-700">{post.content}</p>
                        )}
                        {media ? (
                          <div className="mt-4 overflow-hidden rounded-[22px] border border-slate-200 bg-slate-100">
                            <div className="relative">
                              <Image src={media.src} alt="Post media" width={900} height={500} className="h-[240px] w-full object-cover sm:h-[280px]" />
                              {media.type === 'video' ? (
                                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/20">
                                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-violet-700 shadow-lg">
                                    <Video className="h-6 w-6" />
                                  </div>
                                </div>
                              ) : null}
                            </div>
                            <div className="flex items-center justify-between border-t border-slate-200 bg-white/90 px-3 py-2 text-xs font-semibold text-slate-600">
                              <span>{media.type === 'video' ? 'Video • Live now' : 'Community highlight'}</span>
                              <span className="text-violet-700">View details</span>
                            </div>
                          </div>
                        ) : null}

                        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                            <button type="button" onClick={() => toggleLike(post.id)} className={`inline-flex items-center gap-2 rounded-full px-3 py-2 transition ${liked ? 'bg-violet-50 text-violet-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                              <Heart className="h-4 w-4" />
                              {liked ? post.likes + 1 : post.likes}
                            </button>
                            <button type="button" className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-slate-600 transition hover:bg-slate-200">
                              <MessageCircle className="h-4 w-4" />
                              {post.comments}
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <button type="button" className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-slate-600 transition hover:bg-slate-200">
                              <Share2 className="h-4 w-4" /> Share
                            </button>
                            <button type="button" onClick={() => toggleSave(post.id)} className={`inline-flex items-center gap-2 rounded-full px-3 py-2 transition ${savedPost ? 'bg-violet-50 text-violet-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
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
              <div ref={loadMoreRef} className="rounded-[24px] border border-slate-200/80 bg-white p-5 text-center text-sm text-slate-600 shadow-[0_18px_50px_-25px_rgba(15,23,42,0.25)]">
                Loading more…
              </div>
            ) : null}
          </section>
        </main>

        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-5">
            <section className="rounded-[26px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_50px_-25px_rgba(15,23,42,0.25)]">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Upcoming events</p>
                  <p className="text-xs text-slate-500">Join what’s next.</p>
                </div>
                <Link href="/events" className="text-xs font-semibold text-violet-700 hover:underline">View all</Link>
              </div>
              <div className="mt-4 space-y-3">
                {eventsState.loading ? (
                  Array.from({ length: 2 }).map((_, index) => <div key={index} className="animate-pulse rounded-[20px] border border-slate-100 bg-slate-50 p-3"><div className="h-4 w-24 rounded-full bg-slate-200" /><div className="mt-3 h-3 w-28 rounded-full bg-slate-200" /></div>))
                : eventsState.data.slice(0, 2).map((event) => (
                  <div key={event.id} className="overflow-hidden rounded-[20px] border border-slate-100 bg-slate-50">
                    <div className="h-20 bg-[radial-gradient(circle_at_top_left,_rgba(124,58,237,0.24),_transparent_70%)]" />
                    <div className="p-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-900">{event.title}</p>
                        <span className="rounded-full bg-violet-100 px-2 py-1 text-[11px] font-semibold uppercase text-violet-700">{event.type}</span>
                      </div>
                      <div className="mt-2 space-y-1 text-xs text-slate-500">
                        <div className="flex items-center gap-2"><CalendarDays className="h-3.5 w-3.5" />{event.date} · {event.time}</div>
                        <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" />{event.location}</div>
                      </div>
                      <button type="button" className="mt-3 inline-flex items-center rounded-full bg-violet-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-violet-800">Join</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[26px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_50px_-25px_rgba(15,23,42,0.25)]">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Trending topics</p>
                  <p className="text-xs text-slate-500">Jump into the conversation.</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {trendingTopics.map((topic) => (
                  <button key={topic} type="button" className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-violet-50 hover:text-violet-700">#{topic}</button>
                ))}
              </div>
            </section>

            <section className="rounded-[26px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_50px_-25px_rgba(15,23,42,0.25)]">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Suggested members</p>
                  <p className="text-xs text-slate-500">Women you may want to connect with.</p>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                {membersState.loading ? (
                  Array.from({ length: 3 }).map((_, index) => <div key={index} className="animate-pulse rounded-[18px] border border-slate-100 bg-slate-50 p-3"><div className="h-4 w-24 rounded-full bg-slate-200" /><div className="mt-3 h-3 w-32 rounded-full bg-slate-200" /></div>))
                : membersState.data.map((member) => (
                  <div key={member.id} className="flex items-center justify-between gap-3 rounded-[18px] border border-slate-100 bg-slate-50 px-3 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500 text-sm font-semibold text-white">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{member.name}</p>
                        <p className="text-xs text-slate-500">{member.title}</p>
                      </div>
                    </div>
                    <button type="button" className="rounded-full bg-violet-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-violet-800">Connect</button>
                  </div>
                ))}
              </div>
            </section>

            {isAuthenticated && (notificationsState.loading || notificationsState.data.length > 0) && (
              <section className="rounded-[26px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_50px_-25px_rgba(15,23,42,0.25)]">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-900">Notifications</p>
                  <Bell className="h-4 w-4 text-violet-500" />
                </div>
                <div className="mt-4 space-y-3">
                  {notificationsState.loading ? (
                    Array.from({ length: 3 }).map((_, index) => <div key={index} className="animate-pulse rounded-[18px] border border-slate-100 bg-slate-50 p-3"><div className="h-3 w-24 rounded-full bg-slate-200" /><div className="mt-2 h-3 w-32 rounded-full bg-slate-200" /></div>))
                  : notificationsState.data.map((note) => (
                    <div key={note.id} className="rounded-[18px] border border-slate-100 bg-slate-50 px-3 py-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{note.title}</p>
                          <p className="mt-1 text-xs text-slate-500">{note.description}</p>
                        </div>
                        <span className="mt-1 h-2.5 w-2.5 rounded-full bg-violet-500" />
                      </div>
                      <p className="mt-2 text-[11px] uppercase tracking-[0.24em] text-slate-400">{note.time}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/98 p-2 shadow-[0_-10px_30px_-20px_rgba(15,23,42,0.2)] lg:hidden">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-1 px-1">
          {bottomNav.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.label} href={item.href} className="flex min-w-[60px] flex-1 flex-col items-center justify-center gap-1 rounded-3xl px-2 py-2 text-[10px] font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-violet-700">
                <Icon className="h-4 w-4" />
                <span className="truncate">{item.label}</span>
              </Link>
            )
          })}
          <button type="button" onClick={() => setComposerOpen(true)} className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-violet-700 text-white shadow-xl shadow-violet-200/40 transition hover:bg-violet-800">
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
