'use client'

import Image from 'next/image'
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

  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  const firstName = profile?.first_name || 'there'

  if (loading) return <ProfileSkeleton />

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm border">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Image
            src={profile?.avatar_url || '/images/placeholder-user.jpg'}
            alt="avatar"
            width={56}
            height={56}
            className="rounded-full object-cover"
            priority
          />

          <div>
            <p className="text-sm text-muted-foreground">{greeting},</p>
            <h2 className="text-xl font-semibold">{firstName} 👋</h2>
            <p className="text-sm text-slate-600">Continue building your independent future.</p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-xs text-slate-500">Membership</p>
          <p className="font-medium">{profile?.member_level ?? 'Member'}</p>
          <p className="text-xs text-slate-500">Profile {`${computeProfileCompletion(profile)}%`}</p>
        </div>
      </div>
    </section>
  )
}
