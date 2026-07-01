import { Suspense } from 'react'
import SignUpWizard from '@/components/auth/sign-up-wizard'

export const dynamic = 'force-dynamic'

export default function SignUpWizardPage() {
  return (
    <Suspense fallback={<SignUpWizardLoading />}>
      <SignUpWizard />
    </Suspense>
  )
}

function SignUpWizardLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center space-y-4">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-"></div>
        <p className="text-gray-600 font-medium">Loading sign-up wizard...</p>
      </div>
    </div>
  )
}