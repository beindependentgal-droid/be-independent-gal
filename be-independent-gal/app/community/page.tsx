import type { Metadata } from 'next'

import CommunityFeed from '@/components/community/community-feed'

export const metadata: Metadata = {
  title: 'Community | Be Independent Gal',
  description:
    'Join the BIG community hub for stories, conversations, events, mentorship, and connection with women who are building independent lives.',
}

export default function CommunityPage() {
  return <CommunityFeed />
}
