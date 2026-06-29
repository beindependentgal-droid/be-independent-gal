import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  Users,
  GraduationCap,
  Briefcase,
  HeartPulse,
  Calendar,
  MapPin,
  ArrowRight,
} from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { SectionHeading } from '@/components/section-heading'
import { CtaBanner } from '@/components/cta-banner'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Programs & Events | Be Independent Gal',
  description:
    'Explore BIG programs, workshops, mentorship circles, and upcoming events designed to help women learn, connect, grow, and rise.',
}

const programs = [
  {
    icon: Users,
    title: 'Mentorship Circles',
    desc: 'Be paired with experienced women who guide you through your personal and professional journey.',
  },
  {
    icon: GraduationCap,
    title: 'Skills Academy',
    desc: 'Practical training in financial literacy, leadership, digital skills, and entrepreneurship.',
  },
  {
    icon: Briefcase,
    title: 'Entrepreneur Hub',
    desc: 'Support for women building businesses, from idea to growth, with networks and resources.',
  },
  {
    icon: HeartPulse,
    title: 'Wellness & Self-Care',
    desc: 'Spaces and sessions focused on mental health, confidence, and holistic well-being.',
  },
]

const events = [
  {
    image: '/images/event.png',
    date: 'Mar 8, 2026',
    location: 'Nairobi, Kenya',
    title: 'BIG Women’s Day Summit',
    desc: 'A full-day celebration of women with keynote speakers, panels, and networking.',
    tag: 'Summit',
  },
  {
    image: '/images/community.png',
    date: 'Apr 19, 2026',
    location: 'Online',
    title: 'Financial Freedom Workshop',
    desc: 'Learn to budget, save, invest, and build a foundation for lasting independence.',
    tag: 'Workshop',
  },
  {
    image: '/images/mentorship.png',
    date: 'May 24, 2026',
    location: 'Nakuru, Kenya',
    title: 'Mentorship Mixer',
    desc: 'Connect with mentors and mentees in a relaxed, supportive setting.',
    tag: 'Meetup',
  },
]

export default function ProgramsPage() {
  return (
    <>
      <PageHero
        eyebrow="What We Do"
        title="Programs & Events"
        description="Practical, community-driven initiatives where women learn, connect, grow, and rise together."
      />

      {/* Programs grid */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Our Programs"
            title="Built To Help You Grow"
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {programs.map((p) => (
              <div
                key={p.title}
                className="flex gap-5 rounded-2xl border border-border bg-card p-6"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <p.icon className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="font-heading text-lg font-bold text-secondary">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {p.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming events */}
      <section className="bg-muted/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Mark Your Calendar"
            title="Upcoming Events"
            subtitle="Join us in person or online and become part of the movement."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {events.map((e) => (
              <article
                key={e.title}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-lg"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={e.image || '/placeholder.jpg'}
                    alt={e.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                    {e.tag}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-primary" /> {e.date}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-primary" /> {e.location}
                    </span>
                  </div>
                  <h3 className="mt-3 font-heading text-lg font-bold text-secondary">
                    {e.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {e.desc}
                  </p>
                  <Button
                    asChild
                    variant="ghost"
                    className="mt-4 w-fit px-0 font-semibold text-primary hover:bg-transparent hover:text-primary/80"
                  >
                    <Link href="/get-involved#join">
                      Register <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  )
}
