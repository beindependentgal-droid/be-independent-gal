'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import type { ComponentPropsWithoutRef } from 'react'

type AuthGatedButtonProps = Omit<
  ComponentPropsWithoutRef<typeof Button>,
  'onClick'
> & {
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
    const destination = isAuthenticated
      ? redirectPath
      : `/auth/login?redirect=${encodeURIComponent(redirectPath)}`
    router.push(destination)
  }

  return (
    <Button type="button" onClick={handleClick} {...props}>
      {children}
    </Button>
  )
}
