'use client'

import { usePathname } from 'next/navigation'
import { SiteFooter } from '@/components/site-footer'

export function FooterGuard() {
  const pathname = usePathname()
  if (pathname?.startsWith('/community')) {
    return null
  }
  return <SiteFooter />
}
