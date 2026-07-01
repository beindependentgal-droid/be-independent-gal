'use client'

import { Trophy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Challenge } from '@/lib/db'

interface CircleChallengesProps {
  challenges: Challenge[]
}

export function CircleChallenges({ challenges }: CircleChallengesProps) {
  const completedCount = challenges.filter((challenge) => challenge.completed).length
  const pointsEarned = challenges.reduce((total, challenge) => {
    if (!challenge.completed) return total
    const match = challenge.reward.match(/(\d+)/)
    return total + (match ? Number(match[1]) : 0)
  }, 0)

  return (
    <div className="space-y-6">
      {/* Challenge Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 text-center">
          <Trophy className="h-8 w-8 text-accent mx-auto mb-2" />
          <div className="font-heading text-2xl font-bold text-secondary">{completedCount}</div>
          <p className="text-xs text-muted-foreground mt-1">Challenges Completed</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 text-center">
          <div className="font-heading text-2xl font-bold text-secondary">{pointsEarned}</div>
          <p className="text-xs text-muted-foreground mt-1">Points Earned</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 text-center">
          <div className="font-heading text-2xl font-bold text-secondary">🌸</div>
          <p className="text-xs text-muted-foreground mt-1">Active Sister</p>
        </div>
      </div>

      {/* Challenges List */}
      <div className="space-y-4">
        {challenges.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
            No challenges are available for this circle yet.
          </div>
        ) : (
          challenges.map((challenge) => (
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
          ))
        )}
      </div>
    </div>
  )
}
