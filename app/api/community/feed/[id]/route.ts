import { NextRequest, NextResponse } from "next/server";
import { deleteCommunityPost, updateCommunityPost } from "@/lib/db";
import { requireAuth, errorResponse, successResponse } from "@/lib/api-utils";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authResult = await requireAuth(request);
  if (authResult instanceof Response) return authResult;

  const { id } = await params;
  const body = await request.json().catch(() => null);

  if (!body || typeof body !== "object" || typeof body.content !== "string") {
    return errorResponse(
      "Invalid request body. Provide a content string.",
      400,
    );
  }

  const content = body.content.trim();
  if (!content) {
    return errorResponse("Content cannot be empty.", 400);
  }

  const updated = await updateCommunityPost(id, content);
  if (!updated) {
    return errorResponse("Unable to update community post.", 500);
  }

  return successResponse(updated);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authResult = await requireAuth(request);
  if (authResult instanceof Response) return authResult;

  const { id } = await params;
  const deleted = await deleteCommunityPost(id);
  if (!deleted) {
    return errorResponse("Unable to delete community post.", 500);
  }

  return successResponse({ deleted: true });
}
