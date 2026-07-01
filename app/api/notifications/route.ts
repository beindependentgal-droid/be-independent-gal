import { NextRequest } from 'next/server';
import { requireAuth, successResponse, errorResponse, supabase, getPaginationParams } from '@/lib/api-utils';

// GET /api/notifications - Get user notifications
export async function GET(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (authResult instanceof Response) return authResult;

  const { userId } = authResult;
  const url = new URL(request.url);
  const unreadOnly = url.searchParams.get('unread') === 'true';
  const { pageSize, offset } = getPaginationParams(request);

  try {
    let query = supabase
      .from('notifications')
      .select(
        `
        *,
        related_user:related_user_id(id, first_name, last_name, avatar_url)
      `,
        { count: 'exact' }
      )
      .eq('user_id', userId);

    if (unreadOnly) {
      query = query.is('read_at', null);
    }

    const { data: notifications, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + pageSize - 1);

    if (error) throw error;

    return successResponse({
      notifications,
      total: count,
      unread: count,
      page: Math.floor(offset / pageSize) + 1,
      pageSize,
    });
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
