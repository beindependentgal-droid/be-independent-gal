import { NextRequest } from 'next/server';
import { requireAuth, successResponse, errorResponse, supabase, getPaginationParams } from '@/lib/api-utils';

// GET /api/profiles/[id]/activities - Get user activities
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const authResult = await requireAuth(request);
  if (authResult instanceof Response) return authResult;

  const { pageSize, offset } = getPaginationParams(request);

  try {
    const { data: activities, error, count } = await supabase
      .from('user_activity')
      .select('id, activity_type, points_earned, metadata, created_at', { count: 'exact' })
      .eq('user_id', params.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + pageSize - 1);

    if (error) throw error;

    // Format activities for display
    const formattedActivities = activities?.map((activity) => {
      const activityLabels: Record<string, string> = {
        profile_update: 'Updated profile',
        message_sent: 'Sent a message',
        conversation_started: 'Started a conversation',
        event_registered: 'Registered for an event',
        challenge_joined: 'Joined a challenge',
        article_created: 'Published an article',
        mentorship_requested: 'Requested mentorship',
      };

      return {
        id: activity.id,
        type: activity.activity_type,
        title: activityLabels[activity.activity_type] || activity.activity_type,
        points: activity.points_earned,
        created_at: activity.created_at,
      };
    });

    return successResponse({
      activities: formattedActivities,
      total: count,
      page: Math.floor(offset / pageSize) + 1,
      pageSize,
    });
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
