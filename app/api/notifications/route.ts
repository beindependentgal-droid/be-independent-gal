import { NextRequest } from "next/server";
import {
  requireAuth,
  successResponse,
  errorResponse,
  supabase,
  getPaginationParams,
} from "@/lib/api-utils";

const isRecoverableNotificationError = (message: string) =>
  /permission denied|relation .* does not exist|table .* does not exist|does not exist|not found/i.test(
    message,
  );

// GET /api/notifications - Get user notifications
export async function GET(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (authResult instanceof Response) {
    const { pageSize } = getPaginationParams(request);
    return successResponse({
      notifications: [],
      total: 0,
      unread: 0,
      page: 1,
      pageSize,
    });
  }

  const { userId } = authResult;
  const url = new URL(request.url);
  const unreadOnly = url.searchParams.get("unread") === "true";
  const { pageSize, offset } = getPaginationParams(request);

  try {
    let query = supabase
      .from("notifications")
      .select("*", { count: "exact" })
      .eq("user_id", userId);

    if (unreadOnly) {
      query = query.is("read_at", null);
    }

    const {
      data: notifications,
      error,
      count,
    } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + pageSize - 1);

    if (error) {
      throw error;
    }

    return successResponse({
      notifications: notifications ?? [],
      total: count ?? 0,
      unread: count ?? 0,
      page: Math.floor(offset / pageSize) + 1,
      pageSize,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    if (isRecoverableNotificationError(message)) {
      return successResponse({
        notifications: [],
        total: 0,
        unread: 0,
        page: Math.floor(offset / pageSize) + 1,
        pageSize,
      });
    }
    return errorResponse(message || "Unable to load notifications", 500);
  }
}
