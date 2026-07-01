'use client'

import { Bell, Clock, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { NotificationItem } from '@/lib/db'

interface CircleNotificationsProps {
  notifications: NotificationItem[]
}

export function CircleNotifications({ notifications }: CircleNotificationsProps) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-secondary">Notifications</p>
          <p className="text-xs text-muted-foreground">
            Latest circle activity and updates
          </p>
        </div>
        <Bell className="h-5 w-5 text-primary" />
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="rounded-2xl bg-muted p-4 text-sm text-muted-foreground">
            No new notifications yet.
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl border border-border bg-background p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-secondary">{item.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                {item.unread ? (
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-[11px] font-semibold text-primary">
                    New
                  </span>
                ) : null}
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>{item.time}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-6">
        <Button variant="outline" size="sm" className="w-full rounded-lg gap-2">
          <Sparkles className="h-4 w-4" />
          See full activity
        </Button>
      </div>
    </div>
  )
}
