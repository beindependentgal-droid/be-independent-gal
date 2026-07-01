'use client'

import { Heart, MessageCircle, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Post } from '@/lib/db'
import Image from 'next/image'
import { useState } from 'react'

interface CircleFeedProps {
  feed: Post[]
  onPost: (content: string) => Promise<void>
}

export function CircleFeed({ feed, onPost }: CircleFeedProps) {
  const [draft, setDraft] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handlePost = async () => {
    const trimmed = draft.trim()
    if (!trimmed) return

    setIsSubmitting(true)
    await onPost(trimmed)
    setDraft('')
    setIsSubmitting(false)
  }

  return (
    <div className="space-y-6">
      {/* Create post input */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex gap-4">
          <div className="h-12 w-12 shrink-0 rounded-full bg-gradient-to-br from-purple-400 to-pink-400" />
          <div className="flex-1">
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Share something with your circle..."
              className="w-full rounded-xl border border-border bg-muted p-3 text-sm placeholder-muted-foreground focus:border-primary focus:outline-none"
              rows={3}
            />
            <div className="mt-3 flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-lg"
                onClick={() => setDraft('')}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="rounded-lg"
                onClick={handlePost}
                disabled={isSubmitting || !draft.trim()}
              >
                {isSubmitting ? 'Posting…' : 'Post'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {feed.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
            No posts yet. Start the conversation with your circle.
          </div>
        ) : (
          feed.map((post) => (
            <div key={post.id} className="rounded-2xl border border-border bg-card p-6">
              {/* Author header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full">
                    <Image
                      src={post.author.avatar}
                      alt={post.author.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-heading font-bold text-secondary">
                        {post.author.name}
                      </p>
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                        ⭐ {post.author.rank}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <p className="mb-4 leading-relaxed text-secondary">{post.content}</p>

              {/* Engagement */}
              <div className="flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
                <span>{post.likes} likes</span>
                <span>{post.comments} comments</span>
              </div>

              {/* Actions */}
              <div className="mt-4 flex gap-3 border-t border-border pt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 gap-2 rounded-lg text-muted-foreground hover:text-secondary"
                >
                  <Heart className="h-4 w-4" />
                  Like
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 gap-2 rounded-lg text-muted-foreground hover:text-secondary"
                >
                  <MessageCircle className="h-4 w-4" />
                  Comment
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 gap-2 rounded-lg text-muted-foreground hover:text-secondary"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
