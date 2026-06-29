import { NextRequest } from 'next/server';
import { requireAuth, successResponse, errorResponse, supabase, isAdmin } from '@/lib/api-utils';

// GET /api/analytics/dashboard - Get admin dashboard analytics
export async function GET(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (authResult instanceof Response) return authResult;

  const { userId } = authResult;
  const adminCheck = await isAdmin(userId);
  if (!adminCheck) {
    return errorResponse('Unauthorized', 403);
  }

  try {
    const url = new URL(request.url);
    const circleId = url.searchParams.get('circleId');
    const days = parseInt(url.searchParams.get('days') || '30');

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get platform analytics
    let analyticsQuery = supabase
      .from('platform_analytics')
      .select('*')
      .gte('date', startDate.toISOString().split('T')[0])
      .order('date', { ascending: true });

    const { data: platformAnalytics, error: platformError } = await analyticsQuery;

    if (platformError) throw platformError;

    // Get circle analytics if specified
    let circleAnalytics = null;
    if (circleId) {
      const { data, error } = await supabase
        .from('circle_analytics')
        .select('*')
        .eq('circle_id', circleId)
        .gte('date', startDate.toISOString().split('T')[0])
        .order('date', { ascending: true });

      if (error) throw error;
      circleAnalytics = data;
    }

    // Get recent audit logs
    const { data: auditLogs } = await supabase
      .from('audit_logs')
      .select(
        `
        *,
        admin:admin_id(first_name, last_name)
      `
      )
      .order('created_at', { ascending: false })
      .limit(20);

    // Get pending moderation flags
    const { data: flaggedContent } = await supabase
      .from('moderation_flags')
      .select(
        `
        *,
        flagged_by:flagged_by_user_id(first_name, last_name)
      `
      )
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(20);

    return successResponse({
      platformAnalytics,
      circleAnalytics,
      auditLogs,
      flaggedContent,
      dateRange: {
        start: startDate.toISOString().split('T')[0],
        days,
      },
    });
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
