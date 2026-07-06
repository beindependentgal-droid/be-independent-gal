'use client'

import Link from 'next/link'

const footerLinks = [
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
  { href: '/contact', label: 'Support' },
  { href: '/contact', label: 'Contact' },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white/90">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p className="font-medium text-slate-700">© {new Date().getFullYear()} BIG</p>
        <div className="flex flex-wrap items-center gap-4">
          {footerLinks.map((link) => (
            <Link key={link.label} href={link.href} className="transition hover:text-violet-700">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
