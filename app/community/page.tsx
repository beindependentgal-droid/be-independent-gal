import type { Metadata } from 'next'
import CommunityFeed from '@/components/community/community-feed'
import { PageHero } from '@/components/page-hero'

export const metadata: Metadata = {
  title: 'Community | BIG',
  description:
    'Join the BIG community hub for stories, conversations, events, mentorship, and connection with women who are building independent lives.',
  openGraph: {
    title: 'Community Hub | BIG',
    description: 'Connect and grow with the BIG community',
    images: ['/og-image.jpg'],
  },
}

export const dynamic = 'force-dynamic'

export default function CommunityPage() {
  return (
    <>
      {/* Hero Section */}
      <PageHero
        title="Community Hub"
        subtitle="Connect, learn, and grow together"
        description="Join thousands of women in our vibrant community. Share your journey, find inspiration, and build meaningful connections."
        cta1={{ text: 'Create a Post', href: '/community/create-post' }}
        cta2={{ text: 'Explore Circles', href: '/circles' }}
        imageSrc="/images/community-hero.jpg"
      />

      {/* Community Feed */}
      <section className="py-20 bg-white px-6 sm:px-12 lg:px-16">
        <CommunityFeed />
      </section>
    </>
  )
}
