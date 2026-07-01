import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { BookOpen, Users, TrendingUp, Heart, MapPin, Clock } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { SectionHeading } from '@/components/section-heading'
import { CtaBanner } from '@/components/cta-banner'
import { Button } from '@/components/ui/button'
import FallbackImage from '@/components/ui/fallback-image'

export const metadata: Metadata = {
  title: 'Sister Circles | BIG',
  description:
    'Join your primary Sister Circle and grow with women in the Learn, Connect, Earn, and Thrive communities. Attend meetups, connect with sisters, and rise together.',
  openGraph: {
    title: 'Sister Circles | BIG',
    description: 'Find your community, choose your focus, rise together.',
    images: ['/og-image.jpg'],
  },
}
const meetups = [
  {
    day: '12',
    month: 'Jul',
    title: 'Sisterhood Brunch & Networking',
    location: 'Nairobi',
    time: '11:00 AM',
    tag: 'In person',
  },
  {
    day: '19',
    month: 'Jul',
    title: 'Money Talks: Investing for Beginners',
    location: 'Online',
    time: '6:00 PM',
    tag: 'Webinar',
  },
  {
    day: '03',
    month: 'Aug',
    title: 'Build Your Brand Workshop',
    location: 'Westlands',
    time: '10:00 AM',
    tag: 'Workshop',
  },
  {
    day: '17',
    month: 'Aug',
    title: 'Founders Roundtable Meetup',
    location: 'Kilimani',
    time: '2:00 PM',
    tag: 'In person',
  },
]

const stories = [
  {
    name: 'Amina W.',
    role: 'Entrepreneur, Nairobi',
    image: '/images/member-1.png',
    quote:
      'BIG gave me the courage and the skills to start my catering business. A year later I employ three other women.',
  },
  {
    name: 'Grace M.',
    role: 'Community Leader, Nakuru',
    image: '/images/member-2.png',
    quote:
      'The sisterhood circles changed everything. I found mentors, friends, and the confidence to lead in my community.',
  },
  {
    name: 'Faith K.',
    role: 'Student, Nairobi',
    image: '/images/member-3.png',
    quote:
      'I joined as a shy student. Through the Academy and the circles I landed my first internship and found my voice.',
  },
]

const circles = [
  {
    id: 'learn',
    icon: '📚',
    title: 'Learn Circle',
    description:
      'Develop knowledge, skills, confidence, and personal growth. Master new abilities and unlock your potential with sisters who inspire.',
    memberCount: 2847,
    color: 'from-blue-600 to-blue-800',
  },
  {
    id: 'connect',
    icon: '🤝',
    title: 'Connect Circle',
    description:
      'Build relationships, mentorship, networks, and meaningful connections. Find your tribe and cultivate friendships that matter.',
    memberCount: 3124,
    color: 'from-primary to-primary',
  },
  {
    id: 'earn',
    icon: '💰',
    title: 'Earn Circle',
    description:
      'Explore business, careers, opportunities, financial literacy, and entrepreneurship. Build wealth and independence together.',
    memberCount: 2456,
    color: 'from-emerald-600 to-emerald-800',
  },
  {
    id: 'thrive',
    icon: '❤️',
    title: 'Thrive Circle',
    description:
      'Focus on wellness, purpose, leadership, confidence, and balanced living. Become your best self and inspire others to do the same.',
    memberCount: 2691,
    color: 'from-rose-600 to-rose-800',
  },
]

const features = [
  {
    title: 'Circle Feed',
    description: 'Share posts, photos, videos, and announcements with your community',
    emoji: '📰',
  },
  {
    title: 'Circle Members',
    description: 'Search, connect, and message sisters on your growth journey',
    emoji: '👯',
  },
  {
    title: 'Events & Meetups',
    description: 'Attend workshops, sessions, and retreats with your circle',
    emoji: '📅',
  },
  {
    title: 'Resources',
    description: 'Access guides, templates, recordings, and academy materials',
    emoji: '📚',
  },
  {
    title: 'Challenges',
    description: 'Complete monthly challenges and earn badges and certificates',
    emoji: '🏆',
  },
  {
    title: 'Earn Points',
    description: 'Build your rank from New Member to BIG Ambassador',
    emoji: '⭐',
  },
]

const ranks = [
  { emoji: '🌱', rank: 'New Member', color: 'from-green-100 to-green-50' },
  { emoji: '🌸', rank: 'Active Sister', color: 'from-primary/10 to-primary/5' },
  { emoji: '⭐', rank: 'Community Champion', color: 'from-yellow-100 to-yellow-50' },
  { emoji: '👑', rank: 'Circle Leader', color: 'from-primary/10 to-primary/5' },
  { emoji: '🏆', rank: 'BIG Ambassador', color: 'from-orange-100 to-orange-50' },
]

export default function CirclesPage() {
  return (
    <>
      {/* Hero */}
      <PageHero
        title="Sister Circles"
        subtitle="Find your community. Choose your focus. Rise together."
        description="Join women who are learning, connecting, earning, and thriving together in our four main circles."
        cta1={{ text: 'Browse Circles', href: '#circles-section' }}
        cta2={{ text: 'Learn More', href: '#how-it-works' }}
        imageSrc="/images/circles-hero.jpg"
      />

      {/* Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-12 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-secondary- mb-2">11K+</div>
              <p className="text-gray-600">Sisters in circles</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">50+</div>
              <p className="text-gray-600">Circles worldwide</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">1M+</div>
              <p className="text-gray-600">Connections made</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Four Circles */}
      <section id="circles-section" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 sm:px-12 lg:px-16">
          <SectionHeading
            title="The Four Circles"
            subtitle="Choose where to start your journey"
            description="Each circle focuses on a different aspect of your growth. You can be part of multiple circles as you evolve."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {circles.map((circle) => (
              <Link key={circle.id} href={`/circles/join/${circle.id}`}>
                <div className="h-full bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-shadow cursor-pointer border border-gray-200 hover:border-secondary-">
                  {/* Header with gradient */}
                  <div className={`bg-gradient-to-r ${circle.color} p-8 text-white`}>
                    <div className="text-4xl mb-3">{circle.icon}</div>
                    <h3 className="text-2xl font-bold mb-2">{circle.title}</h3>
                    <p className="text-white/90">{circle.memberCount.toLocaleString()} members</p>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <p className="text-gray-600 leading-relaxed mb-6">{circle.description}</p>
                    <Button className="bg-secondary- hover:bg-secondary- text-white font-bold rounded-full w-full h-11">
                      Explore Circle →
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Circle Features */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-12 lg:px-16">
          <SectionHeading
            title="What You Get in Your Circle"
            subtitle="Everything you need to connect, learn, and grow"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {features.map((feature, idx) => (
              <div key={idx} className="p-6 border border-gray-200 rounded-2xl hover:border-secondary- hover:shadow-lg transition-all">
                <div className="text-3xl mb-3">{feature.emoji}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Meetups */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 sm:px-12 lg:px-16">
          <SectionHeading
            title="Upcoming Meetups & Events"
            subtitle="Join sisters near you"
            description="From workshops to networking brunches, find events happening in your circle."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            {meetups.map((meetup, idx) => (
              <Link key={idx} href="/events"> {/* Assuming a generic events page */}
                <div className="bg-white rounded-2xl border border-gray-200 hover:border-secondary- hover:shadow-lg transition-all p-6 cursor-pointer">
                  <div className="flex gap-6">
                    {/* Date */}
                    <div className="flex-shrink-0 text-center bg-secondary- rounded-xl p-4 min-w-fit">
                      <div className="text-2xl font-bold text-secondary-">{meetup.day}</div>
                      <div className="text-sm text-gray-600">{meetup.month}</div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 mb-3">{meetup.title}</h4>
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{meetup.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{meetup.time}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium bg-blue-100 text-blue-700 rounded-full px-3 py-1">
                          {meetup.tag}
                        </span>
                        <Button size="sm" className="bg-secondary- hover:bg-secondary- text-white rounded-full h-8 text-xs">
                          Save my spot
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/events">
              <Button className="bg-secondary- hover:bg-secondary- text-white font-bold rounded-full h-12 px-8">
                View All Events
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Member Stories */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-12 lg:px-16">
          <SectionHeading
            title="Member Stories"
            subtitle="Real women. Real transformations."
            description="Hear from sisters who have grown with BIG."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {stories.map((story, idx) => (
              <div key={idx} className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                {/* Quote */}
                <blockquote className="text-gray-600 italic mb-6 leading-relaxed">
                  "{story.quote}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                    <FallbackImage
                      src={story.image}
                      alt={story.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                      fallbackSrc="/images/member-placeholder.png"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{story.name}</p>
                    <p className="text-xs text-gray-500">{story.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 sm:px-12 lg:px-16">
          <SectionHeading
            title="How Circle Life Works"
            subtitle="Your growth journey in 4 steps"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {/* Steps */}
            {[
              {
                num: '1',
                title: 'Choose Your Circle',
                desc: 'Pick the circle that aligns with your focus: Learn, Connect, Earn, or Thrive.',
              },
              {
                num: '2',
                title: 'Complete Your Profile',
                desc: 'Tell us who you are and how you want to grow with your circle.',
              },
              {
                num: '3',
                title: 'Connect & Engage',
                desc: 'Join discussions, attend events, and build real relationships.',
              },
              {
                num: '4',
                title: 'Grow & Rise',
                desc: 'Earn points and climb the ranks from New Member to BIG Ambassador.',
              },
            ].map((step, idx) => (
              <div key={idx} className="text-center">
                <div className="w-12 h-12 rounded-full bg-secondary- text-white flex items-center justify-center font-bold text-lg mx-auto mb-4">
                  {step.num}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gamification - Ranks */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-12 lg:px-16">
          <SectionHeading
            title="Build Your Rank"
            subtitle="Earn points and unlock badges"
            description="Start as a New Member and rise to BIG Ambassador"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mt-12">
            {ranks.map((item, idx) => (
              <div
                key={idx}
                className={`bg-gradient-to-b ${item.color} rounded-2xl p-6 text-center border border-gray-200 hover:shadow-lg transition-shadow`}
              >
                <div className="text-4xl mb-3">{item.emoji}</div>
                <p className="font-bold text-gray-900">{item.rank}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center">
            <p className="text-sm text-blue-900">
              ⭐ Earn points by posting, commenting, attending events, helping others, and completing challenges.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <CtaBanner
        title="Ready to Find Your Circle?"
        description="Join thousands of women growing together. Your circle—and your growth journey—starts today."
        cta1={{ text: 'Join a Circle', href: '/circles' }}
        cta2={{ text: 'Learn Our Story', href: '/about' }}
      />
    </>
  )
}