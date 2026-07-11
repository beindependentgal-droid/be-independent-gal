import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { createClient } from "@/lib/supabase-client";

interface Profile {
  id?: string;
  first_name?: string | null;
  last_name?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  city?: string | null;
  phone?: string | null;
  skills?: string[] | string | null;
  interests?: string[] | string | null;
  member_level?: string | null;
  level?: number | null;
  created_at?: string | null;
}

interface Circle {
  id?: string;
  name?: string | null;
  role?: string | null;
  created_at?: string | null;
  next_meeting?: string | null;
}

interface NotificationItem {
  id: string;
  title?: string | null;
  message?: string | null;
  created_at?: string | null;
  read?: boolean | null;
}

interface EventItem {
  id: string;
  title?: string | null;
  date?: string | null;
  event_date?: string | null;
  location?: string | null;
  description?: string | null;
  registered?: boolean;
}

interface OpportunityItem {
  id: string;
  title?: string | null;
  category?: string | null;
  deadline?: string | null;
  application_deadline?: string | null;
  closing_date?: string | null;
  location?: string | null;
  description?: string | null;
}

interface CommunityPost {
  id: string;
  content?: string | null;
  created_at?: string | null;
  user_id?: string | null;
  author_name?: string | null;
  author_avatar?: string | null;
  likes_count?: number | null;
  comments_count?: number | null;
}

interface RecentActivity {
  title: string;
  description: string;
  created_at?: string | null;
  kind: string;
}

interface ActivityEntry {
  id?: string;
  activity_type?: string | null;
  action?: string | null;
  points_earned?: number | null;
  created_at?: string | null;
  circle_id?: string | null;
}

interface DashboardStats {
  postsCreated: number;
  commentsMade: number;
  circlesJoined: number;
  eventsRegistered: number;
  coursesCompleted: number;
  profileCompletion: number;
}

interface DashboardData {
  profile: Profile | null;
  circles: Circle[];
  notifications: NotificationItem[];
  upcomingEvents: EventItem[];
  lastUpdated: string | null;
  upcomingEvent: EventItem | null;
  opportunities: OpportunityItem[];
  communityPosts: CommunityPost[];
  recentActivity: RecentActivity[];
  stats: DashboardStats;
  nextSteps: string[];
  goals: Array<{ title: string; done: boolean }>;
  club: Circle | null;
  registeredEventIds: string[];
  analyticsCounts: Record<string, number>;
  analyticsSeries: Array<{ date: string; count: number }>;
  course: {
    course_id?: string | null;
    progress?: number | null;
    courses?: {
      id?: string;
      title?: string | null;
      image_url?: string | null;
    } | null;
  } | null;
}

async function tryQuery<T>(
  queries: Array<
    () => Promise<{ data: T | null; error: { message?: string } | null }>
  >,
  fallback: T | null = null,
): Promise<T | null> {
  for (const query of queries) {
    try {
      const result = await query();
      if (!result.error) {
        return result.data ?? fallback;
      }
    } catch {
      // Try the next fallback query.
    }
  }

  return fallback;
}

function toArray<T>(value: T | T[] | null | undefined): T[] {
  if (Array.isArray(value)) return value;
  return value ? [value] : [];
}

function parseDate(value: unknown): Date | null {
  if (!value) return null;
  const dateValue = new Date(String(value));
  return Number.isNaN(dateValue.getTime()) ? null : dateValue;
}

function getValue<T>(value: T | null | undefined): T | null {
  return value ?? null;
}

export function useDashboardLoader() {
  const { user, isAuthenticated } = useAuth();
  const userId = user?.id;
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    if (!isAuthenticated || !userId) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    const supabase = createClient();

    try {
      const [
        userProfileResult,
        profileRecordResult,
        postsResult,
        commentsResult,
        membershipsResult,
        registrationsResult,
        academyResult,
        eventsResult,
        opportunitiesResult,
        notificationsResult,
        activityResult,
        analyticsResult,
      ] = await Promise.allSettled([
        tryQuery(
          [
            () =>
              supabase
                .from("user_profiles")
                .select(
                  "id, user_id, first_name, last_name, full_name, avatar_url, bio, profession, industry, business, city, phone, experience, why_joining, skills, interests, mentoring_areas, location, website, total_points, level, badges_count, joined_at, created_at, updated_at",
                )
                .eq("user_id", userId)
                .maybeSingle(),
          ],
          null,
        ),
        tryQuery(
          [
            () =>
              supabase
                .from("profiles")
                .select(
                  "id, first_name, last_name, email, phone, city, profession, business, bio, avatar_url, primary_circle, join_reason, member_level, points, created_at, updated_at",
                )
                .eq("id", userId)
                .maybeSingle(),
          ],
          null,
        ),
        tryQuery([], []),
        tryQuery([], []),
        tryQuery(
          [
            () =>
              supabase
                .from("circle_members")
                .select("id, joined_at, circle_id, role, circles(id, name)")
                .eq("user_id", userId)
                .order("joined_at", { ascending: false })
                .limit(8),
          ],
          [],
        ),
        tryQuery(
          [
            () =>
              supabase
                .from("event_registrations")
                .select("id, event_id, registered_at")
                .eq("user_id", userId)
                .order("registered_at", { ascending: false }),
          ],
          [],
        ),
        tryQuery([], []),
        tryQuery(
          [
            () =>
              supabase
                .from("events")
                .select("id, title, start_date, location, description")
                .order("start_date", { ascending: true })
                .limit(10),
          ],
          [],
        ),
        tryQuery([], []),
        tryQuery(
          [
            () =>
              supabase
                .from("notifications")
                .select("id, title, message, created_at, is_read")
                .eq("user_id", userId)
                .eq("is_read", false)
                .order("created_at", { ascending: false })
                .limit(6),
          ],
          [],
        ),
        tryQuery(
          [
            () =>
              supabase
                .from("user_activity")
                .select(
                  "id, activity_type, action, points_earned, created_at, circle_id",
                )
                .eq("user_id", userId)
                .order("created_at", { ascending: false })
                .limit(8),
          ],
          [],
        ),
        tryQuery(
          [
            () =>
              supabase
                .from("analytics_events")
                .select("event_type, created_at")
                .eq("user_id", userId)
                .order("created_at", { ascending: false })
                .limit(100),
          ],
          [],
        ),
      ]);

      const userProfileData =
        userProfileResult.status === "fulfilled"
          ? userProfileResult.value
          : null;
      const profileRecordData =
        profileRecordResult.status === "fulfilled"
          ? profileRecordResult.value
          : null;
      const profileData = {
        ...(userProfileData as Record<string, unknown> | null),
        ...(profileRecordData as Record<string, unknown> | null),
      } as Record<string, unknown> | null;
      const postsData =
        postsResult.status === "fulfilled" ? (postsResult.value ?? []) : [];
      const commentsData =
        commentsResult.status === "fulfilled"
          ? (commentsResult.value ?? [])
          : [];
      const membershipsData =
        membershipsResult.status === "fulfilled"
          ? (membershipsResult.value ?? [])
          : [];
      const registrationsData =
        registrationsResult.status === "fulfilled"
          ? (registrationsResult.value ?? [])
          : [];
      const academyData =
        academyResult.status === "fulfilled" ? (academyResult.value ?? []) : [];
      const eventsData =
        eventsResult.status === "fulfilled" ? (eventsResult.value ?? []) : [];
      const opportunitiesData =
        opportunitiesResult.status === "fulfilled"
          ? (opportunitiesResult.value ?? [])
          : [];
      const notificationsData =
        notificationsResult.status === "fulfilled"
          ? (notificationsResult.value ?? [])
          : [];
      const activityData =
        activityResult.status === "fulfilled"
          ? (activityResult.value ?? [])
          : [];
      const analyticsData =
        analyticsResult.status === "fulfilled"
          ? (analyticsResult.value ?? [])
          : [];

      const postsArray = toArray(
        postsData as
          | Array<Record<string, unknown>>
          | Record<string, unknown>
          | null
          | undefined,
      );
      const commentsArray = toArray(
        commentsData as
          | Array<Record<string, unknown>>
          | Record<string, unknown>
          | null
          | undefined,
      );
      const membershipsArray = toArray(
        membershipsData as
          | Array<Record<string, unknown>>
          | Record<string, unknown>
          | null
          | undefined,
      );
      const registrationsArray = toArray(
        registrationsData as
          | Array<Record<string, unknown>>
          | Record<string, unknown>
          | null
          | undefined,
      );
      const academyArray = toArray(
        academyData as
          | Array<Record<string, unknown>>
          | Record<string, unknown>
          | null
          | undefined,
      );
      const eventsArray = toArray(
        eventsData as
          | Array<Record<string, unknown>>
          | Record<string, unknown>
          | null
          | undefined,
      );
      const opportunitiesArray = toArray(
        opportunitiesData as
          | Array<Record<string, unknown>>
          | Record<string, unknown>
          | null
          | undefined,
      );
      const notificationsArray = toArray(
        notificationsData as
          | Array<Record<string, unknown>>
          | Record<string, unknown>
          | null
          | undefined,
      );
      const activityArray = toArray(
        activityData as
          | Array<Record<string, unknown>>
          | Record<string, unknown>
          | null
          | undefined,
      );
      const analyticsArray = toArray(
        analyticsData as
          | Array<Record<string, unknown>>
          | Record<string, unknown>
          | null
          | undefined,
      );

      const profile = profileData as Record<string, unknown> | null;
      const analyticsEvents = analyticsArray.map((event) => ({
        event_type: getValue(event.event_type as string | null) ?? "unknown",
        created_at: getValue(event.created_at as string | null),
      }));
      const profileCompletion = (() => {
        if (!profile) return 0;
        const fields = ["avatar_url", "bio", "city", "phone", "interests"];
        const filled = fields.reduce(
          (total, field) => (profile[field] ? total + 1 : total),
          0,
        );
        return Math.round((filled / fields.length) * 100);
      })();

      const posts = postsArray.map((post) => ({
        id: String(post.id ?? ""),
        content: getValue(post.content as string | null),
        created_at: getValue(post.created_at as string | null),
        user_id:
          getValue(post.user_id as string | null) ??
          getValue(post.author_id as string | null),
      }));

      const comments = commentsArray;
      const memberships = membershipsArray;
      const eventRegistrations = registrationsArray;
      const academyEntries = academyArray;

      const circles = memberships
        .map((membership) => {
          const circle =
            (membership.circles as
              | Record<string, unknown>
              | null
              | undefined) ?? null;
          return {
            id: String(circle?.id ?? membership.circle_id ?? ""),
            name: getValue(circle?.name as string | null),
            role: getValue(membership.role as string | null),
            created_at: getValue(
              (membership.joined_at ?? membership.created_at) as string | null,
            ),
            next_meeting: getValue(membership.next_meeting as string | null),
          };
        })
        .filter((circle) => circle.id || circle.name);

      const registeredEventIds = eventRegistrations
        .map((item) => String(item.event_id ?? ""))
        .filter(Boolean);
      const upcomingEvents = eventsArray
        .map((event) => ({
          id: String(event.id ?? ""),
          title: getValue(event.title as string | null),
          date:
            getValue(event.date as string | null) ??
            getValue(event.event_date as string | null),
          location: getValue(event.location as string | null),
          description: getValue(event.description as string | null),
          registered: registeredEventIds.includes(String(event.id ?? "")),
        }))
        .filter((event) => event.id)
        .filter((event) => {
          const parsed = parseDate(event.date);
          return !parsed || parsed >= new Date();
        })
        .sort((left, right) => {
          const leftDate = parseDate(left.date);
          const rightDate = parseDate(right.date);
          if (!leftDate && !rightDate) return 0;
          if (!leftDate) return 1;
          if (!rightDate) return -1;
          return leftDate.getTime() - rightDate.getTime();
        })
        .slice(0, 3);

      const opportunities = opportunitiesArray
        .map((opportunity) => ({
          id: String(opportunity.id ?? ""),
          title: getValue(opportunity.title as string | null),
          category: getValue(opportunity.category as string | null),
          deadline:
            getValue(opportunity.deadline as string | null) ??
            getValue(opportunity.application_deadline as string | null) ??
            getValue(opportunity.closing_date as string | null),
          location: getValue(opportunity.location as string | null),
          description: getValue(opportunity.description as string | null),
        }))
        .filter((opportunity) => opportunity.id)
        .sort((left, right) => {
          const leftDate = parseDate(left.deadline);
          const rightDate = parseDate(right.deadline);
          if (!leftDate && !rightDate) return 0;
          if (!leftDate) return 1;
          if (!rightDate) return -1;
          return leftDate.getTime() - rightDate.getTime();
        })
        .slice(0, 3);

      const postsWithAuthors = posts.map((post) => ({
        ...post,
        author_name: null,
        author_avatar: null,
        likes_count: null,
        comments_count: null,
      }));

      const notifications = notificationsArray
        .map((notification) => ({
          id: String(notification.id ?? ""),
          title: getValue(notification.title as string | null),
          message: getValue(notification.message as string | null),
          created_at: getValue(notification.created_at as string | null),
          read: Boolean(notification.read ?? notification.is_read),
        }))
        .filter((notification) => notification.id);

      const coursesCompleted = academyEntries.filter((entry) => {
        const completed = entry.completed;
        if (typeof completed === "boolean") return completed;
        const progress = Number(entry.progress ?? 0);
        return progress >= 0.99;
      }).length;

      const activityCount = activityArray.filter((entry) => {
        const activityType = String(entry.activity_type ?? "").toLowerCase();
        return activityType === "post" || activityType === "comment";
      }).length;

      const courseEntry = academyEntries.find(
        (entry) =>
          entry.id ||
          entry.course_id ||
          entry.course ||
          entry.progress ||
          entry.completed,
      ) as Record<string, unknown> | undefined;
      const course = courseEntry
        ? {
            course_id:
              getValue(courseEntry.course_id as string | null) ??
              getValue(courseEntry.id as string | null),
            progress:
              typeof courseEntry.progress === "number"
                ? courseEntry.progress
                : typeof courseEntry.completed === "boolean"
                  ? courseEntry.completed
                    ? 1
                    : 0
                  : null,
            courses: null,
          }
        : null;

      const recentActivity: RecentActivity[] = [
        ...activityArray.map((entry) => {
          const activityType = String(entry.activity_type ?? "").toLowerCase();
          const actionText = getValue(entry.action as string | null);
          if (activityType === "post") {
            return {
              title: "Created a post",
              description:
                actionText || "You shared an update in the community",
              created_at: getValue(entry.created_at as string | null),
              kind: "post",
            };
          }
          if (activityType === "comment") {
            return {
              title: "Left a comment",
              description: actionText || "You contributed to the conversation",
              created_at: getValue(entry.created_at as string | null),
              kind: "comment",
            };
          }
          if (activityType === "circle") {
            return {
              title: "Joined a circle",
              description:
                actionText || "You became part of a community circle",
              created_at: getValue(entry.created_at as string | null),
              kind: "circle",
            };
          }
          if (activityType === "event") {
            return {
              title: "Registered for an event",
              description:
                actionText || "You saved a seat for an upcoming event",
              created_at: getValue(entry.created_at as string | null),
              kind: "event",
            };
          }
          return {
            title: "Activity update",
            description: actionText || "Your progress is being tracked",
            created_at: getValue(entry.created_at as string | null),
            kind: activityType || "activity",
          };
        }),
        ...(postsWithAuthors.length > 0
          ? [
              {
                title: "Created a post",
                description:
                  postsWithAuthors[0].content?.slice(0, 80) ||
                  "You shared an update in the community",
                created_at: postsWithAuthors[0].created_at,
                kind: "post",
              },
            ]
          : []),
        ...(circles.length > 0
          ? [
              {
                title: "Joined a Sister Circle",
                description: `${circles[0].name ?? "A circle"} is now part of your community`,
                created_at: circles[0].created_at,
                kind: "circle",
              },
            ]
          : []),
        ...(upcomingEvents.length > 0
          ? [
              {
                title: "Registered for an event",
                description:
                  upcomingEvents[0].title ??
                  "You saved a spot for an upcoming event",
                created_at: new Date().toISOString(),
                kind: "event",
              },
            ]
          : []),
        ...(coursesCompleted > 0
          ? [
              {
                title: "Completed an Academy lesson",
                description: "Your learning streak is moving forward",
                created_at: new Date().toISOString(),
                kind: "academy",
              },
            ]
          : []),
      ]
        .sort(
          (left, right) =>
            new Date(right.created_at ?? 0).getTime() -
            new Date(left.created_at ?? 0).getTime(),
        )
        .slice(0, 5);

      const analyticsCounts = analyticsEvents.reduce(
        (counts, event) => {
          const type = event.event_type || "unknown";
          counts[type] = (counts[type] ?? 0) + 1;
          return counts;
        },
        {} as Record<string, number>,
      );

      const analyticsSeries = Array.from({ length: 7 }, (_, index) => {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() - (6 - index));
        const dateString = date.toISOString().split("T")[0];
        const count = analyticsEvents.filter((event) => {
          const created = parseDate(event.created_at);
          return created
            ? created.toISOString().split("T")[0] === dateString
            : false;
        }).length;
        return { date: dateString, count };
      });

      const nextSteps = [
        ...(profileCompletion < 100 ? ["Complete your profile"] : []),
        ...(circles.length === 0 ? ["Join a Sister Circle"] : []),
        ...(upcomingEvents.length === 0 ? ["Register for an event"] : []),
        ...(coursesCompleted === 0 ? ["Continue learning in Academy"] : []),
        ...(circles.length === 0 ? ["Join BIG Club"] : []),
      ];

      const goals = [
        {
          title: "Create one post",
          done: activityCount >= 1 || posts.length >= 1,
        },
        { title: "Comment three times", done: comments.length >= 3 },
        { title: "Attend one event", done: registeredEventIds.length >= 1 },
        { title: "Complete one lesson", done: coursesCompleted >= 1 },
        { title: "Join one Sister Circle", done: circles.length >= 1 },
      ];

      const authFirstName = getValue(user?.first_name as string | null) ?? null;
      const authLastName = getValue(user?.last_name as string | null) ?? null;
      const fallbackDisplayName =
        getValue(
          (user?.user_metadata as Record<string, unknown> | undefined)
            ?.full_name as string | null,
        ) ??
        getValue(
          (user?.user_metadata as Record<string, unknown> | undefined)
            ?.first_name as string | null,
        ) ??
        (typeof user?.email === "string" ? user.email.split("@")[0] : null);

      const normalizedProfile: Profile = {
        id: userId,
        first_name:
          getValue(profile?.first_name as string | null) ??
          authFirstName ??
          (fallbackDisplayName ? fallbackDisplayName.split(" ")[0] : null),
        last_name:
          getValue(profile?.last_name as string | null) ?? authLastName ?? null,
        full_name:
          getValue(profile?.full_name as string | null) ??
          fallbackDisplayName ??
          [
            getValue(profile?.first_name as string | null) ?? authFirstName,
            getValue(profile?.last_name as string | null) ?? authLastName,
          ]
            .filter(Boolean)
            .join(" "),
        avatar_url: getValue(profile?.avatar_url as string | null),
        bio: getValue(profile?.bio as string | null),
        city: getValue(profile?.city as string | null),
        phone: getValue(profile?.phone as string | null),
        skills: getValue(profile?.skills as string[] | string | null),
        interests: getValue(profile?.interests as string[] | string | null),
        member_level:
          getValue(profile?.member_level as string | null) ??
          (typeof profile?.level === "number"
            ? `Level ${profile.level}`
            : null),
        level: typeof profile?.level === "number" ? profile.level : null,
        created_at: getValue(profile?.created_at as string | null),
      };

      setData({
        profile: normalizedProfile,
        circles,
        notifications,
        upcomingEvents,
        lastUpdated: new Date().toISOString(),
        upcomingEvent: upcomingEvents[0] ?? null,
        opportunities,
        communityPosts: postsWithAuthors,
        recentActivity,
        stats: {
          postsCreated: Math.max(posts.length, activityCount),
          commentsMade: comments.length,
          circlesJoined: circles.length,
          eventsRegistered: registeredEventIds.length,
          coursesCompleted,
          profileCompletion,
        },
        analyticsCounts,
        analyticsSeries,
        nextSteps,
        goals,
        club: circles[0] ?? null,
        registeredEventIds,
        course,
      });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load dashboard");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, userId]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadDashboard();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadDashboard]);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    const supabase = createClient();
    const channel = supabase.channel("dashboard-live-updates");

    const tables = [
      { table: "notifications", filter: `user_id=eq.${userId}` },
      { table: "events" },
      { table: "event_registrations", filter: `user_id=eq.${userId}` },
      { table: "circle_members", filter: `user_id=eq.${userId}` },
      { table: "user_profiles", filter: `user_id=eq.${userId}` },
      { table: "profiles", filter: `id=eq.${userId}` },
      { table: "user_activity", filter: `user_id=eq.${userId}` },
    ];

    tables.forEach(({ table, filter }) => {
      channel.on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table,
          ...(filter ? { filter } : {}),
        },
        () => {
          void loadDashboard();
        },
      );
    });

    channel.subscribe((status: string) => {
      if (status === "SUBSCRIBED") {
        void loadDashboard();
      }
    });

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [isAuthenticated, loadDashboard, user?.id]);

  return {
    data,
    loading,
    error,
    refetch: loadDashboard,
  };
}
