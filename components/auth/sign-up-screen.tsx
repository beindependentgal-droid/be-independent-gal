'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import SignUpForm from '@/components/auth/sign-up-form'
import { useAuth } from '@/lib/auth-context'

interface SignUpScreenProps {
  searchParams: Promise<{
    redirect?: string
    from?: string
  }>
}

export default function SignUpScreen({ searchParams }: SignUpScreenProps) {
  const router = useRouter()
  const { isAuthenticated, loading } = useAuth()
  const [redirect, setRedirect] = useState('/auth/onboarding/profile')
  const [googleReturn, setGoogleReturn] = useState(false)
  const [isReady, setIsReady] = useState(false)

  const isValidRedirect = (path?: string) => path?.startsWith('/') && !path.startsWith('//')
  const loginRedirect = isValidRedirect(redirect) && !redirect.startsWith('/auth/onboarding') ? redirect : '/dashboard'

  // Resolve search params
  useEffect(() => {
    let isMounted = true

    const resolveParams = async () => {
      const params = await searchParams
      if (isMounted) {
        setRedirect(isValidRedirect(params.redirect) ? params.redirect! : '/auth/onboarding/profile')
        setGoogleReturn(params.from === 'google')
        setIsReady(true)
      }
    }

    resolveParams()

    return () => {
      isMounted = false
    }
  }, [searchParams])

  // Handle redirect after authentication
  useEffect(() => {
    if (!loading && isAuthenticated && isReady) {
      router.push(redirect)
    }
  }, [loading, isAuthenticated, redirect, router, isReady])

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      {/* Left side - Form */}
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16">
        <div className="mx-auto w-full max-w-sm space-y-8">
          {/* Logo */}
          <div className="flex justify-center">
            <Image
              src="/images/biglogo.png"
              alt="BIG Logo"
              width={48}
              height={48}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/images/big-logo.jpeg'
              }}
              className="h-12 w-12"
            />
          </div>

          {/* Header */}
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold text-gray-900">Become a BIG Member</h1>
            <p className="text-gray-600">Create your account and join our community</p>
          </div>

          {/* Form */}
          <SignUpForm redirect={redirect} googleReturn={googleReturn} />

          {/* Help text */}
          <div className="text-center space-y-3 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Already have an account?{' '}
              <a href={`/auth/login?redirect=${encodeURIComponent(loginRedirect)}`} className="text-secondary- hover:text-secondary- font-medium">
                Sign In
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Hero Image */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-white p-12">
        <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden shadow-2xl">
          <Image
            src="/images/hero-women.jpg"
            alt="BIG Community"
            fill
            className="object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/images/hero-women2.jpg'
            }}
          />
        </div>

        {/* Hero text */}
        <div className="mt-12 text-center space-y-6 max-w-md">
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome to BIG
          </h2>
          <p className="text-gray-600 text-lg">
            Helping women learn, connect, earn and thrive together.
          </p>

          {/* What you get */}
          <div className="space-y-3 pt-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📚</span>
              <span className="text-gray-700 font-medium">Learn</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🤝</span>
              <span className="text-gray-700 font-medium">Connect</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">💰</span>
              <span className="text-gray-700 font-medium">Earn</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">❤️</span>
              <span className="text-gray-700 font-medium">Thrive</span>
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-2 pt-6 text-left text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Join a growing sisterhood</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Access BIG Academy</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Attend exclusive events</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Discover opportunities</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}