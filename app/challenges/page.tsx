import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getActiveChallenges } from '@/app/actions/gamification-actions'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PageHero } from '@/components/page-hero'
import { SectionHeading } from '@/components/section-heading'
import FallbackImage from '@/components/ui/fallback-image'
import { CalendarDays, Star, Trophy, ArrowRight } from 'lucide-react'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Challenges | BIG',
  description:
    'Take on community challenges to earn points, gain badges, and level up with Be Independent Gal. Personal growth and fun!',
  openGraph: {
    title: 'Challenges | BIG',
    description: 'Earn points and badges with exciting community challenges.',
    images: ['/og-image.jpg'],
  },
}

// Helper function to format date for display
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

// Component to display challenge cards
interface ChallengeCardProps {
  challenge: {
    id: string
    title: string
    description?: string
    image_url?: string
    difficulty: 'easy' | 'medium' | 'hard'
    points_reward: number
    end_date: string
    circle_name?: string
    status: 'active' | 'upcoming' | 'completed'
  }
}

function ChallengeCard({ challenge }: ChallengeCardProps) {
  const daysLeft = Math.ceil(
    (new Date(challenge.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  )

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'hard':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Link href={`/challenges/${challenge.id}`}>
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-secondary- hover:shadow-xl transition-all h-full flex flex-col">
        {/* Image */}
        {challenge.image_url && (
          <div className="relative aspect-video overflow-hidden bg-gray-300">
            <FallbackImage
              src={challenge.image_url}
              alt={challenge.title}
              fill
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              fallbackSrc="/images/challenge-placeholder.jpg"
            />
            <div className="absolute top-4 right-4">
              <Badge className="bg-purple-600 text-white font-bold">
                {challenge.status === 'active' ? 'Active' : 'Upcoming'}
              </Badge>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6 flex flex-col flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-secondary- transition-colors line-clamp-2">
            {challenge.title}
          </h3>

          {challenge.description && (
            <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
              {challenge.description}
            </p>
          )}

          {/* Details */}
          <div className="space-y-3 mb-6 flex-1">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Star className="w-4 h-4 text-secondary-" />
              <span>
                Difficulty:{' '}
                <span
                  className={`capitalize px-2 py-0.5 rounded-full text-xs font-semibold ${getDifficultyColor(challenge.difficulty)}`}
                >
                  {challenge.difficulty}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Trophy className="w-4 h-4 text-secondary-" />
              <span>{challenge.points_reward} Points Reward</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CalendarDays className="w-4 h-4 text-secondary-" />
              <span>
                {daysLeft > 0 ? `${daysLeft} days left` : 'Ended ' + formatDate(challenge.end_date)}
              </span>
            </div>
          </div>

          {/* Circle Name */}
          {challenge.circle_name && (
            <div className="mb-4">
              <Badge className="bg-blue-100 text-blue-700 font-bold">
                {challenge.circle_name} Circle
              </Badge>
            </div>
          )}

          {/* CTA */}
          <Button className="w-full bg-secondary- hover:bg-secondary- text-white font-bold rounded-full h-10 flex items-center justify-center gap-2">
            {challenge.status === 'active' ? 'Join Challenge' : 'View Challenge'}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Link>
  )
}

// Main ChallengesPage component
export default async function ChallengesPage() {
  const challenges = await getActiveChallenges()

  return (
    <>
      {/* Hero */}
      <PageHero
        title="Community Challenges"
        subtitle="Earn points, gain badges, and level up!"
        description="Take on exciting challenges designed to boost your skills, creativity, and connection within the BIG community. Compete, grow, and have fun!"
        cta1={{ text: 'View Leaderboard', href: '/leaderboard' }}
        cta2={{ text: 'How it Works', href: '#how-it-works' }}
        imageSrc="/images/challenges-hero.jpg"
      />

      {/* Main Challenges Section */}
      <section className="py-20 bg-gray-50 px-6 sm:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            title="Active Challenges"
            subtitle="Push your limits, earn rewards"
            description="Browse our current challenges and join the fun!"
          />

          {challenges.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 mt-12">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No active challenges right now
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Check back soon for new opportunities to earn points and grow!
              </p>
              <Link href="/community">
                <Button className="bg-secondary- hover:bg-secondary- text-white font-bold rounded-full h-12 px-8">
                  Go to Community
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              {challenges.map((challenge) => (
                <ChallengeCard key={challenge.id} challenge={challenge} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 bg-white px-6 sm:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            title="How Challenges Work"
            subtitle="Your path to growth and rewards"
            description="Simple steps to participate and succeed in BIG community challenges"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {[
              {
                num: '1',
                title: 'Discover',
                desc: 'Browse active challenges that align with your interests or circle.',
              },
              {
                num: '2',
                title: 'Join',
                desc: 'Click "Join Challenge" and review the specific requirements and timeline.',
              },
              {
                num: '3',
                title: 'Complete',
                desc: 'Engage with tasks, submit your progress, and interact with fellow participants.',
              },
              {
                num: '4',
                title: 'Earn',
                desc: 'Receive points, badges, and recognition upon successful completion.',
              },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8 h-full text-center">
                  {/* Step number */}
                  <div className="w-14 h-14 rounded-full bg-secondary- text-white flex items-center justify-center font-bold text-2xl mx-auto mb-4">
                    {item.num}
                  </div>

                  {/* Content */}
                  <h4 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </div>

                {/* Arrow connector */}
                {idx < 3 && (
                  <div className="hidden md:flex absolute -right-3 top-1/2 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-6 h-6 text-secondary-" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leaderboard CTA */}
      <section className="py-20 bg-gray-50 px-6 sm:px-12 lg:px-16 border-t border-gray-200">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to climb the ranks?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            See how you stack up against other sisters in the BIG community on our dynamic leaderboard.
          </p>
          <Link href="/leaderboard">
            <Button className="bg-secondary- hover:bg-secondary- text-white font-bold rounded-full h-12 px-8">
              View Leaderboard
            </Button>
          </Link>
        </div>
      </section>
    </>
  )
}