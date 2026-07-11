import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "./supabase-server";

// Initialize Supabase client lazily to avoid build-time errors
let supabaseInstance: ReturnType<typeof createClient> | null = null;

export function getSupabase(): ReturnType<typeof createClient> {
  if (!supabaseInstance) {
    const supabaseUrl =
      process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_SERVICE_ROLE ||
      process.env.SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase environment variables");
    }

    supabaseInstance = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });
  }

  return supabaseInstance;
}

// Export as a getter for backward compatibility
export const supabase = new Proxy({} as any, {
  get: (_, prop) => {
    return (getSupabase() as any)[prop];
  },
});

// Extract user ID from request
export async function getUserIdFromRequest(
  request: NextRequest,
): Promise<string | null> {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    const { data, error } = await supabase.auth.getUser(token);

    if (!error && data?.user) {
      return data.user.id;
    }
  }

  try {
    const serverSupabase = await createServerSupabase();
    const { data, error } = await serverSupabase.auth.getSession();

    if (!error && data?.session?.user) {
      return data.session.user.id;
    }
  } catch (error) {
    console.warn("Unable to resolve current user from session cookies:", error);
  }

  return null;
}

// API Response helpers
export function successResponse(data: any, status: number = 200) {
  return NextResponse.json(data, { status });
}

export function errorResponse(message: string, status: number = 400) {
  return NextResponse.json({ error: message }, { status });
}

// Validate user ID from request
export async function requireAuth(
  request: NextRequest,
): Promise<{ userId: string } | NextResponse> {
  const userId = await getUserIdFromRequest(request);
  if (!userId) {
    return errorResponse("Unauthorized", 401);
  }
  return { userId };
}

// Check if user is admin
export async function isAdmin(userId: string): Promise<boolean> {
  const { data: roleData, error: roleError } = await supabase
    .from("admin_roles")
    .select("role")
    .eq("user_id", userId)
    .maybeSingle();

  if (!roleError && roleData?.role) {
    const role = roleData.role.toLowerCase();
    if (role === "admin" || role === "super_admin" || role === "superadmin") {
      return true;
    }
  }

  try {
    const { data, error } = await supabase.auth.admin.getUserById(userId);
    const email = data?.user?.email?.toLowerCase();

    if (!error && email === "athkhassan@gmail.com") {
      return true;
    }
  } catch (error) {
    console.warn("Unable to resolve admin email for user:", error);
  }

  return false;
}

// Create activity record for gamification
export async function recordActivity(
  userId: string,
  activityType: string,
  pointsEarned: number = 0,
  circleId?: string,
  metadata?: Record<string, any>,
) {
  const { error } = await supabase.from("user_activity").insert({
    user_id: userId,
    activity_type: activityType,
    points_earned: pointsEarned,
    circle_id: circleId,
    metadata: metadata || {},
  });

  if (error) {
    console.error("[v0] Failed to record activity:", error);
  }

  // Update user points in profiles
  if (pointsEarned > 0) {
    await supabase
      .from("profiles")
      .update({ points: supabase.raw(`points + ${pointsEarned}`) })
      .eq("id", userId);
  }
}

// Get user profile
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("[v0] Failed to get user profile:", error);
    return null;
  }

  return data;
}

// Paginate results
export function getPaginationParams(request: NextRequest): {
  page: number;
  pageSize: number;
  offset: number;
} {
  const url = new URL(request.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
  const pageSize = Math.min(
    100,
    parseInt(
      url.searchParams.get("limit") || url.searchParams.get("pageSize") || "20",
    ),
  );
  const offset = (page - 1) * pageSize;

  return { page, pageSize, offset };
}

// Send notification
export async function sendNotification(
  userId: string,
  type: string,
  title: string,
  message?: string,
  relatedUserId?: string,
  actionUrl?: string,
) {
  const { error } = await supabase.from("notifications").insert({
    user_id: userId,
    type,
    title,
    message,
    related_user_id: relatedUserId,
    action_url: actionUrl,
  });

  if (error) {
    console.error("[v0] Failed to send notification:", error);
  }
}

// Log audit action
export async function logAuditAction(
  adminId: string,
  action: string,
  resourceType: string,
  resourceId?: string,
  changes?: Record<string, any>,
) {
  const { error } = await supabase.from("audit_logs").insert({
    admin_id: adminId,
    action,
    resource_type: resourceType,
    resource_id: resourceId,
    changes: changes || {},
  });

  if (error) {
    console.error("[v0] Failed to log audit action:", error);
  }
}
