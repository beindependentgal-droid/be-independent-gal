'use client';

import { useRef, useState } from 'react';
import { Send, Loader, Smile, Paperclip, X } from 'lucide-react';

interface MessageInputProps {
  onSend?: (message: string, attachment?: File | null) => Promise<void>;
  onSendMessage?: (message: string, attachment?: File | null) => Promise<void>;
  isLoading?: boolean;
}

const EMOJIS = ['😊', '😍', '😂', '🙌', '🔥', '👍', '💬', '📎', '🎉', '❤️'];

export function MessageInput({ onSend, onSendMessage, isLoading }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() && !attachment) return;

    const send = onSend ?? onSendMessage;
    if (!send) return;

    try {
      setIsSending(true);
      await send(message.trim(), attachment);
      setMessage('');
      setAttachment(null);
      setShowEmojiPicker(false);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const insertEmoji = (emoji: string) => {
    const textarea = textareaRef.current;
    const text = message;

    if (!textarea) {
      setMessage((prev) => prev + emoji);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const updated = `${text.slice(0, start)}${emoji}${text.slice(end)}`;

    setMessage(updated);
    requestAnimationFrame(() => {
      textarea.focus();
      const cursor = start + emoji.length;
      textarea.selectionStart = textarea.selectionEnd = cursor;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setAttachment(file);
    if (file) setShowEmojiPicker(false);
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-600 transition hover:bg-gray-100"
            title="Add emoji"
          >
            <Smile className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-600 transition hover:bg-gray-100"
            title="Attach file"
          >
            <Paperclip className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  handleSubmit(e as any);
                }
              }}
              placeholder="Type your message... (Ctrl+Enter to send)"
              rows={2}
              className="min-h-[72px] w-full resize-none rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20"
              disabled={isSending || isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={( !message.trim() && !attachment) || isSending || isLoading}
            className="inline-flex h-11 items-center justify-center rounded-full bg-secondary px-4 py-2 text-white transition hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSending ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>

        {showEmojiPicker && (
          <div className="grid grid-cols-5 gap-2 rounded-2xl border border-gray-200 bg-gray-50 p-3">
            {EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => insertEmoji(emoji)}
                className="h-10 w-10 rounded-2xl text-lg transition hover:bg-white"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        {attachment && (
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
            <div className="flex items-center gap-3">
              <Paperclip className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">{attachment.name}</p>
                <p className="text-xs text-gray-500">{(attachment.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAttachment(null)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />
      </form>
    </div>
  );
}
