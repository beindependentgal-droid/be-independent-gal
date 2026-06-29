import type { Metadata } from 'next'
import Image from 'next/image'
import { BookOpen, Users, TrendingUp, Heart, MapPin, Clock, Quote, ArrowRight } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { SectionHeading } from '@/components/section-heading'
import { CtaBanner } from '@/components/cta-banner'
import { CircleCard } from '@/components/circles/circle-card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sister Circles',
  description:
    'Join your primary Sister Circle and grow with women in the Learn, Connect, Earn, and Thrive communities. Attend meetups, connect with sisters, and rise together.',
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
    icon: BookOpen,
    title: 'Learn Circle',
    description:
      'Develop knowledge, skills, confidence, and personal growth. Master new abilities and unlock your potential with sisters who inspire.',
    memberCount: 2847,
    gradient: 'bg-gradient-to-br from-blue-600 to-blue-800',
  },
  {
    id: 'connect',
    icon: Users,
    title: 'Connect Circle',
    description:
      'Build relationships, mentorship, networks, and meaningful connections. Find your tribe and cultivate friendships that matter.',
    memberCount: 3124,
    gradient: 'bg-gradient-to-br from-purple-600 to-purple-800',
  },
  {
    id: 'earn',
    icon: TrendingUp,
    title: 'Earn Circle',
    description:
      'Explore business, careers, opportunities, financial literacy, and entrepreneurship. Build wealth and independence together.',
    memberCount: 2456,
    gradient: 'bg-gradient-to-br from-emerald-600 to-emerald-800',
  },
  {
    id: 'thrive',
    icon: Heart,
    title: 'Thrive Circle',
    description:
      'Focus on wellness, purpose, leadership, confidence, and balanced living. Become your best self and inspire others to do the same.',
    memberCount: 2691,
    gradient: 'bg-gradient-to-br from-rose-600 to-rose-800',
  },
]

const features = [
  {
    title: 'Circle Feed',
    description: 'Share posts, photos, videos, and announcements with your community',
  },
  {
    title: 'Circle Members',
    description: 'Search, connect, and message sisters on your growth journey',
  },
  {
    title: 'Events & Meetups',
    description: 'Attend workshops, sessions, and retreats with your circle',
  },
  {
    title: 'Resources',
    description: 'Access guides, templates, recordings, and academy materials',
  },
  {
    title: 'Challenges',
    description: 'Complete monthly challenges and earn badges and certificates',
  },
  {
    title: 'Earn Points',
    description: 'Build your rank from New Member to BIG Ambassador',
  },
]

export default function CirclesPage() {
  return (
    <>
      <PageHero
        eyebrow="Sister Circles"
        title="Small Circles. Deep Connections. Real Growth."
        description="Choose your primary Sister Circle and grow alongside women in the BIG community. Whether you're focused on learning, connecting, earning, or thriving—your circle is waiting for you."
      />

      {/* Hero Stats */}
      <section className="bg-gradient-to-r from-purple-50 to-pink-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="font-heading text-4xl font-extrabold text-purple-700">
                11K+
              </div>
              <p className="mt-2 text-sm text-purple-600">Sisters in circles</p>
            </div>
            <div>
              <div className="font-heading text-4xl font-extrabold text-pink-700">
                50+
              </div>
              <p className="mt-2 text-sm text-pink-600">Circles worldwide</p>
            </div>
            <div>
              <div className="font-heading text-4xl font-extrabold text-purple-700">
                1M+
              </div>
              <p className="mt-2 text-sm text-purple-600">Connections made</p>
            </div>
          </div>
        </div>
      </section>

      {/* The BIG Journey */}
      <section className="bg-background py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="The BIG Journey"
            subtitle="Every circle is a step on your growth path. Choose where you focus first."
          />
          <div className="mt-12 grid gap-8 lg:grid-cols-4">
            {circles.map((circle) => (
              <CircleCard key={circle.id} {...circle} />
            ))}
          </div>
        </div>
      </section>

      {/* Circle Features */}
      <section className="bg-muted py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="What You Get in Every Circle"
            subtitle="A complete community experience designed for growth and connection."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
              >
                <h3 className="font-heading text-lg font-bold text-secondary">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Meetups */}
      <section className="bg-background py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="What's Happening"
            title="Upcoming Meetups & Events"
            subtitle="Show up, connect, and leave inspired. Everyone is welcome."
          />
          <ul className="mt-12 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
            {meetups.map((m) => (
              <li
                key={m.title}
                className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <span className="font-heading text-xl font-extrabold leading-none">
                      {m.day}
                    </span>
                    <span className="text-xs font-bold uppercase">
                      {m.month}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-heading text-base font-bold text-secondary">
                      {m.title}
                    </h3>
                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-accent" /> {m.location}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-accent" /> {m.time}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold uppercase tracking-wide text-secondary-foreground">
                    {m.tag}
                  </span>
                  <Button
                    asChild
                    size="sm"
                    className="rounded-full bg-primary font-semibold text-primary-foreground hover:bg-primary/90"
                  >
                    <Link href="/get-involved#join">Save my spot</Link>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Member Stories */}
      <section className="bg-muted py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Sisterhood In Action"
            title="Stories From Our Women"
            subtitle="Real women, real growth. This is what happens when women rise together."
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {stories.map((story) => (
              <figure
                key={story.name}
                className="flex flex-col rounded-2xl border border-border bg-card p-6"
              >
                <Quote className="h-8 w-8 text-accent" />
                <blockquote className="mt-4 flex-1 text-pretty leading-relaxed text-secondary">
                  {story.quote}
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full">
                    <Image
                      src={story.image || '/placeholder.jpg'}
                      alt={story.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-heading text-sm font-bold text-secondary">
                      {story.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{story.role}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-background py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="How Sister Circles Work"
            subtitle="Join today and start your growth journey"
          />
          <div className="mt-12 space-y-6">
            {[
              {
                num: '1',
                title: 'Choose Your Circle',
                desc: 'Pick the circle that aligns with your current focus: Learn, Connect, Earn, or Thrive.',
              },
              {
                num: '2',
                title: 'Complete Your Profile',
                desc: 'Tell us who you are, what you\'re working on, and how you want to help other sisters.',
              },
              {
                num: '3',
                title: 'Connect & Engage',
                desc: 'Join the feed, attend events, complete challenges, and build real relationships.',
              },
              {
                num: '4',
                title: 'Grow & Rise',
                desc: 'Earn points, unlock badges, and climb the ranks from New Member to BIG Ambassador.',
              },
            ].map((step) => (
              <div key={step.num} className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-heading text-lg font-bold">
                  {step.num}
                </div>
                <div className="flex-1">
                  <h3 className="font-heading text-lg font-bold text-secondary">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-muted-foreground">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gamification Preview */}
      <section className="bg-muted py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Earn Ranks & Recognition"
            subtitle="Grow your status as you engage with your circle community"
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { emoji: '🌱', rank: 'New Member', color: 'from-green-100 to-green-50' },
              {
                emoji: '🌸',
                rank: 'Active Sister',
                color: 'from-pink-100 to-pink-50',
              },
              { emoji: '⭐', rank: 'Community Champion', color: 'from-yellow-100 to-yellow-50' },
              {
                emoji: '👑',
                rank: 'Circle Leader',
                color: 'from-purple-100 to-purple-50',
              },
              {
                emoji: '🏆',
                rank: 'BIG Ambassador',
                color: 'from-orange-100 to-orange-50',
              },
            ].map((item) => (
              <div
                key={item.rank}
                className={`bg-gradient-to-br ${item.color} rounded-2xl p-6 text-center border border-border`}
              >
                <div className="text-4xl mb-3">{item.emoji}</div>
                <p className="font-heading font-bold text-secondary">{item.rank}</p>
              </div>
            ))}
          </div>
          <p className="mt-12 text-center text-muted-foreground">
            Earn points by posting, commenting, attending events, helping others, and completing challenges.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-background py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-16 text-center text-white sm:px-12">
            <h2 className="font-heading text-3xl font-extrabold uppercase tracking-tight text-balance sm:text-4xl">
              Ready to Find Your Circle?
            </h2>
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-white/90">
              Join thousands of women growing together. Your circle—and your growth journey—starts today.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-white px-8 font-semibold text-purple-600 hover:bg-white/90"
              >
                <Link href="/circles#join">Join a Circle</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="ghost"
                className="rounded-full border-2 border-white px-8 font-semibold text-white hover:bg-white/10"
              >
                <Link href="/about">Learn Our Story</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  )
}
