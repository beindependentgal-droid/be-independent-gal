'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Star, Clock, BookOpen, BarChart, ArrowRight, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { AuthGatedButton } from '@/components/auth/auth-gated-button'

export type Course = {
  slug?: string
  title: string
  track: string
  level: string
  duration: string
  lessons: number
  description: string
  image: string
  price?: string
  featured?: boolean
  idealFor?: string
  outcomes?: string[]
  rating?: number
  certificate?: boolean
}

interface CourseCardProps {
  course: Course
  selected?: boolean
  onOpenDetails?: (course: Course) => void
}

export function CourseCard({ course, selected, onOpenDetails }: CourseCardProps) {
  const router = useRouter()

  const handleCardClick = () => {
    if (onOpenDetails) {
      onOpenDetails(course)
      return
    }

    if (course.slug) {
      router.push(`/academy/${course.slug}`)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleCardClick()
    }
  }

  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={`Open ${course.title}`}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      className={cn(
        'group relative flex cursor-pointer flex-col overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-gradient-to-br from-white via-white to-[#f8f5ff] shadow-[0_20px_50px_-24px_rgba(15,23,42,0.18)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-[0_24px_70px_-24px_rgba(91,33,182,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
        selected && 'border-primary/70 ring-2 ring-primary/20 shadow-[0_24px_70px_-24px_rgba(91,33,182,0.35)]',
      )}
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-primary" />
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={course.image || '/placeholder.jpg'}
          alt={course.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute left-3 top-4 rounded-full bg-white/90 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-primary shadow-sm backdrop-blur">
          {course.track}
        </span>
        {course.featured ? (
          <span className="absolute right-3 top-4 rounded-full bg-accent px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-accent-foreground shadow-sm">
            Featured
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-heading text-lg font-bold leading-snug text-secondary text-balance">
          {course.slug ? (
            <Link
              href={`/academy/${course.slug}`}
              className="hover:text-primary"
              onClick={(event) => event.stopPropagation()}
            >
              {course.title}
            </Link>
          ) : (
            course.title
          )}
        </h3>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 text-secondary font-semibold">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} className="h-4 w-4 text-amber-400" />
            ))}
            <span>{course.rating?.toFixed(1) ?? '4.9'}</span>
          </div>
          <span className="rounded-full border border-slate-200/80 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            {course.level}
          </span>
          <span className="rounded-full border border-slate-200/80 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {course.lessons} Lessons
          </span>
          <span className="rounded-full border border-slate-200/80 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {course.duration}
          </span>
          <span className="rounded-full border border-slate-200/80 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {course.certificate ? 'Certificate' : 'Certificate available'}
          </span>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{course.description}</p>

        <div className="mt-6 flex flex-col gap-3 border-t border-slate-200/80 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm font-semibold text-primary">Explore Course →</div>
          {onOpenDetails ? (
            <Button
              type="button"
              variant="outline"
              className="w-full justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold sm:w-auto"
              onClick={(event) => {
                event.stopPropagation()
                onOpenDetails?.(course)
              }}
            >
              <Info className="h-4 w-4" />
              View details
            </Button>
          ) : null}
        </div>

        <AuthGatedButton
          variant="ghost"
          className="w-full justify-center gap-1 px-0 font-semibold text-primary hover:bg-transparent hover:text-primary/80 sm:w-auto sm:justify-start"
          redirectPath={`/academy/${course.slug}`}
        >
          Start learning <ArrowRight className="h-4 w-4" />
        </AuthGatedButton>
      </div>
    </article>
  )
}
