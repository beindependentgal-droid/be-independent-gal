'use client'

import { FileText, Video, BookOpen, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Resource {
  id: string
  title: string
  description: string
  type: 'pdf' | 'video' | 'guide' | 'book'
  size?: string
  duration?: string
}

const mockResources: Resource[] = [
  {
    id: '1',
    title: 'Complete Profile Checklist',
    description: 'PDF guide to building a strong community profile that attracts meaningful connections',
    type: 'pdf',
    size: '2.4 MB',
  },
  {
    id: '2',
    title: 'Networking Like a Boss',
    description: 'Video tutorial on how to approach networking conversations authentically and confidently',
    type: 'video',
    duration: '12:45',
  },
  {
    id: '3',
    title: 'Financial Independence Guide',
    description: 'Comprehensive guide to building financial literacy and independence for women',
    type: 'guide',
  },
  {
    id: '4',
    title: 'Lean In by Sheryl Sandberg',
    description: 'Recommended reading on women in the workplace and breaking barriers',
    type: 'book',
  },
  {
    id: '5',
    title: 'How to Ask for What You Want',
    description: 'Video workshop on negotiation and asking for opportunities at work and in business',
    type: 'video',
    duration: '18:30',
  },
  {
    id: '6',
    title: 'Personal Brand Template',
    description: 'Downloadable template for building and communicating your personal brand',
    type: 'pdf',
    size: '1.8 MB',
  },
]

const typeInfo: Record<
  Resource['type'],
  { icon: typeof FileText; label: string; color: string }
> = {
  pdf: { icon: FileText, label: 'PDF', color: 'text-red-600' },
  video: { icon: Video, label: 'Video', color: 'text-blue-600' },
  guide: { icon: BookOpen, label: 'Guide', color: 'text-green-600' },
  book: { icon: BookOpen, label: 'Book', color: 'text-purple-600' },
}

export function CircleResources() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockResources.map((resource) => {
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
        })}
      </div>
    </div>
  )
}
