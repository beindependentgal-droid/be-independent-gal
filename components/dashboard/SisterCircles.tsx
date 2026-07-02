'use client'

import Link from 'next/link'
import { CirclesSkeleton } from '@/components/ui/skeleton-loaders'
import { useDashboardLoader } from '@/lib/hooks/use-dashboard-loader'

export default function SisterCircles() {
  const { data, loading } = useDashboardLoader()
  const circles = data?.circles || []

  if (loading) return <CirclesSkeleton />

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm border">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Sister circles</p>
        <Link href="/circles" className="text-sm text-slate-600 hover:text-slate-900">
          Discover
        </Link>
      </div>
      <div className="mt-3 space-y-3">
        {circles.length === 0 && (
          <p className="text-sm text-slate-500">
            You are not in any circles yet.{' '}
            <Link href="/circles" className="text-secondary font-medium hover:underline">
              Discover circles
            </Link>
          </p>
        )}
        {circles.map((c: any) => (
          <div key={c.id} className="flex items-center justify-between">
            <div>
              <p className="font-medium">{c.name}</p>
              <p className="text-sm text-slate-600">{c.description || 'Circle'}</p>
            </div>
            <Link href={`/circles/${c.id}/dashboard`} className="text-sm text-secondary hover:underline">
              Open
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
