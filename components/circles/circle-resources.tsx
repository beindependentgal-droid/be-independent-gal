'use client'

import { FileText, Video, BookOpen, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Resource } from '@/lib/db'

interface CircleResourcesProps {
  resources: Resource[]
}

const typeInfo: Record<
  Resource['type'],
  { icon: typeof FileText; label: string; color: string }
> = {
  pdf: { icon: FileText, label: 'PDF', color: 'text-red-600' },
  video: { icon: Video, label: 'Video', color: 'text-blue-600' },
  guide: { icon: BookOpen, label: 'Guide', color: 'text-green-600' },
  book: { icon: BookOpen, label: 'Book', color: 'text-purple-600' },
}

export function CircleResources({ resources }: CircleResourcesProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {resources.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
            No resources are available for this circle yet.
          </div>
        ) : (
          resources.map((resource) => {
          const info = typeInfo[resource.type]
          const Icon = info.icon

          return (
            <div key={resource.id} className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className={`rounded-lg bg-muted p-3 ${info.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                  {info.label}
                </span>
              </div>

              <h3 className="font-heading font-bold text-secondary mb-2">
                {resource.title}
              </h3>

              <p className="text-sm text-muted-foreground mb-4">{resource.description}</p>

              <div className="mb-4 text-xs text-muted-foreground">
                {resource.size && <div>Size: {resource.size}</div>}
                {resource.duration && <div>Duration: {resource.duration}</div>}
              </div>

              <Button size="sm" className="w-full gap-2 rounded-lg">
                <Download className="h-4 w-4" />
                {resource.type === 'video' ? 'Watch' : 'Download'}
              </Button>
            </div>
          )
        })
        )}
      </div>
    </div>
  )
}
