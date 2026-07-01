'use client'

import { Search, Mail, MessageSquare } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useState } from 'react'
import type { Member } from '@/lib/db'

interface CircleMembersProps {
  members: Member[]
}

export function CircleMembers({ members }: CircleMembersProps) {
  const [search, setSearch] = useState('')

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search members..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Members Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredMembers.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
            No members have been added to this circle yet.
          </div>
        ) : (
          filteredMembers.map((member) => (
          <div key={member.id} className="rounded-2xl border border-border bg-card p-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative h-16 w-16 overflow-hidden rounded-full mb-3">
                <Image
                  src={member.avatar}
                  alt={member.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <h3 className="font-heading font-bold text-secondary">{member.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">{member.title}</p>
              <p className="text-xs text-muted-foreground">{member.city}</p>

              <div className="mt-3 w-full">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                  ⭐ {member.rank}
                </span>
              </div>

              <div className="mt-4 flex w-full gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1.5 rounded-lg"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span className="hidden sm:inline">Message</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1.5 rounded-lg"
                >
                  <Mail className="h-4 w-4" />
                  <span className="hidden sm:inline">Connect</span>
                </Button>
              </div>
            </div>
          </div>
          ))
        )}
      </div>
    </div>
  )
}
