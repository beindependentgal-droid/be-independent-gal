import { NextRequest } from "next/server";
import {
  requireAuth,
  successResponse,
  errorResponse,
  supabase,
  recordActivity,
} from "@/lib/api-utils";

// GET /api/profiles - Get user profile
export async function GET(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (authResult instanceof Response) return authResult;

  const { userId } = authResult;

  try {
    const { data, error } = await supabase
      .from("user_profiles")
      .select(
        "id, first_name, last_name, email, avatar_url, bio, skills, interests, member_level, created_at",
      )
      .eq("id", userId)
      .single();

    if (error) throw error;
    if (!data) return errorResponse("Profile not found", 404);

    return successResponse(data);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}

// PUT /api/profiles - Update user profile
export async function PUT(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (authResult instanceof Response) return authResult;

  const { userId } = authResult;
  const body = await request.json();

  try {
    // Update user profile
    const updateData = {
      first_name: body.first_name,
      last_name: body.last_name,
      bio: body.bio,
      avatar_url: body.avatar_url,
      skills: body.skills,
      interests: body.interests,
      mentoring_areas: body.mentoring_areas,
      location: body.city,
    };

    const { error: profileError } = await supabase
      .from("user_profiles")
      .update(updateData)
      .eq("id", userId);

    if (profileError) throw profileError;

    // Record activity
    await recordActivity(userId, "profile_update", 0);

    // Fetch and return updated profile
    const { data } = await supabase
      .from("user_profiles")
      .select(
        "id, first_name, last_name, email, avatar_url, bio, skills, interests, member_level, created_at",
      )
      .eq("id", userId)
      .single();

    return successResponse(data);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
