import { NextResponse } from "next/server";
import { toggleBookmark } from "@/lib/community-db";
import { getCurrentUserId } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body.post_id !== "string") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    const bookmarked = await toggleBookmark(userId, body.post_id);
    return NextResponse.json({ bookmarked });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to toggle bookmark";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
