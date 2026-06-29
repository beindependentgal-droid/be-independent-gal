'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';

interface ConversationItem {
  id: string;
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

interface ConversationsListProps {
  conversations: ConversationItem[];
  selectedId?: string;
  isLoading?: boolean;
}

export function ConversationsList({ conversations, selectedId, isLoading }: ConversationsListProps) {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="space-y-2 p-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse h-16 bg-gray-200 rounded-lg" />
        ))}
      </div>
    );
  }

  if (!conversations || conversations.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-gray-500">
        <p>No conversations yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-1 p-2 overflow-y-auto flex-1">
      {conversations.map((conversation) => {
        const participantName = `${conversation.otherParticipant.first_name} ${conversation.otherParticipant.last_name}`;
        const isSelected = selectedId === conversation.id;
        const messagePreview = conversation.lastMessage?.content.substring(0, 40) || 'No messages';

        return (
          <button
            key={conversation.id}
            onClick={() => router.push(`/messages/${conversation.id}`)}
            className={`w-full flex gap-3 p-3 rounded-lg transition-colors ${
              isSelected
                ? 'bg-brand/10 border border-brand'
                : 'hover:bg-gray-100'
            }`}
          >
            {/* Avatar */}
            <div className="relative h-12 w-12 flex-shrink-0">
              {conversation.otherParticipant.avatar_url ? (
                <Image
                  src={conversation.otherParticipant.avatar_url}
                  alt={participantName}
                  fill
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-brand to-accent" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 text-left">
              <p className="font-medium text-gray-900 truncate">
                {participantName}
              </p>
              <p className="text-sm text-gray-500 truncate">
                {messagePreview}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {formatDistanceToNow(new Date(conversation.updatedAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
