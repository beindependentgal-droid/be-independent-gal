import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  BookOpen,
  Users,
  TrendingUp,
  Heart,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CircleJoinForm } from '@/components/circles/circle-join-form'

// Define circleInfo outside the component for reusability and SSR
const circleInfo: Record<
  string,
  {
    title: string
    subtitle: string
    description: string
    icon: React.ElementType
    color: string
    benefits: string[]
    image: string
  }
> = {
  learn: {
    title: 'Learn Circle',
    subtitle: 'Develop knowledge, skills, and confidence',
    description:
      'Master new abilities and unlock your potential with sisters who inspire and support your growth journey.',
    icon: BookOpen,
    color: 'from-blue-600 to-blue-800',
    benefits: [
      'Access to BIG Academy courses',
      'Monthly workshops and masterclasses',
      'Mentorship from experienced sisters',
      'Book club and learning resources',
      'Skill-building challenges',
      'Networking with learners',
    ],
    image: '/images/circle-learn.jpg',
  },
  connect: {
    title: 'Connect Circle',
    subtitle: 'Build relationships and meaningful connections',
    description:
      'Find your tribe, cultivate genuine friendships, and expand your network with women who understand your journey.',
    icon: Users,
    color: 'from-primary to-primary',
    benefits: [
      'Monthly sisterhood meetups',
      'One-on-one mentorship matching',
      'Networking events and socials',
      'Online community forum',
      'Discussion groups',
      'Accountability partners',
    ],
    image: '/images/circle-connect.jpg',
  },
  earn: {
    title: 'Earn Circle',
    subtitle: 'Explore opportunities and financial growth',
    description:
      'Build wealth, discover business opportunities, and achieve financial independence together with entrepreneurial sisters.',
    icon: TrendingUp,
    color: 'from-emerald-600 to-emerald-800',
    benefits: [
      'Business opportunity board',
      'Financial literacy workshops',
      'Entrepreneurship mentorship',
      'Client/customer sharing',
      'Investment club access',
      'Career advancement resources',
    ],
    image: '/images/circle-earn.jpg',
  },
  thrive: {
    title: 'Thrive Circle',
    subtitle: 'Focus on wellness and balanced living',
    description:
      'Become your best self by prioritizing wellness, purpose, and leadership while inspiring others to rise alongside you.',
    icon: Heart,
    color: 'from-rose-600 to-rose-800',
    benefits: [
      'Wellness challenges and programs',
      'Mental health resources',
      'Leadership development',
      'Mindfulness and yoga sessions',
      'Purpose-finding workshops',
      'Self-care community',
    ],
    image: '/images/circle-thrive.jpg',
  },
}

export const dynamic = 'force-dynamic' // Ensure dynamic rendering for params

export async function generateMetadata({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> {
  const { id } = params
  const circle = circleInfo[id]

  return {
    title: `Join ${circle?.title || 'Sister Circle'} | BIG`,
    description: circle?.subtitle || 'Join a Sister Circle and grow with BIG.',
    openGraph: {
      title: `Join ${circle?.title || 'Sister Circle'}`,
      description: circle?.subtitle,
      images: [circle?.image || '/images/og-default.jpg'],
    },
  }
}

// Statically generate pages for known circle IDs
export async function generateStaticParams() {
  return [
    { id: 'learn' },
    { id: 'connect' },
    { id: 'earn' },
    { id: 'thrive' },
  ]
}

export default async function CircleJoinPage({
  params,
}: {
  params: { id: string }
}) {
  const { id } = params
  const circle = circleInfo[id]

  if (!circle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-6">
        <div className="text-center space-y-6 max-w-md">
          <div className="text-5xl">🔍</div>
          <h1 className="text-3xl font-bold text-gray-900">Circle not found</h1>
          <p className="text-gray-600">
            The circle you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/circles">
            <Button className="bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-full h-12 px-8">
              Back to Circles
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const Icon = circle.icon

  return (
    <div className="min-h-screen bg-white">
      {/* Hero header */}
      <div className={`bg-gradient-to-r ${circle.color} text-white py-20 px-6 sm:px-12 lg:px-16`}>
        <div className="max-w-6xl mx-auto">
          <Link
            href="/circles"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 font-medium"
          >
            ← Back to circles
          </Link>

          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center">
              <Icon className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-5xl font-bold mb-2">{circle.title}</h1>
              <p className="text-xl text-white/90">{circle.subtitle}</p>
            </div>
          </div>

          <p className="text-lg text-white/80 max-w-2xl">{circle.description}</p>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto py-16 px-6 sm:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left side - Benefits */}
          <div className="lg:col-span-2">
            {/* Circle image */}
            <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-xl mb-12">
              <FallbackImage
                src={circle.image}
                alt={circle.title}
                fill
                className="object-cover"
                fallbackSrc="/images/circle-placeholder.jpg"
              />
            </div>

            {/* Benefits section */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">What You'll Get</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {circle.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r ${circle.color} flex items-center justify-center text-white font-bold text-sm`}>
                      ✓
                    </div>
                    <p className="text-gray-700 font-medium pt-0.5">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Why join section */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Join This Circle?</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <span className="text-2xl">👯</span>
                  <div>
                    <p className="font-bold text-gray-900 mb-1">Connect with Like-Minded Women</p>
                    <p className="text-gray-600">
                      Meet sisters who share your goals and understand your journey in a supportive, non-judgmental space.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="text-2xl">📈</span>
                  <div>
                    <p className="font-bold text-gray-900 mb-1">Accelerate Your Growth</p>
                    <p className="text-gray-600">
                      Benefit from shared knowledge, resources, and mentorship that help you reach your goals faster.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="text-2xl">🎁</span>
                  <div>
                    <p className="font-bold text-gray-900 mb-1">Exclusive Opportunities</p>
                    <p className="text-gray-600">
                      Access circle-specific events, challenges, resources, and partnerships unavailable to non-members.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Join form */}
          <div className="lg:col-span-1">
            <div className="bg-white border-2 border-gray-200 rounded-3xl p-8 sticky top-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready to Join?</h3>
              <p className="text-gray-600 mb-8">
                Complete your profile to join the community. This helps other sisters get to know
                you and find meaningful ways to connect.
              </p>

              <CircleJoinForm circleId={id} circleName={circle.title} />

              <div className="mt-8 pt-8 border-t border-gray-200 space-y-4">
                <div className="flex gap-3">
                  <span className="text-sm font-medium text-gray-600">Questions?</span>
                </div>
                <p className="text-xs text-gray-500">
                  You can always update your circle membership in your profile settings.
                </p>
                <Link href="/faq">
                  <Button variant="outline" className="w-full rounded-full h-10 text-sm">
                    Read FAQ
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social proof section */}
      <section className="bg-gray-50 py-16 px-6 sm:px-12 lg:px-16 mt-12">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Join thousands of sisters already thriving
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah M.',
                role: 'Founder',
                text: 'This circle changed my entrepreneurial journey. The support and opportunities are unmatched.',
              },
              {
                name: 'Amina K.',
                role: 'Professional',
                text: 'I found mentors, friends, and the confidence to take the next step in my career.',
              },
              {
                name: 'Grace W.',
                role: 'Student',
                text: 'As a young woman starting out, having this community has been invaluable to my growth.',
              },
            ].map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-pink-300 hover:shadow-lg transition-all"
              >
                <div className="flex gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span key={i} className="text-yellow-400">
                      ⭐
                    </span>
                  ))}
                </div>
                <p className="text-gray-600 italic mb-4">"{testimonial.text}"</p>
                <div>
                  <p className="font-bold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Other circles CTA */}
      <section className="py-16 px-6 sm:px-12 lg:px-16 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Explore Other Circles</h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            You can be part of multiple circles. Explore other communities that align with your goals.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            {Object.entries(circleInfo)
              .filter(([key]) => key !== id)
              .map(([key, circ]) => (
                <Link key={key} href={`/circles/join/${key}`}>
                  <Button variant="outline" className="rounded-full h-12 px-8 font-medium">
                    {circ.title}
                  </Button>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </div>
  )
}
