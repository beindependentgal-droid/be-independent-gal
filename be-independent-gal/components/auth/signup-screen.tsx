'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import SignUpForm from '@/components/auth/sign-up-form'
import { useAuth } from '@/lib/auth-context'

interface SignUpScreenProps {
  searchParams: Promise<{ redirect?: string; from?: string }>
}

export default function SignUpScreen({ searchParams }: SignUpScreenProps) {
  const router = useRouter()
  const { isAuthenticated, loading } = useAuth()
  const [redirect, setRedirect] = useState('/community')
  const [googleReturn, setGoogleReturn] = useState(false)

  useEffect(() => {
    let isMounted = true

    const resolveParams = async () => {
      const { redirect: nextRedirect = '/community', from } = await searchParams
      if (isMounted) {
        setRedirect(nextRedirect)
        setGoogleReturn(from === 'google')
      }
    }

    resolveParams()

    return () => {
      isMounted = false
    }
  }, [searchParams])

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push(redirect)
    }
  }, [loading, isAuthenticated, redirect, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 min-h-screen">
        <div className="hidden md:block relative overflow-hidden">
          <img src="/images/hero-women.png" alt="BIG community" className="absolute inset-0 w-full h-full object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/hero-women.jpg' }} />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-800/40 via-pink-500/20 to-transparent mix-blend-multiply" />
          <div className="relative z-10 p-12 h-full flex flex-col justify-between text-white">
            <div>
              <h1 className="text-4xl font-extrabold leading-tight">Welcome to BIG</h1>
              <p className="mt-4 text-lg max-w-xl">Helping women learn, connect, earn and thrive together.</p>

              <div className="mt-8 grid grid-cols-2 gap-3 max-w-sm">
                <div className="rounded-xl bg-white/10 p-3">📚 Learn</div>
                <div className="rounded-xl bg-white/10 p-3">🤝 Connect</div>
                <div className="rounded-xl bg-white/10 p-3">💰 Earn</div>
                <div className="rounded-xl bg-white/10 p-3">❤️ Thrive</div>
              </div>
            </div>

            <div className="text-sm">
              <ul className="space-y-2">
                <li>✔ Join a growing sisterhood</li>
                <li>✔ Access BIG Academy</li>
                <li>✔ Attend exclusive events</li>
                <li>✔ Discover opportunities</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center p-6">
          <div className="w-full max-w-md bg-white/70 backdrop-blur-md rounded-[24px] p-8 shadow-xl border border-white/10">
            <div className="mb-6 text-center">
              <img src="/images/big.svg" alt="BIG" className="mx-auto h-12 mb-4" />
              <h2 className="text-2xl font-bold">Become a BIG Member</h2>
              <p className="mt-2 text-sm text-foreground/70">Create your account and join the community of women growing together.</p>
            </div>

            <SignUpForm redirect={redirect} googleReturn={googleReturn} />
          </div>
        </div>
      </div>
    </div>
  )
}
