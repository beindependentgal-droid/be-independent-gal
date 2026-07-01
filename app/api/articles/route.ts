import { NextRequest } from 'next/server';
import { requireAuth, successResponse, errorResponse, supabase, getPaginationParams, recordActivity } from '@/lib/api-utils';

// GET /api/articles - List published articles
export async function GET(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (authResult instanceof Response) return authResult;

  const url = new URL(request.url);
  const search = url.searchParams.get('search');
  const circleId = url.searchParams.get('circleId');
  const tag = url.searchParams.get('tag');
  const { pageSize, offset } = getPaginationParams(request);

  try {
    let query = supabase
      .from('articles')
      .select(
        `
        id,
        title,
        slug,
        excerpt,
        featured_image_url,
        status,
        published_at,
        view_count,
        author:author_id(id, first_name, last_name, avatar_url),
        circle:circle_id(id, name),
        article_tags(tag)
      `,
        { count: 'exact' }
      )
      .eq('status', 'published');

    if (search) {
      query = query.textSearch('search_vector', search);
    }

    if (circleId) {
      query = query.eq('circle_id', circleId);
    }

    if (tag) {
      query = query.contains('article_tags.tag', [tag]);
    }

    const { data: articles, error, count } = await query
      .order('published_at', { ascending: false })
      .range(offset, offset + pageSize - 1);

    if (error) throw error;

    return successResponse({
      articles,
      total: count,
      page: Math.floor(offset / pageSize) + 1,
      pageSize,
    });
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}

// POST /api/articles - Create a new article
export async function POST(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (authResult instanceof Response) return authResult;

  const { userId } = authResult;
  const { title, content, excerpt, slug, tags, circleId, status } = await request.json();

  if (!title || !content || !slug) {
    return errorResponse('title, content, and slug are required', 400);
  }

  try {
    // Create article
    const { data: article, error } = await supabase
      .from('articles')
      .insert({
        title,
        content,
        excerpt,
        slug,
        author_id: userId,
        circle_id: circleId,
        status: status || 'draft',
      })
      .select()
      .single();

    if (error) throw error;

    // Add tags
    if (tags && tags.length > 0) {
      const tagInserts = tags.map((tag: string) => ({
        article_id: article.id,
        tag,
      }));

      await supabase.from('article_tags').insert(tagInserts);
    }

    // Record activity
    await recordActivity(userId, 'article_created', 10);

    return successResponse(article, 201);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
