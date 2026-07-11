"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { AuthGatedButton } from '@/components/auth/auth-gated-button'
import { ChevronRight, ChevronDown } from 'lucide-react'

type Module = {
  module: string
  title: string
  lessons: number
}

export function CurriculumAccordion({ modules, courseSlug }: { modules: Module[]; courseSlug: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const hasAnyLessons = modules.some((m) => m.lessons > 0)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Course Curriculum</h3>
        {hasAnyLessons ? (
          <AuthGatedButton size="sm" className="rounded-full bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground" redirectPath={`/academy/${courseSlug}#lesson-1`}>
            Continue to Lesson 1
          </AuthGatedButton>
        ) : (
          <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-500">
            Lesson materials coming soon
          </div>
        )}
      </div>

      {modules.length === 0 ? (
        <div className="rounded-2xl border border-border bg-white p-6 text-sm leading-7 text-slate-700">
          Lesson materials are not yet uploaded. Check back later for lesson materials.
        </div>
      ) : (
        <div className="space-y-2">
          {modules.map((m, idx) => (
            <div key={m.module} className="rounded-2xl border border-border bg-white">
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between px-4 py-3 text-left"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">{m.module}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{m.title}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm font-semibold text-slate-700">{m.lessons} lessons</div>
                  <span className="text-muted-foreground">{openIndex === idx ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}</span>
                </div>
              </button>

              {openIndex === idx ? (
                <div className="border-t border-border px-4 pb-4 pt-2">
                  {m.lessons === 0 ? (
                    <div className="rounded-md bg-slate-50 p-4 text-sm text-slate-700">
                      Lesson materials are not yet uploaded. Check back later for lesson materials.
                    </div>
                  ) : (
                    <ul className="space-y-2">
                      {Array.from({ length: m.lessons }).map((_, i) => (
                        <li key={i} className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-slate-50">
                          <div className="text-sm text-slate-700">Lesson {i + 1}</div>
                          <Link href={`/academy/${courseSlug}#lesson-${i + 1}`} className="text-sm font-semibold text-primary hover:underline">Start</Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CurriculumAccordion
