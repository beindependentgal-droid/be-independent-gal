'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, Moon, Sun, X } from 'lucide-react'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth-context'

const guestNavLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/academy', label: 'Academy' },
  { href: '/circles', label: 'Circles' },
  { href: '/opportunities', label: 'Opportunities' },
  { href: '/programs', label: 'Programs' },
  { href: '/fund', label: 'BIG Fund' },
  { href: '/join', label: 'Join' },
  { href: '/contact', label: 'Contact' },
]

const authNavLinks = [
  { href: '/community', label: 'Community' },
  { href: '/academy', label: 'Academy' },
  { href: '/circles', label: 'Circles' },
  { href: '/opportunities', label: 'Opportunities' },
  { href: '/programs', label: 'Programs' },
  { href: '/fund', label: 'BIG Fund' },
  { href: '/contact', label: 'Contact' },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAuthenticated, signOut } = useAuth()
  const redirectPath = pathname?.startsWith('/auth') ? '/community' : pathname || '/community'
  const menuLinks = isAuthenticated ? authNavLinks : guestNavLinks
  const userName = user?.user_metadata?.full_name || user?.email || 'Member'
  const userRole = user?.user_metadata?.role || 'Member'
  const avatarLabel = user?.user_metadata?.avatar_url ? null : userName.charAt(0).toUpperCase()
  const profileHref = isAuthenticated ? '/auth/profile' : `/auth/login?redirect=${encodeURIComponent(redirectPath)}`
  const adminHref = '/admin'
  const userRoleLower = typeof user?.user_metadata?.role === 'string' ? user.user_metadata.role.toLowerCase() : ''
  const isSuperAdmin = Boolean(
    isAuthenticated && (
      user?.email?.toLowerCase() === 'athkhassan@gmail.com' ||
      ['admin', 'super_admin', 'superadmin'].includes(userRoleLower)
    ),
  )
  const isTransparentHero = pathname === '/' && !scrolled

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 18)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [isThemeLoaded, setIsThemeLoaded] = useState(false)

  useEffect(() => {
    const storedTheme = typeof window !== 'undefined' ? window.localStorage.getItem('theme') : null
    const systemDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialTheme = storedTheme === 'dark' || (!storedTheme && systemDark) ? 'dark' : 'light'

    setTheme(initialTheme)
    setIsThemeLoaded(true)
    document.documentElement.classList.toggle('dark', initialTheme === 'dark')
  }, [])

  const toggleTheme = useCallback(() => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
    window.localStorage.setItem('theme', nextTheme)
    document.documentElement.classList.toggle('dark', nextTheme === 'dark')
  }, [theme])

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b transition-all duration-300',
        isTransparentHero
          ? 'border-transparent bg-transparent backdrop-blur-none'
          : 'border-border/60 bg-white/95 shadow-[0_10px_30px_-20px_rgba(15,23,42,0.3)] backdrop-blur-xl',
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo onLight={!isTransparentHero} showText={false} />

        <nav className="hidden items-center gap-1 lg:flex">
          {menuLinks.map((link) => {
            const active =
              link.href === '/'
                ? pathname === '/'
                : pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'rounded-full px-4 py-2 text-nav font-heading font-medium transition-colors duration-300',
                  active
                    ? isTransparentHero
                      ? 'bg-white/20 text-white underline decoration-white/40 underline-offset-4 font-semibold'
                      : 'bg-primary/10 text-primary underline decoration-primary/50 underline-offset-4 font-semibold'
                    : isTransparentHero
                      ? 'text-white/80 hover:text-secondary hover:bg-white/10'
                      : 'text-foreground/70 hover:text-secondary hover:bg-muted',
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <button
          type="button"
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setOpen((value) => !value)}
          className={cn(
            'inline-flex h-10 w-10 items-center justify-center rounded-full border transition lg:hidden',
            isTransparentHero
              ? 'border-white/30 bg-white/10 text-white hover:bg-white/20'
              : 'border-border/70 bg-background text-foreground hover:bg-muted',
          )}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <div className="hidden items-center gap-2 lg:flex">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className={cn(
              'inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-300',
              isTransparentHero
                ? 'border-white/30 bg-white/10 text-white hover:bg-white/20'
                : 'border-border/70 bg-background text-foreground hover:bg-muted',
            )}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {isAuthenticated ? (
            <>
              {isSuperAdmin ? (
                <Link
                  href={adminHref}
                  className={cn(
                    'rounded-full border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-100',
                    isTransparentHero ? 'border-white/40 bg-white/10 text-white backdrop-blur-sm' : '',
                  )}
                >
                  Superadmin
                </Link>
              ) : null}
              <Link
                href={profileHref}
                className={cn(
                  'inline-flex items-center gap-3 rounded-full border px-4 py-2 text-sm font-semibold transition hover:bg-muted',
                  isTransparentHero
                    ? 'border-white/30 bg-white/10 text-white backdrop-blur-sm'
                    : 'border-border/70 bg-slate-100 text-slate-900',
                )}
              >
                {user?.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt={userName}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-700 text-xs font-bold text-white">
                    {avatarLabel}
                  </span>
                )}
                <div className="flex flex-col text-left">
                  <span>Hey, {userName.split(' ')[0]}</span>
                  <span className="text-[11px] uppercase tracking-[0.24em] text-slate-500">{userRole}</span>
                </div>
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-full border border-secondary/30 px-4 py-2 text-sm font-semibold text-secondary transition-colors hover:bg-secondary hover:text-secondary-foreground"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href={`/auth/login?redirect=${encodeURIComponent(redirectPath)}`}
                className="rounded-full border border-secondary/30 px-4 py-2 text-sm font-semibold text-secondary transition-colors hover:bg-secondary hover:text-secondary-foreground"
              >
                Sign In
              </Link>
              <Button
                asChild
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                  isTransparentHero
                    ? 'bg-white text-[#5B21B6] hover:bg-white/90'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90',
                )}
              >
                <Link href={`/auth/sign-up?redirect=${encodeURIComponent(redirectPath)}`}>Become a BIG Member</Link>
              </Button>
            </>
          )}
        </div>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
            {menuLinks.map((link) => {
              const active =
                link.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'rounded-lg px-4 py-3 text-base font-semibold transition-colors',
                    active
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground/80 hover:bg-muted',
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
            <div className="mt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Toggle dark mode"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-background text-foreground transition-colors hover:bg-muted"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              {isAuthenticated ? (
                <>
                  {isSuperAdmin ? (
                    <Link
                      href={adminHref}
                      onClick={() => setOpen(false)}
                      className="rounded-full border border-amber-300 bg-amber-50 px-4 py-2 text-center font-semibold text-amber-700 transition-colors hover:bg-amber-100"
                    >
                      Superadmin
                    </Link>
                  ) : null}
                  <Link
                    href={profileHref}
                    onClick={() => setOpen(false)}
                    className="rounded-full border border-border/70 px-4 py-2 text-center font-semibold text-foreground transition-colors hover:bg-muted"
                  >
                    My Profile
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false)
                      handleSignOut()
                    }}
                    className="rounded-full bg-primary px-4 py-2 text-center font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/join"
                    onClick={() => setOpen(false)}
                    className="rounded-full border border-secondary/30 px-4 py-2 text-center font-semibold text-secondary transition-colors hover:bg-secondary hover:text-secondary-foreground"
                  >
                    Join BIG
                  </Link>
                  <Link
                    href={`/auth/sign-up?redirect=${encodeURIComponent(pathname?.startsWith('/auth') ? '/community' : pathname || '/community')}`}
                    onClick={() => setOpen(false)}
                    className="rounded-full bg-primary px-4 py-2 text-center font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Become a BIG Member
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
