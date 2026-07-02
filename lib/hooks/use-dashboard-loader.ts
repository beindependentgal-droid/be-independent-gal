import { useEffect, useState, useCallback } from "react";

interface DashboardData {
  profile: any | null;
  circles: any[];
  notifications: any[];
  upcomingEvent: any | null;
  opportunities: any[];
  course: any | null;
  communityPosts: any[];
}

const DASHBOARD_LOADER_KEY = "dashboard-loader-cache";

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

  const fetch = useCallback(async () => {
    // Check if cache is fresh (less than 5 seconds old)
    const now = Date.now();
    if (globalCache.data && now - globalCache.timestamp < 5000) {
      setData(globalCache.data);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/dashboard/loader");
      if (!response.ok) throw new Error("Failed to load dashboard");
      const json = await response.json();
      if (json.error) throw new Error(json.error);

      // Update global cache
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
    fetch();
  }, [fetch]);

  return {
    data,
    loading,
    error,
    refetch: fetch,
  };
}
