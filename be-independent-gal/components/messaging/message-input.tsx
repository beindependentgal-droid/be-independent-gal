'use client';

import { useState } from 'react';
import { Send, Loader } from 'lucide-react';

interface MessageInputProps {
  onSend: (message: string) => Promise<void>;
  isLoading?: boolean;
}

export function MessageInput({ onSend, isLoading }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;

    try {
      setIsSending(true);
      await onSend(message);
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t border-gray-200">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && e.ctrlKey) {
            handleSubmit(e as any);
          }
        }}
        placeholder="Type your message... (Ctrl+Enter to send)"
        rows={1}
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand resize-none"
        disabled={isSending || isLoading}
      />
      <button
        type="submit"
        disabled={!message.trim() || isSending || isLoading}
        className="flex items-center justify-center gap-2 px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSending ? (
          <Loader className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </button>
    </form>
  );
}
