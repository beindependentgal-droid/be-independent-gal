import SavedItems from '@/components/opportunities/saved-items'

export default function SavedPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-slate-900">Saved Opportunities</h1>
        <p className="mt-2 text-sm text-slate-600">Your saved opportunities and quick access to application deadlines.</p>

        <div className="mt-6">
          <SavedItems />
        </div>
      </div>
    </main>
  )
}
