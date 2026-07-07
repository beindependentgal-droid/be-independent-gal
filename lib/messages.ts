import { supabase } from './api-utils'

type Conversation = { id: string; is_group?: boolean }

export async function findOrCreatePrivateConversation(userA: string, userB: string) {
  // search for existing 1:1 conversation
  const { data: rows } = await supabase.from('conversation_members').select('conversation_id').in('profile_id', [userA, userB])

  if (rows) {
    const ids = (rows as { conversation_id: string }[]).map((r) => r.conversation_id)
    const { data: convs } = await supabase.from('conversations').select('*').in('id', ids).limit(100)
    if (convs && convs.length) {
      for (const c of convs as Conversation[]) {
        const { data: members } = await supabase.from('conversation_members').select('profile_id').eq('conversation_id', c.id)
        const memberIds = (members || []).map((m: { profile_id: string }) => m.profile_id).sort()
        if (memberIds.length === 2 && memberIds.includes(userA) && memberIds.includes(userB)) {
          return c
        }
      }
    }
  }

  const { data: conv, error } = await supabase.from('conversations').insert({ is_group: false }).select('*').maybeSingle()
  if (error || !conv) throw error || new Error('Failed to create conversation')

  await supabase.from('conversation_members').insert([{ conversation_id: conv.id, profile_id: userA }, { conversation_id: conv.id, profile_id: userB }])

  return conv
}

export async function userIsMember(conversationId: string, userId: string) {
  const { data, error } = await supabase.from('conversation_members').select('id').eq('conversation_id', conversationId).eq('profile_id', userId).maybeSingle()
  return !!data && !error
}

export async function insertMessage(conversationId: string, senderId: string, body: string | null, data: Record<string, unknown> | null = null) {
  const { data: msg, error } = await supabase.from('messages').insert({ conversation_id: conversationId, sender_id: senderId, body, data }).select('*').maybeSingle()
  if (error) throw error
  await supabase.from('conversations').update({ updated_at: new Date().toISOString() }).eq('id', conversationId)
  return msg
}

export async function getConversationIdsForUser(userId: string) {
  const { data } = await supabase.from('conversation_members').select('conversation_id').eq('profile_id', userId)
  return (data || []).map((r: { conversation_id: string }) => r.conversation_id)
}

export async function getProfilesByIds(ids: string[]) {
  if (!ids || ids.length === 0) return []
  const { data } = await supabase.from('profiles').select('id,first_name,last_name,avatar_url,profession,city').in('id', ids)
  return data || []
}
