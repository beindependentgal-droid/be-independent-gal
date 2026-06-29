'use client'

import { Trophy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Challenge {
  id: string
  title: string
  description: string
  reward: string
  progress: number
  completed?: boolean
  badge: string
}

const mockChallenges: Challenge[] = [
  {
    id: '1',
    title: 'Complete Your Profile',
    description: 'Add all details to your member profile',
    reward: '+25 points',
    progress: 100,
    completed: true,
    badge: '✅',
  },
  {
    id: '2',
    title: 'Make Your First Post',
    description: 'Share something with your circle',
    reward: '+50 points',
    progress: 100,
    completed: true,
    badge: '📝',
  },
  {
    id: '3',
    title: 'Connect with 5 Sisters',
    description: 'Send connection requests to 5 other members',
    reward: '+75 points + Badge',
    progress: 60,
    completed: false,
    badge: '🤝',
  },
  {
    id: '4',
    title: 'Attend a Circle Event',
    description: 'RSVP and attend one circle event this month',
    reward: '+100 points',
    progress: 0,
    completed: false,
    badge: '📅',
  },
  {
    id: '5',
    title: 'Help a Sister',
    description: 'Answer a question or offer advice in the feed',
    reward: '+50 points',
    progress: 0,
    completed: false,
    badge: '💪',
  },
  {
    id: '6',
    title: 'July Monthly Challenge: Share Your Story',
    description: 'Post about your biggest lesson this month',
    reward: '+150 points + Certificate',
    progress: 30,
    completed: false,
    badge: '📖',
  },
]

export function CircleChallenges() {
  return (
    <div className="space-y-6">
      {/* Challenge Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 text-center">
          <Trophy className="h-8 w-8 text-accent mx-auto mb-2" />
          <div className="font-heading text-2xl font-bold text-secondary">3</div>
          <p className="text-xs text-muted-foreground mt-1">Challenges Completed</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 text-center">
          <div className="font-heading text-2xl font-bold text-secondary">175</div>
          <p className="text-xs text-muted-foreground mt-1">Points Earned</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 text-center">
          <div className="font-heading text-2xl font-bold text-secondary">🌸</div>
          <p className="text-xs text-muted-foreground mt-1">Active Sister</p>
        </div>
      </div>

      {/* Challenges List */}
      <div className="space-y-4">
        {mockChallenges.map((challenge) => (
          <div
            key={challenge.id}
            className={`rounded-2xl border p-6 ${
              challenge.completed
                ? 'border-green-200 bg-green-50'
                : 'border-border bg-card'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{challenge.badge}</span>
                  <h3 className="font-heading font-bold text-secondary">
                    {challenge.title}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {challenge.description}
                </p>

                {/* Progress bar */}
                <div className="mb-3">
                  <div className="h-2 w-full rounded-full bg-border overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-accent transition-all"
                      style={{ width: `${challenge.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {challenge.progress}% Complete
                  </p>
                </div>

                <p className="text-sm font-semibold text-accent">{challenge.reward}</p>
              </div>

              {challenge.completed ? (
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-200">
                  <Check className="h-6 w-6 text-green-700" />
                </div>
              ) : (
                <Button size="sm" className="shrink-0 rounded-lg">
                  Track
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
