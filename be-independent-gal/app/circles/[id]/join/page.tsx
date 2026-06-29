import type { Metadata } from 'next'
import { BookOpen, Users, TrendingUp, Heart } from 'lucide-react'
import { CircleJoinForm } from '@/components/circles/circle-join-form'

const circleInfo: Record<
  string,
  {
    icon: typeof BookOpen
    title: string
    subtitle: string
    color: string
  }
> = {
  learn: {
    icon: BookOpen,
    title: 'Learn Circle',
    subtitle: 'Develop knowledge, skills, confidence, and personal growth.',
    color: 'from-blue-600 to-blue-700',
  },
  connect: {
    icon: Users,
    title: 'Connect Circle',
    subtitle: 'Build relationships, mentorship, networks, and meaningful connections.',
    color: 'from-purple-600 to-purple-700',
  },
  earn: {
    icon: TrendingUp,
    title: 'Earn Circle',
    subtitle:
      'Explore business, careers, opportunities, financial literacy, and entrepreneurship.',
    color: 'from-emerald-600 to-emerald-700',
  },
  thrive: {
    icon: Heart,
    title: 'Thrive Circle',
    subtitle:
      'Focus on wellness, purpose, leadership, confidence, and balanced living.',
    color: 'from-rose-600 to-rose-700',
  },
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const circle = circleInfo[id]
  return {
    title: `Join ${circle?.title || 'Sister Circle'}`,
    description: circle?.subtitle || 'Join a Sister Circle and grow with BIG.',
  }
}

export async function generateStaticParams() {
  return [{ id: 'learn' }, { id: 'connect' }, { id: 'earn' }, { id: 'thrive' }]
}

export default async function CircleJoinPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const circle = circleInfo[id]

  if (!circle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Circle not found</h1>
          <a href="/circles" className="text-primary hover:underline">
            Back to circles
          </a>
        </div>
      </div>
    )
  }

  const Icon = circle.icon

  return (
    <div className="min-h-screen bg-background">
      {/* Hero header */}
      <div className={`bg-gradient-to-r ${circle.color} py-16 text-white`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <Icon className="h-12 w-12" />
          </div>
          <h1 className="font-heading text-4xl font-extrabold mb-4">
            {circle.title}
          </h1>
          <p className="text-xl text-white/90">{circle.subtitle}</p>
        </div>
      </div>

      {/* Form section */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="font-heading text-3xl font-extrabold text-secondary mb-4">
              Welcome! Let's Get Started
            </h2>
            <p className="text-muted-foreground">
              Complete your profile to join the community. This helps other sisters get to know
              you and find meaningful ways to connect.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-8">
            <CircleJoinForm circleId={id} />
          </div>
        </div>
      </section>
    </div>
  )
}
