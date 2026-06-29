'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import LoginForm from '@/components/auth/login-form'
import { useAuth } from '@/lib/auth-context'

interface LoginScreenProps {
  searchParams: Promise<{ redirect?: string; from?: string }>
}

export default function LoginScreen({ searchParams }: LoginScreenProps) {
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
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="hidden md:block bg-gradient-to-br from-purple-600 to-pink-400 p-12">
        <div className="h-full flex flex-col justify-center text-white">
          <h1 className="text-4xl font-bold mb-4">Welcome Back, Sister 💜</h1>
          <p className="text-lg max-w-md">Continue your journey to Learn, Connect, Earn, and Thrive.</p>
          <div className="mt-8">
            <img src="/images/hero-women.png" alt="BIG community" className="rounded-lg shadow-lg w-full" onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/hero-women.jpg' }} />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
          <div className="flex flex-col items-center mb-6">
            <img src="/images/big.svg" alt="BIG logo" className="h-12 mb-4" />
            <h2 className="text-2xl font-semibold">Welcome Back</h2>
            <p className="text-gray-600">Sign in to your BIG account</p>
          </div>

          <LoginForm redirect={redirect} googleReturn={googleReturn} />

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link href={`/auth/sign-up?redirect=${encodeURIComponent(redirect)}`} className="text-purple-600 font-medium">
                Become a BIG Member
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
