import { NextRequest } from 'next/server'
import { requireAuth, supabase, sendNotification } from '@/lib/api-utils'
import { findOrCreatePrivateConversation, userIsMember, insertMessage } from '@/lib/messages'

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request)
  if (!('userId' in auth)) return auth
  const userId = auth.userId

  const body = await request.json()
  const { conversationId, toProfileId, text, data } = body

  let convId = conversationId
  if (!convId) {
    if (!toProfileId) return new Response(JSON.stringify({ error: 'Missing conversationId or toProfileId' }), { status: 400 })
    const conv = await findOrCreatePrivateConversation(userId, toProfileId)
    convId = conv.id
  }

  // membership check
  const isMember = await userIsMember(convId, userId)
  if (!isMember) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 })

  // blocked check: ensure recipient(s) have not blocked sender
  // For 1:1 conversations, find other participant
  const { data: members } = await supabase.from('conversation_members').select('profile_id').eq('conversation_id', convId)
  const other = (members || []).map((m: { profile_id: string }) => m.profile_id).filter((id: string) => id !== userId)
  if (other.length === 1) {
    const otherId = other[0]
    const { data: blocked } = await supabase.from('blocked_users').select('*').or(`blocker.eq.${userId},blocker.eq.${otherId}`)
    if (blocked && blocked.length > 0) return new Response(JSON.stringify({ error: 'Blocked' }), { status: 403 })
  }

  // insert message
  const msg = await insertMessage(convId, userId, text || null, data || null)

  // notify other members
  ;(other || []).forEach(async (profileId: string) => {
    await sendNotification(profileId, 'message', 'New message', text || '', userId, `/messages/${convId}`)
  })

  return new Response(JSON.stringify({ message: msg }), { status: 200 })
}
