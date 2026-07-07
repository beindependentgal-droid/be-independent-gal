import { NextRequest } from 'next/server'
import { requireAuth, supabase } from '@/lib/api-utils'

export async function PATCH(request: NextRequest) {
  const auth = await requireAuth(request)
  if (!('userId' in auth)) return auth
  const userId = auth.userId

  const body = await request.json()
  const { conversationId, messageIds } = body
  if (!conversationId || !Array.isArray(messageIds)) return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400 })

  const inserts = messageIds.map((mid: string) => ({ message_id: mid, profile_id: userId, read_at: new Date().toISOString() }))
  const { error } = await supabase.from('message_reads').insert(inserts).upsert(inserts, { onConflict: ['message_id', 'profile_id'] })
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })

  // notify senders about read status (optional)
  // clients subscribed to message_reads will receive realtime updates

  return new Response(JSON.stringify({ ok: true }), { status: 200 })
}
