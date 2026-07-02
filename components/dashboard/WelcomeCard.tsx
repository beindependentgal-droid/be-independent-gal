'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { useAuth } from '@/lib/auth-context'

function computeProfileCompletion(p: any) {
  if (!p) return 0
  const fields = ['full_name', 'avatar_url', 'bio', 'skills', 'interests']
  const filled = fields.reduce((acc, f) => (p[f] ? acc + 1 : acc), 0)
  return Math.round((filled / fields.length) * 100)
}

export default function WelcomeCard() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load() {
      if (!user?.id) {
        setLoading(false)
        return
      }
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        if (error) throw error
        if (mounted) setProfile(data)
      } catch (err) {
        console.error('Failed to load profile', err)
        if (mounted) setProfile(null)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [user?.id])

  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  const firstName = profile?.first_name || user?.first_name || (user?.email ? user.email.split('@')[0] : 'there')

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm border">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {loading ? (
            <div className="h-14 w-14 rounded-full bg-slate-100 animate-pulse" />
          ) : (
            <img src={profile?.avatar_url || `/images/placeholder-user.jpg`} alt="avatar" className="h-14 w-14 rounded-full object-cover" />
          )}

          <div>
            <p className="text-sm text-muted-foreground">{greeting},</p>
            <h2 className="text-xl font-semibold">{firstName} 👋</h2>
            <p className="text-sm text-slate-600">Continue building your independent future.</p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-xs text-slate-500">Membership</p>
          <p className="font-medium">{profile?.member_level ?? 'Member'}</p>
          <p className="text-xs text-slate-500">Profile {loading ? '...' : `${computeProfileCompletion(profile)}%`}</p>
        </div>
      </div>
    </section>
  )
}
