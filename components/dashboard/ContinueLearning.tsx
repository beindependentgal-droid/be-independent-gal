'use client'

import Link from 'next/link'
import { WidgetSkeleton } from '@/components/ui/skeleton-loaders'
import { useDashboardLoader } from '@/lib/hooks/use-dashboard-loader'

export default function ContinueLearning() {
  const { data, loading } = useDashboardLoader()
  const course = data?.course

  if (loading) return <WidgetSkeleton />

  if (!course) {
    return (
      <div className="rounded-xl bg-white p-4 shadow-sm border">
        <p className="text-sm font-semibold">Continue learning</p>
        <p className="mt-2 text-sm text-slate-600">
          No active course.{' '}
          <Link href="/academy" className="text-secondary font-medium hover:underline">
            Explore Academy
          </Link>
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm border">
      <p className="text-sm font-semibold">Continue learning</p>
      <h3 className="mt-2 font-semibold">{course.courses?.title || 'Course'}</h3>
      <div className="mt-3 h-2 w-full bg-slate-100 rounded-full">
        <div
          style={{ width: `${Math.round((course.progress || 0) * 100)}%` }}
          className="h-2 bg-secondary rounded-full transition-all"
        />
      </div>
      <div className="mt-3 flex items-center gap-3">
        <Link
          href={`/academy/${course.course_id}`}
          className="rounded-full bg-secondary text-white px-4 py-2 text-sm hover:opacity-90 transition"
        >
          Resume Learning
        </Link>
        <Link href="/academy" className="text-sm text-slate-600 hover:text-slate-900">
          Browse courses
        </Link>
      </div>
    </div>
  )
}
