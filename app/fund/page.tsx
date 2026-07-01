import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, TrendingUp, Users, Award, Zap, CheckCircle2 } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { SectionHeading } from '@/components/section-heading'
import { Button } from '@/components/ui/button'
import FallbackImage from '@/components/ui/fallback-image'

export const metadata: Metadata = {
  title: 'BIG Fund | Funding Opportunities for Women',
  description:
    'Access grants, microloans, and investment opportunities designed for women entrepreneurs and community members. Build your financial independence with BIG Fund.',
  openGraph: {
    title: 'BIG Fund | Funding Opportunities for Women',
    description: 'Get funded and grow your business with BIG Fund',
    images: ['/og-image.jpg'],
  },
}

const fundTypes = [
  {
    icon: Award,
    title: 'Grants & Scholarships',
    description:
      'Non-dilutive funding for business ideas, education, and personal development. No repayment required.',
    amount: 'Up to KES 500,000',
    eligibility: 'Community members with 3+ months activity',
    color: 'from-primary to-primary',
  },
  {
    icon: Zap,
    title: 'Startup Accelerator',
    description:
      'Structured program with funding, mentorship, and network access for early-stage founders.',
    amount: 'KES 1M - KES 5M',
    eligibility: 'Registered businesses with traction',
    color: 'from-blue-600 to-blue-800',
  },
  {
    icon: TrendingUp,
    title: 'Business Growth Fund',
    description:
      'Capital for scaling established women-owned businesses. Flexible terms and supportive partners.',
    amount: 'KES 2.5M - KES 12.5M',
    eligibility: '2+ years operating, KES 5M+ annual revenue',
    color: 'from-emerald-600 to-emerald-800',
  },
  {
    icon: Users,
    title: 'Venture Investment',
    description:
      'Strategic equity investment with hands-on support from experienced venture partners.',
    amount: 'KES 12.5M+',
    eligibility: 'High-growth potential, proven team',
    color: 'from-rose-600 to-rose-800',
  },
]

const fundingProcess = [
  {
    step: '01',
    title: 'Apply',
    description:
      'Submit your application with business plan, financial projections, and vision for impact.',
  },
  {
    step: '02',
    title: 'Review',
    description:
      'Our expert committee evaluates your application and requests any additional information.',
  },
  {
    step: '03',
    title: 'Interview',
    description:
      'Present your idea to our funding committee and discuss your growth plans.',
  },
  {
    step: '04',
    title: 'Receive',
    description:
      'Get funding disbursed and access to ongoing mentorship and community support.',
  },
]

const successStories = [
  {
    name: 'Sarah Chen',
    business: 'TechHer Academy',
    amount: 'KES 3.75M',
    outcome: 'Trained 5,000+ women in tech, KES 50M ARR',
    image: '/images/founder-1.jpg',
  },
  {
    name: 'Maya Patel',
    business: 'Sustainable Fashion Line',
    amount: 'KES 1.875M',
    outcome: 'Expanded to 15 stores, 50+ employees',
    image: '/images/founder-2.jpg',
  },
  {
    name: 'Amara Johnson',
    business: 'Health Tech Platform',
    amount: 'KES 6.25M',
    outcome: 'Raised Series A, serving 100k+ users',
    image: '/images/founder-3.jpg',
  },
]

const stats = [
  { value: 'KES 125M+', label: 'Funded to date' },
  { value: '500+', label: 'Entrepreneurs supported' },
  { value: '87%', label: 'Success rate' },
  { value: '200+', label: 'Businesses thriving' },
]

const requirements = [
  'Women founder or co-founder involvement',
  'Clear business model and revenue potential',
  'Commitment to community and social impact',
  'Realistic financial projections',
  'Passion and dedication to your mission',
  'Willingness to scale and grow',
]

export default function FundPage() {
  return (
    <>
      {/* Hero */}
      <PageHero
        title="BIG Fund"
        subtitle="Funding for women-led businesses"
        description="Access capital, mentorship, and community support to grow your business and create impact. From grants to venture investment, we have options for every stage."
        cta1={{ text: 'Apply Now', href: '/fund/apply' }}
        cta2={{ text: 'Learn More', href: '#fund-types' }}
        imageSrc="/images/fund-hero.jpg"
      />

      {/* Stats Section */}
      <section className="py-16 bg-primary text-white px-6 sm:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <p className="text-4xl font-bold mb-2">{stat.value}</p>
                <p className="text-white/80 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fund Types */}
      <section id="fund-types" className="py-20 bg-white px-6 sm:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            title="Funding Options"
            subtitle="Choose what works for you"
            description="We offer flexible funding solutions tailored to different business stages and needs"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {fundTypes.map((fund, idx) => {
              const Icon = fund.icon
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-pink-300 hover:shadow-xl transition-all"
                >
                  {/* Header with gradient */}
                  <div className={`bg-gradient-to-r ${fund.color} p-8 text-white`}>
                    <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-bold">{fund.title}</h3>
                  </div>

                  {/* Content */}
                  <div className="p-8 space-y-6">
                    <p className="text-gray-600 leading-relaxed">{fund.description}</p>

                    {/* Details */}
                    <div className="space-y-4 border-t border-gray-200 pt-6">
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase mb-1">
                          Funding Amount
                        </p>
                        <p className="text-lg font-bold text-gray-900">{fund.amount}</p>
                      </div>

                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase mb-1">
                          Who Qualifies
                        </p>
                        <p className="text-sm text-gray-700">{fund.eligibility}</p>
                      </div>
                    </div>

                    {/* CTA */}
                    <Link href={`/fund/apply?type=${fund.title.toLowerCase().replace(/ /g, '-')}`}>
                      <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-full h-11">
                        Learn More
                      </Button>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Funding Process */}
      <section className="py-20 bg-gray-50 px-6 sm:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            title="How It Works"
            subtitle="4 simple steps to get funded"
            description="Our streamlined process from application to funding in 2-4 weeks"
          />

          <div className="mt-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {fundingProcess.map((item, idx) => (
                <div key={idx} className="relative">
                  <div className="bg-white rounded-2xl border border-gray-200 p-8 h-full">
                    {/* Step number */}
                    <div className="text-5xl font-bold text-pink-100 mb-4">{item.step}</div>

                    {/* Content */}
                    <h4 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                  </div>

                  {/* Arrow connector */}
                  {idx < 3 && (
                    <div className="hidden lg:flex absolute -right-3 top-1/2 transform -translate-y-1/2 z-10">
                      <ArrowRight className="w-6 h-6 text-pink-500" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-white px-6 sm:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            title="Success Stories"
            subtitle="Women entrepreneurs transforming with BIG Fund"
            description="Real stories from founders who got funded and scaled their impact"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {successStories.map((story, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 overflow-hidden hover:border-pink-300 hover:shadow-xl transition-all"
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-gray-300">
                  <FallbackImage
                    src={story.image}
                    alt={story.name}
                    fill
                    className="w-full h-full object-cover"
                    fallbackSrc="/images/founder-placeholder.jpg"
                  />
                </div>

                {/* Content */}
                <div className="p-8">
                  <div className="bg-pink-100 text-pink-700 text-sm font-bold px-3 py-1 rounded-full inline-block mb-4">
                    {story.amount} funded
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-1">{story.name}</h3>
                  <p className="text-pink-600 font-semibold mb-4">{story.business}</p>

                  <p className="text-gray-700 text-sm leading-relaxed italic">
                    "{story.outcome}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-20 bg-gray-50 px-6 sm:px-12 lg:px-16">
        <div className="max-w-4xl mx-auto">
          <SectionHeading
            title="What We Look For"
            subtitle="Eligibility and requirements"
            description="Here are the key qualities we seek in BIG Fund recipients"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            {requirements.map((req, idx) => (
              <div key={idx} className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-gray-200 hover:border-pink-300 transition-colors">
                <CheckCircle2 className="w-6 h-6 text-pink-500 flex-shrink-0 mt-1" />
                <span className="font-medium text-gray-900">{req}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-20 bg-white px-6 sm:px-12 lg:px-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Common Questions
          </h2>

          <div className="space-y-6">
            {[
              {
                q: 'How long does the review process take?',
                a: 'We typically review applications within 2-4 weeks. Exceptional applications may be approved faster.',
              },
              {
                q: 'Do I need to have revenue to apply?',
                a: 'No! We fund businesses at all stages, from pre-launch ideas to established companies.',
              },
              {
                q: 'What if I get rejected?',
                a: 'We provide feedback and encourage reapplication. We believe in iteration and growth.',
              },
            ].map((item, idx) => (
              <details
                key={idx}
                className="bg-gray-50 rounded-2xl border border-gray-200 p-6 hover:border-pink-300 transition-colors cursor-pointer group"
              >
                <summary className="flex items-center justify-between font-bold text-gray-900 select-none">
                  {item.q}
                  <span className="text-pink-500 group-open:rotate-180 transition-transform">+</span>
                </summary>
                <p className="text-gray-600 mt-4 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/fund/faq">
              <Button
                variant="outline"
                className="border-2 border-pink-500 text-pink-600 hover:bg-pink-50 font-bold rounded-full h-11 px-8"
              >
                View All FAQs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-primary text-white px-6 sm:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold">Ready to Get Funded?</h2>

          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Join 500+ women entrepreneurs who've received funding through BIG Fund. Apply today and take the next step
            in your entrepreneurial journey.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/fund/apply">
              <Button className="bg-white text-pink-600 hover:bg-gray-100 font-bold rounded-full h-12 px-12 flex items-center gap-2 w-full sm:w-auto justify-center">
                Start Your Application
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>

            <Link href="/fund/faq">
              <Button
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 font-bold rounded-full h-12 px-12 w-full sm:w-auto"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}