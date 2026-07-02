"use client"

import Image from 'next/image'
import Link from 'next/link'

type Opportunity = {
  id: string
  title: string
  organization: string
  location?: string
  deadline?: string
  category?: string
  funding?: string
  remote?: boolean
  featured?: boolean
}

export default function OpportunityCard({ item }: { item: Opportunity }) {
  return (
    <article className="group rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-50">
          {/* placeholder logo */}
          <div className="flex h-full w-full items-center justify-center text-lg text-slate-600">{item.organization.charAt(0)}</div>
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-slate-900"><Link href={`/opportunities/${item.id}`} className="hover:underline">{item.title}</Link></h3>
          <div className="mt-1 text-sm text-slate-600">{item.organization} • {item.location || 'Remote/Various'}</div>
          <div className="mt-2 flex items-center gap-2">
            <span className="rounded-full bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700">{item.category || 'General'}</span>
            {item.funding && <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">{item.funding}</span>}
            {item.featured && <span className="rounded-full bg-pink-50 px-2 py-1 text-xs font-semibold text-pink-700">Featured</span>}
            {item.remote && <span className="ml-auto text-xs text-slate-500">Remote</span>}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-slate-600">Deadline: <span className="text-slate-900 font-semibold">{item.deadline || 'Open'}</span></div>
        <div className="flex gap-2">
          <button className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">Save</button>
          <Link href={`/opportunities/${item.id}`} className="rounded-md bg-pink-600 px-3 py-2 text-sm font-semibold text-white hover:bg-pink-700">View Details</Link>
        </div>
      </div>
    </article>
  )
}
