import { Heart, HandHelping, TrendingUp, Star, Globe } from 'lucide-react'
import { SectionHeading } from '@/components/section-heading'

const pillars = [
  {
    icon: Heart,
    title: 'Sisterhood',
    desc: 'A safe, supportive circle of women who lift each other up.',
  },
  {
    icon: HandHelping,
    title: 'Support',
    desc: 'Practical help, encouragement, and resources at every stage.',
  },
  {
    icon: TrendingUp,
    title: 'Growth',
    desc: 'Skills, knowledge, and mindset to keep moving forward.',
  },
  {
    icon: Star,
    title: 'Opportunity',
    desc: 'Access to networks, mentors, and doors worth walking through.',
  },
  {
    icon: Globe,
    title: 'Impact',
    desc: 'Women who rise and reach back to change their communities.',
  },
]

export function CommunityPillars() {
  return (
    <section className="bg-muted/40 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Our Community Is Built On"
          title="Five Pillars, One Movement"
          subtitle="Everything we do is rooted in these values that hold our community together."
        />
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {pillars.map((p) => (
            <div
              key={p.title}
              className="group flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center transition-shadow hover:shadow-lg"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <p.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-heading text-base font-bold uppercase tracking-wide text-secondary">
                {p.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
