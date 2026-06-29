'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ConversationsList } from '@/components/messaging/conversations-list';
import { Plus } from 'lucide-react';

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
  lastMessage?: {
    content: string;
    sender_id: string;
    created_at: string;
  };
  updatedAt: string;
}

export default function MessagesPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const token = localStorage.getItem('sb-auth-token');
        if (!token) {
          router.push('/login');
          return;
        }

        const res = await fetch('/api/messages/conversations', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Failed to load conversations');

        const data = await res.json();
        setConversations(data.conversations);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();

    // Refresh conversations every 5 seconds
    const interval = setInterval(fetchConversations, 5000);
    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="container max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <button
            onClick={() => router.push('/directory')}
            className="flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Message
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 container max-w-6xl mx-auto py-6">
        {error && (
          <div className="p-4 rounded-lg bg-red-50 text-red-700">
            {error}
          </div>
        )}

        {!error && (
          <div className="bg-white rounded-lg border border-gray-200 h-96">
            <ConversationsList
              conversations={conversations}
              isLoading={isLoading}
            />
          </div>
        )}

        {!isLoading && conversations.length === 0 && !error && (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No conversations yet
            </h2>
            <p className="text-gray-600 mb-4">
              Start a new conversation by finding someone in the directory
            </p>
            <button
              onClick={() => router.push('/directory')}
              className="px-6 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors"
            >
              Go to Directory
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
