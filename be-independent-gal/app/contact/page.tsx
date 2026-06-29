import type { Metadata } from 'next'
import { Mail, MapPin, Phone } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { InstagramIcon, FacebookIcon, LinkedinIcon } from '@/components/social-icons'
import { ContactForm } from '@/components/forms/contact-form'

export const metadata: Metadata = {
  title: 'Contact | Be Independent Gal',
  description:
    'Get in touch with Be Independent Gal (BIG). Reach out about membership, partnerships, volunteering, or general inquiries.',
}

const details = [
  {
    icon: Mail,
    title: 'Email',
    value: 'hello@beindependentgal.org',
    href: 'mailto:hello@beindependentgal.org',
  },
  {
    icon: Phone,
    title: 'Phone',
    value: '+254 700 000 000',
    href: 'tel:+254700000000',
  },
  {
    icon: MapPin,
    title: 'Location',
    value: 'Nairobi, Kenya',
  },
]

const socials = [
  { href: '#', label: 'Instagram', icon: InstagramIcon },
  { href: '#', label: 'Facebook', icon: FacebookIcon },
  { href: '#', label: 'LinkedIn', icon: LinkedinIcon },
]

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="We’d Love To Hear From You"
        title="Get In Touch"
        description="Questions, ideas, or ready to collaborate? Send us a message and we’ll be in touch."
      />

      <section className="py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-5 lg:px-8">
          <div className="lg:col-span-2">
            <h2 className="font-heading text-2xl font-extrabold uppercase tracking-tight text-secondary">
              Reach Out
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Whether you want to join the movement, partner with us, or simply
              say hello, we&apos;re here for you.
            </p>

            <div className="mt-8 space-y-4">
              {details.map((d) => {
                const content = (
                  <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <d.icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-heading text-sm font-bold uppercase tracking-wide text-secondary">
                        {d.title}
                      </p>
                      <p className="mt-0.5 text-muted-foreground">{d.value}</p>
                    </div>
                  </div>
                )
                return d.href ? (
                  <a key={d.title} href={d.href} className="block">
                    {content}
                  </a>
                ) : (
                  <div key={d.title}>{content}</div>
                )
              })}
            </div>

            <div className="mt-8">
              <p className="font-heading text-sm font-bold uppercase tracking-wide text-secondary">
                Follow us
              </p>
              <div className="mt-3 flex items-center gap-3">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    <s.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  )
}
