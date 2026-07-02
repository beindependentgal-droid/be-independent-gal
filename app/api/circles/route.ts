import { NextRequest } from "next/server";
import {
  requireAuth,
  successResponse,
  errorResponse,
  supabase,
} from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (authResult instanceof Response) return authResult;

  const { userId } = authResult;

  try {
    const { data, error } = await supabase
      .from("circle_members")
      .select("circle_id(id, name, description, icon)")
      .eq("user_id", userId)
      .order("joined_at", { ascending: false });

    if (error) throw error;

    const circles = (data || [])
      .map((membership: any) => ({
        id: membership.circle_id?.id,
        name: membership.circle_id?.name,
        description: membership.circle_id?.description,
        icon: membership.circle_id?.icon,
        next_meeting: null,
      }))
      .filter((circle: any) => circle.id);

    return successResponse({ circles });
  } catch (error: any) {
    return errorResponse(error.message || "Failed to load circles", 500);
  }
}
