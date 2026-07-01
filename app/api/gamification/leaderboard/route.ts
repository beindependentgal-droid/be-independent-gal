import { NextRequest } from 'next/server';
import { requireAuth, successResponse, errorResponse, supabase, getPaginationParams } from '@/lib/api-utils';

// GET /api/gamification/leaderboard - Get leaderboard for a circle
export async function GET(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (authResult instanceof Response) return authResult;

  const url = new URL(request.url);
  const circleId = url.searchParams.get('circleId');
  const period = url.searchParams.get('period') || 'all_time';
  const { pageSize, offset } = getPaginationParams(request);

  try {
    let query = supabase
      .from('leaderboards')
      .select(
        `
        id,
        rank,
        total_points,
        user:user_id(id, first_name, last_name, avatar_url, member_level)
      `,
        { count: 'exact' }
      )
      .eq('period', period);

    if (circleId) {
      query = query.eq('circle_id', circleId);
    } else {
      query = query.is('circle_id', null); // Global leaderboard
    }

    const { data: leaderboard, error, count } = await query
      .order('rank', { ascending: true })
      .range(offset, offset + pageSize - 1);

    if (error) throw error;

    return successResponse({
      leaderboard,
      total: count,
      page: Math.floor(offset / pageSize) + 1,
      pageSize,
      period,
    });
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
