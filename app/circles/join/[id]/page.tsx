import { redirect } from 'next/navigation'

export default async function CircleJoinRedirectPage({ params }: { params: Promise<{ id?: string }> }) {
  const resolvedParams = await params
  const rawId = resolvedParams?.id
  const id = rawId && rawId !== 'undefined' ? rawId : 'learn'
  redirect(`/circles/${id}/join`)
}
