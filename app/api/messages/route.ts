import { NextRequest } from 'next/server'
import { requireAuth, supabase } from '@/lib/api-utils'
import { getConversationIdsForUser } from '@/lib/messages'

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request)
  if (!('userId' in auth)) return auth
  const userId = auth.userId

  // Get conversation ids for user
  const convIds = await getConversationIdsForUser(userId)
  if (convIds.length === 0) return new Response(JSON.stringify({ conversations: [] }), { status: 200 })

  // load conversations
  const { data: conversations } = await supabase.from('conversations').select('*').in('id', convIds)

  // load last message per conversation
  const { data: lastMessages } = await supabase
    .from('messages')
    .select('*')
    .in('conversation_id', convIds)
    .order('created_at', { ascending: false })

  const lastByConv: Record<string, Record<string, unknown>> = {}
  ;(lastMessages || []).forEach((m: Record<string, unknown>) => {
    const convId = m.conversation_id as string
    if (!lastByConv[convId]) lastByConv[convId] = m
  })

  // unread counts
  const { data: unreadRows } = await supabase.rpc('get_unread_counts', { p_user_id: userId }).maybeSingle().catch(() => ({ data: null }))

  // assemble conversation list
  const convList = (conversations || []).map((c: Record<string, unknown>) => {
    const id = c.id as string
    const last = lastByConv[id]
    return {
      id,
      is_group: c.is_group,
      title: c.title,
      last_message: last || null,
      last_activity: last?.created_at || c.updated_at || c.created_at,
      unread_count: (unreadRows && (unreadRows as Record<string, number>)[id]) || 0,
    }
  })

  convList.sort((a, b) => new Date(b.last_activity).getTime() - new Date(a.last_activity).getTime())

  return new Response(JSON.stringify({ conversations: convList }), { status: 200 })
}
