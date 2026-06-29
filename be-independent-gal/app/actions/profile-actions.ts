'use server';

import { createClient } from '@supabase/supabase-js';
import { userProfileSchema } from '@/lib/db-validators';
import type { UserProfile } from '@/lib/db-types';

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

export async function updateProfile(userId: string, data: unknown): Promise<UserProfile> {
  const validated = userProfileSchema.parse(data);
  
  const { data: profile, error } = await supabase
    .from('user_profiles')
    .update({
      ...validated,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw new Error(`Failed to update profile: ${error.message}`);
  return profile;
}

export async function getProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
}

export async function getUserActivity(userId: string) {
  const { data, error } = await supabase
    .from('user_activity')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw error;
  return data;
}

export async function addSkill(userId: string, skill: string) {
  const profile = await getProfile(userId);
  if (!profile) throw new Error('Profile not found');

  const skills = [...new Set([...(profile.skills || []), skill])];
  
  return updateProfile(userId, { ...profile, skills });
}

export async function removeSkill(userId: string, skill: string) {
  const profile = await getProfile(userId);
  if (!profile) throw new Error('Profile not found');

  const skills = (profile.skills || []).filter(s => s !== skill);
  
  return updateProfile(userId, { ...profile, skills });
}

export async function toggleMentorStatus(userId: string) {
  const profile = await getProfile(userId);
  if (!profile) throw new Error('Profile not found');

  return updateProfile(userId, { ...profile, is_mentor: !profile.is_mentor });
}
