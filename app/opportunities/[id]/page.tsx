import DetailActions from '@/components/opportunities/detail-actions'

type Props = { params: { id: string } }

export default async function OpportunityDetail({ params }: Props) {
  const { id } = params
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ''}/api/opportunities/${id}`)
    if (!res.ok) throw new Error('Failed to fetch')
    const item = await res.json()

    const daysLeft = item?.deadline ? Math.max(0, Math.ceil((new Date(item.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : '—'

    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-100 bg-white p-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100 flex items-center justify-center text-2xl text-slate-600">{(item.organization || 'O').charAt(0)}</div>
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-semibold text-slate-900">{item.title}</h1>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                  <div>{item.organization}</div>
                  <div>•</div>
                  <div>{item.location}</div>
                  <div className="ml-2 text-sm text-amber-700">Deadline in {daysLeft} days</div>
                </div>
                <div className="mt-4">
                  <DetailActions id={item.id} title={item.title} />
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <section className="rounded-lg bg-slate-50 p-4">
                  <h3 className="font-semibold text-slate-900">Overview</h3>
                  <p className="mt-2 text-sm text-slate-700">{item.process || item.description || 'Overview not available.'}</p>
                </section>

                <section className="mt-4 rounded-lg bg-white p-4">
                  <h4 className="font-semibold text-slate-900">Eligibility</h4>
                  <p className="mt-2 text-sm text-slate-700">{item.eligibility || 'Not specified'}</p>

                  <h4 className="mt-4 font-semibold text-slate-900">Requirements</h4>
                  <ul className="mt-2 list-inside list-disc text-sm text-slate-700">
                    {(item.requirements || []).map((r: string) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>

                  <h4 className="mt-4 font-semibold text-slate-900">Benefits</h4>
                  <ul className="mt-2 list-inside list-disc text-sm text-slate-700">
                    {(item.benefits || []).map((b: string) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </section>

                <section className="mt-4 rounded-lg bg-white p-4">
                  <h4 className="font-semibold text-slate-900">Funding & Duration</h4>
                  <p className="mt-2 text-sm text-slate-700">Funding: <strong className="text-slate-900">{item.funding || '—'}</strong></p>
                  <p className="mt-1 text-sm text-slate-700">Duration: <strong className="text-slate-900">{item.duration || '—'}</strong></p>
                </section>

                <section className="mt-4 rounded-lg bg-white p-4">
                  <h4 className="font-semibold text-slate-900">FAQs</h4>
                  <div className="mt-2 space-y-3">
                    {(item.faqs || []).map((f: any) => (
                      <div key={f.q}>
                        <div className="font-semibold text-slate-800">{f.q}</div>
                        <div className="text-sm text-slate-600">{f.a}</div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <aside className="space-y-4">
                <div className="rounded-lg border border-slate-100 bg-white p-4">
                  <div className="text-sm text-slate-500">Application</div>
                  <div className="mt-2 text-lg font-semibold text-slate-900">Apply by {item.deadline || '—'}</div>
                  <div className="mt-3 text-sm text-slate-600">Estimated time to apply: 30–45 mins</div>
                  <div className="mt-4">
                    <a href="#apply" className="block w-full rounded-md bg-pink-600 px-4 py-2 text-center text-sm font-semibold text-white">Apply Now</a>
                  </div>
                </div>

                <div className="rounded-lg border border-slate-100 bg-white p-4">
                  <h5 className="font-semibold text-slate-900">Related Opportunities</h5>
                  <ul className="mt-2 space-y-2 text-sm">
                    <li><a href="#" className="text-pink-600 hover:underline">Similar Fellowship — Apply</a></li>
                    <li><a href="#" className="text-pink-600 hover:underline">Leadership Training — Open</a></li>
                  </ul>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </main>
    )
  } catch (err) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-200 bg-rose-50 p-6 text-rose-700">Failed to load opportunity.</div>
        </div>
      </main>
    )
  }
}
