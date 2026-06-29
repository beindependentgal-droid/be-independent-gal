import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, TrendingUp, Users, Award, Zap } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { SectionHeading } from '@/components/section-heading'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'BIG Fund | Funding Opportunities for Women',
  description:
    'Access grants, microloans, and investment opportunities designed for women entrepreneurs and community members. Build your financial independence with BIG Fund.',
}

const fundTypes = [
  {
    icon: Award,
    title: 'Grants & Scholarships',
    description: 'Non-dilutive funding for business ideas, education, and personal development. No repayment required.',
    amount: 'Up to $25,000',
    eligibility: 'Community members with 3+ months activity',
  },
  {
    icon: Zap,
    title: 'Startup Accelerator',
    description: 'Structured program with funding, mentorship, and network access for early-stage founders.',
    amount: '$50,000 - $250,000',
    eligibility: 'Registered businesses with traction',
  },
  {
    icon: TrendingUp,
    title: 'Business Growth Fund',
    description: 'Capital for scaling established women-owned businesses. Flexible terms and supportive terms.',
    amount: '$100,000 - $500,000',
    eligibility: '2+ years operating, $200k+ annual revenue',
  },
  {
    icon: Users,
    title: 'Venture Investment',
    description: 'Strategic equity investment with hands-on support from experienced venture partners.',
    amount: '$250,000+',
    eligibility: 'High-growth potential, proven team',
  },
]

const fundingProcess = [
  {
    step: '01',
    title: 'Apply',
    description: 'Submit your application with business plan, financial projections, and vision.',
  },
  {
    step: '02',
    title: 'Review',
    description: 'Our expert committee evaluates your application and requests any additional info.',
  },
  {
    step: '03',
    title: 'Interview',
    description: 'Present your idea to our funding committee and answer key questions.',
  },
  {
    step: '04',
    title: 'Receive',
    description: 'Get funding disbursed and access to ongoing mentorship and resources.',
  },
]

const successStories = [
  {
    name: 'Sarah Chen',
    business: 'TechHer Academy',
    amount: '$150,000',
    outcome: 'Trained 5,000+ women in tech skills, $2M ARR',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
  },
  {
    name: 'Maya Patel',
    business: 'Sustainable Fashion Line',
    amount: '$75,000',
    outcome: 'Expanded to 15 stores, 50+ employees',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
  },
  {
    name: 'Amara Johnson',
    business: 'Health Tech Platform',
    amount: '$250,000',
    outcome: 'Raised Series A, serving 100k+ users',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
  },
]

const stats = [
  { value: '$5M+', label: 'Funded to date' },
  { value: '500+', label: 'Entrepreneurs supported' },
  { value: '87%', label: 'Success rate' },
  { value: '200+', label: 'Businesses thriving' },
]

export default function FundPage() {
  return (
    <>
      <PageHero
        eyebrow="BIG Fund"
        title="Financial Freedom for Women Entrepreneurs"
        description="Access the capital, mentorship, and network you need to build a thriving, independent business. We're committed to democratizing access to funding for women."
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

      {/* Fund Types */}
      <section className="bg-background py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Funding Options"
            title="Choose the Right Funding for Your Journey"
            subtitle="From early-stage grants to growth capital, we have options designed for every stage of your entrepreneurial journey."
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {fundTypes.map((fund) => {
              const Icon = fund.icon
              return (
                <div
                  key={fund.title}
                  className="group rounded-2xl border border-border bg-card p-8 transition-all hover:shadow-lg hover:border-secondary"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/15 text-secondary transition-all group-hover:scale-110">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="mt-4 font-heading text-xl font-bold text-secondary">
                        {fund.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {fund.description}
                      </p>
                      <div className="mt-6 space-y-2">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-foreground/60">
                            Funding Amount
                          </p>
                          <p className="mt-1 font-heading font-bold text-primary">
                            {fund.amount}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-foreground/60">
                            Who Qualifies
                          </p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {fund.eligibility}
                          </p>
                        </div>
                      </div>
                      <Button
                        asChild
                        className="mt-6 w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        <Link href="/fund/apply">Learn More</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Funding Process */}
      <section className="bg-muted py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Simple Process"
            title="From Application to Funding in 4 Steps"
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-4">
            {fundingProcess.map((item, idx) => (
              <div key={item.step} className="relative">
                <div className="rounded-2xl bg-card p-8 text-center">
                  <span className="text-4xl font-heading font-extrabold text-secondary/30">
                    {item.step}
                  </span>
                  <h3 className="mt-4 font-heading text-lg font-bold text-secondary">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                {idx < fundingProcess.length - 1 && (
                  <ArrowRight className="absolute -right-3 top-1/2 hidden -translate-y-1/2 transform text-secondary/30 lg:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="bg-background py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Success Stories"
            title="Women Building Thriving Businesses"
            subtitle="Meet some of the incredible entrepreneurs who've transformed their dreams into reality with BIG Fund support."
          />
          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {successStories.map((story) => (
              <div
                key={story.name}
                className="overflow-hidden rounded-2xl border border-border bg-card transition-all hover:shadow-lg"
              >
                <div className="relative h-48 w-full bg-gradient-to-br from-primary/20 to-secondary/20">
                  <Image
                    src={story.image}
                    alt={story.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="mb-4 rounded-full bg-primary/10 w-fit px-3 py-1">
                    <p className="text-sm font-semibold text-primary">
                      {story.amount} funded
                    </p>
                  </div>
                  <h3 className="font-heading text-lg font-bold text-secondary">
                    {story.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {story.business}
                  </p>
                  <p className="mt-4 text-sm font-medium text-foreground">
                    {story.outcome}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="bg-muted py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="What We Look For"
            title="BIG Fund Eligibility Requirements"
            subtitle="These guidelines help us ensure we're supporting founders who align with our mission."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {[
              'Women founder or co-founder involvement',
              'Clear business model and revenue potential',
              'Commitment to community and social impact',
              'Realistic financial projections',
              'Passion and dedication to your mission',
              'Willingness to scale and grow',
            ].map((req) => (
              <div key={req} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary/20 text-secondary">
                    <span className="text-sm font-bold">✓</span>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-foreground">{req}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-secondary to-primary py-16 text-center text-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-extrabold sm:text-4xl">
            Ready to Get Funded?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/90">
            Join 500+ women entrepreneurs who&apos;ve received funding through BIG Fund. Apply today and take the next step in your entrepreneurial journey.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-white text-secondary hover:bg-white/90 font-semibold"
            >
              <Link href="/fund/apply">Start Your Application</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-white text-white hover:bg-white/10 font-semibold"
            >
              <Link href="/fund/faq">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
