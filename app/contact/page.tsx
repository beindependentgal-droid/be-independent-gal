import type { Metadata } from 'next'
import Link from 'next/link'
import { Mail, MapPin, Phone, Send } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { Button } from '@/components/ui/button'
import { ContactForm } from '@/components/forms/contact-form'

export const metadata: Metadata = {
  title: 'Contact | BIG',
  description:
    'Get in touch with Be Independent Gal (BIG). Reach out about membership, partnerships, volunteering, or general inquiries.',
  openGraph: {
    title: 'Contact Us | BIG',
    description: 'Contact Be Independent Gal',
    images: ['/og-image.jpg'],
  },
}

const contactDetails = [
  {
    icon: Mail,
    title: 'Email',
    value: 'hello@beindependentgal.com',
    href: 'mailto:hello@beindependentgal.com',
  },
  {
    icon: Phone,
    title: 'Phone',
    value: '+254 725 156 897',
    href: 'tel:+254725156897',
  },
  {
    icon: MapPin,
    title: 'Location',
    value: 'Nairobi, Kenya',
  },
]

const socialLinks = [
  {
    name: 'Instagram',
    url: 'https://instagram.com/beindependentgal',
    icon: '📷',
  },
  {
    name: 'Facebook',
    url: 'https://facebook.com/beindependentgal',
    icon: '👍',
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/company/beindependentgal',
    icon: '🔗',
  },
  {
    name: 'X',
    url: 'https://x.com/beindependentgal',
    icon: '𝕏',
  },
  {
    name: 'TikTok',
    url: 'https://tiktok.com/@be.independent.gal',
    icon: '🎵',
  },
]

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <PageHero
        title="Get in Touch"
        subtitle="We'd love to hear from you"
        description="Whether you want to join the movement, partner with us, volunteer, or simply say hello, we're here for you."
        cta1={{ text: 'Send Message', href: '#contact-form' }}
        cta2={{ text: 'Learn More', href: '/' }}
        imageSrc="/images/contact-hero.jpg"
      />

      {/* Contact Section */}
      <section className="py-20 bg-white px-6 sm:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left - Contact Info */}
          <div className="space-y-12">
            {/* Direct Contact */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Contact Information
              </h2>

              <div className="space-y-6">
                {contactDetails.map((detail, idx) => {
                  const Icon = detail.icon
                  const content = (
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-pink-100 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-pink-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                          {detail.title}
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {detail.value}
                        </p>
                      </div>
                    </div>
                  )

                  return (
                    <div key={idx}>
                      {detail.href ? (
                        <a
                          href={detail.href}
                          className="hover:text-pink-600 transition-colors"
                        >
                          {content}
                        </a>
                      ) : (
                        content
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Office Hours */}
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl border border-pink-200 p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Office Hours
              </h3>
              <div className="space-y-2 text-gray-700">
                <p>Monday - Friday: 9:00 AM - 5:00 PM EAT</p>
                <p>Saturday: 10:00 AM - 2:00 PM EAT</p>
                <p>Sunday: Closed</p>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                We aim to respond to all inquiries within 24 business hours.
              </p>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                Follow Us
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {socialLinks.map((social, idx) => (
                  <a
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-pink-50 border border-gray-200 hover:border-pink-300 transition-all group"
                  >
                    <span className="text-2xl">{social.icon}</span>
                    <span className="font-medium text-gray-900 group-hover:text-pink-600 transition-colors">
                      {social.name}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Contact Form */}
          <div>
            <div id="contact-form" className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 p-8 lg:p-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Send us a Message
              </h2>
              <p className="text-gray-600 mb-8">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>

              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Department Routes */}
      <section className="py-20 bg-gray-50 px-6 sm:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Reach the Right Team
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Membership',
                description: 'Questions about joining BIG or membership benefits',
                email: 'membership@big.org',
              },
              {
                title: 'Partnerships',
                description: 'Corporate partnerships, sponsorships, and collaborations',
                email: 'partnerships@big.org',
              },
              {
                title: 'BIG Fund',
                description: 'Funding applications and investment inquiries',
                email: 'fund@big.org',
              },
              {
                title: 'Events',
                description: 'Event hosting, sponsorship, or attendance questions',
                email: 'events@big.org',
              },
              {
                title: 'Academy',
                description: 'Course content, workshops, and learning programs',
                email: 'academy@big.org',
              },
              {
                title: 'General Inquiry',
                description: 'All other questions and feedback',
                email: 'hello@big.org',
              },
            ].map((dept, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-pink-300 hover:shadow-lg transition-all"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {dept.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{dept.description}</p>
                <a
                  href={`mailto:${dept.email}`}
                  className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-bold text-sm"
                >
                  {dept.email}
                  <Send className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Quick Links */}
      <section className="py-16 bg-white px-6 sm:px-12 lg:px-16 border-t border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Can't find what you're looking for?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Check out our FAQ sections for quick answers to common questions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/fund/faq">
              <Button className="bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-full h-12 px-8">
                BIG Fund FAQ
              </Button>
            </Link>
            <Link href="/circles">
              <Button variant="outline" className="border-2 border-pink-500 text-pink-600 hover:bg-pink-50 font-bold rounded-full h-12 px-8">
                Circles FAQ
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
