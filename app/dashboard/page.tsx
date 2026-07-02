import type { Metadata } from 'next'
import DashboardShell from '@/components/dashboard/DashboardShell'

export const metadata: Metadata = {
  title: 'Dashboard | BIG',
  description: 'Your member dashboard for BIG community resources, messages, and growth.',
}

export default function DashboardPage() {
  return <DashboardShell />
}
