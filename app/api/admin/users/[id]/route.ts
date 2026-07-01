import { NextRequest } from "next/server";
import {
  errorResponse,
  isAdmin,
  logAuditAction,
  requireAuth,
  successResponse,
  supabase,
} from "@/lib/api-utils";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const authResult = await requireAuth(request);
  if (authResult instanceof Response) {
    return authResult;
  }

  const { userId } = authResult;
  const adminCheck = await isAdmin(userId);
  if (!adminCheck) {
    return errorResponse("Unauthorized access to admin user resource.", 403);
  }

  try {
    const body = await request.json();
    const memberLevel = body?.member_level;
    const role = body?.role;

    if (!memberLevel && !role) {
      return errorResponse("A member level or role update is required.", 400);
    }

    const updates: Record<string, unknown> = {};
    if (memberLevel) {
      updates.member_level = memberLevel;
    }
    if (role) {
      updates.role = role;
    }

    const { data, error } = await supabase
      .from("user_profiles")
      .update(updates)
      .eq("id", id)
      .select("id, first_name, last_name, email, member_level, created_at")
      .single();

    if (error) {
      throw error;
    }

    await logAuditAction(
      userId,
      "Updated member account",
      "admin_user",
      id,
      updates,
    );

    return successResponse({ user: data });
  } catch (error: any) {
    console.error("API error in PATCH /api/admin/users/[id]:", error);
    return errorResponse(error.message || "Unable to update member", 500);
  }
}
