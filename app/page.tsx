import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  HeartHandshake,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react'
import { HomeHero } from '@/components/home/hero'
import { CtaBanner } from '@/components/cta-banner'
import { SectionHeading } from '@/components/section-heading'
import { Button } from '@/components/ui/button'
import FallbackImage from '@/components/ui/fallback-image'

const trustItems = [
  {
    icon: Users,
    title: 'Growing community of women',
    description: 'Real sisters, real stories, and rising together every day.',
  },
  {
    icon: BookOpen,
    title: 'Live learning sessions',
    description: 'Practical workshops, masterclasses, and coaching built for impact.',
  },
  {
    icon: HeartHandshake,
    title: 'Sister Circles',
    description: 'Small groups where belonging, accountability, and trust are nurtured.',
  },
  {
    icon: CalendarDays,
    title: 'Community events',
    description: 'In-person and digital experiences that spark connection and momentum.',
  },
  {
    icon: Sparkles,
    title: 'Retreats',
    description: 'Restorative gatherings that refresh purpose, energy, and focus.',
  },
  {
    icon: BriefcaseBusiness,
    title: 'Business networking',
    description: 'A powerful ecosystem for collaboration, growth and professional progress.',
  },
]

const pillars = [
  {
    title: 'Learn',
    icon: BookOpen,
    desc: 'Build confidence through practical learning, mentorship, and lived experience.',
  },
  {
    title: 'Connect',
    icon: HeartHandshake,
    desc: 'Meet women who understand your journey and want to see you grow.',
  },
  {
    title: 'Earn',
    icon: BriefcaseBusiness,
    desc: 'Discover opportunities, partnerships, and income pathways that move you forward.',
  },
  {
    title: 'Thrive',
    icon: TrendingUp,
    desc: 'Create a life that feels abundant, purposeful, and deeply yours.',
  },
]

const communityPosts = [
  {
    image: '/images/community.png',
    title: 'Real conversations, real support',
    desc: 'Women showing up for one another in circles shaped by honesty and care.',
  },
  {
    image: '/images/mentorship.png',
    title: 'Mentorship that moves things',
    desc: 'Experienced women guiding the next generation with clarity and heart.',
  },
  {
    image: '/images/event.png',
    title: 'Moments that spark momentum',
    desc: 'Events that turn ideas into community, confidence, and opportunity.',
  },
]

const academyPrograms = [
  {
    image: '/images/mentorship.png',
    title: 'BIG Academy',
    desc: 'A curated learning experience that combines practical, high-impact training with community support.',
  },
  {
    image: '/images/community.png',
    title: 'Sister Circles',
    desc: 'Small, intentional circles that help women process, grow, and stay accountable.',
  },
  {
    image: '/images/event.png',
    title: 'Events & Retreats',
    desc: 'Immersive experiences designed to restore, connect, and unlock new possibilities.',
  },
]

const stories = [
  {
    quote: 'BIG gave me the confidence to step into leadership and build my business with intention.',
    name: 'Njeri, Entrepreneur',
  },
  {
    quote: 'The sisterhood helped me find my voice, my network, and my next chapter.',
    name: 'Amina, Founder',
  },
]

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <HomeHero />

      {/* About section */}
      <section className="py-20 bg-white px-6 sm:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left - Image */}
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
              <FallbackImage
                src="/images/together.jpg"
                alt="Be Independent Gal Community"
                width={600}
                height={600}
                className="w-full h-full object-cover"
                fallbackSrc="/images/placeholder.jpg"
              />
            </div>
          </div>

          {/* Right - Content */}
          <div className="space-y-6">
            <div>
              <p className="text-pink-600 font-bold text-sm uppercase tracking-wide mb-3">About BIG</p>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                A movement of women building independent futures
              </h2>
            </div>

            <p className="text-lg text-gray-600 leading-relaxed">
                BIG is a premium women&apos;s community created to inspire ambitious women to learn, lead, and build futures
            </p>

            <p className="text-lg text-gray-600 leading-relaxed">
              We bring together learning, mentorship, events, and peer support so every woman can move ahead with
              clarity, courage, and purpose.
            </p>

            <div className="pt-6">
              <Link href="/about">
                <Button className="bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-full h-12 px-8 flex items-center gap-2 w-fit">
                  Read Our Story
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What We Serve */}
      <section className="py-20 bg-gray-50 px-6 sm:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            title="What We Serve"
            subtitle="Practical support for every woman in the BIG community"
            description="From learning to belonging, we&apos;ve got you covered"
          />

          {trustItems.map((item, idx) => {
              const Icon = item.icon
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-pink-300 hover:shadow-lg transition-all"
                >
                  <div className="w-12 h-12 rounded-lg bg-pink-100 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-pink-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              )
            })}
          </div>
      </section>

      {/* The Four Pillars */}
      <section className="py-20 bg-white px-6 sm:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            title="The BIG Four"
            subtitle="Learn. Connect. Earn. Thrive."
            description="Four pillars that guide everything we do"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon
              return (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200 hover:border-pink-300 hover:shadow-lg transition-all text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-white border-2 border-pink-300 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-pink-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{pillar.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{pillar.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Community Highlights */}
      <section className="py-20 bg-gray-50 px-6 sm:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            title="Life in BIG"
            subtitle="Real stories, real impact"
            description="See what happens when women come together with purpose"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {communityPosts.map((post, idx) => (
              <Link key={idx} href="/community">
                <div className="group cursor-pointer">
                  <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg mb-6 hover:shadow-xl transition-shadow">
                    <FallbackImage
                      src={post.image}
                      alt={post.title}
                      fill
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      fallbackSrc="/images/placeholder.jpg"
                    />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-pink-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{post.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Academy Programs */}
      <section className="py-20 bg-white px-6 sm:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            title="How We Support Your Growth"
            subtitle="Three powerful pathways"
            description="Multiple ways to learn, connect, and thrive with BIG"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {academyPrograms.map((program, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-pink-300 hover:shadow-xl transition-all">
                {/* Image */}
                <div className="relative aspect-video overflow-hidden">
                  <FallbackImage
                    src={program.image}
                    alt={program.title}
                    fill
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    fallbackSrc="/images/placeholder.jpg"
                  />
                </div>

                {/* Content */}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{program.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">{program.desc}</p>

                  <Link href="/circles">
                    <Button variant="outline" className="w-full rounded-full h-10 border-pink-300 text-pink-600 hover:bg-pink-50 font-bold">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sister Circles CTA */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 sm:px-12 lg:px-16">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-bold">Sister Circles</h2>
          <p className="text-xl text-white/90 leading-relaxed">
            Sister Circles offer women a brave, gentle, and powerful space to be fully seen, share honestly, and grow
            together through life&apos;s seasons.
          </p>
          <Link href="/circles">
            <Button className="bg-white text-pink-600 hover:bg-gray-100 font-bold rounded-full h-12 px-8 flex items-center gap-2 mx-auto">
              Explore Sister Circles
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Events CTA */}
      <section className="py-16 bg-gray-50 px-6 sm:px-12 lg:px-16">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-bold text-gray-900">Events & Experiences</h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            From intimate retreats to immersive events, BIG creates experiences that help women reconnect with
            themselves and each other.
          </p>
          <Link href="/events">
            <Button className="bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-full h-12 px-8 flex items-center gap-2 mx-auto">
              See Upcoming Events
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white px-6 sm:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            title="What Sisters Say"
            subtitle="Real stories from real women"
            description="Hear from women who are living the BIG movement"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
            {stories.map((story, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-12 border border-border relative"
              >
                <div className="absolute top-6 left-6 text-5xl opacity-20">&quot;</div>

                <p className="text-xl text-gray-800 italic leading-relaxed mb-8 relative z-10">
                  {story.quote}
                </p>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                    {story.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{story.name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <CtaBanner
        title="Ready to Join the Movement?"
        description="Become part of a community of ambitious women building independent, purpose-driven futures together."
        cta1={{ text: 'Join BIG Today', href: '/auth/sign-up' }}
        cta2={{ text: 'Learn More', href: '/about' }}
        background="bg-primary"
      />
    </>
  )
}

