'use client'

import { useEffect, useState } from 'react'
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

export default function LoginScreen({ searchParams }: LoginScreenProps) {
  const router = useRouter()
  const { isAuthenticated, loading } = useAuth()
  const [redirect, setRedirect] = useState('/community')
  const [googleReturn, setGoogleReturn] = useState(false)
  const [isReady, setIsReady] = useState(false)

  // Resolve search params
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
              src="/images/big.svg"
              alt="BIG Logo"
              width={48}
              height={48}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/images/big-logo-placeholder.svg'
              }}
              className="h-12 w-12"
            />
          </div>

          {/* Header */}
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your BIG account and continue your journey</p>
          </div>

          {/* Form */}
          <LoginForm redirect={redirect} googleReturn={googleReturn} />

          {/* Help text */}
          <div className="text-center space-y-3 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Having trouble signing in?{' '}
              <a href="/auth/forgot-password" className="text-secondary- hover:text-secondary- font-medium">
                Reset your password
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
              (e.currentTarget as HTMLImageElement).src = '/images/hero-women-placeholder.jpg'
            }}
          />
        </div>

        {/* Hero text */}
        <div className="mt-12 text-center space-y-4 max-w-md">
          <h2 className="text-2xl font-bold text-gray-900">
            Welcome back, Sister 💜
          </h2>
          <p className="text-gray-600">
            Continue your journey to Learn, Connect, Earn, and Thrive with the BIG community.
          </p>

          {/* Benefits */}
          <div className="space-y-3 pt-4">
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <span className="text-lg">📚</span>
              <span>Access to BIG Academy</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <span className="text-lg">🤝</span>
              <span>Connect with amazing women</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <span className="text-lg">💰</span>
              <span>Discover opportunities</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <span className="text-lg">❤️</span>
              <span>Grow and thrive together</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}