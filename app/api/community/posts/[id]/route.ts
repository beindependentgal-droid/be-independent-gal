import { NextResponse } from "next/server";
import { deletePost, updatePost } from "@/lib/community-db";
import { deleteCommunityPost, updateCommunityPost } from "@/lib/db";
import { getCurrentUserId } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const userId = await getCurrentUserId();

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    const content = typeof body.content === "string" ? body.content : "";

    if (userId) {
      try {
        const post = await updatePost(userId, id, body);
        return NextResponse.json(post);
      } catch (error: unknown) {
        const fallbackPost = await updateCommunityPost(id, content);
        if (fallbackPost) {
          return NextResponse.json(fallbackPost);
        }

        const message =
          error instanceof Error ? error.message : "Failed to update post";
        return NextResponse.json({ error: message }, { status: 400 });
      }
    }

    const post = await updateCommunityPost(id, content);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update post";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const userId = await getCurrentUserId();

  try {
    if (userId) {
      try {
        await deletePost(userId, id);
        return NextResponse.json({ success: true });
      } catch (error: unknown) {
        const deleted = await deleteCommunityPost(id);
        if (!deleted) {
          const message =
            error instanceof Error ? error.message : "Failed to delete post";
          return NextResponse.json({ error: message }, { status: 400 });
        }

        return NextResponse.json({ success: true });
      }
    }

    const deleted = await deleteCommunityPost(id);
    if (!deleted) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to delete post";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
