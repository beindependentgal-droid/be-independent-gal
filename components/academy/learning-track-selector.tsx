'use client'

import { useMemo, useRef, useState } from 'react'
import { ArrowRight, Sparkles, Wallet, Briefcase, Lightbulb, Laptop, Heart, type LucideIcon } from 'lucide-react'
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

  const handleExplorePath = (trackTitle: string) => {
    setSelectedTrack(trackTitle)

    requestAnimationFrame(() => {
      courseExplorerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  return (
    <section id="learning-tracks" className="bg-background py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Learning Tracks"
          title="Choose Your Path to Growth"
          subtitle="Every track is built around real outcomes — more income, more confidence, and more control over your future."
        />

        <div className="mt-12">
          <div className="grid gap-4 md:grid-cols-2">
            {tracks.map((track) => {
              const isActive = selectedTrack === track.title
              const matchingCourses = courses.filter((course) => course.track === track.title)
              const TrackIcon = iconMap[track.icon] ?? Sparkles

              return (
                <button
                  key={track.title}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => handleExplorePath(track.title)}
                  className={cn(
                    'group relative flex w-full flex-col overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white p-6 text-left shadow-[0_20px_50px_-24px_rgba(15,23,42,0.16)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-[0_24px_70px_-24px_rgba(91,33,182,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
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

                  <span className="mt-6 inline-flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white/80 px-3 py-2 text-sm font-semibold text-primary shadow-sm transition group-hover:border-primary/50 group-hover:bg-primary/5">
                    <span>View Learning Path</span>
                    <ArrowRight className="ml-3 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div ref={courseExplorerRef} id="academy-course-explorer" className="mt-10">
          <AcademyCourseFilter courses={courses} initialTrack={selectedTrack ?? 'All'} />
        </div>
      </div>
    </section>
  )
}
