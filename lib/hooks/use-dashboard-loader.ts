import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase-client";

interface Profile {
  id?: string;
  first_name?: string | null;
  last_name?: string | null;
  avatar_url?: string | null;
  member_level?: string | null;
  full_name?: string | null;
  bio?: string | null;
  skills?: string[] | string | null;
  interests?: string[] | string | null;
  created_at?: string | null;
}

interface Circle {
  id?: string;
  name?: string | null;
  description?: string | null;
  avatar_url?: string | null;
  created_at?: string | null;
}

interface NotificationItem {
  id: string;
  type?: string | null;
  title?: string | null;
  message?: string | null;
  created_at?: string | null;
  read?: boolean | null;
}

interface EventItem {
  id?: string;
  title?: string | null;
  date?: string | null;
  location?: string | null;
  description?: string | null;
}

interface OpportunityItem {
  id: string;
  title?: string | null;
  description?: string | null;
  cover_image?: string | null;
  category?: string | null;
  featured?: boolean | null;
}

interface CourseItem {
  id?: string;
  course_id?: string | null;
  progress?: number | null;
  updated_at?: string | null;
  courses?: {
    id?: string;
    title?: string | null;
    description?: string | null;
    image_url?: string | null;
  } | null;
}

interface CommunityPost {
  id: string;
  content?: string | null;
  created_at?: string | null;
}

interface RecentActivity {
  title: string;
  description: string;
  created_at?: string | null;
  kind: string;
}

interface DashboardStats {
  postsCreated?: number;
  commentsMade?: number;
  circlesJoined?: number;
  eventsRegistered?: number;
  coursesCompleted?: number;
  profileCompletion?: number;
}

interface DashboardData {
  profile: Profile | null;
  circles: Circle[];
  notifications: NotificationItem[];
  upcomingEvent: EventItem | null;
  opportunities: OpportunityItem[];
  course: CourseItem | null;
  communityPosts: CommunityPost[];
  recentActivity: RecentActivity[];
  stats: DashboardStats;
}

// Global cache to prevent duplicate fetches
let globalCache: { data: DashboardData | null; timestamp: number } = {
  data: null,
  timestamp: 0,
};

/**
 * Hook for accessing unified dashboard data
 * Uses single API call + in-memory caching to prevent duplicate requests
 */
export function useDashboardLoader() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    const now = Date.now();
    if (globalCache.data && now - globalCache.timestamp < 5000) {
      setData(globalCache.data);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const headers: HeadersInit = {};
      if (session?.access_token) {
        headers.Authorization = `Bearer ${session.access_token}`;
      }

      const response = await window.fetch("/api/dashboard/loader", {
        headers,
        credentials: "same-origin",
      });
      if (!response.ok) throw new Error("Failed to load dashboard");
      const json = await response.json();
      if (json.error) throw new Error(json.error);

      globalCache = {
        data: json,
        timestamp: now,
      };

      setData(json);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadDashboard();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadDashboard]);

  return {
    data,
    loading,
    error,
    refetch: loadDashboard,
  };
}
