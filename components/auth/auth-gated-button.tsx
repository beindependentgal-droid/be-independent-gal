'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import type { ComponentPropsWithoutRef } from 'react'

type AuthGatedButtonProps = Omit<ComponentPropsWithoutRef<typeof Button>, 'onClick'> & {
  redirectPath: string
}

export function AuthGatedButton({
  redirectPath,
  children,
  ...props
}: AuthGatedButtonProps) {
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  const handleClick = () => {
    if (isAuthenticated) {
      // User is authenticated, go to the redirect path
      router.push(redirectPath)
    } else {
      // User is not authenticated, go to login with redirect
      const loginUrl = `/auth/login?redirect=${encodeURIComponent(redirectPath)}`
      router.push(loginUrl)
    }
  }

  return (
    <Button onClick={handleClick} {...props}>
      {children}
    </Button>
  )
}

