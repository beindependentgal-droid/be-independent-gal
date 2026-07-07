'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Bell, BookOpen, CalendarDays, ChevronDown, CircleUserRound, House, Info, LogIn, Menu, MessageCircleMore, Moon, Sun, UsersRound, X } from 'lucide-react'
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
  { href: '/contact', label: 'Contact' },
  { href: '/join', label: 'Join' },
  { href: '/signin', label: 'Sign In' },
]

const authNavLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/community', label: 'Community' },
  { href: '/academy', label: 'Academy' },
  { href: '/circles', label: 'Sister Circles' },
  { href: '/opportunities', label: 'Opportunities' },
  { href: '/events', label: 'Events' },
  { href: '/big-club', label: 'BIG Club' },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const profileMenuRef = useRef<HTMLDivElement>(null)
  const { user, isAuthenticated, signOut } = useAuth()
  const redirectPath = pathname?.startsWith('/auth') ? '/dashboard' : pathname || '/dashboard'
  const menuLinks = isAuthenticated ? authNavLinks : guestNavLinks
  const userName = user?.user_metadata?.full_name || user?.email || 'Member'
  const userRole = user?.user_metadata?.role || user?.user_metadata?.membership_level || 'Member'
  const avatarLabel = user?.user_metadata?.avatar_url ? null : userName.charAt(0).toUpperCase()
  const profileHref = isAuthenticated ? '/profile' : `/signin?redirect=${encodeURIComponent(redirectPath)}`
  const adminHref = '/admin'
  const userRoleLower = typeof user?.user_metadata?.role === 'string' ? user.user_metadata.role.toLowerCase() : ''
  const isSuperAdmin = Boolean(
    isAuthenticated && (
      user?.email?.toLowerCase() === 'athkhassan@gmail.com' ||
      ['admin', 'super_admin', 'superadmin'].includes(userRoleLower)
    ),
  )
  const isTransparentHero = pathname === '/' && !scrolled
  const isMemberAppRoute = ['/dashboard', '/community', '/feed', '/messages', '/profile', '/settings', '/saved', '/events/my-events', '/opportunities/my', '/big-club', '/admin'].some((route) => pathname === route || pathname.startsWith(`${route}/`))

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 18)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const storedTheme = window.localStorage.getItem('theme')
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialTheme = storedTheme === 'dark' || (!storedTheme && systemDark) ? 'dark' : 'light'

    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    setTheme(initialTheme)
    setMounted(true)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    window.localStorage.setItem('theme', theme)
  }, [theme])

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

        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={() => setOpen((value) => !value)}
            className={cn(
              'inline-flex h-10 w-10 items-center justify-center rounded-full border transition',
              isTransparentHero
                ? 'border-white/30 bg-white/10 text-white hover:bg-white/20'
                : 'border-border/70 bg-background text-foreground hover:bg-muted',
            )}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <div className="hidden items-center gap-2 md:flex lg:flex">
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
            <span suppressHydrationWarning>
              {mounted ? (theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />) : <span className="h-5 w-5" />}
            </span>
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
              <Link href="/messages" className="rounded-full border border-border/70 bg-background p-2.5 text-foreground transition hover:bg-muted" aria-label="Messages">
                <MessageCircleMore className="h-4 w-4" />
              </Link>
              <Link href="/notifications" className="rounded-full border border-border/70 bg-background p-2.5 text-foreground transition hover:bg-muted" aria-label="Notifications">
                <Bell className="h-4 w-4" />
              </Link>
              <div ref={profileMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setProfileMenuOpen((value) => !value)}
                  className={cn(
                    'inline-flex items-center gap-3 rounded-full border px-3 py-2 text-sm font-semibold transition hover:bg-muted',
                    isTransparentHero ? 'border-white/30 bg-white/10 text-white backdrop-blur-sm' : 'border-border/70 bg-slate-100 text-slate-900',
                  )}
                >
                  {user?.user_metadata?.avatar_url ? (
                    <Image src={user.user_metadata.avatar_url} alt={userName} width={32} height={32} className="h-8 w-8 rounded-full object-cover" />
                  ) : (
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-700 text-xs font-bold text-white">{avatarLabel}</span>
                  )}
                  <span className="hidden sm:inline">{userName.split(' ')[0]}</span>
                  <span className="hidden rounded-full bg-violet-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-700 sm:inline">{userRole}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {profileMenuOpen ? (
                  <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-200/60">
                    <Link href={profileHref} onClick={() => setProfileMenuOpen(false)} className="block rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
                      Profile
                    </Link>
                    <Link href="/messages" onClick={() => setProfileMenuOpen(false)} className="block rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
                      Messages
                    </Link>
                    <Link href="/settings" onClick={() => setProfileMenuOpen(false)} className="block rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
                      Settings
                    </Link>
                    <button type="button" onClick={() => { setProfileMenuOpen(false); void handleSignOut() }} className="mt-1 flex w-full items-center rounded-xl px-3 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50">
                      Sign out
                    </button>
                  </div>
                ) : null}
              </div>
            </>
          ) : (
            <>
              <Link
                href={`/signin?redirect=${encodeURIComponent(redirectPath)}`}
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
                <Link href={`/join?redirect=${encodeURIComponent(redirectPath)}`}>Become a BIG Member</Link>
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
                <span suppressHydrationWarning>
                  {mounted ? (theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />) : <span className="h-5 w-5" />}
                </span>
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
                    href={`/signin?redirect=${encodeURIComponent(pathname?.startsWith('/auth') ? '/dashboard' : pathname || '/dashboard')}`}
                    onClick={() => setOpen(false)}
                    className="rounded-full border border-secondary/30 px-4 py-2 text-center font-semibold text-secondary transition-colors hover:bg-secondary hover:text-secondary-foreground"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/join"
                    onClick={() => setOpen(false)}
                    className="rounded-full border border-secondary/30 px-4 py-2 text-center font-semibold text-secondary transition-colors hover:bg-secondary hover:text-secondary-foreground"
                  >
                    Join BIG
                  </Link>
                  <Link
                    href={`/auth/sign-up?redirect=${encodeURIComponent(pathname?.startsWith('/auth') ? '/dashboard' : pathname || '/dashboard')}`}
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

      <div className="border-t border-border/60 bg-white/95 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-3">
          {isAuthenticated ? (
            [
              { href: '/dashboard', label: 'Dashboard', icon: House },
              { href: '/community', label: 'Community', icon: UsersRound },
              { href: '/events', label: 'Events', icon: CalendarDays },
              { href: '/big-club', label: 'BIG Club', icon: CircleUserRound },
              { href: '/profile', label: 'Profile', icon: CircleUserRound },
            ].map((item) => {
              const Icon = item.icon
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link key={item.href} href={item.href} className={cn('flex flex-1 flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] font-semibold', active ? 'text-violet-700' : 'text-slate-600')}> 
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })
          ) : (
            [
              { href: '/', label: 'Home', icon: House },
              { href: '/about', label: 'About', icon: Info },
              { href: '/academy', label: 'Academy', icon: BookOpen },
              { href: '/join', label: 'Join', icon: LogIn },
              { href: '/signin', label: 'Sign In', icon: LogIn },
            ].map((item) => {
              const Icon = item.icon
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link key={item.href} href={item.href} className={cn('flex flex-1 flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] font-semibold', active ? 'text-violet-700' : 'text-slate-600')}> 
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })
          )}
        </div>
      </div>
    </header>
  )
}
