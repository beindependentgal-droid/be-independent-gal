'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

type Step1 = {
  firstName: string
  lastName: string
  email: string
  phone: string
  city: string
  password: string
  confirmPassword: string
}

type Step2 = {
  profession: string
  business: string
  industry: string
  ageRange: string
  bio: string
  passions: string
  whyJoining: string
}

const CIRCLES = [
  {
    id: 'learn',
    icon: '📚',
    title: 'Learn Circle',
    description: 'Develop skills, knowledge and confidence.',
  },
  {
    id: 'connect',
    icon: '🤝',
    title: 'Connect Circle',
    description: 'Build meaningful relationships and networks.',
  },
  {
    id: 'earn',
    icon: '💰',
    title: 'Earn Circle',
    description: 'Discover opportunities and financial growth.',
  },
  {
    id: 'thrive',
    icon: '❤️',
    title: 'Thrive Circle',
    description: 'Focus on wellness, purpose and balanced living.',
  },
]

export default function SignUpWizard() {
  const router = useRouter()
  const { signUp, signIn, signInWithProvider } = useAuth()
  const supabase = createClient()
  const searchParams = useSearchParams()
  const initialEmail = searchParams.get('email') ?? ''
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [emailInitialized, setEmailInitialized] = useState(false)
  const passwordRef = useRef<HTMLInputElement>(null)

  const [s1, setS1] = useState<Step1>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    password: '',
    confirmPassword: '',
  })

  const [s2, setS2] = useState<Step2>({
    profession: '',
    business: '',
    industry: '',
    ageRange: '',
    bio: '',
    passions: '',
    whyJoining: '',
  })

  const [selectedCircles, setSelectedCircles] = useState<string[]>([])

  // Toggle circle selection
  const toggleCircle = (id: string) => {
    setSelectedCircles((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  // Validate step 1
  const validateStep1 = () => {
    if (!s1.firstName.trim()) {
      setError('Please enter your first name')
      return false
    }
    if (!s1.lastName.trim()) {
      setError('Please enter your last name')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s1.email)) {
      setError('Please enter a valid email address')
      return false
    }
    if (s1.password.length < 6) {
      setError('Password must be at least 6 characters')
      return false
    }
    if (s1.password !== s1.confirmPassword) {
      setError('Passwords do not match')
      return false
    }
    return true
  }

  // Handle step 1 submission
  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateStep1()) return

    setLoading(true)
    try {
      // Sign up the user
      await signUp(s1.email, s1.password)
      
      // Try to sign in immediately
      try {
        await signIn(s1.email, s1.password)
        setStep(2)
      } catch (signInErr: any) {
        const msg = String(signInErr?.message || '').toLowerCase()
        if (msg.includes('confirm') || msg.includes('verify')) {
          setError('Please verify your email before continuing. Check your inbox for a verification link.')
        } else {
          setError('Sign up succeeded but sign in failed. Please try signing in.')
        }
      }
    } catch (err: any) {
      const message = String(err?.message || '').toLowerCase()

      if (message.includes('already') || message.includes('exists')) {
        setError('This email is already registered. Please sign in instead.')
      } else if (message.includes('rate limit')) {
        setError('Too many signup attempts. Please try again later.')
      } else {
        setError(err?.message || 'Sign up failed')
      }
    } finally {
      setLoading(false)
    }
  }

  // Handle Google sign-up
  const handleGoogleSignUp = async () => {
    setError('')
    setLoading(true)
    try {
      const nextPath = `/auth/signup-wizard?step=2`
      await signInWithProvider('google', nextPath)
    } catch (err: any) {
      setError(err?.message || 'Google sign-in failed')
      setLoading(false)
    }
  }

  // Handle step 2 submission
  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const session = await supabase.auth.getSession()
      const token = session.data.session?.access_token

      if (!token) {
        setError('Session expired. Please sign in again.')
        setLoading(false)
        return
      }

      const headers = new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      })

      // Save profile data
      const profileRes = await fetch('/api/auth/profile', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          first_name: s1.firstName,
          last_name: s1.lastName,
          full_name: `${s1.firstName} ${s1.lastName}`,
          phone: s1.phone,
          city: s1.city,
          profession: s2.profession,
          business: s2.business,
          bio: s2.bio,
          avatar_url: '',
          why_joining: s2.whyJoining,
        }),
      })

      if (!profileRes.ok) {
        throw new Error('Failed to save profile')
      }

      // Save preferences
      const prefRes = await fetch('/api/auth/preferences', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          notifications_enabled: true,
          email_digest: true,
        }),
      })

      if (!prefRes.ok) {
        throw new Error('Failed to save preferences')
      }

      setStep(3)
    } catch (err: any) {
      setError(err?.message || 'Failed to save profile')
    } finally {
      setLoading(false)
    }
  }

  // Handle step 3 submission
  const handleStep3 = async () => {
    setError('')
    setLoading(true)

    try {
      const session = await supabase.auth.getSession()
      const token = session.data.session?.access_token

      if (!token) {
        setError('Session expired. Please sign in again.')
        setLoading(false)
        return
      }

      const headers = new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      })

      const circlesRes = await fetch('/api/auth/circles', {
        method: 'POST',
        headers,
        body: JSON.stringify({ selected_circles: selectedCircles }),
      })

      if (!circlesRes.ok) {
        throw new Error('Failed to save circles')
      }

      setStep(4)
    } catch (err: any) {
      setError(err?.message || 'Failed to save circles')
    } finally {
      setLoading(false)
    }
  }

  // Complete signup and redirect
  const handleComplete = () => {
    router.push('/community')
  }

  // Initialize email from search params
  useEffect(() => {
    if (initialEmail && !emailInitialized) {
      setS1((prev) => ({ ...prev, email: initialEmail }))
      setEmailInitialized(true)
      setTimeout(() => passwordRef.current?.focus(), 100)
    }
  }, [initialEmail, emailInitialized])

  const stepTitles = ['Create Account', 'Your Profile', 'Choose Your Circle', 'Welcome to BIG']
  const progressPercent = (step / stepTitles.length) * 100

  return (
    <div className="min-h-screen bg-white">
      {/* Progress bar */}
      <div className="h-1 bg-gray-200">
        <div
          className="h-full bg-secondary- transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      {/* Main container */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Step indicator */}
        <div className="mb-8">
          <p className="text-sm text-gray-500 mb-2">
            Step {step} of {stepTitles.length}
          </p>
          <h1 className="text-3xl font-bold text-gray-900">{stepTitles[step - 1]}</h1>
        </div>

        {/* Step 1: Create Account */}
        {step === 1 && (
          <form onSubmit={handleStep1} className="space-y-6">
            {/* Google button */}
            <Button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={loading}
              variant="outline"
              className="w-full h-12 rounded-full border-2 border-gray-300 font-semibold"
            >
              {loading ? 'Signing up...' : '✓ Continue with Google'}
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-2 bg-white text-sm text-gray-500">or create an account with email</span>
              </div>
            </div>

            {/* Name fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={s1.firstName}
                  onChange={(e) => setS1({ ...s1, firstName: e.target.value })}
                  placeholder="Amina"
                  disabled={loading}
                  className="h-12 rounded-xl px-4"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={s1.lastName}
                  onChange={(e) => setS1({ ...s1, lastName: e.target.value })}
                  placeholder="W."
                  disabled={loading}
                  className="h-12 rounded-xl px-4"
                  required
                />
              </div>
            </div>

            {/* Email field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={s1.email}
                onChange={(e) => setS1({ ...s1, email: e.target.value })}
                placeholder="you@example.com"
                disabled={loading}
                className="h-12 rounded-xl px-4"
                required
              />
            </div>

            {/* Phone and City */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={s1.phone}
                  onChange={(e) => setS1({ ...s1, phone: e.target.value })}
                  placeholder="+254 XXX XXX XXX"
                  disabled={loading}
                  className="h-12 rounded-xl px-4"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">County / City</Label>
                <Input
                  id="city"
                  type="text"
                  value={s1.city}
                  onChange={(e) => setS1({ ...s1, city: e.target.value })}
                  placeholder="Nairobi"
                  disabled={loading}
                  className="h-12 rounded-xl px-4"
                />
              </div>
            </div>

            {/* Password fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  ref={passwordRef}
                  type="password"
                  value={s1.password}
                  onChange={(e) => setS1({ ...s1, password: e.target.value })}
                  placeholder="••••••••"
                  disabled={loading}
                  className="h-12 rounded-xl px-4"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={s1.confirmPassword}
                  onChange={(e) => setS1({ ...s1, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  disabled={loading}
                  className="h-12 rounded-xl px-4"
                  required
                />
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-900">
                {error}
              </div>
            )}

            {/* Submit button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-full bg-secondary- hover:bg-secondary- text-white font-bold"
            >
              {loading ? 'Creating...' : 'Continue'}
            </Button>
          </form>
        )}

        {/* Step 2: Profile */}
        {step === 2 && (
          <form onSubmit={handleStep2} className="space-y-6">
            {/* Profession */}
            <div className="space-y-2">
              <Label htmlFor="profession">Profession</Label>
              <Input
                id="profession"
                type="text"
                value={s2.profession}
                onChange={(e) => setS2({ ...s2, profession: e.target.value })}
                placeholder="e.g., Software Engineer"
                disabled={loading}
                className="h-12 rounded-xl px-4"
              />
            </div>

            {/* Business */}
            <div className="space-y-2">
              <Label htmlFor="business">Business (Optional)</Label>
              <Input
                id="business"
                type="text"
                value={s2.business}
                onChange={(e) => setS2({ ...s2, business: e.target.value })}
                placeholder="e.g., My Startup"
                disabled={loading}
                className="h-12 rounded-xl px-4"
              />
            </div>

            {/* Industry */}
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                type="text"
                value={s2.industry}
                onChange={(e) => setS2({ ...s2, industry: e.target.value })}
                placeholder="e.g., Technology"
                disabled={loading}
                className="h-12 rounded-xl px-4"
              />
            </div>

            {/* Age Range */}
            <div className="space-y-2">
              <Label htmlFor="ageRange">Age Range</Label>
              <select
                id="ageRange"
                value={s2.ageRange}
                onChange={(e) => setS2({ ...s2, ageRange: e.target.value })}
                disabled={loading}
                className="w-full h-12 rounded-xl px-4 border border-gray-300"
              >
                <option value="">Select age range</option>
                <option value="18-25">18-25</option>
                <option value="26-35">26-35</option>
                <option value="36-45">36-45</option>
                <option value="46-55">46-55</option>
                <option value="56+">56+</option>
              </select>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Short Bio</Label>
              <Textarea
                id="bio"
                value={s2.bio}
                onChange={(e) => setS2({ ...s2, bio: e.target.value })}
                placeholder="Tell us a bit about yourself..."
                disabled={loading}
                className="rounded-xl px-4 py-3 min-h-20"
              />
            </div>

            {/* Passions */}
            <div className="space-y-2">
              <Label htmlFor="passions">What are you passionate about?</Label>
              <Input
                id="passions"
                type="text"
                value={s2.passions}
                onChange={(e) => setS2({ ...s2, passions: e.target.value })}
                placeholder="e.g., Design, entrepreneurship, mentoring"
                disabled={loading}
                className="h-12 rounded-xl px-4"
              />
            </div>

            {/* Why Joining */}
            <div className="space-y-2">
              <Label htmlFor="whyJoining">Why Are You Joining BIG?</Label>
              <select
                id="whyJoining"
                value={s2.whyJoining}
                onChange={(e) => setS2({ ...s2, whyJoining: e.target.value })}
                disabled={loading}
                className="w-full h-12 rounded-xl px-4 border border-gray-300"
              >
                <option value="">Select a reason</option>
                <option value="learn">To Learn</option>
                <option value="connect">To Connect</option>
                <option value="earn">To Earn</option>
                <option value="thrive">To Thrive</option>
              </select>
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-900">
                {error}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                onClick={() => setStep(1)}
                disabled={loading}
                variant="outline"
                className="flex-1 h-12 rounded-full"
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 h-12 rounded-full bg-secondary- hover:bg-secondary- text-white font-bold"
              >
                {loading ? 'Saving...' : 'Continue'}
              </Button>
            </div>
          </form>
        )}

        {/* Step 3: Choose Circles */}
        {step === 3 && (
          <div className="space-y-6">
            <p className="text-gray-600">
              Select the circles that align with your goals. You can change these anytime.
            </p>

            {/* Circle cards */}
            <div className="grid grid-cols-1 gap-4">
              {CIRCLES.map((circle) => (
                <button
                  key={circle.id}
                  onClick={() => toggleCircle(circle.id)}
                  disabled={loading}
                  className={`p-4 border-2 rounded-2xl text-left transition-all ${
                    selectedCircles.includes(circle.id)
                      ? 'border-secondary- bg-secondary-'
                      : 'border-gray-200 hover:border-secondary-'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{circle.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{circle.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{circle.description}</p>
                    </div>
                    {selectedCircles.includes(circle.id) && (
                      <span className="text-secondary- text-xl">✓</span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-900">
                {error}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                onClick={() => setStep(2)}
                disabled={loading}
                variant="outline"
                className="flex-1 h-12 rounded-full"
              >
                Back
              </Button>
              <Button
                onClick={handleStep3}
                disabled={loading}
                className="flex-1 h-12 rounded-full bg-secondary- hover:bg-secondary- text-white font-bold"
              >
                {loading ? 'Finishing...' : 'Finish Setup'}
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Complete */}
        {step === 4 && (
          <div className="text-center space-y-6 py-12">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold">Welcome to BIG!</h2>
            <p className="text-gray-600 text-lg">
              Your account is set up and ready to go. Welcome to our community!
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 space-y-3 my-6">
              <p className="font-semibold text-blue-900">What's next?</p>
              <ul className="space-y-2 text-sm text-blue-900 text-left">
                <li>✓ Explore the community and meet other members</li>
                <li>✓ Browse the BIG Academy</li>
                <li>✓ Join your first circle</li>
                <li>✓ Attend an event</li>
              </ul>
            </div>

            <Button
              onClick={handleComplete}
              className="w-full h-12 rounded-full bg-secondary- hover:bg-secondary- text-white font-bold"
            >
              Enter the Community
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}