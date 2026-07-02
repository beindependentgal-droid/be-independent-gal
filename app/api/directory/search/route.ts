import { NextRequest } from "next/server";
import {
  requireAuth,
  successResponse,
  errorResponse,
  supabase,
  getPaginationParams,
} from "@/lib/api-utils";

// GET /api/directory/search - Search members by filters
export async function GET(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (authResult instanceof Response) return authResult;

  const { pageSize, offset } = getPaginationParams(request);
  const url = new URL(request.url);
  const query = url.searchParams.get("q")?.trim() || "";
  const skill = url.searchParams.get("skill");
  const circle = url.searchParams.get("circle");
  const isMentor = url.searchParams.get("mentor") === "true";

  try {
    let dbQuery = supabase
      .from("user_directory")
      .select(
        "id, first_name, last_name, email, avatar_url, headline, skills",
        { count: "exact" },
      );

    // Full-text search if query provided
    if (query) {
      dbQuery = dbQuery.textSearch("search_vector", query);
    }

    // Filter by skill
    if (skill) {
      dbQuery = dbQuery.contains("skills", [skill]);
    }

    // Filter by circle
    if (circle) {
      dbQuery = dbQuery.contains("circles", [circle]);
    }

    // Filter by mentor status
    if (isMentor) {
      dbQuery = dbQuery.eq("is_mentor", true);
    }

    const {
      data: members,
      error,
      count,
    } = await dbQuery
      .order("points", { ascending: false })
      .range(offset, offset + pageSize - 1);

    if (error) throw error;

    return successResponse({
      members,
      total: count,
      page: Math.floor(offset / pageSize) + 1,
      pageSize,
    });
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
