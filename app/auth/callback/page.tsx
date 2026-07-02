'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const DEFAULT_AUTH_REDIRECT = '/dashboard'

export default function AuthCallbackPage() {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Signing you in...')

  useEffect(() => {
    async function finishSignIn() {
      const url = new URL(window.location.href)
      const code = url.searchParams.get('code')
      const next = url.searchParams.get('next') || url.searchParams.get('redirect') || DEFAULT_AUTH_REDIRECT

      if (!code) {
        setStatus('error')
        setMessage('No OAuth code was provided. Please try signing in again.')
        return
      }

      try {
        const response = await fetch('/api/auth/callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code, next }),
        })

        const payload = await response.json()

        if (!response.ok) {
          setStatus('error')
          setMessage(payload.error || 'Unable to complete sign in. Please try again.')
          return
        }

        const redirectPath = typeof payload.redirect === 'string' && payload.redirect.startsWith('/')
          ? payload.redirect
          : DEFAULT_AUTH_REDIRECT

        setStatus('success')
        setMessage('Sign in successful. Redirecting...')
        window.location.href = redirectPath
      } catch (error) {
        console.error('Callback error:', error)
        setStatus('error')
        setMessage('Unable to complete sign in. Please try again.')
      }
    }

    finishSignIn()
  }, [router])

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-slate-900/95 px-8 py-12 text-center shadow-2xl shadow-black/30">
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-500/30">
          <svg className="h-10 w-10 animate-spin" viewBox="0 0 50 50" aria-hidden="true">
            <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeDasharray="31.4 31.4" />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold">Finishing Google sign in</h1>
        <p className="mt-3 text-sm text-slate-300">{message}</p>
        {status === 'error' ? (
          <div className="mt-6 rounded-2xl bg-rose-950/70 px-4 py-3 text-sm text-rose-200 border border-rose-500/20">
            {message}
          </div>
        ) : null}
      </div>
    </div>
  )
}
