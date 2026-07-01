import { NextRequest } from "next/server";
import {
  errorResponse,
  getSupabase,
  requireAuth,
  successResponse,
  isAdmin,
} from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (authResult instanceof Response) {
    return authResult;
  }

  const adminCheck = await isAdmin(authResult.userId);
  if (!adminCheck) {
    return errorResponse("Unauthorized access to admin resource.", 403);
  }

  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("form_submissions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      throw error;
    }

    return successResponse({ submissions: data ?? [] });
  } catch (error) {
    console.warn(
      "Unable to fetch form submissions; returning an empty list.",
      error,
    );
    return successResponse({ submissions: [] });
  }
}
