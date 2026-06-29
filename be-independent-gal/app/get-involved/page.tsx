import type { Metadata } from 'next'
import Link from 'next/link'
import { Users, Heart, HandHelping, Handshake, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHero } from '@/components/page-hero'
import { SectionHeading } from '@/components/section-heading'
import { JoinForm } from '@/components/forms/join-form'
import { DonateWidget } from '@/components/forms/donate-widget'
import { NewsletterForm } from '@/components/newsletter-form'

export const metadata: Metadata = {
  title: 'Get Involved | Be Independent Gal',
  description:
    'Join the BIG community, donate, volunteer, or partner with us to help women build independent lives and unstoppable futures.',
}

const ways = [
  {
    icon: Users,
    title: 'Join the community',
    desc: 'Become a member and access mentorship, events, and a supportive sisterhood.',
    href: '#join',
  },
  {
    icon: Heart,
    title: 'Donate',
    desc: 'Fund programs that equip women with skills, networks, and opportunity.',
    href: '#donate',
  },
  {
    icon: HandHelping,
    title: 'Volunteer',
    desc: 'Share your time and skills as a mentor, facilitator, or event helper.',
    href: '#volunteer',
  },
  {
    icon: Handshake,
    title: 'Partner with us',
    desc: 'Organizations and brands can collaborate to amplify our impact.',
    href: '#partner',
  },
]

export default function GetInvolvedPage() {
  return (
    <>
      <PageHero
        eyebrow="Be Part Of It"
        title="Get Involved"
        description="There are many ways to join the movement and help women build independent, unstoppable futures."
      />

      <div className="mx-auto mt-10 flex max-w-7xl flex-col items-center justify-center gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
        <Button
          asChild
          size="lg"
          className="w-full rounded-full bg-primary px-8 font-semibold text-primary-foreground hover:bg-primary/90 sm:w-auto"
        >
          <Link href="/auth/sign-up?redirect=/get-involved#join">Become a BIG Member</Link>
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="w-full rounded-full border-secondary/25 px-8 font-semibold text-secondary hover:bg-secondary hover:text-secondary-foreground sm:w-auto"
        >
          <Link href="/auth/login?redirect=/get-involved">Sign In</Link>
        </Button>
      </div>

      {/* Ways to get involved */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ways.map((w) => (
              <a
                key={w.title}
                href={w.href}
                className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-lg"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <w.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-heading text-lg font-bold text-secondary">
                  {w.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {w.desc}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Join */}
      <section id="join" className="scroll-mt-20 bg-muted/40 py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Join the Community"
            title="Become a BIG Member"
            subtitle="Tell us a little about yourself and we’ll welcome you into the movement."
          />
          <div className="mt-10">
            <JoinForm redirect="/get-involved#join" />
          </div>
        </div>
      </section>

      {/* Donate */}
      <section id="donate" className="scroll-mt-20 py-20">
        <div className="mx-auto grid max-w-7xl items-start gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Donate"
              title="Power The Movement"
            />
            <p className="mt-6 leading-relaxed text-muted-foreground">
              Every contribution helps us run mentorship circles, workshops, and
              community events that change lives. Your gift directly funds the
              tools, spaces, and support women need to thrive.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="font-heading font-bold text-primary">KES 500</span>
                provides workshop materials for one woman.
              </li>
              <li className="flex gap-3">
                <span className="font-heading font-bold text-primary">KES 2,500</span>
                sponsors a mentorship session.
              </li>
              <li className="flex gap-3">
                <span className="font-heading font-bold text-primary">KES 5,000</span>
                helps host a community event.
              </li>
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-muted/30 p-2">
            <DonateWidget />
          </div>
        </div>
      </section>

      {/* Volunteer & Partner */}
      <section className="bg-muted/40 py-20">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
          <div
            id="volunteer"
            className="scroll-mt-20 rounded-2xl border border-border bg-card p-8"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-primary">
              <HandHelping className="h-6 w-6" />
            </span>
            <h3 className="mt-5 font-heading text-xl font-bold text-secondary">
              Volunteer
            </h3>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Mentors, facilitators, and event volunteers keep our community
              thriving. Share your skills and time to help women rise. Reach out
              and tell us how you&apos;d like to help.
            </p>
            <a
              href="/contact"
              className="mt-5 inline-flex items-center gap-1.5 font-semibold text-primary hover:text-primary/80"
            >
              <Mail className="h-4 w-4" /> Get in touch
            </a>
          </div>
          <div
            id="partner"
            className="scroll-mt-20 rounded-2xl border border-border bg-card p-8"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-primary">
              <Handshake className="h-6 w-6" />
            </span>
            <h3 className="mt-5 font-heading text-xl font-bold text-secondary">
              Partner With Us
            </h3>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              We collaborate with organizations, brands, and institutions that
              share our vision. Together we can reach and empower more women
              across Kenya and beyond.
            </p>
            <a
              href="/contact"
              className="mt-5 inline-flex items-center gap-1.5 font-semibold text-primary hover:text-primary/80"
            >
              <Mail className="h-4 w-4" /> Start a conversation
            </a>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-secondary py-20 text-secondary-foreground">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-extrabold uppercase tracking-tight">
            Stay in the loop
          </h2>
          <p className="mt-4 leading-relaxed text-secondary-foreground/80">
            Get stories, events, and opportunities delivered to your inbox.
          </p>
          <div className="mx-auto mt-8 max-w-md">
            <NewsletterForm variant="footer" />
          </div>
        </div>
      </section>
    </>
  )
}
