import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase-client';
import type { Database } from '@/lib/db-types';

type Badge = Database['public']['Tables']['badges']['Row'];
type UserBadge = Database['public']['Tables']['user_badges']['Row'];
type LeaderboardEntry = Database['public']['Tables']['leaderboards']['Row'];

export function useLeaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const { data, error: err } = await supabase
          .from('leaderboards')
          .select('*')
          .order('rank', { ascending: true })
          .limit(100);

        if (err) throw err;
        setEntries(data || []);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, [supabase]);

  return { entries, loading };
}

export function useUserBadges(userId: string) {
  const [badges, setBadges] = useState<(UserBadge & { badge: Badge })[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchBadges() {
      try {
        const { data, error: err } = await supabase
          .from('user_badges')
          .select(`
            *,
            badge:badges(*)
          `)
          .eq('user_id', userId);

        if (err) throw err;
        setBadges(data || []);
      } finally {
        setLoading(false);
      }
    }

    fetchBadges();
  }, [userId, supabase]);

  return { badges, loading };
}

export function useChallenges() {
  const [challenges, setChallenges] = useState<Database['public']['Tables']['challenges']['Row'][]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchChallenges() {
      try {
        const { data, error: err } = await supabase
          .from('challenges')
          .select('*')
          .eq('status', 'active')
          .order('end_date', { ascending: true });

        if (err) throw err;
        setChallenges(data || []);
      } finally {
        setLoading(false);
      }
    }

    fetchChallenges();
  }, [supabase]);

  return { challenges, loading };
}

export function useUserChallenges(userId: string) {
  const [challenges, setChallenges] = useState<Database['public']['Tables']['challenge_participants']['Row'][]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchUserChallenges() {
      try {
        const { data, error: err } = await supabase
          .from('challenge_participants')
          .select('*')
          .eq('user_id', userId);

        if (err) throw err;
        setChallenges(data || []);
      } finally {
        setLoading(false);
      }
    }

    fetchUserChallenges();
  }, [userId, supabase]);

  return { challenges, loading };
}
