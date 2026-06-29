'use server';

import { createClient } from '@supabase/supabase-js';
import { messageSchema } from '@/lib/db-validators';
import type { Conversation, Message } from '@/lib/db-types';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  return createClient(url, key, { auth: { persistSession: false } });
}

const supabase = new Proxy({} as any, {
  get: (_, prop) => {
    return (getSupabase() as any)[prop];
  },
});

export async function getOrCreateConversation(
  userId: string,
  otherUserId: string
): Promise<Conversation> {
  const [user1, user2] = [userId, otherUserId].sort();

  const { data: existing } = await supabase
    .from('conversations')
    .select('*')
    .eq('user1_id', user1)
    .eq('user2_id', user2)
    .single();

  if (existing) return existing;

  const { data: created, error } = await supabase
    .from('conversations')
    .insert({
      user1_id: user1,
      user2_id: user2,
    })
    .select()
    .single();

  if (error) throw error;
  return created;
}

export async function getConversations(userId: string) {
  const { data, error } = await supabase
    .from('conversations')
    .select(`
      *,
      user1:user1_id(full_name, avatar_url),
      user2:user2_id(full_name, avatar_url)
    `)
    .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
    .order('last_message_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getMessages(conversationId: string, limit = 50) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data || []).reverse();
}

export async function sendMessage(
  conversationId: string,
  senderId: string,
  content: unknown
): Promise<Message> {
  const validated = messageSchema.parse({ content });

  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: senderId,
      content: validated.content,
    })
    .select()
    .single();

  if (error) throw error;

  await supabase
    .from('conversations')
    .update({ last_message_at: new Date().toISOString() })
    .eq('id', conversationId);

  return data;
}

export async function markMessageAsRead(messageId: string) {
  const { data, error } = await supabase
    .from('messages')
    .update({
      is_read: true,
      read_at: new Date().toISOString(),
    })
    .eq('id', messageId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
