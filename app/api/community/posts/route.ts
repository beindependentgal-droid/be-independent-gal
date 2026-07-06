import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/supabase-server";
import { getFeed, createPost } from "@/lib/community-db";
import { addCommunityPost, getCommunityFeed } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("query") || undefined;
  const filter = url.searchParams.get("filter") || undefined;
  const page = Number(url.searchParams.get("page") || "1");
  const pageSize = Number(url.searchParams.get("pageSize") || "12");

  const userId = await getCurrentUserId();

  try {
    const result = await getFeed({ query, filter, userId, page, pageSize });
    return NextResponse.json({
      posts: result.posts ?? [],
      count: result.count ?? 0,
    });
  } catch (error: unknown) {
    console.error("Community posts fetch failed", error);
    const fallbackFeed = await getCommunityFeed();
    return NextResponse.json(
      { posts: fallbackFeed ?? [], count: fallbackFeed?.length ?? 0 },
      { status: 200 },
    );
  }
}

export async function POST(request: Request) {
  const userId = await getCurrentUserId();
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const content = typeof body.content === "string" ? body.content.trim() : "";
  if (!content) {
    return NextResponse.json({ error: "Content cannot be empty." }, { status: 400 });
  }

  try {
    if (userId) {
      const post = await createPost(userId, body);
      return NextResponse.json(post, { status: 201 });
    }

    const post = await addCommunityPost(content);
    return NextResponse.json(post, { status: 201 });
  } catch (error: unknown) {
    try {
      const fallbackPost = await addCommunityPost(content);
      return NextResponse.json(fallbackPost, { status: 201 });
    } catch {
      const message =
        error instanceof Error ? error.message : "Failed to create post";
      return NextResponse.json({ error: message }, { status: 400 });
    }
  }
}
