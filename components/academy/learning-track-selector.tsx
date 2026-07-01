'use client'

import { useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Sparkles, Wallet, Briefcase, Lightbulb, Laptop, Heart, type LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SectionHeading } from '@/components/section-heading'
import { AcademyCourseFilter } from '@/components/academy/course-filter'
import { cn } from '@/lib/utils'
import type { AcademyTrack } from '@/lib/academy-courses'
import type { Course } from '@/components/academy/course-card'

interface AcademyLearningTracksProps {
  tracks: AcademyTrack[]
  courses: Course[]
}

const iconMap: Record<string, LucideIcon> = {
  Wallet,
  Briefcase,
  Lightbulb,
  Laptop,
  Heart,
}

export function AcademyLearningTracks({ tracks, courses }: AcademyLearningTracksProps) {
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null)
  const courseExplorerRef = useRef<HTMLDivElement>(null)

  const previewCourses = useMemo(() => {
    if (!selectedTrack) {
      return courses.filter((course) => course.featured).slice(0, 3)
    }

    return courses.filter((course) => course.track === selectedTrack).slice(0, 3)
  }, [courses, selectedTrack])

  const handleExplorePath = (trackTitle: string) => {
    setSelectedTrack(trackTitle)

    requestAnimationFrame(() => {
      courseExplorerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Learning Tracks"
          title="Choose Your Path to Growth"
          subtitle="Every track is built around real outcomes — more income, more confidence, and more control over your future."
        />

        <div className="mt-12 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="grid gap-4 md:grid-cols-2">
            {tracks.map((track) => {
              const isActive = selectedTrack === track.title
              const matchingCourses = courses.filter((course) => course.track === track.title)
              const TrackIcon = iconMap[track.icon] ?? Sparkles

              return (
                <div
                  key={track.title}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleExplorePath(track.title)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      handleExplorePath(track.title)
                    }
                  }}
                  className={cn(
                    'group relative flex cursor-pointer flex-col overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white p-6 text-left shadow-[0_20px_50px_-24px_rgba(15,23,42,0.16)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-[0_24px_70px_-24px_rgba(91,33,182,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
                    isActive && 'border-primary/70 bg-primary/5 shadow-[0_24px_70px_-24px_rgba(91,33,182,0.32)]',
                  )}
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-primary" />
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <TrackIcon className="h-5 w-5" />
                    </span>
                    <span className="rounded-full bg-primary/5 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-primary">
                      {track.courses} courses
                    </span>
                  </div>

                  <h3 className="mt-5 font-heading text-lg font-bold text-secondary">
                    {track.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {track.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {matchingCourses.slice(0, 2).map((course) => (
                      <span key={course.slug} className="rounded-full border border-slate-200/80 bg-white/80 px-3 py-1 text-xs font-medium text-foreground/80 shadow-sm">
                        {course.title}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      handleExplorePath(track.title)
                    }}
                    className="mt-6 inline-flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white/80 px-3 py-2 text-sm font-semibold text-primary shadow-sm transition hover:border-primary/50 hover:bg-primary/5"
                  >
                    <span>Next step: explore this path</span>
                    <ArrowRight className="ml-3 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </button>
                </div>
              )
            })}
          </div>

          <div className="rounded-[1.75rem] border border-slate-200/80 bg-white p-6 shadow-[0_20px_50px_-24px_rgba(15,23,42,0.16)]">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-primary">
              <Sparkles className="h-4 w-4" />
              Suggested next step
            </div>
            <h3 className="mt-4 font-heading text-2xl font-bold text-secondary">
              {selectedTrack ? `Start with ${selectedTrack}` : 'Pick a learning path'}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {selectedTrack
                ? `These courses are built for the ${selectedTrack.toLowerCase()} track so you can move from insight to action quickly.`
                : 'Choose a path above and the course explorer below will focus on the right learning journey for you.'}
            </p>

            <div className="mt-6 space-y-3">
              {previewCourses.length > 0 ? (
                previewCourses.map((course) => (
                  <Link
                    key={course.slug}
                    href={`/academy/${course.slug}`}
                    className="group flex items-start justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm transition hover:border-primary/60 hover:bg-primary/5"
                  >
                    <div>
                      <p className="font-semibold text-secondary">{course.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{course.description}</p>
                    </div>
                    <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-primary transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-4 text-sm text-muted-foreground">
                  No courses are available for this path yet.
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button asChild className="rounded-full bg-primary px-5 font-semibold text-primary-foreground shadow-[0_20px_40px_-20px_rgba(91,33,182,0.45)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_50px_-18px_rgba(91,33,182,0.55)]">
                <Link href="#academy-course-explorer">
                  Explore the full academy <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              {selectedTrack ? (
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full px-5 py-2 text-sm font-semibold"
                  onClick={() => setSelectedTrack(null)}
                >
                  Show all tracks
                </Button>
              ) : null}
            </div>
          </div>
        </div>

        <div ref={courseExplorerRef} id="academy-course-explorer" className="mt-10">
          <AcademyCourseFilter courses={courses} initialTrack={selectedTrack ?? 'All'} />
        </div>
      </div>
    </section>
  )
}
