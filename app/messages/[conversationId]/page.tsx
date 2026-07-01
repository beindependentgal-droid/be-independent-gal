'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { MessageThread } from '@/components/messaging/message-thread'
import { MessageInput } from '@/components/messaging/message-input'
import { ChevronLeft, Phone, Video, MoreVertical } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

interface Message {
  id: string
  content: string
  sender_id: string
  sender: {
    id: string
    first_name: string
    last_name: string
    avatar_url?: string
  }
  created_at: string
}

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
}

export default function ConversationPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const conversationId = params.conversationId as string
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [messages, setMessages] = useState<Message[]>([])
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Fetch messages and conversation data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // Fetch conversation details
        const conversationRes = await fetch(`/api/conversations/${conversationId}`)

        if (!conversationRes.ok) {
          throw new Error('Failed to load conversation')
        }

        const conversationData = await conversationRes.json()
        setConversation(conversationData)

        // Fetch messages
        const messagesRes = await fetch(`/api/conversations/${conversationId}/messages?pageSize=50`)

        if (!messagesRes.ok) {
          throw new Error('Failed to load messages')
        }

        const messagesData = await messagesRes.json()
        setMessages(messagesData.messages || [])
      } catch (err: any) {
        setError(err?.message || 'Failed to load conversation')
      } finally {
        setIsLoading(false)
      }
    }

    if (conversationId) {
      fetchData()

      // Poll for new messages every 3 seconds
      const interval = setInterval(fetchData, 3000)
      return () => clearInterval(interval)
    }
  }, [conversationId])

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    setIsSending(true)
    try {
      const res = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: content.trim() }),
      })

      if (!res.ok) {
        throw new Error('Failed to send message')
      }

      const newMessage = await res.json()
      setMessages((prev) => [...prev, newMessage])
    } catch (err: any) {
      console.error('Error sending message:', err)
      setError(err?.message || 'Failed to send message')
    } finally {
      setIsSending(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
          <p className="text-gray-600 font-medium">Loading conversation...</p>
        </div>
      </div>
    )
  }

  if (error && !messages.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="text-center space-y-6 max-w-md">
          <div className="text-5xl">⚠️</div>
          <h1 className="text-3xl font-bold text-gray-900">Error</h1>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => router.push('/messages')}
            className="px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-medium transition-colors"
          >
            Back to Messages
          </button>
        </div>
      </div>
    )
  }

  // Get the other participant from the conversation
  const otherParticipant = conversation?.otherParticipant
  const participantName = otherParticipant
    ? `${otherParticipant.first_name} ${otherParticipant.last_name}`
    : 'Participant'

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/messages')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Back to messages"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>

          {otherParticipant && (
            <div className="flex items-center gap-4">
              <div className="relative">
                {otherParticipant.avatar_url ? (
                  <Image
                    src={otherParticipant.avatar_url}
                    alt={participantName}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center text-lg">
                    👤
                  </div>
                )}
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>

              <div>
                <h1 className="text-lg font-bold text-gray-900">{participantName}</h1>
                <p className="text-sm text-gray-500">Active now</p>
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
            title="Start phone call"
          >
            <Phone className="w-5 h-5" />
          </button>
          <button
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
            title="Start video call"
          >
            <Video className="w-5 h-5" />
          </button>
          <button
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
            title="More options"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto bg-white px-6 py-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-3">
              <div className="text-5xl">💬</div>
              <p className="text-gray-500">No messages yet</p>
              <p className="text-gray-400 text-sm">Start the conversation by sending a message</p>
            </div>
          </div>
        ) : (
          <MessageThread messages={messages} currentUserId={user?.id} />
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error message */}
      {error && messages.length > 0 && (
        <div className="bg-yellow-50 border-t border-yellow-200 px-6 py-3 text-sm text-yellow-800">
          {error}
        </div>
      )}

      {/* Message Input */}
      <MessageInput onSendMessage={handleSendMessage} isLoading={isSending} />
    </div>
  )
}
