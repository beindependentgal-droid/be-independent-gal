'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type CourseCtaState = 'guest' | 'not-enrolled' | 'enrolled' | 'completed'

type Props = {
  courseSlug: string
  courseTitle: string
  price?: string
  hasLessons?: boolean
  className?: string
  compact?: boolean
  hideSecondary?: boolean
}

const getStorageKey = (slug: string) => `big-academy-course-state:${slug}`
const getProgressKey = (slug: string) => `big-academy-course-progress:${slug}`
const DEFAULT_START_PROGRESS = 10

export function CourseDetailsCTA({
  courseSlug,
  courseTitle,
  price,
  hasLessons = true,
  className,
  compact = false,
  hideSecondary = false,
}: Props) {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [ctaState, setCtaState] = useState<CourseCtaState>('guest')
  const [progress, setProgress] = useState(0)

  const isPaidCourse = Boolean(price?.trim())
  const requiredRedirect = `/academy/${courseSlug}`

  useEffect(() => {
    if (typeof window === 'undefined') return

    const storedState = window.localStorage.getItem(getStorageKey(courseSlug)) as CourseCtaState | null
    const storedProgress = Number(window.localStorage.getItem(getProgressKey(courseSlug)) ?? '0')

    if (storedState === 'completed' || storedState === 'enrolled') {
      setCtaState(storedState)
      setProgress(Number.isFinite(storedProgress) ? storedProgress : DEFAULT_START_PROGRESS)
      return
    }

    setCtaState(isAuthenticated ? 'not-enrolled' : 'guest')
    setProgress(Number.isFinite(storedProgress) ? storedProgress : 0)
  }, [courseSlug, isAuthenticated])

  const title = useMemo(() => {
    if (!hasLessons) return 'Course content coming soon'

    switch (ctaState) {
      case 'guest':
        return 'Join BIG to Start Learning'
      case 'enrolled':
        return 'Continue Learning'
      case 'completed':
        return 'Download Certificate'
      default:
        return isPaidCourse ? 'Join This Course' : 'Start Course'
    }
  }, [ctaState, hasLessons, isPaidCourse])

  const description = useMemo(() => {
    if (!hasLessons) {
      return courseTitle
        ? `Lesson materials for ${courseTitle} are not yet uploaded. Check back later for this course.`
        : 'Lesson materials are not yet uploaded. Check back later for this course.'
    }

    switch (ctaState) {
      case 'guest':
        return 'Create your account to begin this course and save your progress.'
      case 'enrolled':
        return `${Math.max(progress, DEFAULT_START_PROGRESS)}% complete • Continue from your next lesson.`
      case 'completed':
        return 'You finished this course. Download your certificate and keep going.'
      default:
        return isPaidCourse
          ? 'This is a paid course. Complete your membership or purchase to start learning.'
          : 'Free access • Enroll instantly and begin the first lesson.'
    }
  }, [ctaState, courseTitle, hasLessons, isPaidCourse, progress])

  const primaryButtonText = useMemo(() => {
    if (!hasLessons) return isAuthenticated ? 'Coming soon' : 'Join BIG'

    if (ctaState === 'guest') return 'Join BIG'
    if (ctaState === 'completed') return 'Download Certificate'
    if (ctaState === 'enrolled') return 'Continue Learning'
    return isPaidCourse ? 'Join This Course' : 'Start Course'
  }, [ctaState, hasLessons, isAuthenticated, isPaidCourse])

  const secondaryButtonText = useMemo(() => {
    if (!hasLessons) return 'Browse Academy'

    if (ctaState === 'guest') return 'Sign In'
    if (ctaState === 'completed') return 'Review Course'
    return 'Preview Curriculum'
  }, [ctaState, hasLessons])

  const handlePrimary = () => {
    if (!hasLessons) {
      if (!isAuthenticated) {
        router.push(`/auth/login?redirect=${encodeURIComponent(requiredRedirect)}`)
        return
      }
      router.push('/academy')
      return
    }

    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=${encodeURIComponent(requiredRedirect)}`)
      return
    }

    if (ctaState === 'completed' || ctaState === 'enrolled') {
      router.push(`${requiredRedirect}#lesson-1`)
      return
    }

    if (isPaidCourse) {
      router.push(
        `/join?course=${encodeURIComponent(courseSlug)}&redirect=${encodeURIComponent(requiredRedirect)}`,
      )
      return
    }

    window.localStorage.setItem(getStorageKey(courseSlug), 'enrolled')
    window.localStorage.setItem(getProgressKey(courseSlug), String(DEFAULT_START_PROGRESS))
    setProgress(DEFAULT_START_PROGRESS)
    setCtaState('enrolled')
    router.push(`${requiredRedirect}#lesson-1`)
  }

  const handleSecondary = () => {
    if (!hasLessons) {
      router.push('/academy')
      return
    }

    if (!isAuthenticated) {
      router.push(`/auth/sign-up?redirect=${encodeURIComponent(requiredRedirect)}`)
      return
    }

    if (isPaidCourse && ctaState === 'not-enrolled') {
      router.push(
        `/join?course=${encodeURIComponent(courseSlug)}&redirect=${encodeURIComponent(requiredRedirect)}`,
      )
      return
    }

    if (ctaState === 'completed') {
      router.push(`${requiredRedirect}#lesson-1`)
      return
    }

    router.push(`${requiredRedirect}#curriculum`)
  }

  const handleComplete = () => {
    window.localStorage.setItem(getStorageKey(courseSlug), 'completed')
    window.localStorage.setItem(getProgressKey(courseSlug), '100')
    setProgress(100)
    setCtaState('completed')
  }

  return (
    <div className={cn('w-full max-w-full', className)}>
      <div className={cn('flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm', compact ? 'p-3' : 'p-4')}>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-slate-900">{title}</p>
          <p className="text-sm text-slate-600">{description}</p>
        </div>

        <div className={cn('mt-4 flex flex-col gap-3', compact ? 'sm:flex-row sm:items-center' : '')}>
          <Button onClick={handlePrimary} className="w-full min-h-11 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm">
            {primaryButtonText}
          </Button>

          {!hideSecondary && (
            ctaState === 'completed' ? (
              <Button variant="outline" onClick={handleComplete} className="w-full rounded-full px-4 py-2.5 text-sm font-semibold">
                Review Course
              </Button>
            ) : (
              <Button variant="outline" onClick={handleSecondary} className="w-full rounded-full px-4 py-2.5 text-sm font-semibold">
                {secondaryButtonText}
              </Button>
            )
          )}
        </div>

        {hasLessons && ctaState === 'enrolled' ? (
          <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
            <div className="flex items-center justify-between">
              <span>Progress</span>
              <span className="font-semibold">{progress}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
