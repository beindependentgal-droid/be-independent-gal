import { NextRequest } from 'next/server'
import { requireAuth, supabase } from '@/lib/api-utils'

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAuth(request)
  if (!('userId' in auth)) return auth
  const userId = auth.userId
  const id = params.id

  const url = new URL(request.url)
  const mode = url.searchParams.get('mode') || 'for_me'

  const { data: msg } = await supabase.from('messages').select('*').eq('id', id).maybeSingle()
  if (!msg) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 })

  if (mode === 'for_everyone') {
    if (msg.sender_id !== userId) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 })
    const { error } = await supabase.from('messages').update({ deleted: true, updated_at: new Date().toISOString() }).eq('id', id)
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    return new Response(JSON.stringify({ ok: true }), { status: 200 })
  }

  // for_me: TODO: implement per-user deletes (soft-delete per user). For now, return success and clients should remove locally.
  return new Response(JSON.stringify({ ok: true, note: 'Deleted for me (client-side implementation recommended)' }), { status: 200 })
}
