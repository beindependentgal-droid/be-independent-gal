import SignUpScreen from '@/components/auth/sign-up-screen'

interface SignUpPageProps {
  searchParams: Promise<{
    redirect?: string
    from?: string
  }>
}

export const dynamic = 'force-dynamic'

export default function SignUpPage({ searchParams }: SignUpPageProps) {
  return <SignUpScreen searchParams={searchParams} />
}