'use client'

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
    description:
      'Gain practical skills through the BIG Academy, workshops, mentorship, and live sessions designed to help you grow personally and professionally.',
    color: 'from-primary to-primary',
  },
  {
    icon: Users,
    title: 'Connect',
    description:
      'Meet women who share your ambitions. Build genuine friendships, find mentors, discover collaborators, and expand your network.',
    color: 'from-blue-600 to-blue-800',
  },
  {
    icon: Briefcase,
    title: 'Earn',
    description:
      'Turn your knowledge and connections into opportunities. Grow your business, discover careers, find clients, collaborate with members, and build financial independence.',
    color: 'from-emerald-600 to-emerald-800',
  },
  {
    icon: Leaf,
    title: 'Thrive',
    description:
      'Success is more meaningful when it\'s shared. Continue growing while inspiring and empowering other women to rise alongside you.',
    color: 'from-rose-600 to-rose-800',
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
    emoji: '🎓',
  },
  {
    title: 'Entrepreneur',
    description: 'Learn, promote your business, collaborate, and grow your network.',
    emoji: '👩‍💼',
  },
  {
    title: 'Professional',
    description: 'Develop leadership skills, expand your network, and connect with like-minded women.',
    emoji: '💼',
  },
  {
    title: 'Creative',
    description: 'Share your work, collaborate with others, and discover opportunities.',
    emoji: '🎨',
  },
  {
    title: 'Community Builder',
    description: 'Lead, mentor, volunteer, and inspire other women.',
    emoji: '🤝',
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
    answer:
      'No. BIG welcomes students, professionals, entrepreneurs, creatives, job seekers, and women from all walks of life.',
  },
  {
    question: 'Can I join from outside Kenya?',
    answer:
      'Absolutely. BIG is building a global community while remaining proudly rooted in Africa.',
  },
  {
    question: 'When do I join a Sister Circle?',
    answer:
      'You don\'t need to choose one immediately. Explore the community first, meet other members, and join a Sister Circle whenever you feel ready.',
  },
  {
    question: 'Is there an age limit?',
    answer: 'BIG welcomes women aged 18 and above.',
  },
]

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="w-full text-left border-b border-gray-200 py-6 hover:bg-gray-50 px-6 transition-colors group"
    >
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-bold text-gray-900 group-hover:text-pink-600 transition-colors">
          {question}
        </h4>
        <ChevronDown
          className={`w-5 h-5 text-gray-600 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </div>

      {isOpen && <p className="text-gray-600 mt-4 leading-relaxed">{answer}</p>}
    </button>
  )
}

export default function JoinPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-white py-20 px-6 sm:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <div className="text-5xl mb-4">✨</div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
            Welcome to the BIG Movement
          </h1>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-700">
            Your Journey Starts Here.
          </h2>

          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            You're not just joining another community. You're becoming part of a movement of ambitious women who
            believe in learning, building meaningful relationships, creating opportunities, and thriving together.
          </p>

          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Whether you're a student, entrepreneur, professional, creative, or simply looking for a place where you
            belong, <span className="font-bold">BIG is your home.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link href="/auth/sign-up">
              <Button className="bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-full h-14 px-8 flex items-center gap-2 w-full sm:w-auto justify-center">
                Become a BIG Member
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>

            <Link href="/circles">
              <Button
                variant="outline"
                className="border-2 border-pink-500 text-pink-600 hover:bg-pink-50 font-bold rounded-full h-14 px-8 w-full sm:w-auto"
              >
                Explore the Community
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Join BIG */}
      <section className="py-20 bg-white px-6 sm:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            title="Why Join BIG?"
            subtitle="Build independence together"
            description="At BIG, we believe that independence isn't achieved alone. It's built through knowledge, relationships, opportunities, and the courage to keep growing."
          />

          <div className="mt-12 bg-white rounded-3xl p-12 border border-border">
            <p className="text-xl text-gray-800 leading-relaxed">
              When you become a member, you're joining women who <span className="font-bold">inspire one another</span>,{' '}
              <span className="font-bold">celebrate each other's wins</span>, and{' '}
              <span className="font-bold">create opportunities together.</span>
            </p>
          </div>
        </div>
      </section>

      {/* The BIG Journey */}
      <section className="py-20 bg-gray-50 px-6 sm:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            title="The BIG Journey"
            subtitle="Learn. Connect. Earn. Thrive."
            description="Your growth happens in four powerful dimensions"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {journeySteps.map((step, idx) => {
              const Icon = step.icon
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-pink-300 transition-all"
                >
                  <div className={`bg-gradient-to-r ${step.color} p-8 text-white h-32 flex items-center justify-center`}>
                    <Icon className="w-16 h-16" />
                  </div>

                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Membership Benefits */}
      <section className="py-20 bg-white px-6 sm:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <SectionHeading title="What's Included" subtitle="Everything you need to grow" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {benefits.map((benefit, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 p-4 rounded-lg hover:bg-pink-50 transition-colors"
              >
                <CheckCircle2 className="w-6 h-6 text-pink-500 flex-shrink-0" />
                <span className="font-medium text-gray-800">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Find Your Place */}
      <section className="py-20 bg-gray-50 px-6 sm:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            title="Find Your Place in BIG"
            subtitle="No matter who you are, there's a home for you here"
            description="BIG welcomes women from all backgrounds and life stages"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mt-12">
            {memberTypes.map((type, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-gray-200 p-8 text-center hover:border-pink-300 hover:shadow-lg transition-all"
              >
                <div className="text-5xl mb-4">{type.emoji}</div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{type.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{type.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Happens After You Join */}
      <section className="py-20 bg-white px-6 sm:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            title="Your First Steps"
            subtitle="From day one to thriving"
            description="Here's what your BIG journey looks like"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            {journeyStages.map((stage, idx) => (
              <div
                key={idx}
                className="flex items-start gap-6 p-6 bg-white rounded-2xl border border-border hover:border-primary-400 transition-colors"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold text-lg">
                  {idx + 1}
                </div>
                <div className="pt-1">
                  <p className="font-semibold text-gray-900">{stage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50 px-6 sm:px-12 lg:px-16">
        <div className="max-w-4xl mx-auto">
          <SectionHeading
            title="Frequently Asked Questions"
            subtitle="Everything you need to know"
            description="Have questions? We've got answers."
          />

          <div className="mt-12 bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {faqs.map((faq, idx) => (
              <FAQItem key={idx} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-primary text-white py-20 px-6 sm:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto text-center space-y-8">
          <h2 className="text-4xl sm:text-5xl font-bold">Ready to Begin?</h2>

          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Every great journey begins with one decision. Today could be yours.
          </p>

          <p className="text-lg text-white/80 max-w-3xl mx-auto">
            Become a BIG Member and discover what becomes possible when women learn together, connect intentionally,
            create opportunities, and thrive collectively.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link href="/auth/sign-up">
              <Button className="bg-white text-pink-600 hover:bg-gray-100 font-bold rounded-full h-12 px-12 flex items-center gap-2 w-full sm:w-auto justify-center">
                Become a BIG Member
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/circles">
              <Button
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 font-bold rounded-full h-12 px-12 w-full sm:w-auto"
              >
                Explore Circles
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}