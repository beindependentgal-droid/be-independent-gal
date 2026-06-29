'use client'

import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  BookOpen,
  Users,
  Briefcase,
  Leaf,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
} from 'lucide-react'
import { SectionHeading } from '@/components/section-heading'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

const journeySteps = [
  {
    icon: BookOpen,
    title: 'Learn',
    description: 'Gain practical skills through the BIG Academy, workshops, mentorship, and live sessions designed to help you grow personally and professionally.',
    color: '#5B21B6',
  },
  {
    icon: Users,
    title: 'Connect',
    description: 'Meet women who share your ambitions. Build genuine friendships, find mentors, discover collaborators, and expand your network.',
    color: '#3B82F6',
  },
  {
    icon: Briefcase,
    title: 'Earn',
    description: 'Turn your knowledge and connections into opportunities. Grow your business, discover careers, find clients, collaborate with members, and build financial independence.',
    color: '#22C55E',
  },
  {
    icon: Leaf,
    title: 'Thrive',
    description: 'Success is more meaningful when it\'s shared. Continue growing while inspiring and empowering other women to rise alongside you.',
    color: '#EC4899',
  },
]

const benefits = [
  'Access to the BIG Community',
  'Sister Circles',
  'BIG Academy',
  'Girl Talk Friday',
  'Networking Events',
  'Retreats & Experiences',
  'Member Directory',
  'Business Opportunities',
  'Mentorship',
  'Exclusive Resources',
  'Community Challenges',
  'Future Marketplace Access',
]

const memberTypes = [
  {
    title: 'Student',
    description: 'Build confidence, skills, friendships, and career opportunities.',
  },
  {
    title: 'Entrepreneur',
    description: 'Learn, promote your business, collaborate, and grow your network.',
  },
  {
    title: 'Professional',
    description: 'Develop leadership skills, expand your network, and connect with like-minded women.',
  },
  {
    title: 'Creative',
    description: 'Share your work, collaborate with others, and discover opportunities.',
  },
  {
    title: 'Community Builder',
    description: 'Lead, mentor, volunteer, and inspire other women.',
  },
]

const journeyStages = [
  'Create your BIG account.',
  'Complete your profile.',
  'Meet other members.',
  'Join conversations.',
  'Explore the Academy.',
  'Attend your first event.',
  'Become part of a Sister Circle when you\'re ready.',
  'Learn. Connect. Earn. Thrive.',
]

const faqs = [
  {
    question: 'Is BIG free to join?',
    answer: 'Yes. Creating a BIG account and becoming part of the community is completely free.',
  },
  {
    question: 'Do I need to own a business?',
    answer: 'No. BIG welcomes students, professionals, entrepreneurs, creatives, job seekers, and women from all walks of life.',
  },
  {
    question: 'Can I join from outside Kenya?',
    answer: 'Absolutely. BIG is building a global community while remaining proudly rooted in Africa.',
  },
  {
    question: 'When do I join a Sister Circle?',
    answer: 'You don\'t need to choose one immediately. Explore the community first, meet other members, and join a Sister Circle whenever you feel ready.',
  },
  {
    question: 'Is there an age limit?',
    answer: 'BIG welcomes women aged 18 and above.',
  },
]

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="border-b border-slate-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-6 text-left"
      >
        <h3 className="font-heading text-lg font-semibold text-slate-900">{question}</h3>
        <ChevronDown
          className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          style={{ color: '#5B21B6' }}
        />
      </button>
      {isOpen && (
        <p className="pb-6 text-base leading-relaxed text-muted-foreground">{answer}</p>
      )}
    </div>
  )
}

export default function JoinPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[70vh] sm:min-h-[80vh] overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(91,33,182,0.08),rgba(236,72,153,0.08))]" />
        <div className="relative mx-auto flex min-h-[70vh] sm:min-h-[80vh] max-w-5xl flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8">
          <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs sm:text-sm font-semibold uppercase tracking-[0.24em] text-primary backdrop-blur-md">
            ✨ Welcome to the BIG Movement
          </span>
          <h1 className="mt-8 max-w-4xl text-3xl font-black uppercase tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Your Journey Starts Here.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-700 sm:text-lg">
            You're not just joining another community. You're becoming part of a movement of ambitious women who believe in learning, building meaningful relationships, creating opportunities, and thriving together.
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-700 sm:text-lg">
            Whether you're a student, entrepreneur, professional, creative, or simply looking for a place where you belong, BIG is your home.
          </p>
          <div className="mt-10 flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button asChild className="rounded-full px-8 font-semibold">
              <Link href="/auth/sign-up">Become a BIG Member</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-full border-slate-300 bg-white/50 px-8 font-semibold hover:bg-white"
            >
              <Link href="#benefits">Explore the Community</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Join BIG */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-slate-200/70 bg-gradient-to-br from-purple-50/50 to-pink-50/50 p-8 sm:p-12 text-center shadow-sm">
            <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 sm:text-4xl">
              Why Join BIG?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-700 sm:text-lg">
              At BIG, we believe that independence isn't achieved alone. It's built through knowledge, relationships, opportunities, and the courage to keep growing.
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-700 sm:text-lg">
              When you become a member, you're joining women who inspire one another, celebrate each other's wins, and create opportunities together.
            </p>
          </div>
        </div>
      </section>

      {/* The BIG Journey */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Our Four Pillars"
            title="The BIG Journey"
            subtitle="Learn, Connect, Earn, and Thrive together"
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {journeySteps.map((step) => {
              const Icon = step.icon
              return (
                <div
                  key={step.title}
                  className="rounded-[2rem] border border-slate-200/70 bg-white p-6 shadow-[0_22px_60px_-28px_rgba(15,23,42,0.1)] transition duration-300 hover:-translate-y-1 hover:bg-[#f8f5ff] hover:shadow-[0_24px_70px_-28px_rgba(15,23,42,0.14)]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-pink-100">
                    <Icon className="h-6 w-6" style={{ color: step.color }} />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-slate-900">{step.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">{step.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Membership Benefits */}
      <section id="benefits" className="py-16 sm:py-20 bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="What You Get"
            title="Your BIG Membership Includes"
            subtitle="Everything you need to learn, connect, earn, and thrive"
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-start gap-4">
                <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-primary" />
                <span className="text-base leading-relaxed text-slate-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Find Your Place */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Multiple Paths"
            title="Find Your Place"
            subtitle="No matter where you are in your journey, there's a place for you"
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {memberTypes.map((type) => (
              <div
                key={type.title}
                className="rounded-[2rem] border border-slate-200/70 bg-white p-6 text-center shadow-[0_22px_60px_-28px_rgba(15,23,42,0.1)] transition duration-300 hover:-translate-y-1 hover:bg-[#f8f5ff] hover:shadow-[0_24px_70px_-28px_rgba(15,23,42,0.14)]"
              >
                <h3 className="font-heading text-xl font-bold uppercase tracking-tight text-primary">
                  {type.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">{type.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Happens After You Join */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Next Steps"
            title="What Happens After You Join?"
          />
          <div className="mt-12 space-y-4">
            {journeyStages.map((stage, index) => (
              <div
                key={index}
                className="flex items-start gap-4 rounded-lg border-l-4 border-primary bg-white p-4"
              >
                <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary font-semibold text-white">
                  {index + 1}
                </div>
                <p className="text-base text-slate-700">{stage}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Questions"
            title="Frequently Asked Questions"
            subtitle="Everything you need to know about joining BIG"
          />
          <div className="mt-12 rounded-[2rem] border border-slate-200/70 bg-white p-6 sm:p-8">
            <div className="space-y-0">
              {faqs.map((faq, index) => (
                <FAQItem key={index} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-primary to-secondary">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black uppercase tracking-tight text-white sm:text-4xl lg:text-5xl">
            Ready to Begin?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/90 sm:text-lg">
            Every great journey begins with one decision. Today could be yours.
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-white/90 sm:text-lg">
            Become a BIG Member and discover what becomes possible when women learn together, connect intentionally, create opportunities, and thrive collectively.
          </p>
          <div className="mt-10">
            <Button
              asChild
              className="rounded-full bg-white px-8 font-semibold text-primary hover:bg-white/90"
            >
              <Link href="/auth/sign-up">Become a BIG Member</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
