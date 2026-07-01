import LoginScreen from '@/components/auth/login-screen'

interface LoginPageProps {
  searchParams: Promise<{
    redirect?: string
    from?: string
  }>
}

export const dynamic = 'force-dynamic'

export default function LoginPage({ searchParams }: LoginPageProps) {
  return <LoginScreen searchParams={searchParams} />
}