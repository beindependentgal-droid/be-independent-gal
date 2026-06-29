import Link from 'next/link'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export function Logo({
  className,
  onLight = true,
}: {
  className?: string
  onLight?: boolean
}) {
  const [imageSrc, setImageSrc] = useState('/images/biglogo.png')

  return (
    <Link
      href="/"
      className={cn('group inline-flex items-center gap-2.5', className)}
      aria-label="Be Independent Gal home"
    >
      <span className="relative inline-flex items-center justify-center">
        <span className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-[#4B0082] via-[#7B2CBF] to-[#F59E0B] blur opacity-80" />
        <img
          src={imageSrc}
          onError={() => setImageSrc('/images/big-logo-placeholder.svg')}
          alt="Be Independent Gal"
          className="relative h-10 w-10 rounded-full object-cover"
        />
      </span>
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
    </Link>
  )
}
