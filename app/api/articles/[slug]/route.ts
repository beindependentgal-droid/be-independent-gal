import { NextRequest } from "next/server";
import {
  requireAuth,
  successResponse,
  errorResponse,
  supabase,
} from "@/lib/api-utils";

// GET /api/articles/[slug] - Get article by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const authResult = await requireAuth(request);
  if (authResult instanceof Response) return authResult;

  try {
    const { data: article, error } = await supabase
      .from("articles")
      .select(
        `
        *,
        author:author_id(id, first_name, last_name, avatar_url),
        circle:circle_id(id, name),
        article_tags(tag),
        article_comments(id, content, author_id, created_at, author:author_id(first_name, last_name, avatar_url))
      `,
      )
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    if (error || !article) {
      return errorResponse("Article not found", 404);
    }

    // Increment view count
    await supabase
      .from("articles")
      .update({ view_count: (article.view_count || 0) + 1 })
      .eq("id", article.id);

    return successResponse(article);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
