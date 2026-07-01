import { GoogleForm } from '@/components/forms/google-form'

export const metadata = {
  title: 'Google Form | BIG',
  description: 'A fresh, Google Forms-inspired community interest form for Be Independent Gal.',
}

export default function GoogleFormPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(244,114,182,0.16),_transparent_30%),linear-gradient(135deg,_#fff7fb_0%,_#fdf2f8_45%,_#f5f3ff_100%)] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <div className="rounded-[32px] border border-white/80 bg-white/80 p-8 shadow-[0_30px_80px_-35px_rgba(15,23,42,0.35)] backdrop-blur sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-pink-600">
            Be Independent Gal
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            A richer form experience, built for growth
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
            This updated flow includes step-by-step navigation, draft autosave, personalized topic picks, and a review screen to make every response easier to complete and manage.
          </p>
        </div>

        <GoogleForm />
      </div>
    </main>
  )
}
