import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface PageHeroProps {
  eyebrow?: string
  title: string
  subtitle?: string
  description?: string
  cta1?: {
    text: string
    href: string
  }
  cta2?: {
    text: string
    href: string
  }
  imageSrc?: string
  className?: string
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
  description,
  cta1,
  cta2,
  imageSrc,
  className,
}: PageHeroProps) {
  const primaryCta = cta1 ?? { text: 'Get started', href: '/join' }
  const secondaryCta = cta2

  return (
    <section
      className={cn(
        'relative overflow-hidden bg-secondary py-16 text-white sm:py-20',
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
      <div className="relative mx-auto flex max-w-7xl flex-col gap-12 px-4 sm:px-6 lg:flex-row lg:items-center lg:px-8">
        <div className="w-full lg:w-1/2">
          {eyebrow && (
            <span className="font-heading text-xs font-bold uppercase tracking-[0.25em] text-accent">
              {eyebrow}
            </span>
          )}
          <h1 className="mt-4 text-balance font-heading text-4xl font-extrabold uppercase tracking-tight text-white sm:text-5xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-6 text-xl font-semibold text-white">
              {subtitle}
            </p>
          )}
          {description && (
            <p className="mx-auto mt-5 max-w-2xl text-pretty leading-relaxed text-white/90">
              {description}
            </p>
          )}
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-start">
            <Button asChild size="lg" className="rounded-full bg-primary px-8 font-semibold text-primary-foreground hover:bg-primary/90">
              <Link href={primaryCta.href}>{primaryCta.text}</Link>
            </Button>
            {secondaryCta && (
              <Button asChild size="lg" variant="outline" className="rounded-full border-white/30 bg-transparent px-8 font-semibold text-secondary-foreground hover:bg-white/10">
                <Link href={secondaryCta.href}>{secondaryCta.text}</Link>
              </Button>
            )}
          </div>
        </div>

        {imageSrc && (
          <div className="relative h-72 w-full overflow-hidden rounded-[2rem] bg-white/10 lg:h-105 lg:w-1/2">
            <Image
              src={imageSrc}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        )}
      </div>
    </section>
  )
}
