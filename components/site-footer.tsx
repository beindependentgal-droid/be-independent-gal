'use client'

import Link from 'next/link'

const footerLinks = [
  { href: '/academy', label: 'Academy' },
  { href: '/join', label: 'Join' },
  { href: '/mentorship', label: 'Mentorship' },
  { href: '/contact', label: 'Support' },
]

const legalLinks = [
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
  { href: '/cookies', label: 'Cookies' },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white/95">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <p className="text-xl font-semibold text-slate-900">BIG Academy</p>
            <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">
              Practical learning and mentorship for women who want to grow skills, income, and independence.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-900">Explore</p>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              {footerLinks.map((link) => (
                <Link key={link.label} href={link.href} className="block transition hover:text-primary">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-900">Legal</p>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              {legalLinks.map((link) => (
                <Link key={link.label} href={link.href} className="block transition hover:text-primary">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-slate-200/80 pt-6 text-sm text-slate-600 sm:flex sm:items-center sm:justify-between">
          <p className="font-medium text-slate-700">© {new Date().getFullYear()} BIG</p>
          <p className="mt-3 sm:mt-0">Built to support your next step.</p>
        </div>
      </div>
    </footer>
  )
}
