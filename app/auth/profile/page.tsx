"use client"
export const dynamic = 'force-dynamic';

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase-client'

export default function ProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated, loading } = useAuth()
  const [activeTab, setActiveTab] = useState<'posts' | 'about' | 'photos' | 'business' | 'academy' | 'community'>('posts')
  const [fullName, setFullName] = useState('')
  const [bio, setBio] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [profession, setProfession] = useState('')
  const [industry, setIndustry] = useState('')
  const [business, setBusiness] = useState('')
  const [city, setCity] = useState('')
  const [phone, setPhone] = useState('')
  const [experience, setExperience] = useState('')
  const [primaryCircle, setPrimaryCircle] = useState('')
  const [points, setPoints] = useState(0)
  const [joinedAt, setJoinedAt] = useState('')

  const getStringValue = (value: unknown) => (typeof value === 'string' ? value : '')
  const getNumberValue = (value: unknown) => (typeof value === 'number' ? value : 0)

  useEffect(() => {
    const supabase = createClient()
    if (!loading && !isAuthenticated) {
      router.replace('/auth/login?redirect=/auth/profile')
      return
    }

    let mounted = true
    ;(async () => {
      if (!user) return

      const fetchUserProfiles = async () => {
        return supabase
          .from('user_profiles')
          .select('full_name,bio,avatar_url,profession,industry,business,city,phone,experience,why_joining,points,level,circle,joined_at')
          .eq('user_id', user.id)
          .maybeSingle()
      }

      const fetchProfiles = async () => {
        return supabase
          .from('profiles')
          .select('first_name,last_name,bio,avatar_url,profession,business,city,phone,points,member_level,primary_circle,created_at')
          .eq('id', user.id)
          .maybeSingle()
      }

      try {
        let data: { [key: string]: unknown } | null = null
        let error: { code?: string; message?: string } | null = null

        const userProfilesResult = await fetchUserProfiles()
        data = userProfilesResult.data
        error = userProfilesResult.error

        if (error && error.code === 'PGRST205') {
          const profilesResult = await fetchProfiles()
          data = profilesResult.data
          error = profilesResult.error
          if (error) {
            console.error('Profile fetch error details (profiles):', JSON.stringify(error, null, 2), error)
            return
          }
          if (data) {
            setFullName(`${getStringValue(data.first_name)} ${getStringValue(data.last_name)}`.trim())
            setBio(getStringValue(data.bio))
            setAvatarUrl(getStringValue(data.avatar_url))
            setProfession(getStringValue(data.profession))
            setIndustry('')
            setBusiness(getStringValue(data.business))
            setCity(getStringValue(data.city))
            setPhone(getStringValue(data.phone))
            setExperience('')
            setPoints(getNumberValue(data.points))
            setPrimaryCircle(getStringValue(data.primary_circle))
            setJoinedAt(getStringValue(data.created_at))
          }
          return
        }

        if (!mounted) return
        if (error) {
          console.error('Profile fetch error details:', JSON.stringify(error, null, 2), error)
          return
        }
        if (data) {
          setFullName(getStringValue(data.full_name))
          setBio(getStringValue(data.bio))
          setAvatarUrl(getStringValue(data.avatar_url))
          setProfession(getStringValue(data.profession))
          setIndustry(getStringValue(data.industry))
          setBusiness(getStringValue(data.business))
          setCity(getStringValue(data.city))
          setPhone(getStringValue(data.phone))
          setExperience(getStringValue(data.experience))
          setPoints(getNumberValue(data.points))
          setPrimaryCircle(getStringValue(data.circle))
          setJoinedAt(getStringValue(data.joined_at))
        }
      } catch (err) {
        console.error('Profile fetch error:', err instanceof Error ? err.message : JSON.stringify(err, null, 2), err)
      }
    })()

    return () => {
      mounted = false
    }
  }, [isAuthenticated, loading, user, router])

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600">Loading profile…</p>
      </div>
    )
  }

  const displayName = fullName || user.user_metadata?.full_name || user.email || 'Member'
  const avatarSrc = avatarUrl || user.user_metadata?.avatar_url
  const joinedAtLabel = joinedAt ? new Date(joinedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'June 2026'
  const profileSummary = bio || 'Helping women build confidence through fashion, modelling and entrepreneurship.'
  const profileStrength = Math.min(100, Math.max(60, Math.round([
    fullName,
    profession,
    industry,
    business,
    city,
    bio,
    experience,
  ].filter(Boolean).length / 7 * 100)))
  const bigStats = [
    { icon: '❤️', label: 'Followers', value: '540' },
    { icon: '👥', label: 'Following', value: '312' },
    { icon: '🤝', label: 'Circles', value: primaryCircle ? '4' : '3' },
    { icon: '🏅', label: 'Badges', value: '8' },
  ]
  const achievements = ['Founding Member', 'Academy Graduate', 'Mentor', 'Entrepreneur', 'Connector', 'Volunteer', 'Top Contributor', 'Retreat Attendee']
  const galleryItems = [
    { title: 'Studio Session', caption: 'Creative direction', category: 'Photos', tone: 'from-fuchsia-500 to-rose-500' },
    { title: 'Community Talk', caption: 'Speaking at BIG', category: 'Moments', tone: 'from-indigo-500 to-violet-500' },
    { title: 'Launch Night', caption: 'Celebrating growth', category: 'Events', tone: 'from-amber-500 to-orange-500' },
    { title: 'Workshop', caption: 'Mentorship in motion', category: 'Learning', tone: 'from-emerald-500 to-teal-500' },
    { title: 'Retreat', caption: 'Reflection and connection', category: 'Wellness', tone: 'from-sky-500 to-cyan-500' },
    { title: 'Brand Shoot', caption: 'Personal style story', category: 'Portfolio', tone: 'from-purple-500 to-pink-500' },
  ]
  const events = ['Women’s Retreat', 'BIG Festival', 'Girl Talk Friday', 'Business Networking']
  const recommendations = [
    { name: 'Pauline', quote: 'Sharon is an incredible mentor.', stars: 5 },
    { name: 'Faith', quote: 'Very supportive entrepreneur.', stars: 5 },
  ]
  const profileTabs = [
    { id: 'posts', label: 'Posts' },
    { id: 'about', label: 'About' },
    { id: 'photos', label: 'Photos' },
    { id: 'business', label: 'Business' },
    { id: 'academy', label: 'Academy' },
    { id: 'community', label: 'Community' },
  ] as const
  const highlights = ['Graduation', 'Business', 'Travel', 'Fashion', 'Awards', 'Retreat']
  const profileTags = ['Fashion', 'Leadership', 'Business', 'Mentorship', 'Community']
  const focusAreas = ['Brand strategy', 'Creative direction', 'Women entrepreneurship', 'Public speaking']
  const pinnedPosts = [
    { title: 'Started my fashion business', detail: 'Shared my first collection launch with the BIG community.' },
    { title: 'Graduated BIG Academy', detail: 'Celebrated a major milestone and my next chapter.' },
    { title: 'Looking for business partners', detail: 'Open to collaboration for the next growth sprint.' },
  ]
  const recentActivity = [
    'Liked Pauline’s post',
    'Commented on the Learn Circle discussion',
    'Joined the Learn Circle',
    'Completed the Branding course',
    'Attended the Women’s Retreat',
  ]
  const suggestedMembers = ['Nadia', 'Asha', 'Mina', 'Salma']
  const trendingTopics = ['#FashionBusiness', '#BIGAcademy', '#WomenInLeadership', '#PurposeDrivenGrowth']

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#5B21B6_0%,#7C3AED_35%,#EC4899_100%)]" />
        <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-6 sm:px-6 lg:px-8">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 shadow-2xl shadow-slate-950/40 backdrop-blur-sm sm:rounded-[2rem] sm:p-6">
            <div className="overflow-hidden rounded-[1.25rem] border border-white/10 bg-slate-900/70 sm:rounded-[1.75rem]">
              <div className="h-40 sm:h-56 bg-[radial-gradient(circle_at_top_left,rgba(244,114,182,0.35),transparent_55%),linear-gradient(135deg,#111827_0%,#312e81_100%)]" />
              <div className="relative px-4 pb-6 pt-5 sm:px-8 sm:pb-8 sm:pt-6 lg:px-10">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
                    <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-[1.5rem] border-4 border-white/20 bg-slate-200 shadow-2xl sm:h-32 sm:w-32 sm:rounded-[2rem]">
                      {avatarSrc ? (
                        <Image
                          src={avatarSrc}
                          alt={displayName}
                          width={128}
                          height={128}
                          className="h-full w-full object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-slate-300 text-4xl font-bold text-slate-900">
                          {displayName.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="max-w-2xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <h1 className="text-4xl font-semibold text-white">{displayName}</h1>
                        <span className="rounded-full border border-amber-300/30 bg-amber-400/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-amber-200">Verified</span>
                      </div>
                      <p className="mt-3 text-lg font-semibold text-slate-100">{profession || 'Fashion Designer • Model'}</p>
                      <p className="mt-2 text-sm text-slate-300">{city || 'Nairobi, Kenya'}</p>
                      <p className="mt-4 text-sm leading-7 text-slate-300">{profileSummary}</p>
                      <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                        <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1">Member since {joinedAtLabel}</span>
                        <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1">{primaryCircle || 'Learn'} Circle</span>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {profileTags.map((tag) => (
                          <span key={tag} className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    <Link href="/auth/onboarding/profile" className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15">✏️ Edit Profile</Link>
                    <Link href="/circles" className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15">🤝 View Circles</Link>
                    <button className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15">💬 Message</button>
                    <button className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15">📅 Invite</button>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-white/10 pt-6">
                  <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-slate-200">{bigStats[0].value} Followers</div>
                  <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-slate-200">{bigStats[1].value} Following</div>
                  <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-slate-200">{bigStats[2].value} Circles</div>
                  <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-slate-200">{bigStats[3].value} Badges</div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2 rounded-[1.25rem] border border-white/10 bg-white/10 p-2 sm:rounded-full">
              {profileTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === tab.id ? 'bg-white text-slate-900 shadow' : 'text-slate-200 hover:bg-white/10 hover:text-white'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[1.7fr_0.9fr]">
              <div className="space-y-6">
                {activeTab === 'posts' && (
                  <>
                    <section className="rounded-[1.5rem] bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:rounded-[2rem] sm:p-6">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Highlights</p>
                          <h2 className="mt-2 text-2xl font-semibold text-slate-900">Story highlights</h2>
                        </div>
                      </div>
                      <div className="mt-6 flex flex-wrap gap-3">
                        {highlights.map((item) => (
                          <div key={item} className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">{item}</div>
                        ))}
                      </div>
                      <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Current focus</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {focusAreas.map((area) => (
                            <span key={area} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">{area}</span>
                          ))}
                        </div>
                      </div>
                    </section>

                    <section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Pinned Posts</p>
                          <h2 className="mt-2 text-2xl font-semibold text-slate-900">Always on display</h2>
                        </div>
                      </div>
                      <div className="mt-6 space-y-4">
                        {pinnedPosts.map((post) => (
                          <div key={post.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                            <p className="text-sm font-semibold text-slate-900">📌 {post.title}</p>
                            <p className="mt-2 text-sm text-slate-600">{post.detail}</p>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Recent Activity</p>
                          <h2 className="mt-2 text-2xl font-semibold text-slate-900">What’s been happening</h2>
                        </div>
                      </div>
                      <div className="mt-6 space-y-3">
                        {recentActivity.map((item) => (
                          <div key={item} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">{item}</div>
                        ))}
                      </div>
                    </section>
                  </>
                )}

                {activeTab === 'about' && (
                  <section className="rounded-[1.5rem] bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:rounded-[2rem] sm:p-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm uppercase tracking-[0.35em] text-slate-500">About</p>
                        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Simple, clear, personal</h2>
                      </div>
                    </div>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-3xl bg-slate-50 p-5">
                        <p className="text-sm text-slate-500">Bio</p>
                        <p className="mt-2 text-slate-700">{bio || 'Helping women build confidence through fashion, modelling and entrepreneurship.'}</p>
                      </div>
                      <div className="rounded-3xl bg-slate-50 p-5">
                        <p className="text-sm text-slate-500">Profession</p>
                        <p className="mt-2 font-semibold text-slate-900">{profession || 'Fashion Designer'}</p>
                      </div>
                      <div className="rounded-3xl bg-slate-50 p-5">
                        <p className="text-sm text-slate-500">Industry</p>
                        <p className="mt-2 font-semibold text-slate-900">{industry || 'Fashion & Creative Economy'}</p>
                      </div>
                      <div className="rounded-3xl bg-slate-50 p-5">
                        <p className="text-sm text-slate-500">Business</p>
                        <p className="mt-2 font-semibold text-slate-900">{business || 'Self-employed'}</p>
                      </div>
                      <div className="rounded-3xl bg-slate-50 p-5">
                        <p className="text-sm text-slate-500">Location</p>
                        <p className="mt-2 font-semibold text-slate-900">{city || 'Nairobi'}</p>
                      </div>
                      <div className="rounded-3xl bg-slate-50 p-5">
                        <p className="text-sm text-slate-500">Joined BIG</p>
                        <p className="mt-2 font-semibold text-slate-900">{joinedAtLabel}</p>
                      </div>
                      <div className="rounded-3xl bg-slate-50 p-5">
                        <p className="text-sm text-slate-500">Experience</p>
                        <p className="mt-2 text-slate-700">{experience || 'Founder, mentor and creative entrepreneur with a passion for helping women grow.'}</p>
                      </div>
                      <div className="rounded-3xl bg-slate-50 p-5">
                        <p className="text-sm text-slate-500">Contact</p>
                        <p className="mt-2 text-slate-700">{phone || 'Available on request'} · {user.email}</p>
                      </div>
                    </div>
                    <div className="mt-6 rounded-3xl border border-slate-200 p-5">
                      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">What I bring</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {profileTags.map((tag) => (
                          <span key={tag} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">{tag}</span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-6 grid gap-4 lg:grid-cols-2">
                      <div className="rounded-3xl border border-slate-200 p-5">
                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Looking For</p>
                        <ul className="mt-4 space-y-2 text-sm text-slate-700">
                          <li>• Business partners</li>
                          <li>• Graphic designer</li>
                          <li>• Mentor</li>
                          <li>• Funding opportunities</li>
                        </ul>
                      </div>
                      <div className="rounded-3xl border border-slate-200 p-5">
                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">I Can Help With</p>
                        <ul className="mt-4 space-y-2 text-sm text-slate-700">
                          <li>• Fashion design</li>
                          <li>• Branding</li>
                          <li>• Public speaking</li>
                          <li>• Sewing lessons</li>
                        </ul>
                      </div>
                    </div>
                  </section>
                )}

                {activeTab === 'photos' && (
                  <section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Photos</p>
                        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Visual story</h2>
                      </div>
                    </div>
                    <div className="mt-6 grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                      {galleryItems.map((item) => (
                        <div key={item.title} className={`aspect-square overflow-hidden rounded-3xl bg-gradient-to-br ${item.tone} p-4`}>
                          <div className="flex h-full flex-col justify-between rounded-[1.25rem] border border-white/30 bg-white/15 p-4 text-white backdrop-blur-sm">
                            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/80">{item.category}</span>
                            <div>
                              <p className="text-lg font-semibold">{item.title}</p>
                              <p className="mt-1 text-sm text-white/80">{item.caption}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {activeTab === 'business' && (
                  <section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Business</p>
                        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Featured ventures</h2>
                      </div>
                    </div>
                    <div className="mt-6 space-y-4">
                      <div className="rounded-3xl border border-slate-200 p-5">
                        <p className="text-lg font-semibold text-slate-900">Sharon Sage Fashion</p>
                        <p className="mt-2 text-sm text-slate-500">★★★★★</p>
                        <p className="mt-3 text-sm text-slate-700">Signature fashion and styling experiences for women building confident brands.</p>
                        <button className="mt-4 rounded-full border border-primary bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/20">Visit Profile</button>
                      </div>
                      <div className="rounded-3xl border border-slate-200 p-5">
                        <p className="text-lg font-semibold text-slate-900">Sage Modelling School</p>
                        <p className="mt-2 text-sm text-slate-500">Creative coaching and training.</p>
                        <p className="mt-3 text-sm text-slate-700">Workshops for poise, presence, and personal branding with a strong community focus.</p>
                        <button className="mt-4 rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200">Visit</button>
                      </div>
                    </div>
                    <div className="mt-6 rounded-3xl bg-slate-50 p-5">
                      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Services & offers</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {focusAreas.map((area) => (
                          <span key={area} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">{area}</span>
                        ))}
                      </div>
                    </div>
                  </section>
                )}

                {activeTab === 'academy' && (
                  <section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Academy</p>
                        <h2 className="mt-2 text-2xl font-semibold text-slate-900">BIG impact</h2>
                      </div>
                    </div>
                    <div className="mt-6 rounded-[1.75rem] bg-slate-950 p-6 text-white">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Overall Score</p>
                          <p className="mt-2 text-4xl font-semibold">92</p>
                        </div>
                        <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-slate-200">★★★★☆</div>
                      </div>
                      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {[
                          { label: 'Learn', value: '18 Courses' },
                          { label: 'Connect', value: '612 Members' },
                          { label: 'Earn', value: '3 Businesses' },
                          { label: 'Thrive', value: '84 Impact Points' },
                        ].map((item) => (
                          <div key={item.label} className="rounded-3xl border border-white/10 bg-white/10 p-4">
                            <p className="text-sm font-semibold text-slate-200">{item.label}</p>
                            <p className="mt-2 text-sm text-slate-100">{item.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-6 space-y-4">
                      {[
                        { title: 'Learn', progress: 90, detail: 'Completed 18 Courses' },
                        { title: 'Connect', progress: 82, detail: '612 Community Connections' },
                        { title: 'Earn', progress: 65, detail: '3 Businesses · 2 Partnerships' },
                        { title: 'Thrive', progress: 91, detail: 'Volunteer · Speaker · Mentor' },
                      ].map((item) => (
                        <div key={item.title} className="rounded-3xl border border-slate-200 p-5">
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                              <p className="text-sm text-slate-500">{item.detail}</p>
                            </div>
                            <p className="text-sm font-semibold text-slate-900">{item.progress}%</p>
                          </div>
                          <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
                            <div className="h-full rounded-full bg-primary" style={{ width: `${item.progress}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-3xl bg-slate-50 p-5">
                        <p className="text-sm text-slate-500">Certificates</p>
                        <p className="mt-2 font-semibold text-slate-900">BIG Academy certificate of completion</p>
                      </div>
                      <div className="rounded-3xl bg-slate-50 p-5">
                        <p className="text-sm text-slate-500">Achievements</p>
                        <p className="mt-2 font-semibold text-slate-900">Mentor · Volunteer · Top contributor</p>
                      </div>
                    </div>
                  </section>
                )}

                {activeTab === 'community' && (
                  <section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Community</p>
                        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Circles and connections</h2>
                      </div>
                    </div>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-3xl border border-slate-200 p-5">
                        <p className="text-sm text-slate-500">Circles</p>
                        <p className="mt-2 text-lg font-semibold text-slate-900">{primaryCircle || 'Learn'} · Connect · Earn · Thrive</p>
                      </div>
                      <div className="rounded-3xl border border-slate-200 p-5">
                        <p className="text-sm text-slate-500">Followers</p>
                        <p className="mt-2 text-lg font-semibold text-slate-900">{bigStats[0].value}</p>
                      </div>
                      <div className="rounded-3xl border border-slate-200 p-5">
                        <p className="text-sm text-slate-500">Following</p>
                        <p className="mt-2 text-lg font-semibold text-slate-900">{bigStats[1].value}</p>
                      </div>
                      <div className="rounded-3xl border border-slate-200 p-5">
                        <p className="text-sm text-slate-500">BIG Score</p>
                        <p className="mt-2 text-lg font-semibold text-slate-900">{points || 84} Impact points</p>
                      </div>
                    </div>
                    <div className="mt-6 space-y-4">
                      <div className="rounded-3xl bg-slate-50 p-5">
                        <p className="text-sm text-slate-500">Recommendations</p>
                        <div className="mt-3 space-y-3">
                          {recommendations.map((item) => (
                            <div key={item.name} className="rounded-2xl border border-slate-200 bg-white p-4">
                              <p className="font-semibold text-slate-900">{item.name}</p>
                              <p className="mt-1 text-sm text-slate-600">“{item.quote}”</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-3xl bg-slate-50 p-5">
                        <p className="text-sm text-slate-500">Badges</p>
                        <div className="mt-3 flex flex-wrap gap-3">
                          {achievements.slice(0, 4).map((badge) => (
                            <span key={badge} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">{badge}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>
                )}
              </div>

              <aside className="space-y-4 sm:space-y-6">
                <div className="rounded-[1.5rem] bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:rounded-[2rem] sm:p-6">
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Profile Strength</p>
                  <div className="mt-4 rounded-3xl bg-slate-100 p-4">
                    <div className="flex items-center justify-between text-sm text-slate-700">
                      <span>{profileStrength}%</span>
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">Complete Profile</span>
                    </div>
                    <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
                      <div className="h-full rounded-full bg-linear-to-r from-primary via-violet-500 to-secondary" style={{ width: `${profileStrength}%` }} />
                    </div>
                  </div>
                </div>

                <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-100">
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Upcoming Events</p>
                  <div className="mt-4 space-y-3">
                    {events.map((event) => (
                      <div key={event} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-700">{event}</div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-100">
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Suggested Members</p>
                  <div className="mt-4 space-y-3">
                    {suggestedMembers.map((member) => (
                      <div key={member} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-700">{member}</div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-100">
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Trending Topics</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {trendingTopics.map((topic) => (
                      <span key={topic} className="rounded-full border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-700">{topic}</span>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
