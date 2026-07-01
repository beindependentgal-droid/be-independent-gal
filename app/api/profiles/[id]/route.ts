import { NextRequest } from "next/server";
import { successResponse, errorResponse, supabase } from "@/lib/api-utils";

// GET /api/profiles/[id] - Get user profile by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const { data, error } = await supabase
      .from("user_profiles")
      .select(
        "id, first_name, last_name, bio, avatar_url, skills, interests, mentoring_areas, location, available_to_mentor, total_points, level, created_at, updated_at",
      )
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!data) return errorResponse("Profile not found", 404);

    // Get badges for this user
    const { data: badges } = await supabase
      .from("user_badges")
      .select("badge_id, badges(name, icon_url, color)")
      .eq("user_id", id);

    return successResponse({
      ...data,
      badges: badges || [],
    });
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
