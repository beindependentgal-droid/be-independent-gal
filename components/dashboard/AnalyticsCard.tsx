"use client"

import React from "react"

interface Stats {
  postsCreated?: number
  commentsMade?: number
  circlesJoined?: number
  eventsRegistered?: number
  coursesCompleted?: number
  profileCompletion?: number
}

interface Props {
  stats?: Stats | null
  analyticsSeries?: Array<{ date: string; count: number }>
  analyticsCounts?: Record<string, number>
}

function Sparkline({ points = [] }: { points?: number[] }) {
  if (!points || points.length === 0) return <div className="text-sm text-slate-400">No data</div>
  const w = 200
  const h = 48
  const max = Math.max(...points)
  const min = Math.min(...points)
  const range = Math.max(1, max - min)
  const coords = points.map((p, i) => {
    const x = (i / (points.length - 1)) * w
    const y = h - ((p - min) / range) * h
    return `${x},${y}`
  })
  const poly = coords.join(" ")
  const last = points[points.length - 1]
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="block">
      <defs>
        <linearGradient id="grad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline fill="url(#grad)" stroke="#0000" points={`${poly} ${w},${h} 0,${h}`} />
      <polyline fill="none" stroke="#a78bfa" strokeWidth={2} points={poly} />
      <circle cx={(points.length - 1) / (points.length - 1) * w} cy={h - ((last - min) / range) * h} r={3.5} fill="#ec4899" />
    </svg>
  )
}

export default function AnalyticsCard({ stats, analyticsSeries, analyticsCounts }: Props) {
  const items = [
    { label: "Connections", value: stats?.circlesJoined ?? 0 },
    { label: "Posts", value: stats?.postsCreated ?? 0 },
    { label: "Comments", value: stats?.commentsMade ?? 0 },
    { label: "Events", value: stats?.eventsRegistered ?? 0 },
  ]

  const maxVal = Math.max(...items.map((i) => i.value), 1)

  return (
    <div className="rounded-[24px] border border-slate-200/80 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-950">Analytics</p>
          <p className="text-xs text-slate-500">Recent activity & growth</p>
        </div>
        <div className="text-sm font-semibold text-slate-900">{stats?.profileCompletion ?? 0}% profile</div>
      </div>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <p className="text-xs text-slate-500">Activity (7d)</p>
          <div className="mt-2">
            <Sparkline points={analyticsSeries?.map((item) => item.count) ?? []} />
          </div>
        </div>

        <div className="mt-3 grid w-full gap-2 sm:w-40 sm:ml-6 sm:grid-cols-1">
          {Object.entries(analyticsCounts ?? {}).map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-slate-50 p-3 text-center">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{label.replace(/_/g, " ")}</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
