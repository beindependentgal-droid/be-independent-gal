import type { Metadata } from 'next'
import CommunityFeed from '@/components/community/community-feed'

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
    <main className="bg-[#FAFAFC]">
      <CommunityFeed />
    </main>
  )
}
