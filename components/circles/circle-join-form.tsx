'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface JoinFormData {
  fullName: string
  city: string
  profession: string
  whoAreYou: string
  workingOn: string
  wantToLearn: string
  howCanHelp: string
}

export function CircleJoinForm({ circleId }: { circleId: string }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<JoinFormData>({
    fullName: '',
    city: '',
    profession: '',
    whoAreYou: '',
    workingOn: '',
    wantToLearn: '',
    howCanHelp: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Store in localStorage for now
    const memberData = {
      id: `member-${Date.now()}`,
      ...formData,
      circleId,
      joinedAt: new Date().toISOString(),
      points: 100,
      rank: 'New Member',
    }

    const members = JSON.parse(localStorage.getItem('members') || '[]')
    members.push(memberData)
    localStorage.setItem('members', JSON.stringify(members))

    setIsLoading(false)
    router.push(`/circles/${circleId}/dashboard`)
  }

  const allFieldsFilled = Object.values(formData).every((val) => val.trim() !== '')

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Jane Doe"
            required
          />
        </div>
        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Nairobi"
            required
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="profession">Profession / Business</Label>
          <Input
            id="profession"
            name="profession"
            value={formData.profession}
            onChange={handleChange}
            placeholder="E.g., Marketing Manager, Freelance Designer, Student"
            required
          />
        </div>
      </div>

      <div className="space-y-4 rounded-2xl bg-muted/50 p-6">
        <div className="font-heading font-bold text-secondary">
          Complete Your Circle Profile
        </div>

        <div>
          <Label htmlFor="whoAreYou">Who are you? (Tell us about yourself)</Label>
          <Textarea
            id="whoAreYou"
            name="whoAreYou"
            value={formData.whoAreYou}
            onChange={handleChange}
            placeholder="Share a bit about who you are, your background, and what makes you unique..."
            rows={3}
            required
          />
        </div>

        <div>
          <Label htmlFor="workingOn">What are you currently working on?</Label>
          <Textarea
            id="workingOn"
            name="workingOn"
            value={formData.workingOn}
            onChange={handleChange}
            placeholder="Share your current projects, goals, or initiatives..."
            rows={3}
            required
          />
        </div>

        <div>
          <Label htmlFor="wantToLearn">What do you hope to learn?</Label>
          <Textarea
            id="wantToLearn"
            name="wantToLearn"
            value={formData.wantToLearn}
            onChange={handleChange}
            placeholder="What skills or knowledge do you want to develop?"
            rows={3}
            required
          />
        </div>

        <div>
          <Label htmlFor="howCanHelp">How can you help other women?</Label>
          <Textarea
            id="howCanHelp"
            name="howCanHelp"
            value={formData.howCanHelp}
            onChange={handleChange}
            placeholder="What expertise, skills, or support can you offer to sisters in your circle?"
            rows={3}
            required
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/circles">Back</Link>
        </Button>
        <Button
          type="submit"
          size="lg"
          disabled={!allFieldsFilled || isLoading}
          className="rounded-full"
        >
          {isLoading ? 'Creating Your Profile...' : 'Join Circle'}
        </Button>
      </div>
    </form>
  )
}
