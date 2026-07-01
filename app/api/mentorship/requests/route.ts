import { NextRequest } from 'next/server';
import { requireAuth, successResponse, errorResponse, supabase, recordActivity, sendNotification } from '@/lib/api-utils';

// GET /api/mentorship/requests - Get mentorship requests for user
export async function GET(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (authResult instanceof Response) return authResult;

  const { userId } = authResult;
  const url = new URL(request.url);
  const status = url.searchParams.get('status') || 'pending';

  try {
    const { data, error } = await supabase
      .from('mentorship_requests')
      .select(
        `
        *,
        requester:requester_id(id, first_name, last_name, avatar_url),
        matched_mentor:matched_mentor_id(id, first_name, last_name, avatar_url)
      `
      )
      .eq('status', status)
      .or(`requester_id.eq.${userId},matched_mentor_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return successResponse(data);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}

// POST /api/mentorship/requests - Create a mentorship request
export async function POST(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (authResult instanceof Response) return authResult;

  const { userId } = authResult;
  const { skillArea, goals } = await request.json();

  if (!skillArea) {
    return errorResponse('skillArea is required', 400);
  }

  try {
    const { data, error } = await supabase
      .from('mentorship_requests')
      .insert({
        requester_id: userId,
        skill_area: skillArea,
        goals,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;

    // Record activity
    await recordActivity(userId, 'mentorship_requested', 0);

    // Notify admins/mentors
    const { data: mentors } = await supabase
      .from('user_profile_extended')
      .select('user_id')
      .contains('mentoring_areas', [skillArea]);

    if (mentors && mentors.length > 0) {
      for (const mentor of mentors.slice(0, 5)) {
        await sendNotification(
          mentor.user_id,
          'mentorship_request',
          `New mentorship request in ${skillArea}`,
          `Someone is looking for a mentor in ${skillArea}`
        );
      }
    }

    return successResponse(data, 201);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
