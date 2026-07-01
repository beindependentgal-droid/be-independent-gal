import type { Metadata } from 'next'
import DirectoryClient from './directory-client'

export const metadata: Metadata = {
  title: 'Directory | BIG',
  description:
    'Search and connect with sisters, find mentors, and build relationships across the BIG community.',
  openGraph: {
    title: 'Member Directory | BIG',
    description: 'Connect with women entrepreneurs and professionals',
    images: ['/og-image.jpg'],
  },
}

export default function DirectoryPage() {
  return <DirectoryClient />
}