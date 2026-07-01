import { NextResponse } from "next/server";
import { addCommunityPost, getCommunityFeed } from "@/lib/db";

export async function GET() {
  const feed = await getCommunityFeed();
  return NextResponse.json(feed);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body !== "object" || typeof body.content !== "string") {
    return NextResponse.json(
      { error: "Invalid request body. Provide a content string." },
      { status: 400 },
    );
  }

  const content = body.content.trim();
  if (!content) {
    return NextResponse.json(
      { error: "Content cannot be empty." },
      { status: 400 },
    );
  }

  const post = await addCommunityPost(content);
  if (!post) {
    return NextResponse.json(
      { error: "Unable to publish community post." },
      { status: 500 },
    );
  }

  return NextResponse.json(post, { status: 201 });
}
