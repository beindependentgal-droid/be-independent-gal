import type { Metadata } from 'next'
import Link from 'next/link'
import { Users, Heart, HandHelping, Handshake, Mail, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHero } from '@/components/page-hero'
import { SectionHeading } from '@/components/section-heading'
import { NewsletterForm } from '@/components/forms/newsletter-form'

export const metadata: Metadata = {
  title: 'Get Involved | BIG',
  description:
    'Join the BIG community, donate, volunteer, or partner with us to help women build independent lives and unstoppable futures.',
  openGraph: {
    title: 'Get Involved | BIG',
    description: 'Multiple ways to support women in our community',
    images: ['/og-image.jpg'],
  },
}

const ways = [
  {
    icon: Users,
    title: 'Join the Community',
    desc: 'Become a member and access mentorship, events, and a supportive sisterhood.',
    href: '/auth/sign-up',
    cta: 'Join Now',
  },
  {
    icon: Heart,
    title: 'Donate',
    desc: 'Fund programs that equip women with skills, networks, and opportunity.',
    href: '#donate',
    cta: 'Donate',
  },
  {
    icon: HandHelping,
    title: 'Volunteer',
    desc: 'Share your time and skills as a mentor, facilitator, or event helper.',
    href: '#volunteer',
    cta: 'Volunteer',
  },
  {
    icon: Handshake,
    title: 'Partner with Us',
    desc: 'Organizations and brands can collaborate to amplify our impact.',
    href: '#partner',
    cta: 'Partner',
  },
]

const donationTiers = [
  {
    amount: 'KES 500',
    description: 'Workshop materials for one woman',
    icon: '📚',
  },
  {
    amount: 'KES 2,500',
    description: 'Sponsors a mentorship session',
    icon: '🎓',
  },
  {
    amount: 'KES 5,000',
    description: 'Helps host a community event',
    icon: '🎉',
  },
  {
    amount: 'KES 10,000',
    description: 'Funds a Sister Circle for a month',
    icon: '👯',
  },
]

export default function GetInvolvedPage() {
  return (
    <>
      {/* Hero */}
      <PageHero
        title="Get Involved"
        subtitle="Multiple ways to support women"
        description="Whether you want to join, donate, volunteer, or partner—there's a way for you to be part of the BIG movement."
        cta1={{ text: 'Become a Member', href: '/auth/sign-up' }}
        cta2={{ text: 'Learn More', href: '#ways' }}
        imageSrc="/images/get-involved-hero.jpg"
      />

      {/* Ways to Get Involved */}
      <section id="ways" className="py-20 bg-gray-50 px-6 sm:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            title="Ways to Get Involved"
            subtitle="Choose how you want to contribute"
            description="Every contribution strengthens our community and empowers more women"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {ways.map((way, idx) => {
              const Icon = way.icon
              return (
                <Link key={idx} href={way.href}>
                  <div className="bg-white rounded-2xl border border-gray-200 p-8 hover:border-pink-300 hover:shadow-lg transition-all h-full flex flex-col">
                    <div className="w-12 h-12 rounded-lg bg-pink-100 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-pink-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {way.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed flex-1 mb-6">
                      {way.desc}
                    </p>
                    <Button
                      size="sm"
                      className="bg-pink-500 hover:bg-pink-600 text-white rounded-full font-bold h-10"
                    >
                      {way.cta}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Join Section */}
      <section id="join" className="py-20 bg-white px-6 sm:px-12 lg:px-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-6 mb-12">
            <h2 className="text-4xl font-bold text-gray-900">Become a BIG Member</h2>
            <p className="text-xl text-gray-600">
              Start your journey with a community of ambitious women
            </p>
          </div>

          <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl border-2 border-pink-200 p-12">
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  What You Get as a Member
                </h3>
                <ul className="space-y-3">
                  {[
                    'Access to the BIG Community',
                    'Join Sister Circles (Learn, Connect, Earn, Thrive)',
                    'BIG Academy courses and workshops',
                    'Networking events and meetups',
                    'Mentorship opportunities',
                    'Exclusive resources and challenges',
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                      <span className="text-gray-700 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-2xl p-8 border border-pink-200">
                <p className="text-gray-600 mb-6">
                  Ready to join? It only takes a few minutes to get started.
                </p>
                <Link href="/auth/sign-up">
                  <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-full h-12">
                    Create Your Free Account
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Donate Section */}
      <section id="donate" className="py-20 bg-gray-50 px-6 sm:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            title="Support Through Donations"
            subtitle="Fund the programs that change lives"
            description="Every contribution helps us run mentorship circles, workshops, and community events that change lives. Your gift directly funds the tools, spaces, and support women need to thrive."
          />

          {/* Donation Tiers */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 mb-12">
            {donationTiers.map((tier, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-gray-200 p-8 text-center hover:border-pink-300 hover:shadow-lg transition-all"
              >
                <div className="text-5xl mb-4">{tier.icon}</div>
                <p className="text-3xl font-bold text-pink-600 mb-2">
                  {tier.amount}
                </p>
                <p className="text-gray-600 text-sm mb-6">{tier.description}</p>
                <Link href="#donate-form">
                  <Button
                    size="sm"
                    className="w-full bg-pink-500 hover:bg-pink-600 text-white rounded-full font-bold"
                  >
                    Donate
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          {/* Donation Form */}
          <div
            id="donate-form"
            className="bg-white rounded-3xl border-2 border-gray-200 p-12 max-w-2xl mx-auto"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Make a Donation
            </h3>

            <form className="space-y-6">
              {/* Amount */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-900">
                  Donation Amount (KES)
                </label>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[500, 2500, 5000, 10000].map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      className="px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-bold hover:border-pink-500 hover:text-pink-600 transition-colors"
                    >
                      KES {amount.toLocaleString()}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  placeholder="Or enter custom amount"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 focus:outline-none"
                />
              </div>

              {/* Name */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-900">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 focus:outline-none"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-900">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 focus:outline-none"
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-900">
                  Message (Optional)
                </label>
                <textarea
                  placeholder="Share why you're supporting BIG..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 focus:outline-none resize-none"
                />
              </div>

              {/* Submit */}
              <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-full h-12">
                Donate Now
              </Button>

              <p className="text-xs text-gray-500 text-center">
                Your donation is secure and processed through our trusted payment partner
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Volunteer & Partner Section */}
      <section className="py-20 bg-white px-6 sm:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            title="Volunteer & Partnership"
            subtitle="More ways to make an impact"
            description="Whether you have skills to share or a partnership opportunity, we'd love to work together"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
            {/* Volunteer */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl border-2 border-blue-200 p-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Volunteer</h3>
              <p className="text-gray-700 leading-relaxed mb-8">
                Mentors, facilitators, and event volunteers keep our community thriving. Share your skills and time to
                help women rise. Whether you can mentor one person or help organize events, every contribution matters.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">👩‍🏫</span>
                  <div>
                    <p className="font-bold text-gray-900">Mentor</p>
                    <p className="text-sm text-gray-600">Guide women in your area of expertise</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📋</span>
                  <div>
                    <p className="font-bold text-gray-900">Facilitate</p>
                    <p className="text-sm text-gray-600">Lead workshops and discussions</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🎉</span>
                  <div>
                    <p className="font-bold text-gray-900">Event Helper</p>
                    <p className="text-sm text-gray-600">Support community events and meetups</p>
                  </div>
                </div>
              </div>

              <a href="mailto:volunteer@big.org">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full h-12 flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4" />
                  Get in Touch
                </Button>
              </a>
            </div>

            {/* Partner */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl border-2 border-green-200 p-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Partner With Us</h3>
              <p className="text-gray-700 leading-relaxed mb-8">
                We collaborate with organizations, brands, and institutions that share our vision. Together we can reach
                and empower more women across Kenya and beyond. Let's create lasting impact.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🏢</span>
                  <div>
                    <p className="font-bold text-gray-900">Organizations</p>
                    <p className="text-sm text-gray-600">Co-create programs and reach more women</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🏷️</span>
                  <div>
                    <p className="font-bold text-gray-900">Brands</p>
                    <p className="text-sm text-gray-600">Sponsor events and initiatives</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🎓</span>
                  <div>
                    <p className="font-bold text-gray-900">Institutions</p>
                    <p className="text-sm text-gray-600">Partner on training and education</p>
                  </div>
                </div>
              </div>

              <a href="mailto:partnerships@big.org">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold rounded-full h-12 flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4" />
                  Start a Conversation
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 sm:px-12 lg:px-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div>
            <h2 className="text-4xl font-bold mb-3">Stay in the Loop</h2>
            <p className="text-xl text-white/90">
              Get stories, events, and opportunities delivered to your inbox
            </p>
          </div>

          <NewsletterForm />

          <p className="text-sm text-white/80">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gray-50 px-6 sm:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Thank you for believing in BIG
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Whether you join, donate, volunteer, or partner with us, you're helping to build a world where every woman has
            the tools, networks, and support to thrive.
          </p>
          <p className="text-gray-500">
            Questions? Reach out to us at{' '}
            <a href="mailto:hello@big.org" className="text-pink-600 hover:text-pink-700 font-bold">
              hello@big.org
            </a>
          </p>
        </div>
      </section>
    </>
  )
}