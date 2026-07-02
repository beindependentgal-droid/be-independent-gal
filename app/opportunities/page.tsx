import OpportunitiesHero from '@/components/opportunities/hero'
import OpportunityFilters from '@/components/opportunities/filters'
import OpportunitiesList from '@/components/opportunities/list'

export default function OpportunitiesPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <OpportunitiesHero />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <OpportunityFilters onChange={() => { /* handled by list component via URL params */ }} />
            <div className="mt-6 hidden sm:block rounded-2xl border border-slate-100 bg-white p-4">
              <h4 className="text-sm font-semibold text-slate-900">Featured Categories</h4>
              <div className="mt-3 grid gap-2">
                {['Jobs','Scholarships','Grants','Fellowships','Internships','Business'].map((c) => (
                  <div key={c} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm">
                    <div className="flex items-center gap-2"><div className="h-6 w-6 rounded-full bg-white/50" />{c}</div>
                    <div className="text-sm text-slate-600">{Math.floor(Math.random()*400)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div>
              <OpportunitiesList />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
