'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { Paperclip } from 'lucide-react';

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
  attachment_url?: string;
  created_at: string;
  read_at?: string;
}

interface MessageThreadProps {
  messages: Message[];
  currentUserId?: string;
  isLoading?: boolean;
}

export function MessageThread({ messages, currentUserId, isLoading }: MessageThreadProps) {
  const threadEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className={`h-12 bg-gray-200 rounded-lg ${i % 2 === 0 ? 'ml-12' : 'mr-12'}`} />
          </div>
        ))}
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>No messages yet. Start the conversation!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 overflow-y-auto flex-1">
      {messages.map((message) => {
        const isOwn = message.sender_id === currentUserId;
        const senderName = `${message.sender.first_name} ${message.sender.last_name}`;

        return (
          <div key={message.id} className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}>
            {/* Avatar */}
            <div className="relative h-8 w-8 flex-shrink-0">
              {message.sender.avatar_url ? (
                <Image
                  src={message.sender.avatar_url}
                  alt={senderName}
                  fill
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-brand to-accent" />
              )}
            </div>

            {/* Message bubble */}
            <div className={`max-w-xs ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
              <div
                className={`px-4 py-2 rounded-lg ${
                  isOwn
                    ? 'bg-brand text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-900 rounded-bl-none'
                }`}
              >
                <p className="break-words whitespace-pre-wrap text-sm">
                  {message.content}
                </p>
                {message.attachment_url && (
                  <div className="mt-3 rounded-2xl border border-gray-200 bg-white p-3 text-sm text-gray-900">
                    <div className="flex items-center gap-2 font-medium text-gray-900">
                      <Paperclip className="h-4 w-4 text-gray-500" />
                      <span>Attachment</span>
                    </div>
                    <a
                      href={message.attachment_url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 block text-sm font-medium text-secondary hover:underline"
                    >
                      Open file
                    </a>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {formatDistanceToNow(new Date(message.created_at), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
        );
      })}
      <div ref={threadEndRef} />
    </div>
  );
}
