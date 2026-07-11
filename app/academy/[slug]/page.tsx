import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getCourseBySlug, getAllCourseSlugs } from '@/lib/academy-courses'
import { SectionHeading } from '@/components/section-heading'
import CurriculumAccordion from '@/components/academy/curriculum-accordion'
import { CourseDetailsCTA } from '@/components/academy/course-details-cta'
import { AuthGatedButton } from '@/components/auth/auth-gated-button'
import { Star, Users, CheckCircle, BadgeCheck } from 'lucide-react'

interface AcademyCoursePageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  return getAllCourseSlugs()
}

export async function generateMetadata({ params }: AcademyCoursePageProps): Promise<Metadata> {
  const { slug } = await params
  const course = getCourseBySlug(slug)

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

export default async function AcademyCoursePage({ params }: AcademyCoursePageProps) {
  const { slug } = await params
  const course = getCourseBySlug(slug)

  if (!course) {
    return (
      <main className="bg-background">
        <div className="mx-auto flex min-h-[60vh] max-w-5xl flex-col justify-center px-4 py-20 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-[0_24px_70px_-28px_rgba(15,23,42,0.16)] sm:p-10">
            <h1 className="text-3xl font-semibold text-secondary sm:text-4xl">Course not found</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
              We couldn’t find a course with that link. Try browsing the Academy or join our waitlist to get notified when new courses are published.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/academy" className="inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                Browse Academy
              </Link>
              <Link href="/join" className="inline-flex rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-secondary hover:bg-slate-50">
                Join waitlist
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-background">
      <section className="relative overflow-hidden bg-white py-12 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                <span>BIG Academy</span>
                <span className="hidden sm:inline">•</span>
                <span className="text-accent">{course.track}</span>
              </div>

              <h1 className="mt-4 text-3xl font-heading font-extrabold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
                {course.title}
              </h1>

              <p className="mt-4 max-w-2xl text-lg text-slate-700">{course.description}</p>

              <div className="mt-6">
                <div className="inline-flex items-center gap-3 text-sm font-medium text-slate-700">
                  <span className="inline-flex items-center gap-2"> <Star className="h-4 w-4 text-amber-400" /> <span>{course.rating ?? 4.8}</span></span>
                  <span className="text-muted-foreground">•</span>
                  <span>{course.level}</span>
                  <span className="text-muted-foreground">•</span>
                  <span>{course.duration}</span>
                  <span className="text-muted-foreground">•</span>
                  <span>{course.lessons} Lessons</span>
                  {course.certificate ? (
                    <><span className="text-muted-foreground">•</span><span>🏆 Certificate</span></>
                  ) : null}
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto]">
                <div>
                  <CourseDetailsCTA
                    courseSlug={course.slug}
                    courseTitle={course.title}
                    price={course.price}
                    hasLessons={Boolean(course.modules?.some((module) => module.lessons > 0))}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center justify-center sm:justify-end">
                  <a href="#lesson-1" className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50 sm:w-auto">
                    Preview Curriculum
                  </a>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-2xl border border-border bg-muted">
                <div className="relative aspect-[16/10]">
                  <Image src={course.image} alt={course.title} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
                </div>
              </div>

              {/* image area intentionally minimal for dashboard course-start */}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div>
            <SectionHeading title="What you'll learn" />
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {[
                'Validate your business idea',
                'Find your first customers',
                'Build a compelling offer',
                'Market your business',
                'Manage business finances',
                'Launch with confidence',
              ].map((outcome) => (
                <div key={outcome} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary"><CheckCircle className="h-4 w-4" /></span>
                  <p className="text-sm text-slate-700">{outcome}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-900">Meet your mentor</h3>
            <div className="mt-4 rounded-2xl border border-border bg-white p-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-semibold text-primary">A</div>
                <div>
                  <p className="font-semibold text-slate-900">Amina Yusuf</p>
                  <p className="text-sm text-muted-foreground">Founder & Brand Builder</p>
                </div>
                <div className="ml-auto inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1 text-sm font-semibold text-slate-800">
                  <Star className="h-4 w-4 text-amber-400" />{course.rating ?? 4.8}
                </div>
              </div>
              <div className="mt-3">
                <Link href="#" className="text-sm font-semibold text-primary">View profile</Link>
              </div>
            </div>
          </div>

          <div id="lesson-1">
            <CurriculumAccordion
              courseSlug={course.slug}
              modules={course.modules ?? [
                { module: 'Module 1', title: 'Finding Your Business Idea', lessons: 5 },
                { module: 'Module 2', title: 'Validating Your Idea', lessons: 4 },
                { module: 'Module 3', title: 'Branding', lessons: 4 },
                { module: 'Module 4', title: 'Marketing', lessons: 5 },
                { module: 'Module 5', title: 'Launch Strategy', lessons: 4 },
              ]}
            />
          </div>
          <div className="pt-6">
            <div className="sticky top-24 z-20 mx-auto max-w-md rounded-2xl border border-border bg-white p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">Ready to Begin?</p>
                  <p className="mt-1 text-sm text-slate-700">You're one lesson away from building your next breakthrough.</p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <AuthGatedButton size="md" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground" redirectPath={`/academy/${course.slug}#lesson-1`}>
                    Start Lesson 1 →
                  </AuthGatedButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Floating sticky enroll card removed as requested */}
    </main>
  )
}
