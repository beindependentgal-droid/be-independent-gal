'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ProfileSkeleton } from '@/components/ui/skeleton-loaders'
import { useDashboardLoader } from '@/lib/hooks/use-dashboard-loader'

function computeProfileCompletion(p: any) {
  if (!p) return 0
  const fields = ['full_name', 'avatar_url', 'bio', 'skills', 'interests']
  const filled = fields.reduce((acc, f) => (p[f] ? acc + 1 : acc), 0)
  return Math.round((filled / fields.length) * 100)
}

export default function WelcomeCard() {
  const { data, loading } = useDashboardLoader()
  const profile = data?.profile
  const course = data?.course
  const upcomingEvent = data?.upcomingEvent

  const firstName = profile?.first_name || 'there'

  if (loading) return <ProfileSkeleton />

  return (
    <section className="rounded-[20px] bg-white p-6 shadow-sm border border-slate-200">
      <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Welcome back</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{firstName}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">Continue building your independent future with a clear next step for today.</p>
        </div>

        <div className="flex items-center gap-4 rounded-[20px] bg-violet-50 p-4">
          <Image
            src={profile?.avatar_url || '/images/member-placeholder.svg'}
            alt="Profile avatar"
            width={64}
            height={64}
            className="rounded-full object-cover"
            priority
          />
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Membership</p>
            <p className="text-lg font-semibold text-slate-950">{profile?.member_level ?? 'Member'}</p>
            <p className="text-sm text-slate-600">{`Profile ${computeProfileCompletion(profile)}% complete`}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-[20px] bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Today's goal</p>
          <p className="mt-3 text-sm text-slate-700">Finish one Academy lesson and connect with a circle.</p>
        </div>
        <div className="rounded-[20px] bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Continue your current course</p>
          <p className="mt-3 text-sm text-slate-700">{course?.courses?.title ?? 'Explore BIG Academy'}</p>
        </div>
        <div className="rounded-[20px] bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Upcoming event</p>
          <p className="mt-3 text-sm text-slate-700">{upcomingEvent?.title ?? 'Discover events near you'}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/academy" className="rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700">
          Continue learning
        </Link>
        <Link href="/community" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
          Join the community
        </Link>
      </div>
    </section>
  )
}
