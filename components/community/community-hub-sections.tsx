'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CalendarDays,
  Camera,
  ChevronRight,
  Compass,
  GraduationCap,
  HeartHandshake,
  Image as ImageIcon,
  MessageCircleMore,
  PlayCircle,
  Sparkles,
  Trophy,
  Users2,
  Video,
} from 'lucide-react'

const stats = [
  { value: '4.8K+', label: 'Women Connected' },
  { value: '18K+', label: 'Community Conversations' },
  { value: '650+', label: 'Businesses Shared' },
  { value: '42', label: 'Active Sister Circles' },
]

const storyItems = [
  { name: 'Your Story', label: 'Share a win', active: true, accent: 'from-violet-700 to-fuchsia-500' },
  { name: 'Sharon', label: 'Founder win', active: false, accent: 'from-amber-400 to-orange-500' },
  { name: 'Faith', label: 'New post', active: false, accent: 'from-emerald-500 to-teal-500' },
  { name: 'Pauline', label: 'Launch day', active: false, accent: 'from-sky-500 to-cyan-500' },
  { name: 'Mercy', label: 'Workshop', active: false, accent: 'from-pink-500 to-rose-500' },
]

const circles = [
  {
    title: 'Founders Circle',
    description: 'A thoughtful space for women building businesses, fundraising, and scaling with care.',
    members: '84 members',
    category: 'Entrepreneurship',
  },
  {
    title: 'Career Momentum',
    description: 'Career strategy, interviews, confidence, and leadership conversations for ambitious professionals.',
    members: '61 members',
    category: 'Career Growth',
  },
  {
    title: 'Wellness & Balance',
    description: 'A softer space for reflection, boundaries, healing, and sustainable growth.',
    members: '49 members',
    category: 'Wellbeing',
  },
]

const opportunities = [
  { title: 'Scholarship for Creative Entrepreneurs', type: 'Scholarship', meta: 'Applications open • 4 days left' },
  { title: 'Product Design Internship', type: 'Internship', meta: 'Remote • Hybrid welcome' },
  { title: 'Women in Tech Grant Circle', type: 'Grant', meta: 'Community sponsor • 6 spots left' },
]

export default function CommunityHubSections() {
  const [statsVisible, setStatsVisible] = useState(false)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = statsRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="space-y-8 bg-[#FAFAFC] px-4 py-6 sm:px-6 lg:px-8">
      <section ref={statsRef} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={`rounded-[28px] border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/40 transition-all duration-700 ${statsVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
            style={{ transitionDelay: `${index * 120}ms` }}
          >
            <p className="text-3xl font-semibold tracking-tight text-slate-950">{stat.value}</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">{stat.label}</p>
          </div>
        ))}
      </section>

      <section className="rounded-[32px] border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/40">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-700">Stories</p>
            <p className="mt-1 text-sm text-slate-500">A glimpse into the moments shaping the community.</p>
          </div>
          <button className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-violet-200 hover:text-violet-700">
            View all
          </button>
        </div>
        <div className="mt-6 flex gap-3 overflow-x-auto pb-2">
          {storyItems.map((story) => (
            <button
              key={story.name}
              type="button"
              className={`group min-w-[132px] rounded-[24px] border border-slate-200 p-4 text-left transition duration-200 hover:-translate-y-1 hover:shadow-md ${story.active ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-700 hover:bg-violet-50 hover:text-violet-700'}`}
            >
              <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${story.accent} p-[2px]`}>
                <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-sm font-semibold text-slate-900">
                  {story.name.charAt(0)}
                </div>
              </div>
              <p className="mt-3 text-sm font-semibold">{story.name}</p>
              <p className={`mt-1 text-xs ${story.active ? 'text-slate-300' : 'text-slate-500'}`}>{story.label}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-[32px] border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/40">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-700">Create a Post</p>
            <p className="mt-1 text-sm text-slate-500">Share your win, ask for help, celebrate another woman, or inspire the community.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {[{ label: 'Photo', icon: Camera }, { label: 'Video', icon: Video }, { label: 'Event', icon: CalendarDays }, { label: 'Opportunity', icon: BriefcaseBusiness }, { label: 'Poll', icon: Sparkles }, { label: 'Achievement', icon: Trophy }].map((item) => {
              const Icon = item.icon
              return (
                <button key={item.label} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700">
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.7fr_0.9fr]">
        <div className="space-y-6">
          <div className="rounded-[32px] border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/40">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-700">Suggested Sister Circles</p>
                <p className="mt-1 text-sm text-slate-500">Spaces designed for connection, learning, and momentum.</p>
              </div>
              <Link href="/circles" className="text-sm font-semibold text-violet-700 transition hover:text-violet-800">
                See all
              </Link>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {circles.map((circle) => (
                <div key={circle.title} className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                  <div className="h-24 rounded-[20px] bg-gradient-to-br from-violet-600/80 via-fuchsia-500/80 to-pink-400/80" />
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-slate-900">{circle.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-500">{circle.description}</p>
                    <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
                      <span>{circle.members}</span>
                      <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-violet-700">{circle.category}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/40">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-700">Featured Opportunities</p>
                <p className="mt-1 text-sm text-slate-500">Fresh openings shaped for women building forward.</p>
              </div>
              <Link href="/opportunities" className="text-sm font-semibold text-violet-700 transition hover:text-violet-800">
                View all opportunities
              </Link>
            </div>
            <div className="mt-6 space-y-3">
              {opportunities.map((item) => (
                <div key={item.title} className="flex items-center justify-between gap-3 rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{item.meta}</p>
                  </div>
                  <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-violet-700">
                    {item.type}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/40">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-700">Mentorship</p>
                <p className="mt-1 text-sm text-slate-500">Learn from women who have walked the journey before you.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href="/mentorship" className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
                  Become a Mentor
                  <GraduationCap className="h-4 w-4" />
                </Link>
                <Link href="/mentorship" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:text-violet-700">
                  Find a Mentor
                  <HeartHandshake className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[32px] border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/40">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-700">Upcoming Events</p>
            <div className="mt-5 space-y-3">
              {[
                { title: 'Leadership Lab', date: '12 Aug', place: 'Nairobi' },
                { title: 'Founders Coffee', date: '18 Aug', place: 'Virtual' },
              ].map((event) => (
                <div key={event.title} className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900">{event.title}</p>
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-700">{event.date}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">{event.place}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/40">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-700">Today&apos;s Quote</p>
            <p className="mt-4 text-lg leading-8 text-slate-700">“The strongest women are not the ones who stand alone, but the ones who build, lift, and rise together.”</p>
          </div>

          <div className="rounded-[32px] border border-slate-200/70 bg-gradient-to-br from-violet-700 via-fuchsia-600 to-pink-500 p-6 text-white shadow-[0_25px_70px_-30px_rgba(168,85,247,0.7)]">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-100">Join BIG</p>
            <h2 className="mt-3 text-2xl font-semibold">No Woman Succeeds Alone.</h2>
            <p className="mt-3 text-sm leading-7 text-violet-50">Join thousands of women building independent lives together.</p>
            <Link href="/join" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
              Become a BIG Member
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
