import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard | BIG',
  description: 'Your member dashboard for BIG community resources, messages, and growth.',
}

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-slate-200 bg-white p-10 shadow-xl">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-fuchsia-700">BIG Dashboard</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">Welcome back to your member home</h1>
          <p className="mt-4 max-w-2xl mx-auto text-base leading-7 text-slate-600">
            Access your community, courses, opportunities, and profile from one place.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Link href="/community" className="group rounded-3xl border border-slate-200 bg-slate-50 p-8 transition hover:border-fuchsia-300 hover:bg-fuchsia-50">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-fuchsia-700">Community</p>
            <h2 className="mt-4 text-2xl font-semibold text-slate-950">Conversations & connections</h2>
            <p className="mt-2 text-sm text-slate-600">Jump into the BIG conversations, mentorship, and events.</p>
          </Link>

          <Link href="/messages" className="group rounded-3xl border border-slate-200 bg-slate-50 p-8 transition hover:border-fuchsia-300 hover:bg-fuchsia-50">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-fuchsia-700">Messages</p>
            <h2 className="mt-4 text-2xl font-semibold text-slate-950">View your chats</h2>
            <p className="mt-2 text-sm text-slate-600">Stay connected with your BIG circle and mentors.</p>
          </Link>

          <Link href="/auth/profile" className="group rounded-3xl border border-slate-200 bg-slate-50 p-8 transition hover:border-fuchsia-300 hover:bg-fuchsia-50">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-fuchsia-700">Profile</p>
            <h2 className="mt-4 text-2xl font-semibold text-slate-950">Update your story</h2>
            <p className="mt-2 text-sm text-slate-600">Complete your profile and showcase your BIG journey.</p>
          </Link>

          <Link href="/circles" className="group rounded-3xl border border-slate-200 bg-slate-50 p-8 transition hover:border-fuchsia-300 hover:bg-fuchsia-50">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-fuchsia-700">Circles</p>
            <h2 className="mt-4 text-2xl font-semibold text-slate-950">Explore your circles</h2>
            <p className="mt-2 text-sm text-slate-600">Find the right circle for learning, earning, and thriving.</p>
          </Link>
        </div>
      </div>
    </main>
  )
}
