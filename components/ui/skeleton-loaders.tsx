'use client'

/**
 * Skeleton loaders for dashboard widgets
 * Provides visually consistent loading states
 */

export function ProfileSkeleton() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border animate-pulse">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="h-14 w-14 rounded-full bg-slate-200" />
          <div className="flex-1">
            <div className="h-4 w-24 bg-slate-200 rounded mb-2" />
            <div className="h-6 w-32 bg-slate-200 rounded mb-2" />
            <div className="h-3 w-48 bg-slate-100 rounded" />
          </div>
        </div>
        <div className="text-right">
          <div className="h-3 w-16 bg-slate-100 rounded mb-2" />
          <div className="h-4 w-20 bg-slate-200 rounded mb-2" />
          <div className="h-3 w-24 bg-slate-100 rounded" />
        </div>
      </div>
    </div>
  )
}

export function WidgetSkeleton() {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm border animate-pulse">
      <div className="h-5 w-32 bg-slate-200 rounded mb-4" />
      <div className="space-y-3">
        <div className="h-4 w-full bg-slate-100 rounded" />
        <div className="h-4 w-3/4 bg-slate-100 rounded" />
      </div>
    </div>
  )
}

export function CirclesSkeleton() {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm border animate-pulse space-y-4">
      <div className="h-5 w-32 bg-slate-200 rounded" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center justify-between">
          <div className="flex-1">
            <div className="h-4 w-40 bg-slate-200 rounded mb-2" />
            <div className="h-3 w-32 bg-slate-100 rounded" />
          </div>
          <div className="h-3 w-12 bg-slate-100 rounded" />
        </div>
      ))}
    </div>
  )
}

export function EventSkeleton() {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm border animate-pulse">
      <div className="h-5 w-24 bg-slate-200 rounded mb-4" />
      <div className="h-4 w-32 bg-slate-200 rounded mb-2" />
      <div className="h-3 w-40 bg-slate-100 rounded" />
    </div>
  )
}

export function NotificationsSkeleton() {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm border animate-pulse space-y-3">
      <div className="h-5 w-32 bg-slate-200 rounded mb-4" />
      {[1, 2].map((i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 w-32 bg-slate-200 rounded" />
          <div className="h-3 w-48 bg-slate-100 rounded" />
        </div>
      ))}
    </div>
  )
}

export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-lg bg-slate-100 h-16" />
      ))}
    </div>
  )
}
