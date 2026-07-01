'use client'

import { Mail, MapPin, Briefcase, Link as LinkIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface MemberProfileProps {
  name: string
  avatar: string
  title: string
  city: string
  bio: string
  skills: string[]
  interests: string[]
  rank: string
  points: number
  joinedAt: string
  circleId: string
}

export function MemberProfile({
  name,
  avatar,
  title,
  city,
  bio,
  skills,
  interests,
  rank,
  points,
  joinedAt,
  circleId,
}: MemberProfileProps) {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      {/* Header gradient */}
      <div className="h-24 bg-gradient-to-r from-primary- to-secondary-" />

      {/* Content */}
      <div className="px-6 pb-6">
        {/* Avatar */}
        <div className="flex items-end gap-4 -mt-12 mb-6">
          <div className="relative h-32 w-32 overflow-hidden rounded-2xl border-4 border-card">
            <Image
              src={avatar}
              alt={name}
              fill
              sizes="128px"
              className="object-cover"
            />
          </div>

          <div className="flex-1 pb-2">
            <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
              ⭐ {rank}
            </div>
          </div>
        </div>

        {/* Info */}
        <h2 className="font-heading text-2xl font-bold text-secondary">{name}</h2>

        <div className="mt-2 space-y-1 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            {title}
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {city}
          </div>
        </div>

        {/* Bio */}
        <p className="mt-4 text-sm leading-relaxed text-secondary">{bio}</p>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4 rounded-lg bg-muted p-4">
          <div className="text-center">
            <div className="font-heading text-lg font-bold text-secondary">{points}</div>
            <p className="text-xs text-muted-foreground">Points</p>
          </div>
          <div className="text-center">
            <div className="font-heading text-lg font-bold text-secondary">
              {new Date(joinedAt).toLocaleDateString()}
            </div>
            <p className="text-xs text-muted-foreground">Joined</p>
          </div>
          <div className="text-center">
            <div className="font-heading text-lg font-bold text-secondary">
              {skills.length}
            </div>
            <p className="text-xs text-muted-foreground">Skills</p>
          </div>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mt-6">
            <h3 className="font-heading font-bold text-secondary mb-3">Skills & Expertise</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Interests */}
        {interests.length > 0 && (
          <div className="mt-4">
            <h3 className="font-heading font-bold text-secondary mb-3">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest) => (
                <span
                  key={interest}
                  className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex gap-2">
          <Button className="flex-1 gap-2 rounded-lg">
            <Mail className="h-4 w-4" />
            Message
          </Button>
          <Button variant="outline" className="flex-1 gap-2 rounded-lg">
            <LinkIcon className="h-4 w-4" />
            Connect
          </Button>
        </div>
      </div>
    </div>
  )
}
