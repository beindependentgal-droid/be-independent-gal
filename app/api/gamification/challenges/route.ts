import { NextRequest } from 'next/server';
import { requireAuth, successResponse, errorResponse, supabase, getPaginationParams, recordActivity } from '@/lib/api-utils';

// GET /api/gamification/challenges - List active challenges
export async function GET(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (authResult instanceof Response) return authResult;

  const url = new URL(request.url);
  const circleId = url.searchParams.get('circleId');
  const { pageSize, offset } = getPaginationParams(request);

  try {
    let query = supabase
      .from('challenges')
      .select(
        `
        *,
        creator:creator_id(id, first_name, last_name, avatar_url),
        participants:challenge_participants(count)
      `,
        { count: 'exact' }
      )
      .eq('status', 'active');

    if (circleId) {
      query = query.eq('circle_id', circleId);
    }

    const { data: challenges, error, count } = await query
      .order('start_date', { ascending: true })
      .range(offset, offset + pageSize - 1);

    if (error) throw error;

    return successResponse({
      challenges,
      total: count,
      page: Math.floor(offset / pageSize) + 1,
      pageSize,
    });
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}

// POST /api/gamification/challenges/join - Join a challenge
export async function POST(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (authResult instanceof Response) return authResult;

  const { userId } = authResult;
  const { challengeId } = await request.json();

  if (!challengeId) {
    return errorResponse('challengeId is required', 400);
  }

  try {
    const { data, error } = await supabase
      .from('challenge_participants')
      .insert({
        challenge_id: challengeId,
        user_id: userId,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return errorResponse('Already joined this challenge', 400);
      }
      throw error;
    }

    // Record activity
    await recordActivity(userId, 'challenge_joined', 5);

    return successResponse(data, 201);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
