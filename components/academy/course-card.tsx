'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Clock, BookOpen, BarChart, ArrowRight, Info } from 'lucide-react'
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
  featured?: boolean
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
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
          {course.description}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/5 px-2.5 py-1">
            <BarChart className="h-4 w-4 text-accent" /> {course.level}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/5 px-2.5 py-1">
            <Clock className="h-4 w-4 text-accent" /> {course.duration}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/5 px-2.5 py-1">
            <BookOpen className="h-4 w-4 text-accent" /> {course.lessons} lessons
          </span>
          {course.price ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-1 text-accent">
              {course.price}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-primary">
              Free
            </span>
          )}
        </div>

        <div
          className="mt-5 space-y-3 border-t border-slate-200/80 pt-4"
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm font-semibold text-primary">
              <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs">↗</span>
              Next step: explore
            </div>
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
            Enroll free <ArrowRight className="h-4 w-4" />
          </AuthGatedButton>
        </div>
      </div>
    </article>
  )
}
