"use client"

import { useEffect, useState } from 'react'

export default function OpportunityFilters({ onChange }: { onChange?: (filters: Record<string, any>) => void }) {
  const [category, setCategory] = useState('All')
  const [remote, setRemote] = useState('Any')
  const [country, setCountry] = useState('Any')
  const [deadline, setDeadline] = useState('Any')
  const [funding, setFunding] = useState('Any')
  const [keyword, setKeyword] = useState('')

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange?.({ category, remote, country, deadline, funding, keyword })
    }, 300)
    return () => clearTimeout(timeout)
  }, [category, remote, country, deadline, funding, keyword])

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4">
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <input
            aria-label="Keyword"
            placeholder="Keyword, org, location"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
            <option>All</option>
            <option>Jobs</option>
            <option>Scholarships</option>
            <option>Grants</option>
            <option>Fellowships</option>
            <option>Internships</option>
            <option>Business</option>
            <option>Accelerators</option>
            <option>Competitions</option>
            <option>Training</option>
            <option>Volunteer</option>
          </select>
        </div>

        <div className="flex gap-2">
          <select value={country} onChange={(e) => setCountry(e.target.value)} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
            <option>Any</option>
            <option>Kenya</option>
            <option>Nigeria</option>
            <option>United States</option>
            <option>Remote</option>
          </select>
          <select value={remote} onChange={(e) => setRemote(e.target.value)} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
            <option>Any</option>
            <option>Remote</option>
            <option>Hybrid</option>
            <option>On-site</option>
          </select>
          <select value={deadline} onChange={(e) => setDeadline(e.target.value)} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
            <option>Any</option>
            <option>Next 7 days</option>
            <option>Next 30 days</option>
            <option>This Quarter</option>
          </select>
          <select value={funding} onChange={(e) => setFunding(e.target.value)} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
            <option>Any</option>
            <option>Funding available</option>
            <option>No funding</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button onClick={() => { setCategory('All'); setRemote('Any'); setCountry('Any'); setDeadline('Any'); setFunding('Any'); setKeyword('') }} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">Reset</button>
          <button onClick={() => onChange?.({ category, remote, country, deadline, funding, keyword })} className="rounded-lg bg-pink-600 px-3 py-2 text-sm font-semibold text-white">Apply</button>
        </div>
      </div>
    </div>
  )
}
