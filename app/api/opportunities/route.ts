import { NextRequest } from "next/server";
import {
  supabase,
  successResponse,
  errorResponse,
  getPaginationParams,
  requireAuth,
  isAdmin,
} from "@/lib/api-utils";

// GET /api/opportunities - list opportunities with basic filtering
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const search = url.searchParams.get("search");
  const category = url.searchParams.get("category");
  const country = url.searchParams.get("country");
  const remote = url.searchParams.get("remote");
  const featured = url.searchParams.get("featured");
  const { pageSize, offset } = getPaginationParams(request);

  try {
    let query = supabase.from("opportunities").select("*", { count: "exact" });

    if (search) {
      query = query.ilike("title", `%${search}%`);
    }

    if (category) {
      query = query.eq("category", category);
    }

    if (country) {
      query = query.eq("country", country);
    }

    if (remote && remote !== "Any") {
      if (remote === "Remote") query = query.eq("remote", true);
      if (remote === "On-site") query = query.eq("remote", false);
    }

    if (featured) {
      query = query.eq("featured", featured === "true");
    }

    const {
      data: opportunities,
      error,
      count,
    } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + pageSize - 1);

    if (error) throw error;

    return successResponse({
      opportunities,
      total: count,
      page: Math.floor(offset / pageSize) + 1,
      pageSize,
    });
  } catch (err: any) {
    return errorResponse(err.message || "Failed to fetch opportunities", 500);
  }
}

// POST /api/opportunities - create (requires admin/auth handled in admin routes)
export async function POST(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (authResult instanceof Response) return authResult;
  const { userId } = authResult;

  const admin = await isAdmin(userId);
  if (!admin) return errorResponse("Forbidden", 403);

  try {
    const body = await request.json();
    const { data, error } = await supabase
      .from("opportunities")
      .insert([body])
      .select()
      .single();
    if (error) throw error;
    return successResponse(data, 201);
  } catch (err: any) {
    return errorResponse(err.message || "Failed to create opportunity", 500);
  }
}
