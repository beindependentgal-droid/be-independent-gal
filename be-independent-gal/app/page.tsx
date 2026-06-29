import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  Compass,
  HeartHandshake,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react'
import { HomeHero } from '@/components/home/hero'
import { CtaBanner } from '@/components/cta-banner'
import { SectionHeading } from '@/components/section-heading'
import { Button } from '@/components/ui/button'

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
    icon: Users,
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
      <HomeHero />

      <section className="bg-[#f8fafc] py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Why BIG Exists"
              title="A movement where women build independent lives together."
            />
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              BIG is a premium women’s community created to inspire ambitious women to learn, lead, and build futures rooted in confidence, connection, and opportunity.
            </p>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              We bring together learning, mentorship, events, and peer support so every woman can move ahead with clarity, courage, and purpose.
            </p>
            <Button
              asChild
              className="mt-8 rounded-full bg-[#5B21B6] px-8 py-4 text-base font-semibold text-white shadow-[0_20px_50px_-18px_rgba(91,33,182,0.45)] transition hover:-translate-y-0.5 hover:bg-[#4c1d95]"
            >
              <Link href="/about">
                Read Our Story <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="relative overflow-hidden rounded-[2rem] border border-border/70 shadow-[0_24px_80px_-28px_rgba(91,33,182,0.28)]">
            <Image
              src="/images/community.png"
              alt="Women gathered in a supportive community workshop"
              width={680}
              height={520}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section id="trust" className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#5B21B6]">WE SERVE</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Practical support for every woman in the BIG community.
            </h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {trustItems.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="rounded-[2rem] border border-slate-200/70 bg-[#fbf9ff] p-6 shadow-[0_22px_60px_-28px_rgba(15,23,42,0.12)] transition duration-300 hover:-translate-y-1 hover:bg-[#f4efff] hover:shadow-[0_25px_70px_-30px_rgba(15,23,42,0.16)]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ede9fe] to-[#fdf2f8] text-[#5B21B6]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-heading text-lg font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#f8fafc] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Learn • Connect • Earn • Thrive"
            title="A framework that helps women move forward with confidence and community"
            subtitle="Every experience inside BIG is designed to help women grow, connect, and build meaningful futures."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {pillars.map((pillar) => {
              const Icon = pillar.icon
              return (
                <div key={pillar.title} className="rounded-[2rem] border border-slate-200/70 bg-white/95 p-6 shadow-[0_22px_60px_-28px_rgba(15,23,42,0.1)] transition duration-300 hover:-translate-y-1 hover:bg-[#f8f5ff] hover:shadow-[0_24px_70px_-28px_rgba(15,23,42,0.14)]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ede9fe] to-[#fdf2f8] text-[#5B21B6]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-heading text-xl font-semibold text-slate-900">{pillar.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{pillar.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Community Preview"
            title="A Place Where Women Feel Seen, Supported, and Empowered"
            subtitle="The BIG experience is shaped by real moments, shared stories, and meaningful connection."
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {communityPosts.map((post) => (
              <article key={post.title} className="overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white shadow-[0_22px_60px_-28px_rgba(15,23,42,0.1)] transition duration-300 hover:-translate-y-1 hover:bg-[#f8f5ff] hover:shadow-[0_24px_70px_-28px_rgba(15,23,42,0.14)]">
                <div className="relative aspect-4/3">
                  <Image src={post.image} alt={post.title} fill className="object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="font-heading text-lg font-semibold text-slate-900">{post.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{post.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f8fafc] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="BIG Academy"
            title="Learn in a Space Built for Real Growth"
            subtitle="Programs and experiences designed to build practical skills and lasting confidence."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {academyPrograms.map((program) => (
              <article key={program.title} className="overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white shadow-[0_22px_60px_-28px_rgba(15,23,42,0.1)] transition duration-300 hover:-translate-y-1 hover:bg-[#f8f5ff] hover:shadow-[0_24px_70px_-28px_rgba(15,23,42,0.14)]">
                <div className="relative aspect-4/3">
                  <Image src={program.image} alt={program.title} fill className="object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="font-heading text-lg font-semibold text-slate-900">{program.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{program.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div className="rounded-[2rem] border border-border/70 bg-white p-8 shadow-[0_18px_40px_-18px_rgba(15,23,42,0.12)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_-24px_rgba(15,23,42,0.16)]">
            <SectionHeading align="left" eyebrow="Sister Circles" title="Small Circles, Big Belonging" />
            <p className="mt-6 leading-8 text-muted-foreground">
              Sister Circles offer women a brave, gentle, and powerful space to be fully seen, share honestly, and grow together through life&apos;s seasons.
            </p>
            <Button asChild className="mt-8 rounded-full bg-[#5B21B6] px-8 font-semibold text-white hover:bg-[#4c1d95]">
              <Link href="/circles">Explore Sister Circles</Link>
            </Button>
          </div>
          <div className="rounded-[2rem] bg-[#5B21B6] p-8 text-white shadow-[0_24px_70px_-24px_rgba(91,33,182,0.5)]">
            <SectionHeading align="left" eyebrow="Events & Retreats" title="Spaces to Reset, Connect, and Rise" />
            <p className="mt-6 leading-8 text-white/85">
              From intimate retreats to immersive events, BIG creates experiences that help women reconnect with themselves and each other.
            </p>
            <Button asChild variant="outline" className="mt-8 rounded-full border-white/50 bg-white/10 px-8 font-semibold text-white hover:bg-white/20">
              <Link href="/programs">See Upcoming Events</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-[#f8fafc] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Success Stories" title="Women Who Found Their Voice, Their Circle, and Their Momentum" />
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {stories.map((story) => (
              <div key={story.name} className="rounded-[2rem] border border-slate-200/70 bg-white/95 p-8 shadow-[0_22px_60px_-28px_rgba(15,23,42,0.1)] transition duration-300 hover:-translate-y-1 hover:bg-[#f8f5ff] hover:shadow-[0_24px_70px_-28px_rgba(15,23,42,0.14)]">
                <p className="text-lg leading-8 text-slate-700">“{story.quote}”</p>
                <p className="mt-6 font-heading text-sm font-semibold uppercase tracking-[0.24em] text-[#5B21B6]">{story.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  )
}
