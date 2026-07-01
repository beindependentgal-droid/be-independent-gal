'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CourseCard, type Course } from '@/components/academy/course-card'
import { AuthGatedButton } from '@/components/auth/auth-gated-button'
import { cn } from '@/lib/utils'
import { Dialog } from '@base-ui/react'

export function AcademyCourseFilter({ courses, initialTrack = 'All' }: { courses: Course[]; initialTrack?: string }) {
  const [search, setSearch] = useState('')
  const [track, setTrack] = useState(initialTrack)
  const [level, setLevel] = useState('All')
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)

  const tracks = useMemo(
    () => ['All', ...Array.from(new Set(courses.map((course) => course.track)))],
    [courses],
  )

  const levels = useMemo(
    () => ['All', ...Array.from(new Set(courses.map((course) => course.level)))],
    [courses],
  )

  const filteredCourses = useMemo(() => {
    const query = search.trim().toLowerCase()
    return courses.filter((course) => {
      const matchesTrack = track === 'All' || course.track === track
      const matchesLevel = level === 'All' || course.level === level
      const matchesQuery =
        !query ||
        [course.title, course.description, course.track, course.level]
          .join(' ')
          .toLowerCase()
          .includes(query)

      return matchesTrack && matchesLevel && matchesQuery
    })
  }, [courses, level, search, track])

  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setTrack(initialTrack)
    })

    return () => cancelAnimationFrame(handle)
  }, [initialTrack])

  const resetFilters = () => {
    setSearch('')
    setTrack(initialTrack)
    setLevel('All')
  }

  const openCourseDetails = (course: Course) => setSelectedCourse(course)
  const closeCourseDetails = () => setSelectedCourse(null)

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-border bg-card p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-secondary">Find the right course</h3>
            <p className="text-sm text-muted-foreground">
              Filter by track, level, or keywords to discover courses that match
              your goals.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-80">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search courses"
                className="pl-10"
                aria-label="Search courses"
              />
              {search ? (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : null}
            </div>
            <Button
              type="button"
              variant="outline"
              className="rounded-full px-5 py-2 text-sm font-semibold"
              onClick={resetFilters}
            >
              Reset filters
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="grid gap-3">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Track
            </p>
            <div className="flex flex-wrap gap-2">
              {tracks.map((trackOption) => (
                <button
                  key={trackOption}
                  type="button"
                  onClick={() => setTrack(trackOption)}
                  className={cn(
                    'rounded-full border px-4 py-2 text-sm transition-colors',
                    track === trackOption
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-background text-foreground hover:border-primary/70',
                  )}
                >
                  {trackOption}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-3">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Level
            </p>
            <div className="flex flex-wrap gap-2">
              {levels.map((levelOption) => (
                <button
                  key={levelOption}
                  type="button"
                  onClick={() => setLevel(levelOption)}
                  className={cn(
                    'rounded-full border px-4 py-2 text-sm transition-colors',
                    level === levelOption
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-background text-foreground hover:border-primary/70',
                  )}
                >
                  {levelOption}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-muted/70 p-4 text-sm text-muted-foreground">
          <span>{filteredCourses.length} course{filteredCourses.length === 1 ? '' : 's'} available</span>
          <span>
            Showing {track === 'All' ? 'all' : track} · {level === 'All' ? 'all' : level} ·{' '}
            {search ? `matching “${search}”` : 'search all'}
          </span>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <CourseCard
              key={course.title}
              course={course}
              selected={selectedCourse?.title === course.title}
              onOpenDetails={openCourseDetails}
            />
          ))
        ) : (
          <div className="col-span-full rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
            No courses match your filters. Try a different track, level, or keyword.
          </div>
        )}
      </div>

      <Dialog.Root open={selectedCourse !== null} onOpenChange={(open) => open || closeCourseDetails()} modal>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          <Dialog.Viewport className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <Dialog.Popup className="w-full max-w-[min(100vw-2rem,40rem)] overflow-hidden rounded-3xl border border-border bg-background shadow-2xl shadow-black/20 sm:max-w-3xl lg:max-w-4xl">
              <div className="flex flex-col gap-6 p-6 sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Dialog.Title className="text-xl font-semibold text-secondary">
                      {selectedCourse?.title}
                    </Dialog.Title>
                    <Dialog.Description className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {selectedCourse?.description}
                    </Dialog.Description>
                  </div>
                  <Dialog.Close
                    type="button"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-muted"
                    aria-label="Close"
                  >
                    <X className="h-4 w-4" />
                  </Dialog.Close>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
                  <div className="space-y-6">
                    <div className="relative overflow-hidden rounded-3xl bg-muted">
                      <div className="relative aspect-[16/10]">
                        <Image
                          src={selectedCourse?.image ?? '/placeholder.jpg'}
                          alt={selectedCourse?.title ?? 'Course image'}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover"
                        />
                      </div>
                    </div>

                    <div className="rounded-3xl border border-border bg-card p-6">
                      <div className="grid gap-3 text-sm text-muted-foreground">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <span className="font-semibold text-foreground">Track</span>
                          <span className="text-right text-foreground">{selectedCourse?.track}</span>
                        </div>
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <span className="font-semibold text-foreground">Level</span>
                          <span className="text-right text-foreground">{selectedCourse?.level}</span>
                        </div>
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <span className="font-semibold text-foreground">Duration</span>
                          <span className="text-right text-foreground">{selectedCourse?.duration}</span>
                        </div>
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <span className="font-semibold text-foreground">Lessons</span>
                          <span className="text-right text-foreground">{selectedCourse?.lessons}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="rounded-3xl border border-border bg-card p-6">
                      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                        Course preview
                      </p>
                      <ul className="mt-5 space-y-3 text-sm leading-relaxed text-foreground">
                        <li>Explore course goals, outcomes, and what you’ll learn.</li>
                        <li>See how this course fits your current track and level.</li>
                        <li>Start with confidence using the resources inside BIG Academy.</li>
                      </ul>
                    </div>

                    <div className="rounded-3xl border border-border bg-card p-6">
                      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                        Ready to join?
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        Enroll free with BIG Academy and start building your future today.
                      </p>
                      <AuthGatedButton
                        size="lg"
                        className="inline-flex w-full items-center justify-center rounded-full bg-primary px-4 py-2 text-center font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                        redirectPath={selectedCourse?.slug ? `/academy/${selectedCourse.slug}` : '/get-involved#join'}
                      >
                        View full course
                      </AuthGatedButton>
                    </div>
                  </div>
                </div>
              </div>
            </Dialog.Popup>
          </Dialog.Viewport>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}
