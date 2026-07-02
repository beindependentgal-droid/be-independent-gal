import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'

export function Logo({
  className,
  onLight = true,
  showText = true,
}: {
  className?: string
  onLight?: boolean
  showText?: boolean
}) {
  return (
    <Link
      href="/"
      className={cn('group inline-flex items-center gap-2.5', className)}
      aria-label="Be Independent Gal home"
    >
      <span className="relative inline-flex items-center justify-center">
        <span className="absolute -inset-0.5 rounded-full bg-secondary/80 blur opacity-80" />
        <Image
          src="/images/biglogo.png"
          alt="Be Independent Gal"
          width={40}
          height={40}
          className="relative rounded-full object-cover"
          priority
        />
      </span>
      {showText ? (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              'font-heading text-base font-extrabold uppercase tracking-tight',
              onLight ? 'text-secondary' : 'text-primary-foreground',
            )}
          >
            Be Independent Gal
          </span>
          <span
            className={cn(
              'text-[11px] font-semibold uppercase tracking-wide',
              onLight ? 'text-primary' : 'text-accent',
            )}
          >
            Be Unstoppable Woman
          </span>
        </span>
      ) : null}
    </Link>
  )
}
