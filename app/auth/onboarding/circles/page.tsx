'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase-client'

export const dynamic = 'force-dynamic'

const CIRCLES = [
  {
    id: 'learn',
    icon: '📚',
    name: 'Learn Circle',
    description: 'Expand your knowledge and develop new skills through workshops, courses, and mentorship.',
    color: 'bg-blue-50 border-blue-300',
    hoverColor: 'hover:bg-blue-100',
  },
  {
    id: 'connect',
    icon: '🤝',
    name: 'Connect Circle',
    description: 'Build meaningful relationships and expand your network with like-minded women.',
    color: 'bg-purple-50 border-purple-300',
    hoverColor: 'hover:bg-purple-100',
  },
  {
    id: 'earn',
    icon: '💰',
    name: 'Earn Circle',
    description: 'Grow your income and achieve financial independence through opportunities and partnerships.',
    color: 'bg-green-50 border-green-300',
    hoverColor: 'hover:bg-green-100',
  },
  {
    id: 'thrive',
    icon: '❤️',
    name: 'Thrive Circle',
    description: 'Focus on wellness, purpose, and balanced living while inspiring others.',
    color: 'bg-orange-50 border-orange-300',
    hoverColor: 'hover:bg-orange-100',
  },
]

export default function CirclesOnboardingPage() {
  const router = useRouter()
  const [selectedCircles, setSelectedCircles] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const toggleCircle = (circleId: string) => {
    setSelectedCircles((prev) =>
      prev.includes(circleId)
        ? prev.filter((id) => id !== circleId)
        : [...prev, circleId]
    )
    setError('') // Clear error when user makes selection
  }

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (selectedCircles.length === 0) {
      setError('Please select at least one circle to continue')
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()
      const session = await supabase.auth.getSession()
      const token = session.data.session?.access_token

      if (!token) {
        setError('Authentication error - please login again')
        setLoading(false)
        return
      }

      const headers = new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      })

      const response = await fetch('/api/auth/circles', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          selected_circles: selectedCircles,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save circles')
      }

      // Redirect to home
      router.push('/community')
    } catch (err: any) {
      setError(err?.message || 'Failed to complete onboarding. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white py-12 px-6 sm:px-12 lg:px-16">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm text-gray-500 font-medium mb-2">STEP 3 OF 3</p>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Choose Your Circles</h1>
          <p className="text-lg text-gray-600">
            Select the circles that align with your goals. You can change these anytime.
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-12">
          <div className="h-1 bg-gray-200 rounded-full">
            <div className="h-full w-full bg-secondary- rounded-full"></div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleComplete} className="space-y-8">
          {/* Circle cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CIRCLES.map((circle) => (
              <button
                key={circle.id}
                type="button"
                onClick={() => toggleCircle(circle.id)}
                disabled={loading}
                className={`p-6 border-2 rounded-2xl transition-all text-left ${
                  selectedCircles.includes(circle.id)
                    ? `${circle.color} border-2`
                    : 'bg-white border-gray-200 hover:border-gray-300'
                } ${!loading && 'cursor-pointer'}`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon and content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{circle.icon}</span>
                      <h3 className="text-xl font-bold text-gray-900">{circle.name}</h3>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{circle.description}</p>
                  </div>

                  {/* Checkbox */}
                  <div className="flex-shrink-0">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedCircles.includes(circle.id)
                          ? 'bg-secondary- border-secondary-'
                          : 'border-gray-300'
                      }`}
                    >
                      {selectedCircles.includes(circle.id) && (
                        <span className="text-white font-bold text-sm">✓</span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Selected count */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-sm text-blue-900">
            <p className="font-medium">
              {selectedCircles.length === 0
                ? 'Select at least one circle to continue'
                : `${selectedCircles.length} circle${selectedCircles.length !== 1 ? 's' : ''} selected`}
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-900">
              ⚠️ {error}
            </div>
          )}

          {/* Submit button */}
          <Button
            type="submit"
            disabled={loading || selectedCircles.length === 0}
            className="w-full h-12 rounded-full bg-secondary- hover:bg-secondary- disabled:bg-gray-300 text-white font-bold transition-colors"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="inline-block animate-spin">⚙️</span>
                Completing...
              </span>
            ) : (
              'Complete Onboarding'
            )}
          </Button>

          {/* Info */}
          <div className="text-center space-y-2 pt-6 border-t">
            <p className="text-sm text-gray-600">
              Don't worry, you can join or leave circles anytime from your profile settings.
            </p>
            <p className="text-xs text-gray-500">
              After completing onboarding, you'll be able to explore all BIG features.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}