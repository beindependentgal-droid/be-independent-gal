import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Be Independent Gal',
  description: 'How Be Independent Gal handles your information and privacy preferences.',
}

export default function PrivacyPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col px-6 py-20 text-slate-800 sm:px-8 lg:px-10">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-700">Privacy Policy</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Your privacy matters to us.</h1>
        <p className="mt-4 text-base leading-8 text-slate-600">
          Be Independent Gal respects your privacy and is committed to protecting the personal information you share with us.
          We use your information to provide access to our community, events, academy content, and support resources.
        </p>
        <div className="mt-8 space-y-4 text-sm leading-8 text-slate-600">
          <p><strong>What we collect:</strong> basic profile information, email address, and activity relevant to your use of the platform.</p>
          <p><strong>How we use it:</strong> to personalize your experience, communicate with you about events and opportunities, and improve our services.</p>
          <p><strong>Sharing:</strong> we do not sell your personal data. We may share limited information with trusted service providers that help us operate the platform.</p>
          <p><strong>Your choices:</strong> you can update your preferences or contact us at any time to request changes to your information.</p>
        </div>
      </div>
    </main>
  )
}
