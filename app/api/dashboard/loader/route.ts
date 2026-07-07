import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { requireAuth, errorResponse } from "@/lib/api-utils";
import { NextRequest } from "next/server";

/**
 * Unified dashboard loader
 * Fetches profile, activity counts, recent activity, circles, events, opportunities, and course context.
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
    const [
      profileResult,
      circlesResult,
      notificationsResult,
      upcomingEventResult,
      featuredOpportunitiesResult,
      courseResult,
      postsResult,
      commentsResult,
      eventRegistrationsResult,
      academyEnrollmentsResult,
    ] = await Promise.allSettled([
      supabase
        .from("user_profiles")
        .select(
          "id, first_name, last_name, avatar_url, member_level, full_name, bio, skills, interests, created_at",
        )
        .eq("id", userId)
        .single(),

      supabase
        .from("circle_memberships")
        .select("created_at, circle_id, circles(id, name, description, avatar_url)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(5),

      supabase
        .from("notifications")
        .select("id, type, title, message, created_at, read")
        .eq("user_id", userId)
        .eq("read", false)
        .order("created_at", { ascending: false })
        .limit(3),

      supabase
        .from("events")
        .select("id, title, date, location, description")
        .gte("date", new Date().toISOString())
        .order("date", { ascending: true })
        .limit(1)
        .single(),

      supabase
        .from("opportunities")
        .select("id, title, description, cover_image, category, featured")
        .eq("featured", true)
        .order("created_at", { ascending: false })
        .limit(3),

      supabase
        .from("academy_enrollments")
        .select(
          "id, course_id, progress, updated_at, courses(id, title, description, image_url)",
        )
        .eq("user_id", userId)
        .order("updated_at", { ascending: false })
        .limit(5),

      supabase
        .from("posts")
        .select("id, content, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(5),

      supabase
        .from("comments")
        .select("id, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(10),

      supabase
        .from("event_registrations")
        .select("id, created_at, event_id")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(5),

      supabase
        .from("academy_enrollments")
        .select("id, progress")
        .eq("user_id", userId),
    ]);

    const profile = profileResult.status === "fulfilled" ? profileResult.value.data : null;
    const circles = circlesResult.status === "fulfilled"
      ? (circlesResult.value.data || []).map((membership: { circles?: Record<string, unknown> | null }) => membership.circles).filter(Boolean)
      : [];
    const notifications = notificationsResult.status === "fulfilled" ? notificationsResult.value.data || [] : [];
    const upcomingEvent = upcomingEventResult.status === "fulfilled" ? upcomingEventResult.value.data : null;
    const opportunities = featuredOpportunitiesResult.status === "fulfilled" ? featuredOpportunitiesResult.value.data || [] : [];
    const course = courseResult.status === "fulfilled" ? courseResult.value.data?.[0] ?? null : null;
    const posts = postsResult.status === "fulfilled" ? postsResult.value.data || [] : [];
    const comments = commentsResult.status === "fulfilled" ? commentsResult.value.data || [] : [];
    const eventRegistrations = eventRegistrationsResult.status === "fulfilled" ? eventRegistrationsResult.value.data || [] : [];
    const academyEnrollments = academyEnrollmentsResult.status === "fulfilled" ? academyEnrollmentsResult.value.data || [] : [];

    const completedCourses = academyEnrollments.filter((item: { progress?: number | null }) => Number(item.progress ?? 0) >= 0.99).length;
    const profileCompletion = (() => {
      if (!profile) return 0;
      const fields = ["full_name", "avatar_url", "bio", "skills", "interests"];
      const filled = fields.reduce((acc, field) => (profile[field] ? acc + 1 : acc), 0);
      return Math.round((filled / fields.length) * 100);
    })();

    const recentActivity = [
      ...(posts.length > 0
        ? [{
            title: "You posted in Community",
            description: posts[0].content?.slice(0, 70) || "You shared an update with the community",
            created_at: posts[0].created_at,
            kind: "post",
          }]
        : []),
      ...(circles.length > 0
        ? [{
            title: `You joined ${circles[0].name}`,
            description: "You are now part of a BIG circle",
            created_at: circles[0].created_at ?? null,
            kind: "circle",
          }]
        : []),
      ...(eventRegistrations.length > 0
        ? [{
            title: "You registered for an upcoming event",
            description: "You are keeping your calendar active",
            created_at: eventRegistrations[0].created_at,
            kind: "event",
          }]
        : []),
      ...(completedCourses > 0 && course
        ? [{
            title: `You completed ${course.courses?.title || "a course"}`,
            description: "That is progress you can build on",
            created_at: course.updated_at,
            kind: "course",
          }]
        : []),
    ].slice(0, 4);

    return new Response(
      JSON.stringify({
        profile,
        circles,
        notifications,
        upcomingEvent,
        opportunities,
        course,
        communityPosts: posts,
        stats: {
          postsCreated: posts.length,
          commentsMade: comments.length,
          circlesJoined: circles.length,
          eventsRegistered: eventRegistrations.length,
          coursesCompleted: completedCourses,
          profileCompletion,
        },
        recentActivity,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "private, max-age=60",
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
