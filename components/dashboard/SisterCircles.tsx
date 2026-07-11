'use client'

import Link from 'next/link'
import { Circle, ShieldCheck, Sparkles } from 'lucide-react'
import { CirclesSkeleton } from '@/components/ui/skeleton-loaders'
import { useDashboardLoader } from '@/lib/hooks/use-dashboard-loader'

export default function SisterCircles() {
  const { data, loading } = useDashboardLoader()
  const circles = data?.circles || []

  if (loading) return <CirclesSkeleton />

  return (
    <section className="rounded-[20px] bg-white p-5 shadow-sm border border-slate-200">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold">Circles</p>
          <p className="mt-2 text-sm text-slate-600">Your community spaces for connection and growth.</p>
        </div>
        <Link href="/circles" className="text-sm font-semibold text-violet-600 hover:text-violet-700">
          Discover
        </Link>
      </div>

      <div className="mt-5 space-y-4">
        {circles.length === 0 ? (
          <div className="rounded-[20px] bg-violet-50 p-5 text-sm text-slate-700">
            You are not in any circles yet.{' '}
            <Link href="/circles" className="font-semibold text-violet-700 hover:underline">
              Join your first community
            </Link>
            .
          </div>
        ) : (
          circles.map((circle: any) => (
            <div key={circle.id} className="rounded-[20px] border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-slate-950">{circle.name}</p>
                  <p className="mt-1 text-sm text-slate-600">{circle.description || 'Circle community'}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2 py-1 shadow-sm">
                      <ShieldCheck className="h-3.5 w-3.5" /> Members online 4
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2 py-1 shadow-sm">
                      <Sparkles className="h-3.5 w-3.5" /> Last activity 2h ago
                    </span>
                  </div>
                </div>
                <Link href={`/circles/${circle.id}/dashboard`} className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700">
                  <Circle className="h-4 w-4" /> Open
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
