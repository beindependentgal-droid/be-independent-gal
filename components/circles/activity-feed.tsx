'use client'

import { Badge } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface ActivityItem {
  id: string
  type: 'new_member' | 'new_post' | 'event' | 'achievement' | 'challenge_completed'
  user?: {
    name: string
    avatar: string
  }
  circle: string
  title: string
  description: string
  timestamp: string
  icon: string
}

const mockActivity: ActivityItem[] = [
  {
    id: '1',
    type: 'new_member',
    user: {
      name: 'Sarah K.',
      avatar: '/images/member-1.png',
    },
    circle: 'Learn Circle',
    title: 'Welcome to the Community',
    description: 'Sarah joined the Learn Circle and is ready to grow',
    timestamp: '30 minutes ago',
    icon: '🎉',
  },
  {
    id: '2',
    type: 'new_post',
    user: {
      name: 'Amina W.',
      avatar: '/images/member-1.png',
    },
    circle: 'Earn Circle',
    title: 'Shared an Update',
    description: 'Just launched my new service offering! Excited to see how our circle sisters respond.',
    timestamp: '2 hours ago',
    icon: '📝',
  },
  {
    id: '3',
    type: 'achievement',
    user: {
      name: 'Grace M.',
      avatar: '/images/member-2.png',
    },
    circle: 'Connect Circle',
    title: 'Reached Community Champion',
    description: 'Grace has reached the Community Champion rank!',
    timestamp: '4 hours ago',
    icon: '⭐',
  },
  {
    id: '4',
    type: 'event',
    circle: 'Thrive Circle',
    title: 'Upcoming Event',
    description: 'Wellness & Mindfulness Workshop - Join us for a guided meditation session',
    timestamp: '5 hours ago',
    icon: '📅',
  },
  {
    id: '5',
    type: 'challenge_completed',
    user: {
      name: 'Faith K.',
      avatar: '/images/member-3.png',
    },
    circle: 'Learn Circle',
    title: 'Completed Challenge',
    description: 'Faith completed the "Make Your First Post" challenge',
    timestamp: '6 hours ago',
    icon: '✅',
  },
]

export function ActivityFeed() {
  return (
    <div className="space-y-4">
      {mockActivity.map((activity) => (
        <Link
          key={activity.id}
          href="#"
          className="block rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
        >
          <div className="flex gap-4">
            <div className="text-3xl">{activity.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {activity.user && (
                      <>
                        <div className="relative h-6 w-6 rounded-full overflow-hidden">
                          <Image
                            src={activity.user.avatar}
                            alt={activity.user.name}
                            fill
                            sizes="24px"
                            className="object-cover"
                          />
                        </div>
                        <span className="font-semibold text-secondary">
                          {activity.user.name}
                        </span>
                      </>
                    )}
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                      {activity.circle}
                    </span>
                  </div>
                  <h3 className="mt-2 font-heading font-bold text-secondary">
                    {activity.title}
                  </h3>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">
                  {activity.timestamp}
                </span>
              </div>

              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                {activity.description}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
