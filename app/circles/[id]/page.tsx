import type { Metadata } from 'next'
import Link from 'next/link'
import { BookOpen, Users, TrendingUp, Heart, ArrowRight, Sparkles, Calendar, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'

const circleInfo: Record<string, {
  title: string
  subtitle: string
  description: string
  color: string
  icon: typeof BookOpen
  highlights: string[]
  outcomes: string[]
  image: string
}> = {
  learn: {
    title: 'Learn Circle',
    subtitle: 'Build knowledge, confidence, and practical skills',
    description: 'A supportive space to grow through masterclasses, academy courses, and shared learning experiences.',
    color: 'from-blue-600 to-blue-800',
    icon: BookOpen,
    highlights: ['Monthly workshops', 'Learning challenges', 'Academy resources'],
    outcomes: ['Sharpen your skills', 'Stay accountable to your goals', 'Learn alongside women who get it'],
    image: '/images/bs.jpg',
  },
  connect: {
    title: 'Connect Circle',
    subtitle: 'Create valuable relationships and lasting community',
    description: 'Meet women who inspire you, support you, and open doors to new opportunities.',
    color: 'from-fuchsia-600 to-violet-700',
    icon: Users,
    highlights: ['Peer circles', 'Mentoring', 'Community meetups'],
    outcomes: ['Grow your network', 'Find accountability partners', 'Meet mentors and collaborators'],
    image: '/images/sister.jpg',
  },
  earn: {
    title: 'Earn Circle',
    subtitle: 'Turn ambition into income, business, and opportunity',
    description: 'Gain practical guidance for entrepreneurship, money mastery, career growth, and financial confidence.',
    color: 'from-emerald-600 to-teal-700',
    icon: TrendingUp,
    highlights: ['Business support', 'Career tools', 'Financial literacy'],
    outcomes: ['Grow your income', 'Learn from women-led businesses', 'Build momentum with real opportunities'],
    image: '/images/member-1.png',
  },
  thrive: {
    title: 'Thrive Circle',
    subtitle: 'Prioritize wellbeing, balance, and self-leadership',
    description: 'A wellness-centered community that helps women lead with calm, confidence, and intention.',
    color: 'from-rose-600 to-orange-500',
    icon: Heart,
    highlights: ['Wellness challenges', 'Self-care tools', 'Leadership support'],
    outcomes: ['Feel grounded', 'Create healthier routines', 'Lead with more confidence'],
    image: '/images/together.jpg',
  },
}

export async function generateMetadata({ params }: { params: Promise<{ id?: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const id = resolvedParams?.id || 'learn'
  const circle = circleInfo[id]

  return {
    title: `${circle?.title || 'Circle'} | BIG`,
    description: circle?.description || 'Join a BIG circle and grow with a powerful community.',
  }
}

export async function generateStaticParams() {
  return [{ id: 'learn' }, { id: 'connect' }, { id: 'earn' }, { id: 'thrive' }]
}

export default async function CircleDetailPage({ params }: { params: Promise<{ id?: string }> }) {
  const resolvedParams = await params
  const rawId = resolvedParams?.id
  const id = rawId && rawId !== 'undefined' ? rawId : 'learn'
  const circle = circleInfo[id]

  if (!circle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-6">
        <div className="text-center max-w-md space-y-4">
          <p className="text-4xl">🔍</p>
          <h1 className="text-3xl font-bold text-slate-900">Circle not found</h1>
          <p className="text-slate-600">This circle isn’t available right now.</p>
          <Link href="/circles">
            <Button className="rounded-full">Back to circles</Button>
          </Link>
        </div>
      </div>
    )
  }

  const Icon = circle.icon

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <section className={`bg-gradient-to-r ${circle.color} px-6 py-20 text-white sm:px-12 lg:px-16`}>
        <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-medium backdrop-blur">
              <Sparkles className="h-4 w-4" />
              BIG Circle Experience
            </div>
            <h1 className="text-4xl font-semibold sm:text-5xl">{circle.title}</h1>
            <p className="mt-4 text-lg text-white/90">{circle.subtitle}</p>
            <p className="mt-5 max-w-xl text-base text-white/80">{circle.description}</p>
          </div>
          <div className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-white/70">Circle focus</p>
                <p className="text-lg font-semibold">{circle.title}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-16 sm:px-12 lg:grid-cols-[1.2fr_0.8fr] lg:px-16">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">What this circle offers</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {circle.highlights.map((item) => (
              <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-700">
                {item}
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-3xl bg-slate-950 p-6 text-white">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-300">
              <ShieldCheck className="h-4 w-4" />
              Circle outcomes
            </div>
            <ul className="mt-4 space-y-3 text-sm text-slate-200">
              {circle.outcomes.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-pink-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
              <Calendar className="h-4 w-4" />
              Start here
            </div>
            <p className="mt-3 text-lg font-semibold text-slate-900">Join this circle and unlock your community space.</p>
            <div className="mt-6 flex flex-col gap-3">
              <Link href={`/circles/join/${id}`}>
                <Button className="w-full rounded-full">Join this circle</Button>
              </Link>
              <Link href={`/circles/${id}/dashboard`}>
                <Button variant="outline" className="w-full rounded-full">Open dashboard</Button>
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
              <Sparkles className="h-4 w-4" />
              What members enjoy
            </div>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>• A guided, welcoming space for women at every stage</li>
              <li>• Events, challenges, and meaningful conversations</li>
              <li>• Direct access to the BIG community and resources</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
