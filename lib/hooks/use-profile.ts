import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import type { UserProfile } from "@/lib/db-types";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export function useProfile(userId: string | null) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function fetchProfile() {
      try {
        const { data, error: err } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (err && err.code !== "PGRST116") throw err;

        if (isMounted) {
          setProfile(data || null);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error("Unknown error"));
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchProfile();

    const subscription = supabase
      .channel(`profile:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_profiles",
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          if (isMounted) setProfile(payload.new as UserProfile | null);
        },
      )
      .subscribe();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [userId]);

  return { profile, loading, error };
}
