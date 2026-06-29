export const dynamic = 'force-dynamic';

import SignUpScreen from '@/components/auth/signup-screen'

interface SignUpPageProps {
  searchParams: Promise<{ redirect?: string; from?: string }>
}

export default function SignUpPage({ searchParams }: SignUpPageProps) {
  return <SignUpScreen searchParams={searchParams} />
}
