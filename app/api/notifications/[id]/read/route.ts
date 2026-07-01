import { NextRequest } from 'next/server';
import { requireAuth, successResponse, errorResponse, supabase } from '@/lib/api-utils';

// PATCH /api/notifications/[id]/read - Mark notification as read
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const authResult = await requireAuth(request);
  if (authResult instanceof Response) return authResult;

  const { userId } = authResult;

  try {
    // Verify ownership
    const { data: notification } = await supabase
      .from('notifications')
      .select('user_id')
      .eq('id', params.id)
      .single();

    if (!notification) {
      return errorResponse('Notification not found', 404);
    }

    if (notification.user_id !== userId) {
      return errorResponse('Unauthorized', 403);
    }

    // Mark as read
    const { data, error } = await supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;

    return successResponse(data);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
