import { NextResponse } from "next/server";
import { reportContent } from "@/lib/community-db";
import { getCurrentUserId } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    const report = await reportContent(userId, body);
    return NextResponse.json(report, { status: 201 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to report content";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
