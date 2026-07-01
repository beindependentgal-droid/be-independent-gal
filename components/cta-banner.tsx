import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CtaBanner() {
  return (
    <section className="bg-secondary py-20 text-secondary-foreground">
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <p className="font-heading text-2xl font-extrabold leading-snug text-balance sm:text-4xl">
          We are more than an organization. We are a{' '}
          <span className="text-accent italic">movement</span> of women building
          independent lives and{' '}
          <span className="text-accent italic">unstoppable</span> futures.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="rounded-full bg-primary px-8 font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Link href="/join">
              Become a BIG Member <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-full border-white/30 bg-transparent px-8 font-semibold text-secondary-foreground hover:bg-white/10"
          >
            <Link href="/contact">Support Our Work</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
