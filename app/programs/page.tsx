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
import FallbackImage from '@/components/ui/fallback-image'

export const metadata: Metadata = {
  title: 'Programs & Events | BIG',
  description:
    'Explore BIG programs, workshops, mentorship circles, and upcoming events designed to help women learn, connect, grow, and rise.',
  openGraph: {
    title: 'Programs & Events | BIG',
    description: 'Explore BIG programs and upcoming events for women',
    images: ['/og-image.jpg'],
  },
}

const programs = [
  {
    icon: Users,
    title: 'Mentorship Circles',
    desc: 'Be paired with experienced women who guide you through your personal and professional journey.',
    color: 'from-primary to-primary',
    features: ['1-on-1 mentorship', 'Group guidance', 'Accountability partners'],
  },
  {
    icon: GraduationCap,
    title: 'Skills Academy',
    desc: 'Practical training in financial literacy, leadership, digital skills, and entrepreneurship.',
    color: 'from-blue-600 to-blue-800',
    features: ['Live classes', 'Recorded sessions', 'Certificates'],
  },
  {
    icon: Briefcase,
    title: 'Entrepreneur Hub',
    desc: 'Support for women building businesses, from idea to growth, with networks and resources.',
    color: 'from-emerald-600 to-emerald-800',
    features: ['Business planning', 'Funding access', 'Growth strategies'],
  },
  {
    icon: HeartPulse,
    title: 'Wellness & Self-Care',
    desc: 'Spaces and sessions focused on mental health, confidence, and holistic well-being.',
    color: 'from-rose-600 to-rose-800',
    features: ['Workshops', 'Retreats', 'Support groups'],
  },
]

const events = [
  {
    image: '/images/event.png',
    date: 'Mar 8, 2026',
    location: 'Nairobi, Kenya',
    title: 'BIG Women\'s Day Summit',
    desc: 'A full-day celebration of women with keynote speakers, panels, and networking.',
    tag: 'Summit',
    attendees: 500,
  },
  {
    image: '/images/community.png',
    date: 'Apr 19, 2026',
    location: 'Online',
    title: 'Financial Freedom Workshop',
    desc: 'Learn to budget, save, invest, and build a foundation for lasting independence.',
    tag: 'Workshop',
    attendees: 200,
  },
  {
    image: '/images/mentorship.png',
    date: 'May 24, 2026',
    location: 'Nakuru, Kenya',
    title: 'Mentorship Mixer',
    desc: 'Connect with mentors and mentees in a relaxed, supportive setting.',
    tag: 'Meetup',
    attendees: 100,
  },
]

export default function ProgramsPage() {
  return (
    <>
      {/* Hero */}
      <PageHero
        title="Programs & Events"
        subtitle="Learn, grow, and connect with purpose"
        description="Discover our carefully curated programs and upcoming events designed to support every stage of your journey."
        cta1={{ text: 'Explore Programs', href: '#programs' }}
        cta2={{ text: 'View Events', href: '#events' }}
        imageSrc="/images/programs-hero.jpg"
      />

      {/* Programs Section */}
      <section id="programs" className="py-20 bg-white px-6 sm:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            title="Our Programs"
            subtitle="Four pillars of growth"
            description="Each program is designed to support you at every stage of your journey, from learning to earning and thriving."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {programs.map((program, idx) => {
              const Icon = program.icon
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-pink-300 hover:shadow-xl transition-all"
                >
                  {/* Header with gradient */}
                  <div className={`bg-gradient-to-r ${program.color} p-8 text-white`}>
                    <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-bold">{program.title}</h3>
                  </div>

                  {/* Content */}
                  <div className="p-8 space-y-6">
                    <p className="text-gray-600 leading-relaxed">{program.desc}</p>

                    {/* Features */}
                    <div className="space-y-3 pt-4 border-t border-gray-200">
                      <p className="text-sm font-semibold text-gray-900">What's included:</p>
                      <ul className="space-y-2">
                        {program.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
                            <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA */}
                    <Link href="/circles">
                      <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-full h-11">
                        Learn More
                      </Button>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50 px-6 sm:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            title="How Programs Work"
            subtitle="Your path to growth"
            description="Every program follows a simple but powerful process"
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
            {[
              {
                num: '1',
                title: 'Discover',
                desc: 'Explore programs that align with your goals and interests.',
              },
              {
                num: '2',
                title: 'Enroll',
                desc: 'Sign up and get matched with mentors or join a cohort.',
              },
              {
                num: '3',
                title: 'Engage',
                desc: 'Participate in sessions, workshops, and community interactions.',
              },
              {
                num: '4',
                title: 'Grow',
                desc: 'Transform your skills, confidence, and opportunities.',
              },
            ].map((step, idx) => (
              <div key={idx} className="relative">
                <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg mx-auto mb-4">
                    {step.num}
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h4>
                  <p className="text-sm text-gray-600">{step.desc}</p>
                </div>

                {/* Arrow connector */}
                {idx < 3 && (
                  <div className="hidden md:flex absolute -right-3 top-1/2 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-6 h-6 text-pink-500" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section id="events" className="py-20 bg-white px-6 sm:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            title="Upcoming Events"
            subtitle="Don't miss out"
            description="Join us for inspiring events, workshops, and gatherings happening near you"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {events.map((event, idx) => (
              <Link key={idx} href={`/events/${idx}`}>
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-pink-300 hover:shadow-xl transition-all h-full flex flex-col">
                  {/* Image */}
                  <div className="relative aspect-video overflow-hidden">
                    <FallbackImage
                      src={event.image}
                      alt={event.title}
                      fill
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      fallbackSrc="/images/placeholder.jpg"
                    />

                    {/* Tag */}
                    <div className="absolute top-4 right-4">
                      <span className="bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        {event.tag}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    {/* Date & Location */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 text-pink-500" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-pink-500" />
                        <span>{event.location}</span>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <div className="flex-1 mb-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-pink-600 transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{event.desc}</p>
                    </div>

                    {/* Attendees & CTA */}
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">{event.attendees}+ attending</p>
                        <Button
                          size="sm"
                          className="bg-pink-500 hover:bg-pink-600 text-white rounded-full h-9 px-6 font-bold"
                        >
                          Register
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* View all events button */}
          <div className="text-center mt-12">
            <Link href="/events">
              <Button className="bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-full h-12 px-8 flex items-center gap-2 mx-auto">
                View All Events
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50 px-6 sm:px-12 lg:px-16">
        <div className="max-w-4xl mx-auto">
          <SectionHeading
            title="Frequently Asked Questions"
            subtitle="Got questions? We have answers."
            description="Learn more about our programs and events"
          />

          <div className="mt-12 space-y-4">
            {[
              {
                q: 'What is the cost of programs?',
                a: 'All BIG programs are included with your membership. There are no additional costs beyond your membership fee.',
              },
              {
                q: 'How do I register for events?',
                a: 'Click "Register" on any event card. You\'ll need to be logged in to complete your registration.',
              },
              {
                q: 'Can I attend events remotely?',
                a: 'Yes! We offer both in-person and online events. Check the event details to see which format works for you.',
              },
              {
                q: 'What if I miss a workshop or session?',
                a: 'All workshops are recorded and available to watch anytime in your member dashboard.',
              },
            ].map((item, idx) => (
              <details
                key={idx}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:border-pink-300 transition-colors group cursor-pointer"
              >
                <summary className="flex items-center justify-between font-bold text-gray-900 select-none">
                  {item.q}
                  <span className="text-pink-500 group-open:rotate-180 transition-transform">+</span>
                </summary>
                <p className="text-gray-600 mt-4 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white px-6 sm:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            title="What Members Say"
            subtitle="Real impact from real women"
            description="Hear from women who have transformed through our programs"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {[
              {
                quote: 'The mentorship program completely changed my perspective on leadership and business.',
                author: 'Sarah M.',
                role: 'Entrepreneur',
              },
              {
                quote: 'I gained practical skills and a support system that has been invaluable to my growth.',
                author: 'Grace K.',
                role: 'Professional',
              },
              {
                quote: 'The events and workshops create a community where I feel truly seen and supported.',
                author: 'Amina W.',
                role: 'Student',
              },
            ].map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-8 border border-border"
              >
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span key={i} className="text-yellow-400">
                      ⭐
                    </span>
                  ))}
                </div>
                <p className="text-gray-800 italic mb-6 leading-relaxed">"{testimonial.quote}"</p>
                <div>
                  <p className="font-bold text-gray-900">{testimonial.author}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <CtaBanner
        title="Ready to Transform Your Life?"
        description="Join thousands of women in BIG programs and discover what's possible when you learn, connect, and grow with purpose."
        cta1={{ text: 'Explore Programs', href: '/circles' }}
        cta2={{ text: 'View Events', href: '/events' }}
      />
    </>
  )
}