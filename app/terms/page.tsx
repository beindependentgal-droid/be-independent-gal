import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | Be Independent Gal',
  description: 'The terms for using the Be Independent Gal platform and community.',
  alternates: { canonical: 'https://big.org/terms' },
}

export default function TermsPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col px-6 py-20 text-slate-800 sm:px-8 lg:px-10">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-700">Terms of Service</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Welcome to the BIG community.</h1>
        <p className="mt-4 text-base leading-8 text-slate-600">
          By using Be Independent Gal, you agree to participate respectfully, protect the privacy of others, and use the platform for genuine community, learning, and growth.
        </p>
        <div className="mt-8 space-y-4 text-sm leading-8 text-slate-600">
          <p><strong>Community conduct:</strong> keep interactions respectful, constructive, and inclusive.</p>
          <p><strong>Content:</strong> you are responsible for the content you share and should not post harmful, misleading, or unlawful material.</p>
          <p><strong>Account use:</strong> keep your account secure and do not impersonate others.</p>
          <p><strong>Changes:</strong> these terms may be updated from time to time to reflect platform improvements and legal requirements.</p>
        </div>
      </div>
    </main>
  )
}
