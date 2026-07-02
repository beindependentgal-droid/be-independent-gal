'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight, MoveDown, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

const slides = [
  {
    image: '/images/hero-women.jpg',
    alt: 'Women learning and connecting in a BIG community space',
  },
  {
    image: '/images/hero-women2.jpg',
    alt: 'Women supporting one another in an uplifting event setting',
  },
  {
    image: '/images/hero-women3.jpg',
    alt: 'Women building confidence and community together',
  },
]

export function HomeHero() {
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length)
    }, 6000)

    return () => window.clearInterval(interval)
  }, [])

  const goToSlide = (index: number) => setActiveSlide(index)

  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-slate-950">
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={`${slide.image}-${index}`}
            className={`absolute inset-0 transition-all duration-1000 ${
              index === activeSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              priority={index === 0}
              className="object-cover"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-primary/80" />
        <div className="absolute inset-0 bg-secondary/20" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4 py-24 text-center text-white sm:px-6 lg:px-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-white/90 backdrop-blur-md">
          <Sparkles className="h-4 w-4 text-[#f7d36b]" />
          Africa&apos;s Premium Women&apos;s Community
        </div>

        <h1 className="mt-8 mx-auto max-w-4xl text-4xl font-heading font-black uppercase tracking-tight leading-tight text-white sm:text-5xl lg:text-6xl">
          <span className="block">Be Independent.</span>
          <span className="mt-2 block text-[#f7d36b]">Be Unstoppable.</span>
        </h1>

        <p className="mt-6 text-body-lg font-semibold">Learn. Connect. Earn. Thrive.</p>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-white/90 sm:text-xl">
          Join a community where ambitious women learn practical skills, build meaningful relationships, discover opportunities, grow businesses, and thrive together.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="rounded-full bg-primary px-8 py-5 text-base font-semibold text-primary-foreground shadow-[0_20px_50px_-18px_rgba(91,33,182,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-16px_rgba(91,33,182,0.45)]"
          >
            <Link href="/auth/sign-up">
              Become a BIG Member <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-full border border-white/80 bg-white/15 px-8 py-5 text-base font-semibold text-[#5B21B6] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/30"
          >
            <Link href="/community">Explore the Community</Link>
          </Button>
        </div>

        <div className="mt-12 flex items-center gap-2">
          {slides.map((slide, index) => (
            <button
              key={`${slide.image}-${index}`}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => goToSlide(index)}
              className={`h-2.5 rounded-full transition-all ${
                index === activeSlide ? 'w-8 bg-white' : 'w-2.5 bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>

      <a
        href="#trust"
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center text-center text-sm font-semibold uppercase tracking-[0.3em] text-white/90"
      >
        <span className="mb-3">Discover BIG</span>
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/15 backdrop-blur-sm">
          <MoveDown className="h-4 w-4 animate-bounce" />
        </span>
      </a>
    </section>
  )
}
