import { NextRequest } from "next/server";
import * as fs from "fs/promises";
import * as path from "path";
import {
  supabase,
  successResponse,
  errorResponse,
  getPaginationParams,
  requireAuth,
  isAdmin,
} from "@/lib/api-utils";

async function readOpportunitiesFallback() {
  try {
    const filePath = path.join(process.cwd(), "data", "opportunities.json");
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as Array<Record<string, unknown>>;
  } catch {
    return [];
  }
}

// GET /api/opportunities - list opportunities with basic filtering
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const search = url.searchParams.get("search");
  const category = url.searchParams.get("category");
  const country = url.searchParams.get("country");
  const remote = url.searchParams.get("remote");
  const featured = url.searchParams.get("featured");
  const status = url.searchParams.get("status");
  const { pageSize, offset } = getPaginationParams(request);

  try {
    let opportunities: Array<Record<string, unknown>> = [];
    let total = 0;

    try {
      let query = supabase
        .from("opportunities")
        .select(
          "id, title, description, cover_image, category, featured, created_at, deadline, remote, status, country",
          { count: "exact" },
        );

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

      if (status && status !== "Any") {
        query = query.eq("status", status);
      }

      const { data, error, count } = await query
        .order("featured", { ascending: false })
        .order("featured_order", { ascending: true, nulls: "last" })
        .order("published_at", { ascending: false })
        .order("created_at", { ascending: false })
        .range(offset, offset + pageSize - 1);

      if (!error) {
        opportunities = (data as Array<Record<string, unknown>>) ?? [];
        total = count ?? opportunities.length;
      }
    } catch {
      opportunities = [];
      total = 0;
    }

    if (!opportunities.length) {
      const fallback = await readOpportunitiesFallback();
      let filtered = fallback;

      if (search) {
        filtered = filtered.filter((item) =>
          String(item.title ?? "")
            .toLowerCase()
            .includes(search.toLowerCase()),
        );
      }

      if (category) {
        filtered = filtered.filter((item) => item.category === category);
      }

      if (country) {
        filtered = filtered.filter((item) => item.country === country);
      }

      if (remote && remote !== "Any") {
        if (remote === "Remote") {
          filtered = filtered.filter((item) => item.remote === true);
        }
        if (remote === "On-site") {
          filtered = filtered.filter((item) => item.remote === false);
        }
      }

      if (featured) {
        filtered = filtered.filter(
          (item) => Boolean(item.featured) === (featured === "true"),
        );
      }

      if (status && status !== "Any") {
        filtered = filtered.filter((item) => item.status === status);
      }

      filtered = filtered.sort((a, b) => {
        const featuredDiff =
          Number(Boolean(b.featured)) - Number(Boolean(a.featured));
        if (featuredDiff !== 0) return featuredDiff;
        return (
          new Date(String(b.published_at ?? b.created_at ?? 0)).getTime() -
          new Date(String(a.published_at ?? a.created_at ?? 0)).getTime()
        );
      });

      opportunities = filtered.slice(offset, offset + pageSize);
      total = filtered.length;
    }

    return successResponse({
      opportunities,
      total,
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
