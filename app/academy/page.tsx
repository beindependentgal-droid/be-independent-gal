import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, BadgeCheck, CheckCircle, GraduationCap, Sparkles } from 'lucide-react'
import { SectionHeading } from '@/components/section-heading'
import { type Course } from '@/components/academy/course-card'
import { AcademyLearningTracks } from '@/components/academy/learning-track-selector'
import { Button } from '@/components/ui/button'
import { academyCourses, academyTracks } from '@/lib/academy-courses'

export const metadata: Metadata = {
  title: 'BIG Academy',
  description:
    'BIG Academy equips women with practical skills across finance, career, entrepreneurship, digital, and wellbeing through self-paced courses, live cohorts, and mentorship.',
}

const tracks = academyTracks
const courses: Course[] = academyCourses

export default function AcademyPage() {
  return (
    <>
      <section id="overview" className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(255,20,147,0.16),_transparent_35%),linear-gradient(135deg,_#2D1B4E_0%,_#5B21B6_45%,_#FF1493_100%)] py-20 text-white sm:py-24">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.12),transparent_40%,rgba(255,255,255,0.08))]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-white/90 backdrop-blur">
              <Sparkles className="h-4 w-4" />
              BIG Academy
            </div>
            <h1 className="mt-6 font-heading text-4xl font-extrabold leading-[0.95] tracking-[-0.02em] text-white sm:text-5xl lg:text-6xl">
              Build the Career, Business & Financial Freedom You Deserve
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/85 sm:text-xl">
              Practical learning, expert mentors, and a strong community designed to help African women grow with confidence and independence.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full bg-white px-8 font-semibold text-primary hover:bg-white/90">
                <Link href="#academy-course-explorer">Start Learning</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full border-white/40 bg-transparent px-8 font-semibold text-white hover:bg-white/10">
                <Link href="#learning-tracks">Browse Courses</Link>
              </Button>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {['Self-paced Learning', 'Expert Mentors', 'Certificates', 'Community Support'].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-white/85">
                  <BadgeCheck className="h-4 w-4 text-amber-300" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-xl">
            <Image
              src="/images/bswomen.jpg"
              alt="Diverse African women learning, collaborating, and succeeding"
              width={900}
              height={900}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 900px"
              className="h-full min-h-[420px] w-full rounded-[1.5rem] object-cover"
            />
          </div>
        </div>
      </section>

      <section className="sticky top-16 z-40 border-b border-border/80 bg-white/95 py-3 backdrop-blur-sm lg:top-20">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-2 px-4 sm:px-6 lg:px-8">
          {[
            { href: '#overview', label: 'Overview' },
            { href: '#academy-course-explorer', label: 'Courses' },
            { href: '#mentors', label: 'Mentors' },
            { href: '#certificates', label: 'Certificates' },
            { href: '#resources', label: 'Resources' },
            { href: '#faq', label: 'FAQ' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-primary/80 hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="border-b border-border bg-white/90">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-8 sm:px-6 lg:grid-cols-4 lg:px-8">
          {[
            { value: '100+', label: 'Women Learning' },
            { value: '38+', label: 'Courses' },
            { value: '12', label: 'Industry Mentors' },
            { value: '9', label: 'Learning Tracks' },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl bg-white p-6 text-center shadow-sm">
              <p className="font-heading text-3xl font-extrabold text-primary">{item.value}</p>
              <p className="mt-2 text-sm font-medium text-muted-foreground">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <AcademyLearningTracks tracks={tracks} courses={courses} />

      <section className="bg-white py-20" id="why-big-academy">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Why BIG Academy"
            title="Built for women who want practical growth and real results"
            subtitle="Everything in BIG Academy is designed to help you learn faster, take action sooner, and build momentum with support from women like you."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              'Built by African women',
              'Practical workbooks',
              'Real mentors',
              'Certificates',
              'Community support',
              'Flexible learning',
              'Career focused',
              'Entrepreneurship focused',
            ].map((item) => (
              <div key={item} className="rounded-[1.75rem] border border-slate-200 bg-background p-6 shadow-sm">
                <div className="flex items-center gap-3 text-primary">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-xl">✓</span>
                  <h3 className="font-heading text-base font-semibold text-secondary">{item}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="The BIG Learning Journey"
            title="From first discovery to real impact"
            subtitle="A complete story of how learning at BIG Academy turns knowledge into confidence, action, and real opportunity."
          />
          <div className="mt-10 overflow-x-auto rounded-[2rem] bg-white/80 py-4 pb-4 pt-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex min-w-[max-content] gap-4 px-2">
              {[
                'Discover',
                'Choose Your Learning Path',
                'Enroll',
                'Watch Lessons',
                'Complete Workbooks',
                'Join Discussions',
                'Attend Live Mentorship',
                'Earn Your Certificate',
                'Apply Your Skills',
                'Build Your Career or Business',
              ].map((step) => (
                <div key={step} className="min-w-[16rem] rounded-[1.75rem] border border-slate-200 bg-background p-6 shadow-sm">
                  <p className="font-heading text-xl font-semibold text-secondary">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-20" id="mentors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Mentors" title="Learn From Women Who've Done It" subtitle="Build confidence with guidance from women who have walked the path before you." />
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[
              { name: 'Nia Achieng', title: 'Finance Strategist', industry: 'Finance', experience: '12 years', students: '85 women coached', rating: '4.9', linkedin: '#' },
              { name: 'Amina Yusuf', title: 'Founder & Brand Builder', industry: 'Entrepreneurship', experience: '10 years', students: '60 women coached', rating: '4.8', linkedin: '#' },
              { name: 'Wanjiku Muriithi', title: 'People & Leadership Coach', industry: 'Leadership', experience: '14 years', students: '120 women coached', rating: '4.9', linkedin: '#' },
            ].map((mentor) => (
              <div key={mentor.name} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">{mentor.name.split(' ')[0][0]}</div>
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-slate-900">{mentor.name}</h3>
                    <p className="text-sm text-muted-foreground">{mentor.title}</p>
                  </div>
                </div>
                <div className="mt-5 space-y-2 text-sm text-muted-foreground">
                  <p><span className="font-semibold text-slate-900">Industry:</span> {mentor.industry}</p>
                  <p><span className="font-semibold text-slate-900">Experience:</span> {mentor.experience}</p>
                  <p><span className="font-semibold text-slate-900">Mentoring impact:</span> {mentor.students}</p>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <span className="rounded-full bg-accent/10 px-3 py-1 text-sm font-semibold text-accent">★ {mentor.rating}</span>
                  <Link href={mentor.linkedin} className="text-sm font-semibold text-primary">View profile</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Success Stories" title="Women Who Took the First Step" subtitle="Our learners are earning more, leading stronger, and building futures that feel possible." />
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {[
              {
                quote: '“BIG Academy helped me build my side hustle into a paying business in 12 weeks.”',
                name: 'Zara',
                result: 'Earned 3 new clients',
              },
              {
                quote: '“I finally had the confidence to lead my team and present with clarity.”',
                name: 'Amara',
                result: 'Promoted to team lead',
              },
              {
                quote: '“The financial planning course helped me save 40% of my monthly income.”',
                name: 'Lina',
                result: 'Financial clarity gained',
              },
            ].map((story) => (
              <div key={story.name} className="rounded-[1.75rem] border border-slate-200 bg-gradient-to-br from-white to-primary/5 p-8 shadow-sm">
                <p className="text-lg leading-8 text-slate-700">{story.quote}</p>
                <div className="mt-6 flex items-center justify-between text-sm font-semibold text-slate-600">
                  <span>{story.name}</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">{story.result}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted py-20" id="certificates">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Certificates" title="Graduate With Confidence" subtitle="Proof that you learned, grew, and are ready for the next opportunity." />
          <div className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex items-center gap-3 text-primary">
                <BadgeCheck className="h-6 w-6" />
                <h3 className="font-heading text-xl font-semibold text-slate-900">Verified Certificates</h3>
              </div>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">Share your achievements with confidence and add them to your CV, LinkedIn, or portfolio.</p>
              <div className="mt-8 space-y-4">
                {['Digital badge and certificate', 'Course completion date', 'Verified skills summary', 'Shareable certificate link'].map((item) => (
                  <div key={item} className="flex items-start gap-3 text-sm text-slate-700">
                    <CheckCircle className="mt-1 h-5 w-5 text-primary" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[1.75rem] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-primary/5 p-8 shadow-sm">
              <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">BIG Academy</p>
                    <h3 className="mt-3 text-xl font-semibold text-slate-900">Certificate of Completion</h3>
                  </div>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary">Verified</span>
                </div>
                <div className="mt-6 space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-600">Awarded to</p>
                    <p className="mt-1 text-lg font-semibold text-slate-900">Amina Bello</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-600">Course</p>
                    <p className="mt-1 text-base text-slate-800">Money Mastery for New Founders</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['Finance', 'Leadership', 'Growth'].map((tag) => (
                      <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-20" id="resources">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Resources" title="Everything You Need To Succeed" subtitle="Templates, planners, guides, and tools that support every step of your learning journey." />
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {[
              {
                title: 'Financial',
                items: ['Budget Templates', 'Financial Trackers'],
              },
              {
                title: 'Career',
                items: ['Resume Templates', 'Interview Guides'],
              },
              {
                title: 'Business',
                items: ['Business Plans', 'Pitch Decks', 'Grant Templates'],
              },
              {
                title: 'Digital',
                items: ['Canva Templates', 'Google Sheets', 'Notion Templates'],
              },
            ].map((group) => (
              <div key={group.title} className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="font-heading text-lg font-semibold text-slate-900">{group.title}</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span key={item} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700">{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20" id="faq">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="FAQ" title="Questions Learners Ask Before They Join" subtitle="Everything you need to know to feel confident before enrolling." />
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {[
              {
                question: 'How fast can I complete a course?',
                answer: 'Most courses are self-paced and designed to be completed in 4–6 weeks with 3–5 hours of practice per week.',
              },
              {
                question: 'Do I get a certificate after finishing?',
                answer: 'Yes. Every complete course offers a verified certificate you can share with employers and mentors.',
              },
              {
                question: 'Can I join live sessions?',
                answer: 'Yes. We offer optional mentorship sessions and cohort check-ins to support your progress.',
              },
              {
                question: 'Is this suitable for beginners?',
                answer: 'Absolutely. Our courses are tailored for learners at every level, with clear steps, practical exercises, and mentor support.',
              },
            ].map((item) => (
              <div key={item.question} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <h3 className="font-heading text-base font-semibold text-slate-900">{item.question}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-primary to-secondary py-24 text-white">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <p className="font-heading text-4xl font-extrabold leading-tight sm:text-5xl">
            Your Independence Starts With One Decision
          </p>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/85">
            Every successful woman started somewhere. Choose a course. Build a skill. Take action. Your future self will thank you.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="rounded-full bg-white px-8 font-semibold text-primary hover:bg-white/90">
              <Link href="#academy-course-explorer">Join BIG Academy</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full border-white/40 bg-transparent px-8 font-semibold text-white hover:bg-white/10">
              <Link href="/join">Choose a Course</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
