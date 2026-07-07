'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SiteFooter } from '@/components/site-footer'
import { useAuth } from '@/lib/auth-context'

const memberAppRoutes = ['/dashboard', '/community', '/feed', '/messages', '/profile', '/settings', '/saved', '/events/my-events', '/opportunities/my', '/big-club', '/admin']

function isMemberAppRoute(pathname: string | null | undefined) {
  if (!pathname) return false
  return memberAppRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))
}

export function FooterGuard() {
  const pathname = usePathname()
  const { isAuthenticated, loading } = useAuth()

  if (loading) return null

  if (isAuthenticated && isMemberAppRoute(pathname)) {
    return null
  }

  if (isAuthenticated) {
    return (
      <footer className="border-t border-slate-200 bg-slate-50/80">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p className="font-medium text-slate-700">© {new Date().getFullYear()} BIG</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/profile" className="transition hover:text-violet-700">Profile</Link>
            <Link href="/settings" className="transition hover:text-violet-700">Settings</Link>
            <Link href="/messages" className="transition hover:text-violet-700">Messages</Link>
          </div>
        </div>
      </footer>
    )
  }

  return <SiteFooter />
}
