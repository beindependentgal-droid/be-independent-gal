import Link from 'next/link'
import { Mail, MapPin } from 'lucide-react'
import { NewsletterForm } from '@/components/newsletter-form'
import { InstagramIcon, FacebookIcon, LinkedinIcon } from '@/components/social-icons'

const footerNav = [
  {
    title: 'Explore',
    links: [
      { href: '/about', label: 'About Us' },
      { href: '/academy', label: 'BIG Academy' },
      { href: '/community', label: 'Community' },
      { href: '/programs', label: 'Programs & Events' },
      { href: '/contact', label: 'Contact' },
    ],
  },
  {
    title: 'Get Involved',
    links: [
      { href: '/join', label: 'Become a BIG Member' },
      { href: '/contact', label: 'Contact Us' },
      { href: '/academy', label: 'Explore Academy' },
      { href: '/circles', label: 'Join a Circle' },
    ],
  },
]

const socials = [
  { href: '#', label: 'Instagram', icon: InstagramIcon },
  { href: '#', label: 'Facebook', icon: FacebookIcon },
  { href: '#', label: 'LinkedIn', icon: LinkedinIcon },
]

export function SiteFooter() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3">
              <img
                src="/images/big-logo.jpeg"
                alt="Be Independent Gal logo"
                className="h-14 w-14 rounded-full object-cover shadow-sm"
              />
              <div>
                <span className="font-heading text-2xl font-extrabold uppercase tracking-tight">
                  Be Independent Gal
                </span>
                <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-accent">
                  Be Unstoppable Woman
                </p>
              </div>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-secondary-foreground/70">
              A women&apos;s growth movement building independent lives and
              unstoppable futures.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-primary"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {footerNav.map((col) => (
            <div key={col.title}>
              <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-accent">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-secondary-foreground/75 transition-colors hover:text-secondary-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-accent">
              Stay in the loop
            </h3>
            <p className="mt-4 text-sm text-secondary-foreground/75">
              Get stories, events, and opportunities in your inbox.
            </p>
            <div className="mt-4">
              <NewsletterForm variant="footer" />
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-secondary-foreground/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} Be Independent Gal. All rights
            reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-accent" /> Nairobi, Kenya
            </span>
            <a
              href="mailto:hello@beindependentgal.org"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-secondary-foreground"
            >
              <Mail className="h-4 w-4 text-accent" /> hello@beindependentgal.org
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
