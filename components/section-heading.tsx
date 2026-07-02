import { cn } from '@/lib/utils'

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  description,
  align = 'center',
  className,
}: {
  eyebrow?: string
  title: React.ReactNode
  subtitle?: string
  description?: string
  align?: 'center' | 'left'
  className?: string
}) {
  return (
    <div
      className={cn(
        'max-w-2xl',
        align === 'center' ? 'mx-auto text-center' : 'text-left',
        className,
      )}
    >
      {eyebrow && (
        <div
          className={cn(
            'flex items-center gap-3',
            align === 'center' ? 'justify-center' : 'justify-start',
          )}
        >
          <span className="h-px w-6 bg-accent" />
          <span className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-primary">
            {eyebrow}
          </span>
          <span className="h-px w-6 bg-accent" />
        </div>
      )}
      <h2 className="mt-4 text-3xl font-heading font-bold uppercase tracking-tight text-secondary sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          {subtitle}
        </p>
      )}
      {description && (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>
      )}
    </div>
  )
}
