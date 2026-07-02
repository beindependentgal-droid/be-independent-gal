import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  Users,
  MessageCircle,
  Leaf,
  Handshake,
  Heart,
  Target,
  Eye,
  Sparkles,
} from 'lucide-react'
import { SectionHeading } from '@/components/section-heading'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'About Us | Be Independent Gal',
  description:
    'Discover BIG (Be Independent Gal), a movement empowering women through learning, community, opportunity, and impact.',
}

const bigLooks = [
  {
    title: 'BIG Academy',
    description: 'Learn practical skills that prepare you for life and work.',
    icon: BookOpen,
  },
  {
    title: 'Sister Circles',
    description: 'Small communities where meaningful friendships and accountability grow.',
    icon: Users,
  },
  {
    title: 'Girl Talk Friday',
    description: 'Honest conversations that inspire, educate, and empower.',
    icon: MessageCircle,
  },
  {
    title: 'Retreats',
    description: 'Reconnect with yourself while building lifelong friendships.',
    icon: Leaf,
  },
  {
    title: 'Networking',
    description: 'Meet women who open doors to new opportunities.',
    icon: Handshake,
  },
  {
    title: 'Community',
    description: 'A safe space where every woman belongs.',
    icon: Heart,
  },
]

const coreValues = [
  { title: 'Sisterhood', description: 'We rise together.', icon: Heart },
  { title: 'Growth', description: 'Learning never stops.', icon: BookOpen },
  { title: 'Integrity', description: 'Trust is our foundation.', icon: Target },
  { title: 'Excellence', description: 'We pursue our best every day.', icon: Sparkles },
  { title: 'Opportunity', description: 'Every woman deserves a chance.', icon: Handshake },
  { title: 'Impact', description: 'Success uplifts others.', icon: Leaf },
]

const testimonials = [
  {
    quote: 'BIG gave me more than knowledge—it gave me confidence.',
    name: 'Nia, Founder',
  },
  {
    quote: 'I found business partners, lifelong friends, and opportunities.',
    name: 'Amina, Consultant',
  },
  {
    quote: 'For the first time, I felt like I truly belonged.',
    name: 'Zuri, Creative',
  },
]

export default function AboutPage() {
  return (
    <>
      <section className="relative min-h-[70vh] sm:min-h-[80vh] overflow-hidden">
        <Image
          src="/images/hero-women2.jpg"
          alt="Women walking together, laughing, and learning as a community"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative mx-auto flex min-h-[70vh] sm:min-h-[80vh] max-w-5xl flex-col items-center justify-center px-4 text-center text-white sm:px-6 lg:px-8">
          <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs sm:text-sm font-semibold uppercase tracking-[0.24em] text-white/90 backdrop-blur-md">
            ✨ More Than a Community
          </span>
          <h1 className="mt-8 max-w-3xl text-3xl font-black uppercase tracking-tight sm:text-5xl lg:text-6xl">
            Building Independent Women.
            <span className="mt-4 block text-[#F7D36B]">Building an Unstoppable<br />Generation.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/90 sm:text-lg">
            BIG (Be Independent Gal) is a movement empowering women to learn, build meaningful relationships, create opportunities, and thrive together. We believe that every woman deserves access to knowledge, community, and opportunities to build the life she dreams of.
          </p>
          <div className="mt-10 flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              asChild
              className="w-full rounded-full bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-[0_20px_50px_-18px_rgba(91,33,182,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-16px_rgba(91,33,182,0.45)] sm:w-auto"
            >
              <Link href="/auth/sign-up">Become a BIG Member</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full rounded-full border border-white/70 bg-white/10 px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:bg-white/20 sm:w-auto"
            >
              <Link href="/community">Explore Our Community</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="relative overflow-hidden rounded-[2rem] bg-slate-100 shadow-xl">
              <Image
                src="/images/hero-women.jpg"
                alt="Women networking and learning together"
                width={780}
                height={680}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <SectionHeading
                align="left"
                eyebrow="Why BIG Exists"
                title="Every woman deserves the opportunity to thrive."
              />
              <p className="mt-6 text-base leading-8 text-muted-foreground sm:text-lg">
                Across Africa, millions of women have incredible dreams, talents, and ideas. Yet many never reach their full potential—not because they lack ability, but because they lack access to the right knowledge, meaningful relationships, mentorship, and opportunities.
              </p>
              <p className="mt-6 text-base leading-8 text-muted-foreground sm:text-lg">
                BIG was created to change that. We believe no woman should have to build her future alone.
              </p>
              <p className="mt-6 text-base leading-8 text-muted-foreground sm:text-lg">
                BIG is a home where women learn practical skills, connect with inspiring people, discover opportunities, support one another, and grow into confident, independent leaders.
              </p>
              <p className="mt-6 text-base leading-8 text-muted-foreground sm:text-lg">
                Because when one woman rises, she inspires countless others to rise with her.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F8FAFC] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="The BIG Framework"
            title="Learn. Connect. Earn. Thrive."
            subtitle="Four powerful steps that create confidence, community, opportunity, and lasting impact."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[2rem] border border-slate-200/70 bg-white/95 p-8 text-center shadow-[0_20px_50px_-20px_rgba(15,23,42,0.12)] transition duration-300 hover:-translate-y-1 hover:bg-[#f8f5ff] hover:shadow-[0_24px_80px_-28px_rgba(15,23,42,0.16)]">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary-50 text-secondary">
                <BookOpen className="h-6 w-6" />
              </div>
              <p className="mt-6 text-sm uppercase tracking-[0.2em] text-[#5B21B6]">Learn</p>
              <h3 className="mt-3 text-2xl font-semibold text-slate-900">Knowledge creates confidence.</h3>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                Acquire practical skills, business knowledge, leadership, financial literacy, and personal development that prepare you for real life.
              </p>
            </div>
            <div className="rounded-[2rem] border border-slate-200/70 bg-white/95 p-8 text-center shadow-[0_20px_50px_-20px_rgba(15,23,42,0.12)] transition duration-300 hover:-translate-y-1 hover:bg-[#f8f5ff] hover:shadow-[0_24px_80px_-28px_rgba(15,23,42,0.16)]">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#ede9fe] to-[#fdf2f8] text-[#5B21B6]">
                <Users className="h-6 w-6" />
              </div>
              <p className="mt-6 text-sm uppercase tracking-[0.2em] text-[#5B21B6]">Connect</p>
              <h3 className="mt-3 text-2xl font-semibold text-slate-900">Relationships create opportunities.</h3>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                Meet mentors, friends, professionals, entrepreneurs, and collaborators who help you grow personally and professionally.
              </p>
            </div>
            <div className="rounded-[2rem] border border-slate-200/70 bg-white/95 p-8 text-center shadow-[0_20px_50px_-20px_rgba(15,23,42,0.12)] transition duration-300 hover:-translate-y-1 hover:bg-[#f8f5ff] hover:shadow-[0_24px_80px_-28px_rgba(15,23,42,0.16)]">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#ede9fe] to-[#fdf2f8] text-[#5B21B6]">
                <Handshake className="h-6 w-6" />
              </div>
              <p className="mt-6 text-sm uppercase tracking-[0.2em] text-[#5B21B6]">Earn</p>
              <h3 className="mt-3 text-2xl font-semibold text-slate-900">Opportunities create independence.</h3>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                Turn your skills into businesses, careers, partnerships, income, and sustainable opportunities.
              </p>
            </div>
            <div className="rounded-[2rem] border border-slate-200/70 bg-white/95 p-8 text-center shadow-[0_20px_50px_-20px_rgba(15,23,42,0.12)] transition duration-300 hover:-translate-y-1 hover:bg-[#f8f5ff] hover:shadow-[0_24px_80px_-28px_rgba(15,23,42,0.16)]">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#ede9fe] to-[#fdf2f8] text-[#5B21B6]">
                <Leaf className="h-6 w-6" />
              </div>
              <p className="mt-6 text-sm uppercase tracking-[0.2em] text-[#5B21B6]">Thrive</p>
              <h3 className="mt-3 text-2xl font-semibold text-slate-900">Success is better together.</h3>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                Build a fulfilling life, create impact in your community, and empower other women to begin their own journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="What BIG Looks Like"
            title="The experiences that bring this movement to life."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {bigLooks.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="rounded-[2rem] border border-slate-200/70 bg-white/95 p-6 shadow-[0_18px_45px_-18px_rgba(15,23,42,0.1)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_60px_-24px_rgba(15,23,42,0.14)]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary-50 text-secondary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#F8FAFC] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-slate-200/70 bg-white/95 p-10 shadow-[0_24px_60px_-28px_rgba(15,23,42,0.12)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_80px_-32px_rgba(15,23,42,0.16)]">
              <SectionHeading eyebrow="Our Vision" title="Creating Africa's Largest Community of Independent Women." align="left" />
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Our vision is to build a future where every woman has access to education, meaningful relationships, opportunities, and the confidence to build an independent life.
              </p>
            </div>
            <div className="rounded-[2rem] border border-slate-200/70 bg-white/95 p-10 shadow-[0_24px_60px_-28px_rgba(15,23,42,0.12)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_80px_-32px_rgba(15,23,42,0.16)]">
              <SectionHeading eyebrow="Our Mission" title="Empowering women through learning, mentorship, connection, and leadership." align="left" />
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                To empower women through learning, mentorship, meaningful connections, entrepreneurship, leadership development, and supportive communities that create lasting impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Our Core Values" title="What guides every decision inside BIG." />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {coreValues.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="rounded-[2rem] border border-slate-200/70 bg-white/95 p-6 shadow-[0_18px_45px_-18px_rgba(15,23,42,0.1)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_60px_-24px_rgba(15,23,42,0.14)]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary-50 text-secondary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#F8FAFC] py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="The BIG Journey" title="A path that turns learning into independence and impact." />
          <div className="mt-12 space-y-6 rounded-[2rem] border border-border/70 bg-white p-8 shadow-sm transition duration-300 hover:bg-[#f8f5ff] hover:shadow-[0_24px_70px_-24px_rgba(15,23,42,0.14)]">
            {[
              'Join BIG',
              'Learn',
              'Connect',
              'Earn',
              'Thrive',
              'Help Another Woman Rise',
            ].map((step, index) => (
              <div key={step} className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#5B21B6]">Step {index + 1}</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">{step}</p>
                </div>
                {index < 5 ? (
                  <span className="hidden text-3xl font-bold text-[#5B21B6] sm:block">↓</span>
                ) : null}
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-sm leading-7 text-muted-foreground">
            Every member begins her journey by learning. Through meaningful relationships she discovers opportunities, builds independence, and eventually becomes a mentor to others. This cycle is how BIG creates lasting impact.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Our Community" title="Moments that show what BIG feels like." />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {['academy.png', 'community.png', 'mentor.png', 'event.png', 'circles.png', 'hero-women3.jpg', 'hero-women.jpg', 'hero-women2.jpg'].slice(0, 8).map((src, index) => (
              <div key={src} className="relative overflow-hidden rounded-[1.5rem] bg-slate-100 aspect-4/5">
                <Image src={`/images/${src}`} alt={`BIG community ${index + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#5B21B6] py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="BIG by the Numbers" title="Momentum measured in members, sessions, circles, and impact." align="center" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {[
              { value: '100+', label: 'Community Members' },
              { value: '4', label: 'Sister Circles' },
              { value: '20+', label: 'Learning Sessions' },
              { value: '10+', label: 'Partner Organizations' },
              { value: 'Growing Daily', label: 'Across Kenya' },
            ].map((item) => (
              <div key={item.label} className="rounded-[1.5rem] border border-white/15 bg-white/5 p-8 text-center shadow-sm backdrop-blur-xl transition duration-300 hover:bg-white/10 hover:shadow-[0_24px_70px_-28px_rgba(255,255,255,0.18)]">
                <p className="text-4xl font-semibold tracking-tight sm:text-5xl">{item.value}</p>
                <p className="mt-3 text-sm uppercase tracking-[0.24em] text-white/70">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Why Women Join BIG" title="Real women. Real transformation. Real belonging." />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {testimonials.map((item) => (
              <div key={item.name} className="rounded-[1.5rem] border border-border/70 bg-white p-8 shadow-sm transition duration-300 hover:bg-[#f8f5ff] hover:shadow-[0_24px_70px_-28px_rgba(15,23,42,0.14)]">
                <p className="text-base leading-8 text-slate-700 sm:text-lg">“{item.quote}”</p>
                <p className="mt-6 font-heading text-sm font-semibold uppercase tracking-[0.24em] text-[#5B21B6]">{item.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-violet-700 py-24 text-white">
        <div className="absolute inset-0 opacity-20 bg-white/10" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-white/80">Your Journey Starts Today</p>
          <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">Whether you're a student, entrepreneur, professional, creative, or simply looking for a place where you belong, BIG is here to help you learn, connect, earn, and thrive.</h2>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button
              asChild
              className="rounded-full bg-white px-8 py-4 text-base font-semibold text-[#5B21B6] shadow-[0_20px_50px_-30px_rgba(255,255,255,0.9)] transition-all duration-300 hover:-translate-y-1 hover:bg-white/90"
            >
              <Link href="/auth/sign-up">Become a BIG Member</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-full border border-white/70 bg-white/10 px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:bg-white/20"
            >
              <Link href="/community">Explore the Community</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-[#F8FAFC] py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#5B21B6]">Footer Quote</p>
          <p className="mt-6 text-2xl font-semibold leading-10 text-slate-900">
            “When women learn together, connect intentionally, create opportunities, and thrive collectively, communities change, businesses grow, and generations are transformed.”
          </p>
        </div>
      </section>
    </>
  )
}