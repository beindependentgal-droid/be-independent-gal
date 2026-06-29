import type { Metadata } from 'next'
import DirectoryClient from './directory-client'

export const metadata: Metadata = {
  title: 'Directory | Be Independent Gal',
  description: 'Search and connect with sisters, mentors, and professionals across the BIG community.',
}

export default function DirectoryPage() {
  return <DirectoryClient />
}
