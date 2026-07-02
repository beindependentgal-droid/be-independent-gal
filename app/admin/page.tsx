"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Activity, ShieldCheck, Users, AlertTriangle, ArrowRight, CheckCircle2, XCircle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from '@/lib/auth-context'
import { getAccessToken } from '@/lib/auth-utils'

interface PlatformAnalyticsItem {
  date: string
  new_users: number
  active_users: number
  posts: number
  events: number
}

interface FlaggedContent {
  id: string
  reason: string
  status: string
  created_at: string
  flagged_by?: { first_name?: string; last_name?: string }
}

interface AdminUser {
  id: string
  first_name?: string
  last_name?: string
  email?: string
  profession?: string
  city?: string
  member_level?: string
  points?: number
  created_at?: string
}

interface FormSubmission {
  id: string
  full_name: string
  email: string
  role: string
  experience: string
  goals: string
  interests: string[]
  contact_method: string
  updates: boolean
  created_at: string
}

export default function AdminDashboardPage() {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const [analytics, setAnalytics] = useState<PlatformAnalyticsItem[]>([])
  const [flaggedContent, setFlaggedContent] = useState<FlaggedContent[]>([])
  const [users, setUsers] = useState<AdminUser[]>([])
  const [submissions, setSubmissions] = useState<FormSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [processingAction, setProcessingAction] = useState<{ id: string; type: "flag" | "member" } | null>(null)

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const token = await getAccessToken()
      const headers: HeadersInit | undefined = token
        ? { Authorization: `Bearer ${token}` }
        : undefined

      const [analyticsRes, usersRes, formsRes] = await Promise.all([
        fetch("/api/analytics/dashboard", { headers }),
        fetch("/api/admin/users?limit=8", { headers }),
        fetch("/api/admin/forms", { headers }),
      ])

      if (!analyticsRes.ok || !usersRes.ok || !formsRes.ok) {
        throw new Error("Unable to load admin data")
      }

      const analyticsPayload = await analyticsRes.json()
      const usersPayload = await usersRes.json()
      const formsPayload = await formsRes.json()

      setAnalytics(analyticsPayload.platformAnalytics ?? [])
      setFlaggedContent(analyticsPayload.flaggedContent ?? [])
      setUsers(usersPayload.users ?? [])
      setSubmissions(formsPayload.submissions ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load admin dashboard")
    } finally {
      setLoading(false)
    }
  }, [])

  const summary = useMemo(() => {
    const latest = analytics.at(-1)
    const totalMembers = users.length
    const pendingFlags = flaggedContent.filter((item) => item.status === "pending").length

    return {
      activeMembers: latest?.active_users ?? 0,
      newMembers: latest?.new_users ?? 0,
      pendingFlags,
      totalMembers,
    }
  }, [analytics, flaggedContent, users])

  const summaryCards = useMemo(
    () => [
      {
        label: "Active members",
        value: summary.activeMembers,
        icon: Users,
        accent: "from-violet-600 via-fuchsia-500 to-pink-500",
      },
      {
        label: "New members",
        value: summary.newMembers,
        icon: Activity,
        accent: "from-sky-600 via-cyan-500 to-emerald-400",
      },
      {
        label: "Pending flags",
        value: summary.pendingFlags,
        icon: AlertTriangle,
        accent: "from-amber-500 via-orange-500 to-rose-500",
      },
      {
        label: "Managed members",
        value: summary.totalMembers,
        icon: ShieldCheck,
        accent: "from-slate-700 via-slate-600 to-slate-500",
      },
    ],
    [summary],
  )

  const handleFlagAction = async (flagId: string, action: "approve" | "dismiss") => {
    try {
      setProcessingAction({ id: flagId, type: "flag" })
      const token = await getAccessToken()
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      }

      const response = await fetch(`/api/admin/moderation/${flagId}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ action }),
      })

      if (!response.ok) {
        throw new Error("Unable to update moderation flag")
      }

      await loadDashboard()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update moderation flag")
    } finally {
      setProcessingAction(null)
    }
  }

  const handleMemberUpdate = async (memberId: string, nextLevel: string) => {
    try {
      setProcessingAction({ id: memberId, type: "member" })
      const token = await getAccessToken()
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      }

      const response = await fetch(`/api/admin/users/${memberId}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ member_level: nextLevel }),
      })

      if (!response.ok) {
        throw new Error("Unable to update member level")
      }

      await loadDashboard()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update member level")
    } finally {
      setProcessingAction(null)
    }
  }

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      void loadDashboard()
    }
  }, [authLoading, isAuthenticated, loadDashboard])

  if (!authLoading && !isAuthenticated) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-7xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary-">Admin</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">Access denied</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            You must be signed in with an admin account to view this page.
          </p>
          <div className="mt-6">
            <Link href="/auth/login">
              <Button className="rounded-full bg-secondary- px-5 py-3 text-sm font-semibold text-white hover:bg-secondary-">
                Sign in
              </Button>
            </Link>
          </div>
        </div>
      </main>
    )
  }

  if (authLoading || loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary-">Admin</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">Loading dashboard…</h1>
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-7xl rounded-3xl border border-rose-200 bg-rose-50 p-8 text-rose-700">
          <p className="font-semibold">Unable to load admin dashboard</p>
          <p className="mt-2 text-sm">{error}</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(247,30,108,0.12),_transparent_30%),linear-gradient(135deg,_#f8fafc_0%,_#fdf2f8_100%)] px-6 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/80 p-8 shadow-[0_25px_70px_-28px_rgba(15,23,42,0.22)] backdrop-blur">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-pink-50 px-3 py-1 text-sm font-semibold text-pink-700">
                <Sparkles className="h-4 w-4" />
                Admin dashboard
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Community operations at a glance
              </h1>
              <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                Monitor growth, moderation, and new community activity in one clean, modern workspace.
              </p>
            </div>
            <Link href="/community">
              <Button className="rounded-full bg-gradient-to-r from-secondary- via-pink-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-200 hover:opacity-95">
                Open community
              </Button>
            </Link>
          </div>
        </section>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.label}
                className={`rounded-[1.5rem] border border-white/80 bg-gradient-to-br ${item.accent} p-[1px] shadow-[0_20px_50px_-24px_rgba(15,23,42,0.35)]`}
              >
                <div className="rounded-[1.44rem] bg-slate-950/90 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-white/80">{item.label}</p>
                    <div className="rounded-2xl bg-white/15 p-2 backdrop-blur">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <p className="mt-6 text-3xl font-semibold tracking-tight">{item.value}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[1.75rem] border border-slate-200/80 bg-white/80 p-6 shadow-[0_20px_50px_-28px_rgba(15,23,42,0.25)] backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Recent platform activity</h2>
                <p className="mt-1 text-sm text-slate-500">Last 30 days</p>
              </div>
              <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
                Live snapshot
              </div>
            </div>
            <div className="mt-6 space-y-3">
              {analytics.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                  No analytics data is available yet.
                </p>
              ) : (
                analytics.map((item) => (
                  <div key={item.date} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-3">
                    <div>
                      <p className="font-medium text-slate-800">{item.date}</p>
                      <p className="text-sm text-slate-500">{item.active_users} active users</p>
                    </div>
                    <div className="text-right text-sm text-slate-600">
                      <p>{item.new_users} new users</p>
                      <p>{item.posts} posts</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[1.75rem] border border-slate-200/80 bg-white/80 p-6 shadow-[0_20px_50px_-28px_rgba(15,23,42,0.25)] backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Pending moderation</h2>
                  <p className="mt-1 text-sm text-slate-500">Needs review</p>
                </div>
                <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                  {flaggedContent.length} open
                </div>
              </div>
              <div className="mt-6 space-y-3">
                {flaggedContent.length === 0 ? (
                  <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                    No moderation flags right now.
                  </p>
                ) : (
                  flaggedContent.map((item) => {
                    const isBusy = processingAction?.id === item.id && processingAction.type === "flag"
                    return (
                      <div key={item.id} className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                        <p className="text-sm font-medium text-slate-800">{item.reason}</p>
                        <p className="mt-1 text-xs text-slate-500">Reported by {item.flagged_by?.first_name ?? "a member"}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50"
                            onClick={() => void handleFlagAction(item.id, "approve")}
                            disabled={isBusy}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            Approve
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                            onClick={() => void handleFlagAction(item.id, "dismiss")}
                            disabled={isBusy}
                          >
                            <XCircle className="h-4 w-4" />
                            Dismiss
                          </Button>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200/80 bg-white/80 p-6 shadow-[0_20px_50px_-28px_rgba(15,23,42,0.25)] backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Recent form submissions</h2>
                  <p className="mt-1 text-sm text-slate-500">Community interest intake</p>
                </div>
                <div className="rounded-full bg-violet-50 px-3 py-1 text-sm font-medium text-violet-700">
                  New interest
                </div>
              </div>
              <div className="mt-6 space-y-3">
                {submissions.length === 0 ? (
                  <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                    No form submissions yet.
                  </p>
                ) : (
                  submissions.slice(0, 6).map((submission) => (
                    <div key={submission.id} className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-slate-800">{submission.full_name}</p>
                          <p className="text-sm text-slate-500">{submission.email}</p>
                        </div>
                        <span className="rounded-full bg-gradient-to-r from-secondary- to-pink-500 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                          {submission.role}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-slate-600">{submission.goals}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {submission.interests.slice(0, 4).map((interest) => (
                          <span key={interest} className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600">
                            {interest}
                          </span>
                        ))}
                      </div>
                      <p className="mt-3 text-xs text-slate-500">Submitted {new Date(submission.created_at).toLocaleDateString()}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200/80 bg-white/80 p-6 shadow-[0_20px_50px_-28px_rgba(15,23,42,0.25)] backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Recent members</h2>
              <p className="mt-1 text-sm text-slate-500">New arrivals and account updates</p>
            </div>
            <Link href="/directory" className="inline-flex items-center gap-2 text-sm font-semibold text-pink-600">
              View directory <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-6 overflow-hidden rounded-[1.25rem] border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Member</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Location</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Level</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Joined</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-sm text-slate-500">
                      No member records are available yet.
                    </td>
                  </tr>
                ) : (
                  users.map((member) => {
                    const isBusy = processingAction?.id === member.id && processingAction.type === "member"
                    const nextLevel = member.member_level === "mentor" ? "member" : "mentor"
                    const nextLabel = member.member_level === "mentor" ? "Downgrade" : "Promote"

                    return (
                      <tr key={member.id}>
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-800">
                            {member.first_name || member.last_name ? `${member.first_name ?? ""} ${member.last_name ?? ""}`.trim() : "Unnamed member"}
                          </div>
                          <div className="text-xs text-slate-500">{member.email}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-600">{member.city || "—"}</td>
                        <td className="px-4 py-3 text-slate-600">{member.member_level || "member"}</td>
                        <td className="px-4 py-3 text-slate-600">{member.created_at ? new Date(member.created_at).toLocaleDateString() : "—"}</td>
                        <td className="px-4 py-3">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="border-pink-200 bg-white text-pink-600 hover:bg-pink-50"
                            onClick={() => void handleMemberUpdate(member.id, nextLevel)}
                            disabled={isBusy}
                          >
                            <Sparkles className="h-4 w-4" />
                            {isBusy ? "Updating..." : nextLabel}
                          </Button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  )
}
