import Link from 'next/link'
import { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CircleCardProps {
  id: string
  icon: LucideIcon
  title: string
  description: string
  memberCount: number
  gradient: string
}

export function CircleCard({
  id,
  icon: Icon,
  title,
  description,
  memberCount,
  gradient,
}: CircleCardProps) {
  return (
    <div className={`group relative overflow-hidden rounded-3xl p-8 text-white transition-all duration-300 hover:shadow-2xl ${gradient}`}>
      {/* Glassmorphism effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 transition-all group-hover:bg-white/30 group-hover:scale-110">
          <Icon className="h-8 w-8" />
        </div>

        <h3 className="font-heading text-2xl font-extrabold mb-3">{title}</h3>

        <p className="mb-6 flex-1 text-white/90 leading-relaxed text-sm">
          {description}
        </p>

        <div className="mb-6 flex items-center gap-2 text-white/80 text-sm">
          <div className="h-1 w-1 rounded-full bg-white/60" />
          <span>{memberCount.toLocaleString()} members</span>
        </div>

        <Button
          asChild
          size="lg"
          className="w-full rounded-xl bg-white text-secondary font-semibold hover:bg-white/90 transition-all"
        >
          <Link href={`/circles/${id}/join`}>Join {title}</Link>
        </Button>
      </div>
    </div>
  )
}
