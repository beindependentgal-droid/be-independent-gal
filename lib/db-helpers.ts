import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const db = {
  // User Profiles
  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) throw error;
    return data;
  },

  async updateUserProfile(userId: string, updates: any) {
    const { data, error } = await supabase
      .from('user_profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // User Activity
  async logActivity(userId: string, activityType: string, pointsEarned: number, metadata: any = {}) {
    const { data, error } = await supabase
      .from('user_activity')
      .insert({
        user_id: userId,
        activity_type: activityType,
        points_earned: pointsEarned,
        metadata,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getUserActivity(userId: string, limit = 20) {
    const { data, error } = await supabase
      .from('user_activity')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data;
  },

  // Messages
  async getOrCreateConversation(user1Id: string, user2Id: string) {
    const [userId1, userId2] = [user1Id, user2Id].sort();
    
    const { data: existing } = await supabase
      .from('conversations')
      .select('*')
      .or(`and(eq(user1_id,${userId1}),eq(user2_id,${userId2})),and(eq(user1_id,${userId2}),eq(user2_id,${userId1}))`);

    if (existing && existing.length > 0) {
      return existing[0];
    }

    const { data, error } = await supabase
      .from('conversations')
      .insert({
        user1_id: userId1,
        user2_id: userId2,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getConversations(userId: string) {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .order('last_message_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getMessages(conversationId: string, limit = 50) {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data?.reverse() || [];
  },

  async sendMessage(conversationId: string, senderId: string, content: string) {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        content,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Directory Search
  async searchMembers(query: string, filters?: { mentor?: boolean; circle?: string }) {
    let q = supabase
      .from('user_directory')
      .select('*');

    if (query) {
      q = q.or(`full_name.ilike.%${query}%,bio.ilike.%${query}%`);
    }

    if (filters?.mentor) {
      q = q.eq('is_mentor', true);
    }

    const { data, error } = await q.limit(50);
    if (error) throw error;
    return data;
  },

  // Events
  async getEvents(filters?: { circle?: string; status?: string }) {
    let q = supabase
      .from('events')
      .select('*')
      .order('start_time', { ascending: true });

    if (filters?.circle) {
      q = q.eq('circle_name', filters.circle);
    }
    if (filters?.status) {
      q = q.eq('status', filters.status);
    }

    const { data, error } = await q;
    if (error) throw error;
    return data;
  },

  async registerForEvent(eventId: string, userId: string) {
    const { data, error } = await supabase
      .from('event_registrations')
      .insert({
        event_id: eventId,
        user_id: userId,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Gamification
  async getLeaderboard(period: 'daily' | 'weekly' | 'monthly' | 'all-time', circleName?: string) {
    let q = supabase
      .from('leaderboards')
      .select('*')
      .eq('period', period)
      .order('rank', { ascending: true })
      .limit(100);

    if (circleName) {
      q = q.eq('circle_name', circleName);
    } else {
      q = q.is('circle_name', null);
    }

    const { data, error } = await q;
    if (error) throw error;
    return data;
  },

  // Articles
  async getPublishedArticles(limit = 20) {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data;
  },

  async getArticleBySlug(slug: string) {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();
    if (error) throw error;
    return data;
  },

  async createArticle(authorId: string, article: any) {
    const { data, error } = await supabase
      .from('articles')
      .insert({
        ...article,
        author_id: authorId,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Notifications
  async getNotifications(userId: string, limit = 20) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data;
  },

  async markNotificationAsRead(notificationId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
      })
      .eq('id', notificationId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Analytics
  async getAnalytics(userId: string, days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const { data, error } = await supabase
      .from('user_analytics')
      .select('*')
      .eq('user_id', userId)
      .gte('date', since.toISOString().split('T')[0])
      .order('date', { ascending: false });
    if (error) throw error;
    return data;
  },
};

export default db;
