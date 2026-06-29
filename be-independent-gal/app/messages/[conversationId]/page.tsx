'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { MessageThread } from '@/components/messaging/message-thread';
import { MessageInput } from '@/components/messaging/message-input';
import { ChevronLeft } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  sender: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
  created_at: string;
}

interface Conversation {
  id: string;
  participant_1_id: string;
  participant_2_id: string;
  otherParticipant: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
}

export default function ConversationPage() {
  const params = useParams();
  const router = useRouter();
  const conversationId = params.conversationId as string;

  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('sb-auth-token');
        if (!token) {
          router.push('/login');
          return;
        }

        // Get current user ID from profile
        const profileRes = await fetch('/api/profiles', {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (profileRes.ok) {
          const profile = await profileRes.json();
          setCurrentUserId(profile.id);
        }

        // Fetch messages
        const messagesRes = await fetch(
          `/api/messages/${conversationId}?pageSize=50`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!messagesRes.ok) throw new Error('Failed to load messages');

        const messagesData = await messagesRes.json();
        setMessages(messagesData.messages || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (conversationId) {
      fetchData();
      
      // Poll for new messages every 2 seconds
      const interval = setInterval(fetchData, 2000);
      return () => clearInterval(interval);
    }
  }, [conversationId, router]);

  const handleSendMessage = async (content: string) => {
    try {
      const token = localStorage.getItem('sb-auth-token');
      if (!token) throw new Error('Not authenticated');

      const res = await fetch(`/api/messages/${conversationId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) throw new Error('Failed to send message');

      const newMessage = await res.json();
      setMessages((prev) => [...prev, newMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-500">
          <p>Loading conversation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/messages')}
            className="px-6 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors"
          >
            Back to Messages
          </button>
        </div>
      </div>
    );
  }

  // Get the other participant info from messages
  const otherParticipant = messages[0]?.sender_id !== currentUserId
    ? messages[0]?.sender
    : messages[messages.length - 1]?.sender;

  const participantName = otherParticipant
    ? `${otherParticipant.first_name} ${otherParticipant.last_name}`
    : 'Participant';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="container max-w-4xl mx-auto flex items-center gap-4">
          <button
            onClick={() => router.push('/messages')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-6 w-6 text-gray-700" />
          </button>
          
          {otherParticipant && (
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 flex-shrink-0">
                {otherParticipant.avatar_url ? (
                  <Image
                    src={otherParticipant.avatar_url}
                    alt={participantName}
                    fill
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-brand to-accent" />
                )}
              </div>
              <div>
                <h1 className="font-semibold text-gray-900">
                  {participantName}
                </h1>
                <p className="text-sm text-gray-500">Active now</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 container max-w-4xl mx-auto w-full flex flex-col bg-white rounded-lg border border-gray-200 m-4 overflow-hidden">
        <MessageThread
          messages={messages}
          currentUserId={currentUserId || ''}
          isLoading={isLoading}
        />
        <MessageInput onSend={handleSendMessage} />
      </div>
    </div>
  );
}
