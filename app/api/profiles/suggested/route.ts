import { NextRequest } from "next/server";
import {
  getUserIdFromRequest,
  successResponse,
  errorResponse,
  supabase,
  getPaginationParams,
} from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  const userId = await getUserIdFromRequest(request);
  const { pageSize, offset } = getPaginationParams(request);

  try {
    let query = supabase
      .from("user_profiles")
      .select(
        "id, first_name, last_name, avatar_url, profession, bio, total_points, location",
        { count: "exact" },
      )
      .order("total_points", { ascending: false })
      .range(offset, offset + pageSize - 1);

    if (userId) {
      query = query.neq("id", userId);
    }

    const { data, error, count } = await query;

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
