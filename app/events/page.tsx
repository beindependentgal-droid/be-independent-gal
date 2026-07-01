import { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react'
import { getUpcomingEvents } from '@/app/actions/event-actions'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import FallbackImage from '@/components/ui/fallback-image'
import { PageHero } from '@/components/page-hero'

export const metadata: Metadata = {
  title: 'Events | BIG',
  description:
    'Discover upcoming events, workshops, meetups, and retreats. Connect, learn, and grow with the BIG community.',
  openGraph: {
    title: 'Events | BIG',
    description: 'Join BIG community events',
    images: ['/og-image.jpg'],
  },
}

export default async function EventsPage() {
  const events = await getUpcomingEvents(50)

  const eventsByCircle = events.reduce(
    (acc, event) => {
      const circle = event.circle_name || 'Other'
      if (!acc[circle]) {
        acc[circle] = []
      }
      acc[circle].push(event)
      return acc
    },
    {} as Record<string, typeof events>
  )

  const circleOrder = ['Learn', 'Connect', 'Earn', 'Thrive']
  const sortedCircles = circleOrder.filter((circle) => eventsByCircle[circle])

  return (
    <>
      {/* Hero */}
      <PageHero
        title="Community Events"
        subtitle="Learn, connect, and grow together"
        description="Join us for workshops, networking events, retreats, and community gatherings designed to support your growth journey."
        cta1={{ text: 'Create an Event', href: '/events/create' }}
        cta2={{ text: 'View Calendar', href: '#events' }}
        imageSrc="/images/events-hero.jpg"
      />

      {/* Events by Circle */}
      <section id="events" className="py-20 bg-gray-50 px-6 sm:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              {events.length} Upcoming Events
            </h2>
            <p className="text-gray-600">
              Filter by circle or browse all upcoming community events
            </p>
          </div>

          {/* No Events State */}
          {events.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No Upcoming Events
              </h3>
              <p className="text-gray-600 mb-8">
                Check back soon for exciting community events!
              </p>
              <Link href="/events/create">
                <Button className="bg-secondary- hover:bg-secondary- text-white font-bold rounded-full h-12 px-8">
                  Create an Event
                </Button>
              </Link>
            </div>
          )}

          {/* Events by Circle */}
          {events.length > 0 && (
            <div className="space-y-16">
              {sortedCircles.map((circle) => (
                <div key={circle}>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xl">
                        {circle === 'Learn'
                          ? '📚'
                          : circle === 'Connect'
                            ? '🤝'
                            : circle === 'Earn'
                              ? '💰'
                              : '❤️'}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {circle} Circle Events
                    </h3>
                    <Badge className="ml-auto bg-secondary- text-secondary- font-bold">
                      {eventsByCircle[circle].length} events
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {eventsByCircle[circle].map((event) => (
                      <div key={event.id} className="block">
                        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-secondary- hover:shadow-xl transition-all h-full flex flex-col">
                          {/* Event Image */}
                          {event.image_url && (
                            <div className="relative aspect-video overflow-hidden bg-gray-300">
                              <FallbackImage
                                src={event.image_url}
                                alt={event.title}
                                fill
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                fallbackSrc="/images/event-placeholder.jpg"
                              />

                              {/* Event Type Badge */}
                              <div className="absolute top-4 right-4">
                                <Badge className="bg-secondary- text-white font-bold">
                                  {event.event_type}
                                </Badge>
                              </div>
                            </div>
                          )}

                          {/* Content */}
                          <div className="p-6 flex flex-col flex-1">
                            {/* Title */}
                            <h4 className="text-xl font-bold text-gray-900 mb-2 hover:text-secondary- transition-colors">
                              {event.title}
                            </h4>

                            {/* Description */}
                            {event.description && (
                              <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                                {event.description}
                              </p>
                            )}

                            {/* Meta Info */}
                            <div className="space-y-2 mb-4 flex-1">
                              {/* Date */}
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="w-4 h-4 text-secondary-" />
                                <span>
                                  {new Date(event.start_time).toLocaleDateString(
                                    'en-US',
                                    {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric',
                                    }
                                  )}
                                </span>
                                <span className="text-gray-400">•</span>
                                <span>
                                  {new Date(event.start_time).toLocaleTimeString(
                                    'en-US',
                                    {
                                      hour: 'numeric',
                                      minute: '2-digit',
                                      hour12: true,
                                    }
                                  )}
                                </span>
                              </div>

                              {/* Location */}
                              {event.location && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <MapPin className="w-4 h-4 text-secondary-" />
                                  <span>{event.location}</span>
                                </div>
                              )}

                              {/* Circle */}
                              {event.circle_name && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Users className="w-4 h-4 text-secondary-" />
                                  <span>{event.circle_name}</span>
                                </div>
                              )}
                            </div>

                            {/* CTA Button */}
                            <Button asChild className="w-full rounded-full px-0 py-0 text-white font-bold">
                              <Link
                                href={`/events/${event.id}`}
                                className="flex h-10 w-full items-center justify-center gap-2 rounded-full bg-secondary- px-4 text-white hover:bg-secondary-"
                              >
                                View Details
                                <ArrowRight className="w-4 h-4" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Other Events */}
              {eventsByCircle['Other'] && (
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xl">✨</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Other Events
                    </h3>
                    <Badge className="ml-auto bg-secondary- text-secondary- font-bold">
                      {eventsByCircle['Other'].length} events
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {eventsByCircle['Other'].map((event) => (
                      <div key={event.id} className="block">
                        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-secondary- hover:shadow-xl transition-all h-full flex flex-col">
                          {/* Event Image */}
                          {event.image_url && (
                            <div className="relative aspect-video overflow-hidden bg-gray-300">
                              <FallbackImage
                                src={event.image_url}
                                alt={event.title}
                                fill
                                className="w-full h-full object-cover"
                                fallbackSrc="/images/event-placeholder.jpg"
                              />

                              <div className="absolute top-4 right-4">
                                <Badge className="bg-secondary- text-white font-bold">
                                  {event.event_type}
                                </Badge>
                              </div>
                            </div>
                          )}

                          <div className="p-6 flex flex-col flex-1">
                            <h4 className="text-xl font-bold text-gray-900 mb-2 hover:text-secondary- transition-colors">
                              {event.title}
                            </h4>

                            {event.description && (
                              <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                                {event.description}
                              </p>
                            )}

                            <div className="space-y-2 mb-4 flex-1">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="w-4 h-4 text-secondary-" />
                                <span>
                                  {new Date(event.start_time).toLocaleDateString(
                                    'en-US',
                                    {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric',
                                    }
                                  )}
                                </span>
                                <span className="text-gray-400">•</span>
                                <span>
                                  {new Date(event.start_time).toLocaleTimeString(
                                    'en-US',
                                    {
                                      hour: 'numeric',
                                      minute: '2-digit',
                                      hour12: true,
                                    }
                                  )}
                                </span>
                              </div>

                              {event.location && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <MapPin className="w-4 h-4 text-secondary-" />
                                  <span>{event.location}</span>
                                </div>
                              )}
                            </div>

                            <Button asChild className="w-full rounded-full px-0 py-0 text-white font-bold">
                              <Link
                                href={`/events/${event.id}`}
                                className="flex h-10 w-full items-center justify-center gap-2 rounded-full bg-secondary- px-4 text-white hover:bg-secondary-"
                              >
                                View Details
                                <ArrowRight className="w-4 h-4" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Create Event CTA */}
      <section className="py-16 bg-white px-6 sm:px-12 lg:px-16 border-t border-gray-200">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Have an event idea?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Community members can create and host events for their circles. Share your
            knowledge, organize meetups, and bring sisters together.
          </p>
          <Link href="/events/create">
            <Button className="bg-secondary- hover:bg-secondary- text-white font-bold rounded-full h-12 px-8">
              Create an Event
            </Button>
          </Link>
        </div>
      </section>
    </>
  )
}