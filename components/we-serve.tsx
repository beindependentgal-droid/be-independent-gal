import { Users, MapPin, Layers, Handshake } from 'lucide-react'
import { SectionHeading } from '@/components/section-heading'

const audience = [
  {
    icon: Users,
    title: 'Women of all ages',
    desc: 'From students to professionals, entrepreneurs, and community leaders.',
  },
  {
    icon: MapPin,
    title: 'Communities',
    desc: 'In urban, peri-urban, and rural areas across the region.',
  },
  {
    icon: Layers,
    title: 'Diverse backgrounds',
    desc: 'Women from every industry and walk of life.',
  },
  {
    icon: Handshake,
    title: 'The committed',
    desc: 'Anyone committed to personal growth, empowerment, and impact.',
  },
]

export function WeServe() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="We Serve"
          title="Built For Every Woman Ready To Rise"
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {audience.map((a) => (
            <div
              key={a.title}
              className="flex flex-col rounded-2xl border border-border bg-card p-6"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-accent-foreground">
                <a.icon className="h-6 w-6 text-primary" />
              </span>
              <h3 className="mt-4 font-heading text-lg font-bold text-secondary">
                {a.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {a.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
