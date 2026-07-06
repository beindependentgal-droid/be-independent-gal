'use client'

import { usePathname } from 'next/navigation'
import { SiteFooter } from '@/components/site-footer'
import { useAuth } from '@/lib/auth-context'

export function FooterGuard() {
  const pathname = usePathname()
  const { isAuthenticated, loading } = useAuth()

  if (loading) return null
  if (isAuthenticated) return null
  if (pathname?.startsWith('/community')) {
    return null
  }

  return <SiteFooter />
}
