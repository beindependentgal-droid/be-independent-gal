import { NextResponse } from "next/server";
import * as fs from "fs/promises";
import * as path from "path";
import { addCirclePost, getCircleDashboardData, type Post } from "@/lib/db";
import supabase from "@/lib/supabase";

async function readDashboardFallback(circleId: string) {
  try {
    const filePath = path.join(process.cwd(), "data", "circle-dashboard.json");
    const raw = await fs.readFile(filePath, "utf-8");
    const json = JSON.parse(raw) as {
      circleDashboard?: Record<string, unknown>;
    };
    return json.circleDashboard?.[circleId] ?? null;
  } catch {
    return null;
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  // Prefer Supabase when available to surface richer errors
  if (supabase) {
    try {
      const res = await supabase
        .from("circle_dashboard")
        .select("data")
        .eq("id", id)
        .single();
      if (!res.error && res.data) {
        return NextResponse.json((res.data as any).data);
      }
    } catch {
      // fall through to local fallback
    }
  }

  const dashboardData = await getCircleDashboardData(id);

  if (!dashboardData) {
    const fallback = await readDashboardFallback(id);
    if (fallback) {
      return NextResponse.json(fallback);
    }
  }

  if (!dashboardData) {
    return NextResponse.json(
      { error: "Circle dashboard data not found." },
      { status: 404 },
    );
  }

  return NextResponse.json(dashboardData);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json().catch(() => null);

  if (!body || typeof body !== "object" || typeof body.content !== "string") {
    return NextResponse.json(
      { error: "Invalid request body. Provide a content string." },
      { status: 400 },
    );
  }

  // If Supabase is available, execute there and return any errors
  if (supabase) {
    try {
      // fetch current row
      const row = await supabase
        .from("circle_dashboard")
        .select("data")
        .eq("id", id)
        .single();
      if (!row.error && row.data) {
        const current = (row.data as any).data as { feed: Post[] };

        const newPost: Post = {
          id:
            typeof crypto !== "undefined" &&
            typeof crypto.randomUUID === "function"
              ? crypto.randomUUID()
              : `${Date.now()}`,
          author: {
            name: "You",
            avatar: "/images/member-1.png",
            rank: "Community Champion",
          },
          content: body.content.trim(),
          timestamp: "Just now",
          likes: 0,
          comments: 0,
          liked: false,
        };

        const updated = {
          ...current,
          feed: [newPost, ...(current?.feed ?? [])],
        };

        const upd = await supabase
          .from("circle_dashboard")
          .update({ data: updated })
          .eq("id", id);
        if (!upd.error) {
          return NextResponse.json(newPost, { status: 201 });
        }
      }
    } catch {
      // fall through to local fallback
    }
  }

  const post = await addCirclePost(id, body.content.trim());

  if (!post) {
    return NextResponse.json(
      { error: "Unable to add post. Circle not found." },
      { status: 404 },
    );
  }

  return NextResponse.json(post, { status: 201 });
}
