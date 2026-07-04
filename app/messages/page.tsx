'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ConversationsList } from '@/components/messaging/conversations-list'
import { MessageCircle, Plus, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'

interface Conversation {
  id: string
  participant_1_id: string
  participant_2_id: string
  otherParticipant: {
    id: string
    first_name: string
    last_name: string
    avatar_url?: string
  }
  lastMessage?: {
    content: string
    sender_id: string
    created_at: string
  }
  unreadCount?: number
  updatedAt: string
}

export default function MessagesPage() {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, loading: authLoading } = useAuth()

  const [conversations, setConversations] = useState<Conversation[]>([])
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isStartingConversation, setIsStartingConversation] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchParamsString, setSearchParamsString] = useState('')
  const [startUserId, setStartUserId] = useState<string | null>(null)

  // Redirect if not authenticated
  useEffect(() => {
    if (typeof window === 'undefined') return

    const params = new URLSearchParams(window.location.search)
    setSearchParamsString(params.toString())
    setStartUserId(params.get('start'))
  }, [])

  useEffect(() => {
    const redirectPath = `${pathname}${searchParamsString ? `?${searchParamsString}` : ''}`

    if (!authLoading && !isAuthenticated) {
      router.push(`/auth/login?redirect=${encodeURIComponent(redirectPath)}`)
    }
  }, [authLoading, isAuthenticated, router, pathname, searchParamsString])

  useEffect(() => {
    const startConversation = async () => {
      if (!startUserId) return
      setIsStartingConversation(true)
      setError(null)

      try {
        const res = await fetch('/api/messages/conversations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ otherUserId: startUserId }),
        })

        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData?.error || 'Failed to start conversation')
        }

        const data = await res.json()
        const conversationId = data.id || data.conversation?.id

        if (!conversationId) {
          throw new Error('Unable to start conversation')
        }

        router.replace(`/messages/${conversationId}`)
      } catch (err: any) {
        setError(err?.message || 'Unable to start conversation')
      } finally {
        setIsStartingConversation(false)
      }
    }

    if (startUserId && isAuthenticated) {
      startConversation()
    }
  }, [startUserId, isAuthenticated, router])

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const res = await fetch('/api/messages/conversations')

        if (!res.ok) {
          throw new Error('Failed to load conversations')
        }

        const data = await res.json()
        const convs = data.conversations || []

        // Sort by most recent
        const sorted = convs.sort(
          (a: Conversation, b: Conversation) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )

        setConversations(sorted)
        setFilteredConversations(sorted)
      } catch (err: any) {
        setError(err?.message || 'Failed to load conversations')
      } finally {
        setIsLoading(false)
      }
    }

    if (isAuthenticated) {
      fetchConversations()

      // Refresh conversations every 5 seconds
      const interval = setInterval(fetchConversations, 5000)
      return () => clearInterval(interval)
    }
  }, [isAuthenticated])

  // Handle search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredConversations(conversations)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = conversations.filter((conv) =>
        `${conv.otherParticipant.first_name} ${conv.otherParticipant.last_name}`
          .toLowerCase()
          .includes(query)
      )
      setFilteredConversations(filtered)
    }
  }, [searchQuery, conversations])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-6 px-6 sm:px-12 lg:px-16 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Messages</h1>
              <p className="text-gray-600 mt-2">
                {conversations.length === 0
                  ? 'No conversations yet'
                  : `${conversations.length} conversation${conversations.length !== 1 ? 's' : ''}`}
              </p>
            </div>

            <Link href="/members">
              <Button className="bg-secondary hover:bg-secondary/90 text-white font-bold rounded-full h-12 px-8 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                New Message
              </Button>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 rounded-full bg-gray-100 border-0 focus:bg-white focus:ring-2 focus:ring-secondary placeholder-gray-500"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 py-8">
        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <p className="text-red-700 font-medium">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-full h-10 px-6"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && !error && (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse"
              >
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Conversations List */}
        {!error && !isLoading && conversations.length > 0 && (
          <ConversationsList conversations={filteredConversations} />
        )}

        {/* Empty State */}
        {!isLoading && conversations.length === 0 && !error && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">💬</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No conversations yet</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start a new conversation by finding someone in the member directory and sending them a message.
            </p>
            <Link href="/members">
              <Button className="bg-secondary hover:bg-secondary/90 text-white font-bold rounded-full h-12 px-8">
                Go to Member Directory
              </Button>
            </Link>
          </div>
        )}

        {/* No search results */}
        {!isLoading &&
          conversations.length > 0 &&
          filteredConversations.length === 0 &&
          !error && (
            <div className="text-center py-12">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                No conversations found
              </h3>
              <p className="text-gray-600">
                Try a different search term
              </p>
            </div>
          )}
      </div>
    </div>
  )
}
