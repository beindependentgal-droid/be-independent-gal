import { Metadata } from 'next';
import Link from 'next/link';
import { getUpcomingEvents } from '@/app/actions/event-actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Events | Be Independent Gal',
  description: 'Discover upcoming events and connect with the community',
};

export default async function EventsPage() {
  const events = await getUpcomingEvents(50);

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Upcoming Events</h1>
          <p className="text-xl text-gray-600">
            Connect, learn, and grow with sisters in your community
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
            >
              {event.image_url && (
                <div className="relative h-40 overflow-hidden bg-gray-200">
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {event.title}
                </h2>
                {event.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {event.description}
                  </p>
                )}
                <div className="space-y-3 mb-4 text-sm text-gray-600">
                  <p className="flex items-center gap-2">
                    <span className="font-semibold">Date:</span>
                    {new Date(event.start_time).toLocaleDateString()}
                  </p>
                  {event.location && (
                    <p className="flex items-center gap-2">
                      <span className="font-semibold">Location:</span>
                      {event.location}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-4">
                  {event.circle_name && (
                    <Badge>{event.circle_name}</Badge>
                  )}
                  <Badge variant="secondary">{event.event_type}</Badge>
                </div>
                <Link href={`/events/${event.id}`}>
                  <Button className="w-full">View Details</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No upcoming events. Check back soon!</p>
          </div>
        )}
      </div>
    </main>
  );
}
