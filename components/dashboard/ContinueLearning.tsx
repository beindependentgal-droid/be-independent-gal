'use client'

import Image from 'next/image'
import Link from 'next/link'
import { WidgetSkeleton } from '@/components/ui/skeleton-loaders'
import { useDashboardLoader } from '@/lib/hooks/use-dashboard-loader'

export default function ContinueLearning() {
  const { data, loading } = useDashboardLoader()
  const course = data?.course

  if (loading) return <WidgetSkeleton />

  if (!course) {
    return (
      <div className="rounded-[20px] bg-white p-5 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold">Continue learning</p>
            <p className="mt-2 text-sm text-slate-600">No course yet? Explore BIG Academy and start a learning streak.</p>
          </div>
          <div className="rounded-3xl bg-violet-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-violet-700">Explore</div>
        </div>

        <div className="mt-6 rounded-[20px] bg-slate-50 p-6 text-center text-slate-600">
          <p className="text-sm font-semibold">Discover your next course</p>
          <p className="mt-2 text-sm">Start learning with tailored recommendations for your goals.</p>
        </div>

        <Link href="/academy" className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-700">
          Explore BIG Academy
        </Link>
      </div>
    )
  }

  return (
    <div className="rounded-[20px] bg-white p-5 shadow-sm border border-slate-200">
      <div className="flex items-start gap-4">
        <div className="h-20 w-20 overflow-hidden rounded-3xl bg-slate-100">
          {course.courses?.image_url ? (
            <Image src={course.courses.image_url} alt={course.courses.title || 'Course'} width={80} height={80} className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-violet-500">🎓</div>
          )}
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold">Continue learning</p>
          <h3 className="mt-2 text-lg font-semibold text-slate-900">{course.courses?.title || 'Your course'}</h3>
          <p className="mt-2 text-sm text-slate-600">Lesson {Math.max(1, Math.round((course.progress || 0) * 12))} · {Math.round((course.progress || 0) * 100)}% complete</p>
        </div>
      </div>

      <div className="mt-5 rounded-3xl bg-slate-100 p-3">
        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
          <div className="h-2 rounded-full bg-violet-600 transition-all" style={{ width: `${Math.round((course.progress || 0) * 100)}%` }} />
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <Link href={`/academy/${course.course_id}`} className="inline-flex rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700">
          Continue course
        </Link>
        <Link href="/academy" className="text-sm font-semibold text-violet-600 hover:text-violet-700">
          Browse courses
        </Link>
      </div>
    </div>
  )
}
