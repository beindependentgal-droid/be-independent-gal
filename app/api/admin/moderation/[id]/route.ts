import { NextRequest, NextResponse } from "next/server";
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
    return errorResponse(
      "Unauthorized access to admin moderation resource.",
      403,
    );
  }

  try {
    const body = await request.json();
    const action = body?.action;

    if (!action || !["approve", "dismiss", "review"].includes(action)) {
      return errorResponse("A valid moderation action is required.", 400);
    }

    const nextStatus =
      action === "approve"
        ? "resolved"
        : action === "dismiss"
          ? "dismissed"
          : "reviewed";
    const actionTaken =
      action === "approve"
        ? "Approved by admin"
        : action === "dismiss"
          ? "Dismissed by admin"
          : "Reviewed by admin";

    const { data, error } = await supabase
      .from("moderation_flags")
      .update({
        status: nextStatus,
        action_taken: actionTaken,
        reviewed_by_id: userId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    await logAuditAction(
      userId,
      `Moderation flag ${action}`,
      "moderation_flag",
      id,
      { action, status: nextStatus },
    );

    return successResponse({ flag: data });
  } catch (error: any) {
    console.error("API error in PATCH /api/admin/moderation/[id]:", error);
    return errorResponse(
      error.message || "Unable to update moderation flag",
      500,
    );
  }
}
