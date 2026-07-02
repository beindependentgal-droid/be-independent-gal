'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import LoginForm from '@/components/auth/login-form'
import { useAuth } from '@/lib/auth-context'

interface LoginScreenProps {
  searchParams: Promise<{
    redirect?: string
    from?: string
  }>
}

const testimonials = [
  {
    quote: 'BIG helped me find a circle where I finally feel seen, supported, and inspired every week.',
    author: 'Amina, Community Organizer',
  },
  {
    quote: 'The Academy courses gave me confidence and practical skills to apply for my first leadership role.',
    author: 'Zuri, Product Designer',
  },
  {
    quote: 'I connected with mentors who understood my journey and helped me take the next step.',
    author: 'Nyambura, Founder',
  },
]

export default function LoginScreen({ searchParams }: LoginScreenProps) {
  const router = useRouter()
  const { isAuthenticated, loading } = useAuth()
  const [redirect, setRedirect] = useState('/community')
  const [googleReturn, setGoogleReturn] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [testimonialIndex, setTestimonialIndex] = useState(0)

  useEffect(() => {
    let isMounted = true

    const resolveParams = async () => {
      const params = await searchParams
      if (isMounted) {
        setRedirect(params.redirect || '/community')
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
      router.push(redirect)
    }
  }, [loading, isAuthenticated, redirect, router, isReady])

  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex((current) => (current + 1) % testimonials.length)
    }, 7000)
    return () => clearInterval(interval)
  }, [])

  const testimonial = useMemo(() => testimonials[testimonialIndex], [testimonialIndex])

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-fuchsia-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-pink-50 via-violet-50 to-slate-50">
      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-16">
          <div className="mx-auto w-full max-w-md space-y-8">
            <div className="rounded-[36px] border border-white/90 bg-white/95 p-6 shadow-[0_40px_120px_-60px_rgba(99,102,241,0.25)] backdrop-blur-xl">
              <div className="flex justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-fuchsia-600 to-violet-600 text-white shadow-lg shadow-fuchsia-200/60">
                  <span className="text-2xl font-black">BIG</span>
                </div>
              </div>

              <div className="mt-8 space-y-4 text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-fuchsia-600/90">Sign in</p>
                <h1 className="text-4xl font-semibold tracking-tight text-slate-950">Your circle is waiting.</h1>
                <p className="mx-auto max-w-sm text-base leading-7 text-slate-600">
                  Access your BIG profile, courses, circles, events, and opportunities from one welcoming place.
                </p>
              </div>

              <div className="mt-8 lg:hidden">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                  <p className="text-sm font-semibold text-slate-900">BIG Community</p>
                  <p className="mt-3 text-sm text-slate-600">A premium home for women building confidence, skills, and careers together.</p>
                  <div className="mt-5 grid gap-3 text-sm text-slate-700">
                    <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">4,800+ Members</div>
                    <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">30+ Courses</div>
                    <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">42 Circles</div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <LoginForm redirect={redirect} googleReturn={googleReturn} />
              </div>

              <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-slate-500">
                <a href="/auth/sign-up" className="font-semibold text-fuchsia-600 hover:text-fuchsia-700">Create account</a>
                <span aria-hidden="true">·</span>
                <a href="/auth/reset" className="font-semibold text-fuchsia-600 hover:text-fuchsia-700">Reset password</a>
              </div>
            </div>
          </div>
        </div>

        <div className="relative hidden overflow-hidden border-l border-white/80 bg-gradient-to-br from-[#f7efff] via-[#fbf8ff] to-[#fff1f8] p-8 lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(192,38,211,0.16),_transparent_34%)]" />
          <div className="absolute inset-y-0 right-0 w-1/2 bg-white/20 blur-3xl" />
          <div className="relative z-10 flex h-full flex-col justify-between gap-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-fuchsia-700 shadow-sm shadow-fuchsia-100">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-fuchsia-100 text-fuchsia-700">✨</span>
                Continue your journey with BIG
              </div>

              <div className="rounded-[32px] border border-white/80 bg-white/85 p-6 shadow-lg shadow-slate-200/40 backdrop-blur-xl">
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-slate-100">
                  <Image
                    src="/images/hero-women3.jpg"
                    alt="Women learning and collaborating"
                    fill
                    className="object-cover"
                    loading="eager"
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-3 text-sm text-slate-700">
              {[
                'Learn practical skills',
                'Join Sister Circles',
                'Discover opportunities',
                'Attend events',
                'Meet mentors',
                'Build your career',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-fuchsia-100 text-fuchsia-700">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 text-center text-sm font-semibold text-slate-900">
                <div className="rounded-3xl bg-white px-4 py-5 shadow-sm">
                  <p className="text-3xl">4,800+</p>
                  <p className="mt-1 text-[13px] uppercase tracking-[0.24em] text-slate-500">Members</p>
                </div>
                <div className="rounded-3xl bg-white px-4 py-5 shadow-sm">
                  <p className="text-3xl">30+</p>
                  <p className="mt-1 text-[13px] uppercase tracking-[0.24em] text-slate-500">Courses</p>
                </div>
                <div className="rounded-3xl bg-white px-4 py-5 shadow-sm">
                  <p className="text-3xl">42</p>
                  <p className="mt-1 text-[13px] uppercase tracking-[0.24em] text-slate-500">Circles</p>
                </div>
                <div className="rounded-3xl bg-white px-4 py-5 shadow-sm">
                  <p className="text-3xl">100+</p>
                  <p className="mt-1 text-[13px] uppercase tracking-[0.24em] text-slate-500">Opportunities</p>
                </div>
              </div>

              <div className="rounded-[32px] border border-slate-200 bg-white px-6 py-6 shadow-sm">
                <p className="text-sm uppercase tracking-[0.3em] text-fuchsia-700">Testimonial</p>
                <p className="mt-4 text-lg font-semibold leading-8 text-slate-900">“{testimonial.quote}”</p>
                <p className="mt-4 text-sm font-semibold text-slate-600">{testimonial.author}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
