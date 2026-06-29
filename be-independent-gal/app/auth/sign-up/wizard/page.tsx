export const dynamic = 'force-dynamic';

import { Suspense } from 'react'
import SignUpWizard from '@/components/auth/signup-wizard'

export default function SignUpWizardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading wizard…</div>}>
      <SignUpWizard />
    </Suspense>
  )
}
