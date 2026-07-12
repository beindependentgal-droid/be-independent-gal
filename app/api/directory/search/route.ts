import { NextRequest } from "next/server";
import {
  requireAuth,
  successResponse,
  errorResponse,
  getPaginationParams,
} from "@/lib/api-utils";
import { fetchDiscoverableProfiles } from "@/lib/profile-discovery";

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
    const { members, total } = await fetchDiscoverableProfiles({
      query,
      skill: skill || undefined,
      circle: circle || undefined,
      isMentor,
      pageSize,
      offset,
    });

    return successResponse({
      members,
      total,
      page: Math.floor(offset / pageSize) + 1,
      pageSize,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return errorResponse(message, 500);
  }
}
