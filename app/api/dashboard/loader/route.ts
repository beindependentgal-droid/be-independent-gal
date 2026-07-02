import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { requireAuth, successResponse, errorResponse } from "@/lib/api-utils";
import { NextRequest } from "next/server";

/**
 * Unified dashboard loader
 * Replaces 8+ separate API calls with a single request
 * Fetches: profile, notifications, current course, circles, events, opportunities, community feed
 */
export async function GET(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (authResult instanceof Response) return authResult;

  const { userId } = authResult;

  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return errorResponse("Supabase config missing", 500);
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options),
        );
      },
    },
  });

  try {
    // Fetch all data in parallel
    const [
      profileResult,
      circlesResult,
      notificationsResult,
      upcomingEventResult,
      featuredOpportunitiesResult,
      courseResult,
      communityPostsResult,
    ] = await Promise.allSettled([
      // 1. User profile (only needed fields)
      supabase
        .from("user_profiles")
        .select(
          "id, first_name, last_name, avatar_url, member_level, full_name, bio, skills, interests",
        )
        .eq("id", userId)
        .single(),

      // 2. User's circles (limited to 5)
      supabase
        .from("circle_memberships")
        .select("circle_id, circles(id, name, description, avatar_url)")
        .eq("user_id", userId)
        .limit(5),

      // 3. Notifications (limit 3)
      supabase
        .from("notifications")
        .select("id, type, title, message, created_at, read")
        .eq("user_id", userId)
        .eq("read", false)
        .order("created_at", { ascending: false })
        .limit(3),

      // 4. Next upcoming event (limit 1)
      supabase
        .from("events")
        .select("id, title, date, location, description")
        .gte("date", new Date().toISOString())
        .order("date", { ascending: true })
        .limit(1)
        .single(),

      // 5. Featured opportunities (limit 3)
      supabase
        .from("opportunities")
        .select("id, title, description, cover_image, category, featured")
        .eq("featured", true)
        .order("created_at", { ascending: false })
        .limit(3),

      // 6. User's current course (from gamification_points or saved progress)
      supabase
        .from("academy_enrollments")
        .select(
          "id, course_id, progress, courses(id, title, description, image_url)",
        )
        .eq("user_id", userId)
        .order("updated_at", { ascending: false })
        .limit(1)
        .single(),

      // 7. Community posts (limit 5)
      supabase
        .from("community_posts")
        .select("id, title, content, author_id, created_at, likes, replies")
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

    // Extract results, handling settled promises
    const profile =
      profileResult.status === "fulfilled" ? profileResult.value.data : null;
    const circles =
      circlesResult.status === "fulfilled"
        ? (circlesResult.value.data || []).map((m: any) => m.circles)
        : [];
    const notifications =
      notificationsResult.status === "fulfilled"
        ? notificationsResult.value.data || []
        : [];
    const upcomingEvent =
      upcomingEventResult.status === "fulfilled"
        ? upcomingEventResult.value.data
        : null;
    const opportunities =
      featuredOpportunitiesResult.status === "fulfilled"
        ? featuredOpportunitiesResult.value.data || []
        : [];
    const course =
      courseResult.status === "fulfilled" ? courseResult.value.data : null;
    const communityPosts =
      communityPostsResult.status === "fulfilled"
        ? communityPostsResult.value.data || []
        : [];

    return new Response(
      JSON.stringify({
        profile,
        circles,
        notifications,
        upcomingEvent,
        opportunities,
        course,
        communityPosts,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "private, max-age=60", // Cache for 1 minute
        },
      },
    );
  } catch (error) {
    console.error("Dashboard loader error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to load dashboard data" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
