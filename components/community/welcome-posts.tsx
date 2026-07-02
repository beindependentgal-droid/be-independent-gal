'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

const samplePosts = [
    {
    id: 'w1',
    author: 'BIG Team',
    avatar: '/images/biglogo.png',
    text: 'Welcome to BIG! This is your community feed — meet sisters, share wins, and grow together. 💜',
    time: 'Just now',
  },
  {
    id: 'w2',
    author: 'Amina W.',
    avatar: '/images/placeholder-user.jpg',
    text: "Excited to join the Learn Circle — any resources for building confidence?",
    time: '2h',
  },
]

export default function WelcomePosts() {
  const [posts] = useState(samplePosts)

  return (
    <div className="space-y-4">
      {posts.map((p) => (
        <article key={p.id} className="rounded-xl bg-white/60 backdrop-blur p-4 shadow-md border border-white/10">
          <div className="flex items-start gap-3">
            <Image src={p.avatar} alt="avatar" width={40} height={40} className="rounded-full object-cover" />
            <div>
              <div className="flex items-center gap-2">
                <strong className="block">{p.author}</strong>
                <span className="text-xs text-foreground/60">· {p.time}</span>
              </div>
              <p className="mt-2 text-sm text-foreground/90">{p.text}</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
