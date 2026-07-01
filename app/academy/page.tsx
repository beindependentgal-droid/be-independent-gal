import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { SectionHeading } from '@/components/section-heading'
import { CtaBanner } from '@/components/cta-banner'
import { CourseCard, type Course } from '@/components/academy/course-card'
import { AcademyLearningTracks } from '@/components/academy/learning-track-selector'
import { Button } from '@/components/ui/button'
import { academyCourses, academyFormats, academyStats, academyTracks } from '@/lib/academy-courses'

export const metadata: Metadata = {
  title: 'BIG Academy',
  description:
    'BIG Academy equips women with practical skills across finance, career, entrepreneurship, digital, and wellbeing through self-paced courses, live cohorts, and mentorship.',
}

const tracks = academyTracks
const formats = academyFormats
const courses: Course[] = academyCourses
const stats = academyStats

export default function AcademyPage() {
  return (
    <>
      <PageHero
        eyebrow="BIG Academy"
        title="Learn the Skills to Build an Independent Life"
        description="Practical, women-centered learning across finance, career, business, digital skills, and wellbeing — designed to move you from where you are to where you want to be."
      />

      {/* Stats */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
          {stats.map((s) => (
            <div key={s.label} className="px-4 py-8 text-center">
              <p className="font-heading text-3xl font-extrabold text-primary sm:text-4xl">
                {s.value}
              </p>
              <p className="mt-1 text-sm font-medium text-muted-foreground">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <AcademyLearningTracks tracks={tracks} courses={courses} />

      {/* How it works */}
      <section className="bg-muted py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="How You Learn"
            title="Flexible Learning That Fits Real Lives"
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {formats.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-border bg-card p-6 text-center"
              >
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent/15 text-accent">
                  <f.icon className="h-7 w-7" />
                </span>
                <h3 className="mt-4 font-heading text-base font-bold text-secondary">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured courses */}
      <section className="bg-background py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Featured Courses"
            title="Start Learning Today"
            subtitle="Hand-picked courses to help you earn more, grow your career, and build the life you want."
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {courses.filter((course) => course.featured).map((course) => (
              <CourseCard key={course.slug} course={course} />
            ))}
          </div>
          <div className="mt-12 grid gap-6 rounded-[2rem] border border-border bg-white p-8 shadow-sm lg:grid-cols-[1.5fr_auto]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Want more?
              </p>
              <h3 className="mt-3 text-3xl font-bold text-secondary">
                Browse the full academy catalog
              </h3>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                BIG Academy includes practical courses across finance, career, entrepreneurship, digital skills, and wellbeing — all designed to help you move from curiosity to confidence.
              </p>
            </div>
            <div className="flex items-center justify-center lg:justify-end">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-primary px-8 font-semibold text-primary-foreground hover:bg-primary/90"
              >
                <Link href="#academy-course-explorer">
                  Browse all courses{' '}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mentor highlight strip */}
      <section className="bg-background pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-8 overflow-hidden rounded-3xl bg-secondary text-secondary-foreground lg:grid-cols-2">
            <div className="p-8 sm:p-12">
              <span className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-accent">
                Learn From Women Who&apos;ve Done It
              </span>
              <h2 className="mt-4 font-heading text-3xl font-extrabold uppercase tracking-tight text-balance">
                Mentorship Built Into Every Track
              </h2>
              <p className="mt-4 leading-relaxed text-secondary-foreground/80">
                Our courses are guided by entrepreneurs, professionals, and
                community leaders who share what actually worked for them. You
                never learn alone.
              </p>
              <Button
                asChild
                size="lg"
                className="mt-8 rounded-full bg-accent font-semibold text-accent-foreground hover:bg-accent/90"
              >
                <Link href="/community">
                  Meet the community <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="relative h-64 w-full lg:h-full lg:min-h-[22rem]">
              <Image
                src="/images/mentorship.png"
                alt="A mentor advising a younger woman over coffee"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  )
}
