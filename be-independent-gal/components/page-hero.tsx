import { cn } from '@/lib/utils'

export function PageHero({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow?: string
  title: string
  description?: string
  className?: string
}) {
  return (
    <section
      className={cn(
        'relative overflow-hidden bg-secondary py-16 text-secondary-foreground sm:py-20',
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/30 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-accent/20 blur-2xl"
      />
      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        {eyebrow && (
          <span className="font-heading text-xs font-bold uppercase tracking-[0.25em] text-accent">
            {eyebrow}
          </span>
        )}
        <h1 className="mt-4 text-balance font-heading text-4xl font-extrabold uppercase tracking-tight sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mx-auto mt-5 max-w-2xl text-pretty leading-relaxed text-secondary-foreground/80">
            {description}
          </p>
        )}
      </div>
    </section>
  )
}
