import { NextRequest } from "next/server";
import {
  supabase,
  successResponse,
  errorResponse,
  requireAuth,
  isAdmin,
} from "@/lib/api-utils";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("opportunity_categories")
      .select("*")
      .order("name");
    if (error) throw error;
    return successResponse(data);
  } catch (err: any) {
    return errorResponse(err.message || "Failed to fetch categories", 500);
  }
}

export async function POST(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (authResult instanceof Response) return authResult;
  const { userId } = authResult;

  const admin = await isAdmin(userId);
  if (!admin) return errorResponse("Forbidden", 403);

  try {
    const body = await request.json();
    const { data, error } = await supabase
      .from("opportunity_categories")
      .insert([
        {
          name: body.name,
          slug: body.slug || body.name.toLowerCase().replace(/\s+/g, "-"),
        },
      ])
      .select()
      .single();
    if (error) throw error;
    return successResponse(data, 201);
  } catch (err: any) {
    return errorResponse(err.message || "Failed to create category", 500);
  }
}
