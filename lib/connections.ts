import { createClient } from './supabase-client';

export type ConnectionStatus = 'not_connected' | 'request_sent' | 'request_received' | 'connected' | 'blocked';

export async function getConnectionBetween(userId: string, otherId: string) {
  const supabase = createClient();

  // look for a direct connection row either way
  const { data, error } = await supabase
    .from('connections')
    .select('*')
    .or(`and(requester.eq.${userId},recipient.eq.${otherId}),and(requester.eq.${otherId},recipient.eq.${userId})`)
    .maybeSingle();

  if (error) throw error;
  return data ?? null;
}

export async function sendConnectionRequest(fromProfile: string, toProfile: string, message?: string) {
  const supabase = createClient();

  // upsert a connection_requests row
  const { data, error } = await supabase
    .from('connection_requests')
    .upsert({ from_profile: fromProfile, to_profile: toProfile, message, status: 'pending' }, { onConflict: ['from_profile', 'to_profile'] })
    .select()
    .maybeSingle();

  if (error) throw error;

  // ensure a connections row exists to represent the state
  await supabase.from('connections').upsert(
    { requester: fromProfile, recipient: toProfile, status: 'request_sent' },
    { onConflict: ['requester', 'recipient'] },
  );

  // insert notification
  await supabase.from('notifications').insert({ profile_id: toProfile, type: 'connection_request', title: 'Connection request', message: message ?? 'You have a new connection request', data: { from: fromProfile } });

  return data;
}

export async function respondToRequest(requestId: string, responderProfile: string, accept: boolean) {
  const supabase = createClient();

  const { data: req } = await supabase.from('connection_requests').select('*').eq('id', requestId).maybeSingle();
  if (!req) throw new Error('Request not found');

  if (req.to_profile !== responderProfile && req.from_profile !== responderProfile) {
    throw new Error('Not authorized to respond to this request');
  }

  const status = accept ? 'accepted' : 'declined';
  await supabase.from('connection_requests').update({ status, responded_at: new Date().toISOString() }).eq('id', requestId);

  if (accept) {
    // create symmetric connections entries or mark connected
    await supabase.from('connections').upsert([
      { requester: req.from_profile, recipient: req.to_profile, status: 'connected' },
      { requester: req.to_profile, recipient: req.from_profile, status: 'connected' },
    ], { onConflict: ['requester', 'recipient'] });

    // create a direct conversation between the two users
    const { data: conv } = await supabase.from('conversations').insert({ is_group: false }).select('*').maybeSingle();
    if (conv) {
      await supabase.from('conversation_members').insert([
        { conversation_id: conv.id, profile_id: req.from_profile },
        { conversation_id: conv.id, profile_id: req.to_profile },
      ]);
    }

    // notify requester
    await supabase.from('notifications').insert({ profile_id: req.from_profile, type: 'connection_accepted', title: 'Connection accepted', message: 'Your connection request was accepted', data: { by: responderProfile } });
  } else {
    // declined: mark in connections if present
    await supabase.from('connections').upsert({ requester: req.from_profile, recipient: req.to_profile, status: 'not_connected' }, { onConflict: ['requester', 'recipient'] });
    await supabase.from('notifications').insert({ profile_id: req.from_profile, type: 'connection_declined', title: 'Connection declined', message: 'Your connection request was declined', data: { by: responderProfile } });
  }

  return { ok: true };
}
