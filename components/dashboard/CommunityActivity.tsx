'use client'

import Link from 'next/link'
import { MessageCircle, Sparkles } from 'lucide-react'
import { WidgetSkeleton } from '@/components/ui/skeleton-loaders'
import { useDashboardLoader } from '@/lib/hooks/use-dashboard-loader'

export default function CommunityActivity() {
  const { data, loading } = useDashboardLoader()
  const posts = data?.communityPosts || []

  const activityItems = posts.slice(0, 5).map((post: any) => {
    const title = post.title || post.content || 'Shared an update in community'
    const userLabel = post.author_id ? `User ${post.author_id.slice(0, 6)}` : 'A sister'
    return {
      id: post.id,
      label: `${userLabel} posted`,
      details: title.length > 80 ? `${title.slice(0, 77)}…` : title,
    }
  })

  return (
    <section className="rounded-[20px] bg-white p-5 shadow-sm border border-slate-200">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold">Community activity</p>
          <p className="text-sm text-slate-500">Live updates from BIG members.</p>
        </div>
        <Link href="/community" className="text-sm font-semibold text-violet-600 hover:text-violet-700">
          View Community
        </Link>
      </div>

      <div className="mt-5 space-y-4">
        {loading && <WidgetSkeleton />}
        {!loading && activityItems.length === 0 && (
          <div className="rounded-3xl bg-violet-50 px-4 py-5 text-sm text-slate-600">
            No recent activity yet. <Link href="/community" className="font-semibold text-violet-700 hover:underline">Explore the community</Link>.
          </div>
        )}

        {activityItems.map((item) => (
          <div key={item.id} className="flex items-start gap-3 rounded-3xl border border-slate-100 bg-slate-50 p-4">
            <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">{item.label}</p>
              <p className="mt-1 text-sm text-slate-600">{item.details}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
