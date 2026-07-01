import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CtaBannerProps {
  title?: string
  description?: string
  cta1?: {
    text: string
    href: string
  }
  cta2?: {
    text: string
    href: string
  }
  background?: string
}

export function CtaBanner({
  title,
  description,
  cta1,
  cta2,
  background = 'bg-secondary',
}: CtaBannerProps) {
  const primaryCta = cta1 ?? {
    text: 'Become a BIG Member',
    href: '/join',
  }

  const secondaryCta = cta2 ?? {
    text: 'Support Our Work',
    href: '/contact',
  }

  return (
    <section className={`${background} py-20 text-secondary-foreground`}>
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <p className="font-heading text-2xl font-extrabold leading-snug text-balance sm:text-4xl">
          {title ?? (
            <>
              We are more than an organization. We are a{' '}
              <span className="text-accent italic">movement</span> of women building
              independent lives and{' '}
              <span className="text-accent italic">unstoppable</span> futures.
            </>
          )}
        </p>
        {description && (
          <p className="mt-6 max-w-3xl mx-auto text-lg leading-relaxed text-secondary-foreground/85">
            {description}
          </p>
        )}
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="rounded-full bg-primary px-8 font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Link href={primaryCta.href}>
              {primaryCta.text} <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-full border-white/30 bg-transparent px-8 font-semibold text-secondary-foreground hover:bg-white/10"
          >
            <Link href={secondaryCta.href}>{secondaryCta.text}</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
