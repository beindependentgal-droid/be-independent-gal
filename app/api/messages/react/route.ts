import { NextRequest } from 'next/server'
import { requireAuth, supabase } from '@/lib/api-utils'

export async function PATCH(request: NextRequest) {
  const auth = await requireAuth(request)
  if (!('userId' in auth)) return auth
  const userId = auth.userId

  const body = await request.json()
  const { messageId, reaction } = body
  if (!messageId || !reaction) return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400 })

  // toggle reaction
  const { data: exists } = await supabase.from('message_reactions').select('*').eq('message_id', messageId).eq('profile_id', userId).eq('reaction', reaction)
  if (exists && exists.length > 0) {
    await supabase.from('message_reactions').delete().eq('message_id', messageId).eq('profile_id', userId).eq('reaction', reaction)
    return new Response(JSON.stringify({ ok: true, removed: true }), { status: 200 })
  }

  const { error } = await supabase.from('message_reactions').insert({ message_id: messageId, profile_id: userId, reaction }).select('*')
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })

  return new Response(JSON.stringify({ ok: true }), { status: 200 })
}
