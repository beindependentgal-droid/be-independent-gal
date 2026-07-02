import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Mail, MapPin, Phone, Copy, Clock, Users, Handshake, Gift, Calendar, BookOpen } from 'lucide-react'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
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

// contactDetails and socialLinks moved inline into the layout for tighter control

export default function ContactPage() {
  return (
    <>
        {/* Hero */}
        <section className="relative overflow-hidden bg-white">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl sm:text-5xl font-semibold leading-tight text-slate-900">
                  Let&apos;s Start a Conversation
                </h1>
                <p className="mt-6 text-lg text-slate-700 max-w-2xl">
                  Whether you want to join BIG, partner with us, volunteer, sponsor a program, speak at an event, or simply ask a question—we&apos;re excited to hear from you.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <a href="#contact-form">
                    <Button className="rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground">Send a Message</Button>
                  </a>
                  <Link href="/join">
                    <Button variant="outline" className="rounded-full border border-slate-200 px-6 py-3 font-semibold">Become a BIG Member</Button>
                  </Link>
                </div>
              </div>

              <div className="relative h-72 w-full overflow-hidden rounded-2xl bg-slate-50">
                <Image src="/images/mbl.jpg" alt="Women collaborating" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
              </div>
            </div>
          </div>
        </section>

        {/* Contact Cards & Form */}
        <section className="py-16 bg-white px-6 sm:px-12 lg:px-16">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-1 space-y-6">
              {/* Contact Cards */}
              <div className="space-y-4">
                {[
                  { icon: Mail, title: 'Email', value: 'hello@beindependentgal.com', href: 'mailto:hello@beindependentgal.com' },
                  { icon: Phone, title: 'Phone', value: '+254 725 156 897', href: 'tel:+254725156897' },
                  { icon: MapPin, title: 'Location', value: 'Nairobi, Kenya' },
                  { icon: Clock, title: 'Office Hours', value: 'Mon–Fri 9:00–17:00, Sat 10:00–14:00' },
                ].map((c) => {
                  const Icon = c.icon
                  return (
                    <div key={c.title} className="group relative flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 hover:shadow-lg transition-all">
                      <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-4">
                          <h4 className="text-sm font-semibold text-slate-900">{c.title}</h4>
                          {c.href && (
                            <button
                              onClick={() => navigator.clipboard?.writeText(c.value)}
                              aria-label={`Copy ${c.title}`}
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-sm text-slate-500"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                        <p className="mt-1 text-base font-medium text-slate-900">{c.value}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Social Community */}
              <div>
                <h3 className="text-base font-semibold text-slate-900 mb-4">Social Community</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: 'Instagram', url: 'https://instagram.com/beindependentgal' },
                    { name: 'Facebook', url: 'https://facebook.com/beindependentgal' },
                    { name: 'LinkedIn', url: 'https://linkedin.com/company/beindependentgal' },
                    { name: 'TikTok', url: 'https://tiktok.com/@be.independent.gal' },
                  ].map((s) => (
                    <a key={s.name} href={s.url} target="_blank" rel="noreferrer" className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-3 hover:shadow-md transition">
                      <div className="h-10 w-10 rounded-md bg-slate-100 flex items-center justify-center text-slate-700">{s.name[0]}</div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{s.name}</div>
                        <div className="text-xs text-slate-500">12.3k followers</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div id="contact-form" className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-semibold text-slate-900">Send a Message</h2>
                <p className="mt-2 text-slate-600">Complete the form and we&apos;ll respond as soon as possible.</p>
                <div className="mt-6">
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </section>

      {/* Department Directory */}
      <section className="py-20 bg-gray-50 px-6 sm:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Department Directory</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Membership', desc: 'Questions about joining BIG or membership benefits', email: 'membership@big.org', icon: Users, eta: '1-2 business days' },
              { title: 'Partnerships', desc: 'Corporate partnerships, sponsorships, and collaborations', email: 'partnerships@big.org', icon: Handshake, eta: '2-3 business days' },
              { title: 'Academy', desc: 'Course content, workshops, and learning programs', email: 'academy@big.org', icon: BookOpen, eta: '1-2 business days' },
              { title: 'BIG Fund', desc: 'Funding applications and investment inquiries', email: 'fund@big.org', icon: Gift, eta: '5-7 business days' },
              { title: 'Events', desc: 'Event hosting, sponsorship, or attendance questions', email: 'events@big.org', icon: Calendar, eta: '2-4 business days' },
              { title: 'General Support', desc: 'All other questions and feedback', email: 'hello@big.org', icon: Mail, eta: '1-2 business days' },
            ].map((d, i) => {
              const Icon = d.icon
              return (
                <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center"><Icon className="h-6 w-6" /></div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900">{d.title}</h3>
                      <p className="text-sm text-slate-600 mt-1">{d.desc}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <a href={`mailto:${d.email}`} className="text-sm font-semibold text-primary">{d.email}</a>
                        <span className="text-xs text-slate-500">Response: {d.eta}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Quick Help */}
      <section className="py-16 bg-white px-6 sm:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">How can we help?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { title: 'Become a Member', href: '/join' },
              { title: 'Partner with BIG', href: '/get-involved' },
              { title: 'Sponsor an Event', href: '/fund/apply' },
              { title: 'Volunteer', href: '/get-involved' },
              { title: 'Join the Academy', href: '/academy' },
              { title: 'Start a Sister Circle', href: '/circles' },
              { title: 'Apply for Funding', href: '/fund/apply' },
              { title: 'Partner Programs', href: '/opportunities' },
            ].map((h) => (
              <Link key={h.title} href={h.href} className="rounded-2xl border border-gray-200 p-6 text-center hover:shadow-md transition flex flex-col items-center gap-3">
                <div className="h-12 w-12 rounded-md bg-slate-100 flex items-center justify-center text-slate-700">{h.title[0]}</div>
                <div className="font-semibold text-sm text-slate-900">{h.title}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Visit Us */}
      <section className="py-16 bg-gray-50 px-6 sm:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div>
            <h3 className="text-2xl font-semibold text-slate-900">Visit Us</h3>
            <p className="mt-3 text-slate-600">Office Address</p>
            <address className="not-italic mt-4 text-slate-700">Suite 4B, Riverside Building, Riverside Drive, Nairobi, Kenya</address>
            <h4 className="mt-6 font-semibold text-slate-900">Directions & Parking</h4>
            <p className="mt-2 text-slate-600">Street parking available nearby. Visitor parking at the adjacent lot (entrance on River Road). Public transport: buses and Matatus stop at Riverside.</p>
            <p className="mt-3 text-sm text-slate-500">Nearby landmark: Riverside Shopping Complex</p>
          </div>
          <div>
            <div className="aspect-[16/9] w-full overflow-hidden rounded-2xl bg-slate-100">
              <iframe title="BIG office map" loading="lazy" src="https://www.google.com/maps/embed?pb=!1m18!2m..." className="w-full h-full border-0" />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white px-6 sm:px-12 lg:px-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Frequently asked questions</h2>
          <Accordion type="single" collapsible>
            {[
              { q: 'How long does it take to receive a reply?', a: 'We aim to respond within 24-72 business hours depending on the department and request.' },
              { q: 'How do I become a BIG member?', a: 'Visit our membership page and complete the application. A team member will follow up.' },
              { q: 'How do I partner with BIG?', a: 'Contact partnerships@big.org with details about your organisation and proposal.' },
              { q: 'How do I become a mentor?', a: 'Apply via the Academy page; mentors are matched to programs and circles.' },
              { q: 'How do I apply for BIG Fund?', a: 'See the BIG Fund page for eligibility and the application form.' },
              { q: 'Can I volunteer?', a: 'Yes — we welcome volunteers. Check our Get Involved page.' },
              { q: 'How do I join a Sister Circle?', a: 'Explore Circles and use the Join link on the circle you are interested in.' },
            ].map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger>{f.q}</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-slate-600">{f.a}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 bg-primary/5 px-6 sm:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-2xl font-semibold text-slate-900">We&apos;re Here for You</h3>
          <p className="mt-3 text-slate-700 max-w-3xl mx-auto">Every message matters to us. Whether your question is big or small, our team is committed to responding with care, respect, and as quickly as possible.</p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-white px-6 sm:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto rounded-2xl bg-gradient-to-r from-primary to-accent p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-semibold">Ready to Become Part of BIG?</h2>
            <p className="mt-2 max-w-xl">Join a movement where women learn, connect, build opportunities, and thrive together.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/join"><Button className="rounded-full bg-white text-primary font-semibold">Become a BIG Member</Button></Link>
            <Link href="/academy"><Button variant="outline" className="rounded-full border-white text-white">Explore BIG Academy</Button></Link>
          </div>
        </div>
      </section>

      {/* FAQ Quick Links */}
      <section className="py-16 bg-white px-6 sm:px-12 lg:px-16 border-t border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Can&apos;t find what you&apos;re looking for?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Check out our FAQ sections for quick answers to common questions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/fund/faq">
              <Button className="bg-secondary- hover:bg-secondary- text-white font-bold rounded-full h-12 px-8">
                BIG Fund FAQ
              </Button>
            </Link>
            <Link href="/circles">
              <Button variant="outline" className="border-2 border-secondary- text-secondary- hover:bg-secondary- font-bold rounded-full h-12 px-8">
                Circles FAQ
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
