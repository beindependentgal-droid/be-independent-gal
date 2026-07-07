import LoginScreen from '@/components/auth/login-screen'

interface SignInPageProps {
  searchParams: Promise<{
    redirect?: string
    from?: string
  }>
}

export const dynamic = 'force-dynamic'

export default function SignInPage({ searchParams }: SignInPageProps) {
  return <LoginScreen searchParams={searchParams} />
}
