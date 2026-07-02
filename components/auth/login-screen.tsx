'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Check } from 'lucide-react'
import LoginForm from '@/components/auth/login-form'
import { useAuth } from '@/lib/auth-context'

interface LoginScreenProps {
  searchParams: Promise<{
    redirect?: string
    from?: string
  }>
}

const DEFAULT_AUTH_REDIRECT = '/dashboard'

const isValidRedirect = (path?: string) => path?.startsWith('/') && !path.startsWith('//')

const benefits = [
  'Access your Academy courses',
  'Join your Sister Circles',
  'Discover new opportunities',
  'Manage your BIG profile',
]

export default function LoginScreen({ searchParams }: LoginScreenProps) {
  const router = useRouter()
  const { isAuthenticated, loading } = useAuth()
  const [redirect, setRedirect] = useState(DEFAULT_AUTH_REDIRECT)
  const [googleReturn, setGoogleReturn] = useState(false)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    let isMounted = true

    const resolveParams = async () => {
      const params = await searchParams
      if (isMounted) {
        setRedirect(isValidRedirect(params.redirect) ? params.redirect! : DEFAULT_AUTH_REDIRECT)
        setGoogleReturn(params.from === 'google')
        setIsReady(true)
      }
    }

    resolveParams()

    return () => {
      isMounted = false
    }
  }, [searchParams])

  useEffect(() => {
    if (!loading && isAuthenticated && isReady) {
      router.replace(redirect)
    }
  }, [loading, isAuthenticated, redirect, router, isReady])

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-fuchsia-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 lg:grid-cols-[0.45fr_0.55fr]">
        <div className="relative hidden overflow-hidden bg-slate-950/5 lg:flex">
          <div className="absolute inset-0 bg-slate-950/60" />
          <Image
            src="/images/hero-women3.jpg"
            alt="Women collaborating"
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 45vw, 100vw"
          />
          <div className="relative z-10 flex h-full flex-col justify-center bg-gradient-to-r from-slate-950/70 via-slate-950/30 to-transparent px-12 py-16">
            <div className="max-w-md text-white">
              <div className="mb-8 inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-white/10 text-white shadow-lg shadow-black/20">
                <span className="text-lg font-semibold">BIG</span>
              </div>
              <p className="text-4xl font-semibold leading-tight">Welcome back 👋</p>
              <p className="mt-4 max-w-sm text-sm text-slate-200/90">Continue your journey with BIG.</p>
              <div className="mt-10 space-y-4">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-start gap-3 rounded-3xl border border-white/10 bg-white/10 p-4 text-sm text-slate-100 shadow-sm shadow-black/10">
                    <span className="mt-1 flex h-7 w-7 items-center justify-center rounded-2xl bg-fuchsia-600 text-white">
                      <Check className="h-4 w-4" />
                    </span>
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex min-h-screen flex-col justify-center bg-white px-6 py-10 ring-1 ring-slate-200/70 dark:bg-slate-950 dark:ring-slate-700/50 sm:px-8 lg:px-12">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-10 text-center lg:hidden">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-200/30">
                <span className="text-lg font-semibold">BIG</span>
              </div>
              <p className="mt-6 text-3xl font-semibold text-slate-950 dark:text-white">Welcome back 👋</p>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Continue your journey with BIG.</p>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white px-8 py-10 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.3)] dark:border-slate-800 dark:bg-slate-900 sm:px-10 sm:py-12">
              <div className="mb-8">
                <p className="text-base font-semibold uppercase tracking-[0.2em] text-fuchsia-700">Sign in</p>
                <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Welcome back. Sign in to continue.</h1>
              </div>

              <LoginForm redirect={redirect} googleReturn={googleReturn} />
            </div>

            <footer className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              <a href="/privacy" className="transition hover:text-slate-900 dark:hover:text-white">Privacy Policy</a>
              <a href="/terms" className="transition hover:text-slate-900 dark:hover:text-white">Terms</a>
              <span>© Be Independent Gal</span>
            </footer>
          </div>
        </div>
      </div>
    </div>
  )
}
