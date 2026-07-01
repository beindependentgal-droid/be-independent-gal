'use client'

import { Calendar, Clock, MapPin, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Event } from '@/lib/db'

interface CircleEventsProps {
  events: Event[]
}

const typeLabels: Record<Event['type'], { label: string; color: string }> = {
  workshop: { label: 'Workshop', color: 'bg-blue-100 text-blue-700' },
  meetup: { label: 'Meetup', color: 'bg-purple-100 text-purple-700' },
  webinar: { label: 'Webinar', color: 'bg-secondary- text-secondary-' },
  retreat: { label: 'Retreat', color: 'bg-green-100 text-green-700' },
}

export function CircleEvents({ events }: CircleEventsProps) {
  return (
    <div className="space-y-4">
      {events.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
          No upcoming events have been scheduled for this circle yet.
        </div>
      ) : (
        events.map((event) => (
        <div key={event.id} className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${typeLabels[event.type].color}`}
                >
                  {typeLabels[event.type].label}
                </span>
                <span className="text-xs text-muted-foreground">
                  {event.attendees} attending
                </span>
              </div>

              <h3 className="font-heading text-lg font-bold text-secondary mb-3">
                {event.title}
              </h3>

              <div className="space-y-1.5 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-accent" />
                  {event.date}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-accent" />
                  {event.time}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-accent" />
                  {event.location}
                </div>
              </div>
            </div>

            <Button
              className="rounded-lg whitespace-nowrap"
              variant={event.rsvped ? 'outline' : 'default'}
            >
              {event.rsvped ? 'You\'re Going' : 'RSVP'}
            </Button>
          </div>
        </div>
        ))
      )}
    </div>
  )
}
