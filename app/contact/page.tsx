import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Mail, MapPin, Phone, Clock } from 'lucide-react'
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

              <div className="relative h-72 w-full overflow-hidden rounded-3xl bg-slate-50">
                <Image src="/images/event.png" alt="Women at a BIG community event" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
              </div>
            </div>
          </div>
        </section>

      {/* Contact Cards */}
      <section className="py-16 bg-white px-6 sm:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { icon: Mail, title: 'Email', value: 'hello@beindependentgal.com', href: 'mailto:hello@beindependentgal.com', action: 'Send email' },
              { icon: Phone, title: 'Phone & WhatsApp', value: '+254 725 156 897', href: 'tel:+254725156897', action: 'Call or WhatsApp' },
              { icon: MapPin, title: 'Location', value: 'Based in Nairobi, Kenya', href: 'https://www.google.com/maps/search/?api=1&query=Nairobi+Kenya', action: 'View directions' },
              { icon: Clock, title: 'Office hours', value: 'Mon–Fri 9:00–17:00 EAT' },
            ].map((c) => {
              const Icon = c.icon
              return (
                <div key={c.title} className="group flex items-center gap-4 rounded-3xl border border-gray-200 bg-white p-6 hover:shadow-2xl transition-all">
                  <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-slate-900">{c.title}</h4>
                    <p className="mt-1 text-base font-medium text-slate-900">{c.value}</p>
                    {c.href && (
                      <div className="mt-3">
                        <a href={c.href} className="text-sm text-primary font-semibold">{c.action}</a>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Ways to Connect */}
      <section className="py-12 bg-gray-50 px-6 sm:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Ways to connect</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { title: 'Become a Member', href: '/join' },
              { title: 'Join BIG Academy', href: '/academy' },
              { title: 'Start a Sister Circle', href: '/circles' },
              { title: 'Explore Opportunities', href: '/opportunities' },
            ].map((w) => (
              <Link key={w.title} href={w.href} className="rounded-3xl border border-gray-200 bg-white p-6 text-center hover:shadow-lg transition flex flex-col items-center gap-4">
                <div className="h-12 w-12 rounded-md bg-slate-100 flex items-center justify-center text-slate-700">{w.title[0]}</div>
                <div className="font-semibold text-sm text-slate-900">{w.title}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-white px-6 sm:px-12 lg:px-16">
        <div className="max-w-4xl mx-auto">
          <div id="contact-form" className="rounded-3xl border border-gray-200 bg-white p-10 shadow-xl">
            <h2 className="text-2xl font-semibold text-slate-900">Send a Message</h2>
            <p className="mt-2 text-slate-600">Every conversation starts with a hello. Whether you&apos;re exploring BIG for the first time, looking for opportunities, interested in partnering with us, or simply have a question, we&apos;d love to hear from you.</p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>


      {/* Based in Nairobi */}
      <section className="py-12 bg-gray-50 px-6 sm:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-2xl font-semibold text-slate-900">Based in Nairobi, Kenya</h3>
          <p className="mt-3 text-slate-600 max-w-3xl mx-auto">Serving women across Kenya and Africa through digital learning, community programs, and events. We run online courses, virtual circles, and regional meetups—reach out and we&apos;ll connect you with the right team.</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white px-6 sm:px-12 lg:px-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Frequently asked questions</h2>
          <Accordion type="single">
            {[
              { q: 'How do I become a BIG member?', a: 'Visit our membership page and complete the application. A team member will follow up.' },
              { q: 'Is BIG free to join?', a: 'BIG offers a mix of free and paid programs. Membership provides access to community benefits—check the membership page for current options.' },
              { q: 'How do I join a Sister Circle?', a: 'Explore Circles and use the Join link on the circle you are interested in.' },
              { q: 'How do I partner with BIG?', a: 'Tell us about your organisation via the contact form and choose "Partnerships" as the department.' },
              { q: 'How long does it take to receive a response?', a: 'We typically reply within 1-3 business days. Complex requests may take slightly longer.' },
            ].map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger>{f.q}</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-slate-600">{f.a}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-600">Still have a question? We&apos;d love to help.</p>
            <Link href="#contact-form" className="mt-4 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90">Contact Us →</Link>
          </div>
        </div>
      </section>

      {/* Social Community */}
      <section className="py-12 bg-white px-6 sm:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-semibold text-slate-900 mb-6">Social Community</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { name: 'Instagram', url: 'https://instagram.com/beindependentgal', desc: 'Stories, events & community' },
              { name: 'Facebook', url: 'https://facebook.com/beindependentgal', desc: 'Stories, events & community' },
              { name: 'LinkedIn', url: 'https://linkedin.com/company/beindependentgal', desc: 'Stories, events & community' },
              { name: 'TikTok', url: 'https://tiktok.com/@be.independent.gal', desc: 'Stories, events & community' },
              { name: 'YouTube', url: 'https://youtube.com', desc: 'Stories, events & community' },
              { name: 'X', url: 'https://x.com/beindependentgal', desc: 'Stories, events & community' },
            ].map((s) => (
              <a key={s.name} href={s.url} target="_blank" rel="noreferrer" className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 hover:shadow-md transition">
                <div className="h-12 w-12 rounded-md bg-slate-100 flex items-center justify-center text-slate-700">{s.name[0]}</div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">{s.name}</div>
                  <div className="text-xs text-slate-500">{s.desc}</div>
                </div>
                <div className="ml-auto text-sm text-primary font-semibold">Follow</div>
              </a>
            ))}
          </div>
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
              <Button className="bg-primary text-white font-bold rounded-full h-12 px-8 hover:bg-primary/90">
                BIG Fund FAQ
              </Button>
            </Link>
            <Link href="/circles">
              <Button variant="outline" className="border-2 border-primary text-primary hover:bg-primary/10 font-bold rounded-full h-12 px-8">
                Circles FAQ
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
