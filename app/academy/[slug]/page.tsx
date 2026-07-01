import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getCourseBySlug, getAllCourseSlugs } from '@/lib/academy-courses'
import { PageHero } from '@/components/page-hero'
import { SectionHeading } from '@/components/section-heading'
import { AuthGatedButton } from '@/components/auth/auth-gated-button'

interface AcademyCoursePageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  return getAllCourseSlugs()
}

export async function generateMetadata({ params }: AcademyCoursePageProps): Promise<Metadata> {
  const course = getCourseBySlug(params.slug)

  if (!course) {
    return {
      title: 'Course not found',
      description: 'This course could not be found.',
    }
  }

  return {
    title: `${course.title} | BIG Academy`,
    description: course.description,
  }
}

export default function AcademyCoursePage({ params }: AcademyCoursePageProps) {
  const course = getCourseBySlug(params.slug)

  if (!course) {
    return (
      <main className="bg-background">
        <div className="mx-auto flex min-h-[70vh] max-w-5xl flex-col justify-center px-4 py-24 sm:px-6 lg:px-8">
            <div className="rounded-[2rem] border border-slate-200/80 bg-white p-8 shadow-[0_24px_70px_-28px_rgba(15,23,42,0.16)] sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Coming soon</p>
            <h1 className="mt-4 text-3xl font-semibold text-secondary sm:text-4xl">
              This learning path is not available just yet
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
              We&apos;re building this experience with care and will be sharing it soon. Please check back soon or explore our current academy courses in the meantime.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/academy" className="inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                Back to Academy
              </Link>
              <Link href="/join" className="inline-flex rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-secondary hover:bg-slate-50">
                Get updates
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-background">
      <PageHero
        eyebrow="BIG Academy"
        title={course.title}
        description={course.description}
      />

      <section className="mx-auto max-w-6xl space-y-12 px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6 rounded-3xl border border-border bg-card p-8">
            <div className="flex flex-wrap items-center gap-4 text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              <span>{course.track}</span>
              <span className="text-accent">{course.level}</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl bg-secondary/5 p-6 text-center">
                <p className="text-3xl font-bold text-secondary">{course.duration}</p>
                <p className="text-sm text-muted-foreground">Duration</p>
              </div>
              <div className="rounded-3xl bg-secondary/5 p-6 text-center">
                <p className="text-3xl font-bold text-secondary">{course.lessons}</p>
                <p className="text-sm text-muted-foreground">Lessons</p>
              </div>
              <div className="rounded-3xl bg-secondary/5 p-6 text-center">
                <p className="text-3xl font-bold text-secondary">{course.price ?? 'Free'}</p>
                <p className="text-sm text-muted-foreground">Enrollment</p>
              </div>
            </div>
            <div className="space-y-4">
              <SectionHeading eyebrow="What you’ll learn" title="Course outcomes" />
              <ul className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                {(course.outcomes ?? []).length > 0 ? (
                  (course.outcomes ?? []).map((outcome) => (
                    <li key={outcome} className="flex items-start gap-3">
                      <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-primary" />
                      <span>{outcome}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-sm leading-relaxed text-muted-foreground">
                    This course includes practical lessons, examples, and tools to help you move forward with confidence.
                  </li>
                )}
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div className="overflow-hidden rounded-3xl border border-border bg-muted">
              <div className="relative aspect-[16/10]">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6">
              <h2 className="text-base font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Enroll with BIG Academy
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-foreground">
                {course.idealFor
                  ? `Ideal for ${course.idealFor.toLowerCase()}.`
                  : 'Join the course instantly and access the learning path designed for women who want more financial independence, career momentum, or a stronger business foundation.'}
              </p>
              <div className="mt-4 inline-flex flex-wrap gap-2">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                  {course.level}
                </span>
                <span className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-secondary">
                  {course.track}
                </span>
              </div>
              <AuthGatedButton
                size="lg"
                className="mt-6 w-full rounded-full bg-primary px-5 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
                redirectPath={`/academy/${course.slug}`}
              >
                Join this course
              </AuthGatedButton>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
