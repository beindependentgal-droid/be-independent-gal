'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { useAuth } from '@/lib/auth-context'

export default function ProfileCompletionBanner() {
  const { user, isAuthenticated } = useAuth()
  const [incomplete, setIncomplete] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    if (!isAuthenticated || !user) return

    let mounted = true
    ;(async () => {
      try {
        const queryUserProfiles = () => supabase
          .from('user_profiles')
          .select('full_name,bio,avatar_url')
          .eq('user_id', user.id)
          .maybeSingle()

        const queryProfiles = () => supabase
          .from('profiles')
          .select('first_name,last_name,bio,avatar_url')
          .eq('id', user.id)
          .maybeSingle()

        let result = await queryUserProfiles()
        let profile: any = result.data

        if (result.error && result.error.code === 'PGRST205') {
          result = await queryProfiles()
          profile = result.data
          if (result.error) {
            return
          }
          profile = {
            full_name: `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim(),
            bio: profile?.bio,
            avatar_url: profile?.avatar_url,
          }
        }

        if (!mounted) return
        if (!profile || !profile.full_name || !profile.avatar_url || !profile.bio) {
          setIncomplete(true)
        }
      } catch (err) {
        // ignore
      }
    })()

    return () => {
      mounted = false
    }
  }, [isAuthenticated, user, supabase])

  if (!incomplete) return null

  return (
    <div className="glass-morph rounded-2xl p-4 mb-6 border border-white/10 shadow-lg">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Welcome to BIG — make it yours</h3>
          <p className="text-sm text-foreground/70">Finish your profile so sisters can find and follow you.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/auth/onboarding/profile" className="rounded-full bg-purple-600 px-4 py-2 text-white font-semibold shadow hover:opacity-95">Complete profile</Link>
        </div>
      </div>
    </div>
  )
}
