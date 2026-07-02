import { NextRequest } from "next/server";
import {
  requireAuth,
  successResponse,
  errorResponse,
  supabase,
  getPaginationParams,
} from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (authResult instanceof Response) return authResult;

  const { userId } = authResult;
  const { pageSize, offset } = getPaginationParams(request);

  try {
    const { data, error, count } = await supabase
      .from("user_profiles")
      .select(
        "id, first_name, last_name, avatar_url, profession, bio, total_points, location",
        { count: "exact" },
      )
      .neq("id", userId)
      .order("total_points", { ascending: false })
      .range(offset, offset + pageSize - 1);

    if (error) throw error;

    return successResponse({
      members: data || [],
      total: count,
      page: Math.floor(offset / pageSize) + 1,
      pageSize,
    });
  } catch (error: any) {
    return errorResponse(
      error.message || "Failed to load suggested members",
      500,
    );
  }
}
