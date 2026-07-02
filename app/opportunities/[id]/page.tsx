import Image from 'next/image'
import DetailActions from '@/components/opportunities/detail-actions'

type Props = { params: { id: string } }

export default async function OpportunityDetail({ params }: Props) {
  const { id } = params
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ''}/api/opportunities/${id}`)
    if (!res.ok) throw new Error('Failed to fetch')
    const item = await res.json()

    const deadlineDate = item?.deadline ? new Date(item.deadline) : null
    const now = new Date()
    const deadlineDiff = deadlineDate ? deadlineDate.getTime() - now.getTime() : null
    const deadlinePassed = deadlineDiff !== null && deadlineDiff < 0
    const daysLeft = deadlineDiff !== null ? Math.max(0, Math.ceil(deadlineDiff / (1000 * 60 * 60 * 24))) : '—'
    const deadlineLabel = deadlineDate ? deadlineDate.toLocaleDateString() : 'Open'

    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
            {item.cover_image ? (
              <div className="relative h-72 w-full bg-slate-100">
                <Image
                  src={item.cover_image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
              </div>
            ) : null}
            <div className="space-y-6 p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-3xl bg-slate-100 flex items-center justify-center text-2xl text-slate-600">{(item.organization || 'O').charAt(0)}</div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-700">{item.category || 'General'}</span>
                      {item.featured && <span className="rounded-full bg-pink-50 px-2 py-1 text-pink-700">Featured</span>}
                      {item.status && item.status !== 'published' && <span className="rounded-full bg-amber-100 px-2 py-1 text-amber-700">{item.status}</span>}
                    </div>
                    <h1 className="mt-3 text-3xl font-semibold text-slate-900">{item.title}</h1>
                    <p className="mt-2 text-sm text-slate-600">{item.organization} • {item.location || 'Remote/Various'}</p>
                  </div>
                </div>
                <div className="space-y-3 text-right">
                  <div className="rounded-full bg-slate-50 px-3 py-2 text-sm text-slate-700">{item.status === 'published' ? 'Published' : 'Draft'}</div>
                  <div className="rounded-full bg-slate-50 px-3 py-2 text-sm text-slate-700">Deadline: {deadlineLabel}</div>
                  <div className={`rounded-full px-3 py-2 text-sm font-semibold ${deadlinePassed ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {deadlinePassed ? 'Closed' : `Deadline in ${daysLeft} days`}
                  </div>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                <div className="space-y-6">
                  <section className="rounded-3xl bg-slate-50 p-6">
                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                      {item.tags?.length ? item.tags.map((tag: string) => (
                        <span key={tag} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">{tag}</span>
                      )) : null}
                    </div>
                    <h2 className="mt-4 text-xl font-semibold text-slate-900">Overview</h2>
                    <p className="mt-3 text-sm leading-7 text-slate-700">{item.process || item.description || 'Overview not available.'}</p>
                  </section>

                  <section className="rounded-3xl bg-white p-6">
                    <h3 className="font-semibold text-slate-900">Eligibility</h3>
                    <p className="mt-3 text-sm text-slate-700">{item.eligibility || 'Not specified'}</p>

                    <h3 className="mt-5 font-semibold text-slate-900">Requirements</h3>
                    <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-slate-700">
                      {(item.requirements || []).map((r: string) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>

                    <h3 className="mt-5 font-semibold text-slate-900">Benefits</h3>
                    <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-slate-700">
                      {(item.benefits || []).map((b: string) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  </section>

                  <section className="rounded-3xl bg-white p-6">
                    <h3 className="font-semibold text-slate-900">Funding & Duration</h3>
                    <div className="mt-3 space-y-2 text-sm text-slate-700">
                      <p>Funding: <span className="font-semibold text-slate-900">{item.funding || '—'}</span></p>
                      <p>Duration: <span className="font-semibold text-slate-900">{item.duration || '—'}</span></p>
                      <p>Location: <span className="font-semibold text-slate-900">{item.location || 'Remote/Various'}</span></p>
                      <p>Status: <span className="font-semibold text-slate-900">{item.status || 'draft'}</span></p>
                    </div>
                  </section>

                  <section className="rounded-3xl bg-white p-6" id="apply">
                    <h3 className="font-semibold text-slate-900">Application Details</h3>
                    <p className="mt-3 text-sm text-slate-700">Apply by {deadlineLabel}</p>
                    {item.application_url ? (
                      <a href={item.application_url} target="_blank" rel="noreferrer" className="mt-4 inline-flex rounded-full bg-pink-600 px-4 py-3 text-sm font-semibold text-white hover:bg-pink-700">Go to Application</a>
                    ) : (
                      <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">No direct application URL set yet. Use the admin panel to add one.</div>
                    )}
                  </section>

                  <section className="rounded-3xl bg-white p-6">
                    <h3 className="font-semibold text-slate-900">FAQs</h3>
                    <div className="mt-3 space-y-4 text-sm text-slate-700">
                      {(item.faqs || []).length ? item.faqs.map((f: any) => (
                        <div key={f.q}>
                          <div className="font-semibold text-slate-800">{f.q}</div>
                          <div>{f.a}</div>
                        </div>
                      )) : <p>No FAQs available.</p>}
                    </div>
                  </section>
                </div>

                <aside className="space-y-4">
                  <div className="rounded-3xl border border-slate-100 bg-white p-6">
                    <div className="text-sm text-slate-500">Quick actions</div>
                    <div className="mt-4">
                      <DetailActions id={item.id} title={item.title} />
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-100 bg-white p-6">
                    <h4 className="font-semibold text-slate-900">Need help?</h4>
                    <p className="mt-3 text-sm text-slate-700">If you want to add a hero image, deadline, or application URL, update this opportunity in the admin dashboard.</p>
                  </div>
                </aside>
              </div>
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
