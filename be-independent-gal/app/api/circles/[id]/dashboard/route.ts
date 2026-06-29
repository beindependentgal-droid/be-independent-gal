import { NextResponse } from "next/server";
import { addCirclePost, getCircleDashboardData, type Post } from "@/lib/db";
import supabase from "@/lib/supabase";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  // Prefer Supabase when available to surface richer errors
  if (supabase) {
    const res = await supabase
      .from("circle_dashboard")
      .select("data")
      .eq("id", id)
      .single();
    if (res.error) {
      return NextResponse.json(
        { error: res.error.message, details: res.error },
        { status: res.status ?? 500 },
      );
    }

    if (!res.data) {
      return NextResponse.json(
        { error: "Circle dashboard data not found." },
        { status: 404 },
      );
    }

    return NextResponse.json((res.data as any).data);
  }

  const dashboardData = await getCircleDashboardData(id);

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
    // fetch current row
    const row = await supabase
      .from("circle_dashboard")
      .select("data")
      .eq("id", id)
      .single();
    if (row.error) {
      return NextResponse.json(
        { error: row.error.message, details: row.error },
        { status: row.status ?? 500 },
      );
    }

    if (!row.data) {
      return NextResponse.json({ error: "Circle not found." }, { status: 404 });
    }

    const current = (row.data as any).data as { feed: Post[] };

    const newPost: Post = {
      id:
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
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

    const updated = { ...current, feed: [newPost, ...(current?.feed ?? [])] };

    const upd = await supabase
      .from("circle_dashboard")
      .update({ data: updated })
      .eq("id", id);
    if (upd.error) {
      return NextResponse.json(
        { error: upd.error.message, details: upd.error },
        { status: upd.status ?? 500 },
      );
    }

    return NextResponse.json(newPost, { status: 201 });
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
