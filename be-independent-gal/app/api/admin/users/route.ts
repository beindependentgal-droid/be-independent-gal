import { NextRequest } from "next/server";
import {
  requireAuth,
  successResponse,
  errorResponse,
  supabase,
  isAdmin,
  getPaginationParams,
  logAuditAction,
} from "@/lib/api-utils";

// GET /api/admin/users - List all users (admin only)
export async function GET(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (authResult instanceof Response) return authResult;

  const { userId } = authResult;
  const adminCheck = await isAdmin(userId);
  if (!adminCheck) {
    return errorResponse("Unauthorized", 403);
  }

  const url = new URL(request.url);
  const search = url.searchParams.get("search");
  const { pageSize, offset } = getPaginationParams(request);

  try {
    let query = supabase.from("user_profiles").select(
      `
        *,
        user_activity:user_activity(count)
      `,
      { count: "exact" },
    );

    if (search) {
      query = query.or(
        `first_name.ilike.%${search}%,last_name.ilike.%${search}%`,
      );
    }

    const {
      data: users,
      error,
      count,
    } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + pageSize - 1);

    if (error) throw error;

    return successResponse({
      users,
      total: count,
      page: Math.floor(offset / pageSize) + 1,
      pageSize,
    });
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
