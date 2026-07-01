"use server";

import { createClient } from "@supabase/supabase-js";
import type { Badge, Challenge, Leaderboard } from "@/lib/db-types";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const candidateKeys = [serviceRoleKey, anonKey].filter(Boolean);

  if (!url || candidateKeys.length === 0) {
    return null;
  }

  for (const key of candidateKeys) {
    try {
      return createClient(url, key, { auth: { persistSession: false } });
    } catch {
      continue;
    }
  }

  return null;
}

const supabase = new Proxy({} as any, {
  get: (_, prop) => {
    return (getSupabase() as any)[prop];
  },
});

// Badges
export async function getBadges(): Promise<Badge[]> {
  const { data, error } = await supabase
    .from("badges")
    .select("*")
    .order("points_required", { ascending: true });

  if (error) throw error;
  return data;
}

export async function getUserBadges(userId: string) {
  const { data, error } = await supabase
    .from("user_badges")
    .select("*, badge:badge_id(*)")
    .eq("user_id", userId);

  if (error) throw error;
  return data;
}

export async function awardBadge(userId: string, badgeId: string) {
  const { data, error } = await supabase
    .from("user_badges")
    .insert({
      user_id: userId,
      badge_id: badgeId,
    })
    .select()
    .single();

  if (error && error.code === "23505") {
    return null; // Already has badge
  }
  if (error) throw error;
  return data;
}

// Challenges
export async function getActiveChallenges() {
  const client = getSupabase();
  if (!client) {
    return [];
  }

  const { data, error } = await client
    .from("challenges")
    .select("*")
    .eq("status", "active")
    .gte("end_date", new Date().toISOString())
    .order("end_date", { ascending: true });

  if (error) {
    // Return empty list if table is missing during build-time prerendering
    if (error.code === "PGRST205" || error.code === "PGRST116") {
      return [];
    }
    throw error;
  }

  return data;
}

export async function getChallengeById(challengeId: string) {
  const { data, error } = await supabase
    .from("challenges")
    .select("*")
    .eq("id", challengeId)
    .single();

  if (error) throw error;
  return data;
}

export async function joinChallenge(challengeId: string, userId: string) {
  const { data, error } = await supabase
    .from("challenge_participants")
    .insert({
      challenge_id: challengeId,
      user_id: userId,
    })
    .select()
    .single();

  if (error && error.code === "23505") {
    return null; // Already joined
  }
  if (error) throw error;
  return data;
}

export async function updateChallengeProgress(
  challengeId: string,
  userId: string,
  progressPercentage: number,
) {
  const { data, error } = await supabase
    .from("challenge_participants")
    .update({
      progress_percentage: Math.min(100, progressPercentage),
      completed_at: progressPercentage >= 100 ? new Date().toISOString() : null,
    })
    .eq("challenge_id", challengeId)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUserChallenges(userId: string) {
  const { data, error } = await supabase
    .from("challenge_participants")
    .select("*, challenge:challenge_id(*)")
    .eq("user_id", userId)
    .order("joined_at", { ascending: false });

  if (error) throw error;
  return data;
}

// Leaderboards
export async function getLeaderboard(
  period: "daily" | "weekly" | "monthly" | "all-time",
  circleName?: string,
) {
  let query = supabase
    .from("leaderboards")
    .select("*, user:user_id(full_name, avatar_url)")
    .eq("period", period)
    .order("rank", { ascending: true })
    .limit(100);

  if (circleName) {
    query = query.eq("circle_name", circleName);
  } else {
    query = query.is("circle_name", null);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getUserLeaderboardRank(
  userId: string,
  period: "daily" | "weekly" | "monthly" | "all-time",
  circleName?: string,
) {
  let query = supabase
    .from("leaderboards")
    .select("*")
    .eq("user_id", userId)
    .eq("period", period);

  if (circleName) {
    query = query.eq("circle_name", circleName);
  } else {
    query = query.is("circle_name", null);
  }

  const { data, error } = await query.single();
  if (error && error.code !== "PGRST116") throw error;
  return data || null;
}

export async function updateLeaderboard(
  userId: string,
  points: number,
  period: "daily" | "weekly" | "monthly" | "all-time",
  circleName?: string,
) {
  const { data: existing, error: fetchError } = await getUserLeaderboardRank(
    userId,
    period,
    circleName,
  );

  if (fetchError && fetchError.code !== "PGRST116") throw fetchError;

  if (existing) {
    const { data, error } = await supabase
      .from("leaderboards")
      .update({
        total_points: existing.total_points + points,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  const { data, error } = await supabase
    .from("leaderboards")
    .insert({
      user_id: userId,
      period,
      circle_name: circleName,
      total_points: points,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
