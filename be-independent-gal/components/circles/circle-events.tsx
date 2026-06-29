'use client'

import { Calendar, Clock, MapPin, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Event {
  id: string
  title: string
  date: string
  time: string
  location: string
  type: 'workshop' | 'meetup' | 'webinar' | 'retreat'
  attendees: number
  rsvped?: boolean
}

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Monthly Circle Meetup',
    date: 'July 12, 2026',
    time: '10:00 AM - 12:00 PM',
    location: 'Nairobi CBD',
    type: 'meetup',
    attendees: 34,
    rsvped: false,
  },
  {
    id: '2',
    title: 'Leadership Workshop: Building Confidence',
    date: 'July 19, 2026',
    time: '6:00 PM - 7:30 PM',
    location: 'Online (Zoom)',
    type: 'workshop',
    attendees: 127,
    rsvped: false,
  },
  {
    id: '3',
    title: 'Circle Stories: Member Spotlights',
    date: 'July 26, 2026',
    time: '7:00 PM - 8:00 PM',
    location: 'Online (Zoom)',
    type: 'webinar',
    attendees: 89,
    rsvped: true,
  },
  {
    id: '4',
    title: 'Sisters Retreat Weekend',
    date: 'August 2-4, 2026',
    time: 'All day',
    location: 'Nairobi, Kenya',
    type: 'retreat',
    attendees: 56,
    rsvped: false,
  },
]

const typeLabels: Record<Event['type'], { label: string; color: string }> = {
  workshop: { label: 'Workshop', color: 'bg-blue-100 text-blue-700' },
  meetup: { label: 'Meetup', color: 'bg-purple-100 text-purple-700' },
  webinar: { label: 'Webinar', color: 'bg-pink-100 text-pink-700' },
  retreat: { label: 'Retreat', color: 'bg-green-100 text-green-700' },
}

export function CircleEvents() {
  return (
    <div className="space-y-4">
      {mockEvents.map((event) => (
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
      ))}
    </div>
  )
}
