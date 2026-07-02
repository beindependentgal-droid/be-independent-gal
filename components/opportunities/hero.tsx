"use client"

import { useState } from 'react'

export default function OpportunitiesHero({ onSearch }: { onSearch?: (q: string) => void }) {
  const [q, setQ] = useState('')

  return (
    <header className="bg-white py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">Discover Opportunities That Move You Forward</h1>
          <p className="mt-3 text-sm text-slate-600">Explore jobs, scholarships, grants, fellowships, competitions, internships, business opportunities, accelerator programs, and leadership opportunities curated for ambitious women.</p>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <label htmlFor="op-search" className="sr-only">Search opportunities</label>
            <div className="relative">
              <input
                id="op-search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by keyword, organization, or location"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-600"
                onKeyDown={(e) => e.key === 'Enter' && onSearch?.(q)}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => onSearch?.(q)}
              className="rounded-xl bg-pink-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-pink-700"
            >
              Browse Opportunities
            </button>
            <button className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Subscribe to Alerts
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-slate-600">
          <span className="rounded-full bg-slate-50 px-3 py-1">Opportunities Available: <strong className="text-slate-900">1,234</strong></span>
          <span className="rounded-full bg-slate-50 px-3 py-1">Scholarships: <strong className="text-slate-900">120</strong></span>
          <span className="rounded-full bg-slate-50 px-3 py-1">Jobs: <strong className="text-slate-900">600</strong></span>
          <span className="rounded-full bg-slate-50 px-3 py-1">Grants: <strong className="text-slate-900">80</strong></span>
          <span className="rounded-full bg-slate-50 px-3 py-1">Internships: <strong className="text-slate-900">75</strong></span>
          <span className="rounded-full bg-slate-50 px-3 py-1">New This Week: <strong className="text-slate-900">34</strong></span>
        </div>
      </div>
    </header>
  )
}
