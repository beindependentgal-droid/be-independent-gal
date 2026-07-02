'use client'

export default function DashboardActions() {
  const actions = [
    { href: '/community', label: 'Create Post' },
    { href: '/academy', label: 'Browse Academy' },
    { href: '/events', label: 'Join Event' },
    { href: '/opportunities', label: 'Explore Opportunities' },
    { href: '/mentorship', label: 'Find a Mentor' },
    { href: '/circles/start', label: 'Start a Circle' },
  ]

  return (
    <div className="flex flex-wrap gap-3">
      {actions.map((a) => (
        <a key={a.href} href={a.href} className="inline-flex items-center gap-2 rounded-full bg-secondary/90 text-white px-4 py-2 text-sm shadow-sm hover:scale-[.99]">
          {a.label}
        </a>
      ))}
    </div>
  )
}
