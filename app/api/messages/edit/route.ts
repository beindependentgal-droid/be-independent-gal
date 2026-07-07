import { NextRequest } from 'next/server'
import { requireAuth, supabase } from '@/lib/api-utils'

const EDIT_WINDOW_SECONDS = parseInt(process.env.MESSAGE_EDIT_WINDOW_SECONDS || '300')

export async function PATCH(request: NextRequest) {
  const auth = await requireAuth(request)
  if (!('userId' in auth)) return auth
  const userId = auth.userId

  const body = await request.json()
  const { messageId, newBody } = body
  if (!messageId || typeof newBody !== 'string') return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400 })

  const { data: msg } = await supabase.from('messages').select('*').eq('id', messageId).maybeSingle()
  if (!msg) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 })
  if (msg.sender_id !== userId) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 })

  const created = new Date(msg.created_at).getTime()
  const now = Date.now()
  if ((now - created) / 1000 > EDIT_WINDOW_SECONDS) return new Response(JSON.stringify({ error: 'Edit window expired' }), { status: 403 })

  const { error } = await supabase.from('messages').update({ body: newBody, edited: true, updated_at: new Date().toISOString() }).eq('id', messageId)
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })

  return new Response(JSON.stringify({ ok: true }), { status: 200 })
}
