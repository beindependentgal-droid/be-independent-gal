// Database Types for Be Independent Gal - Auto-generated from Supabase schema

export interface UserProfile {
  id: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  cover_image_url: string | null;
  location: string | null;
  website: string | null;
  skills: string[];
  interests: string[];
  mentoring_areas: string[];
  is_mentor: boolean;
  is_verified: boolean;
  total_points: number;
  level: number;
  circles: string[];
  created_at: string;
  updated_at: string;
}

export interface UserActivity {
  id: string;
  user_id: string;
  activity_type:
    | "post"
    | "comment"
    | "event_attend"
    | "article_read"
    | "challenge_join"
    | "mentorship_start";
  action_description: string | null;
  points_earned: number;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface Conversation {
  id: string;
  user1_id: string;
  user2_id: string;
  created_at: string;
  last_message_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

export interface UserDirectory {
  id: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  location: string | null;
  skills: string[];
  is_mentor: boolean;
  circles: string[];
  created_at: string;
}

export interface MentorshipRelationship {
  id: string;
  mentor_id: string;
  mentee_id: string;
  started_at: string;
  ended_at: string | null;
  status: "active" | "paused" | "ended";
}

export interface MentorshipRequest {
  id: string;
  mentor_id: string;
  requester_id: string;
  status: "pending" | "accepted" | "rejected";
  message: string | null;
  created_at: string;
  responded_at: string | null;
}

export interface Event {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  event_type: string;
  circle_name: string | null;
  organizer_id: string;
  start_time: string;
  end_time: string;
  location: string | null;
  capacity: number | null;
  registration_url: string | null;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  created_at: string;
  updated_at: string;
}

export interface EventRegistration {
  id: string;
  event_id: string;
  user_id: string;
  registered_at: string;
  status: "registered" | "attended" | "cancelled";
}

export interface Badge {
  id: string;
  name: string;
  description: string | null;
  icon_url: string | null;
  points_required: number;
  created_at: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string | null;
  circle_name: string | null;
  creator_id: string | null;
  start_date: string;
  end_date: string;
  points_reward: number;
  difficulty: "easy" | "medium" | "hard";
  status: "active" | "completed" | "cancelled";
  created_at: string;
}

export interface ChallengeParticipant {
  id: string;
  challenge_id: string;
  user_id: string;
  joined_at: string;
  completed_at: string | null;
  progress_percentage: number;
}

export interface Leaderboard {
  id: string;
  circle_name: string | null;
  period: "daily" | "weekly" | "monthly" | "all-time";
  user_id: string;
  total_points: number;
  rank: number | null;
  updated_at: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featured_image_url: string | null;
  author_id: string;
  circle_name: string | null;
  status: "draft" | "published" | "archived";
  published_at: string | null;
  created_at: string;
  updated_at: string;
  view_count: number;
}

export interface ArticleComment {
  id: string;
  article_id: string;
  author_id: string;
  content: string;
  parent_comment_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string | null;
  resource_type: "guide" | "template" | "tool" | "other";
  file_url: string;
  creator_id: string;
  circle_name: string | null;
  downloads: number;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  notification_type: string;
  title: string;
  content: string | null;
  related_user_id: string | null;
  related_id: string | null;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

export interface NotificationPreferences {
  id: string;
  email_on_message: boolean;
  email_on_mention: boolean;
  email_on_event_reminder: boolean;
  email_digest_frequency: "daily" | "weekly" | "monthly" | "never";
  push_notifications: boolean;
  in_app_notifications: boolean;
  updated_at: string;
}

export interface AdminRole {
  id: string;
  role:
    | "admin"
    | "super_admin"
    | "superadmin"
    | "moderator"
    | "content_manager";
  permissions: string[];
  created_at: string;
  created_by: string | null;
}

export interface AuditLog {
  id: string;
  admin_id: string;
  action: string;
  table_name: string | null;
  record_id: string | null;
  changes: Record<string, unknown> | null;
  created_at: string;
}

export interface ModerationFlag {
  id: string;
  reported_by: string;
  content_type: "message" | "article" | "comment" | "profile";
  content_id: string;
  reason: string;
  status: "pending" | "reviewed" | "resolved" | "dismissed";
  reviewer_id: string | null;
  resolution_notes: string | null;
  created_at: string;
  resolved_at: string | null;
}

export interface UserAnalytics {
  id: string;
  user_id: string;
  date: string;
  messages_sent: number;
  posts_created: number;
  events_attended: number;
  articles_read: number;
  points_earned: number;
  created_at: string;
}

export interface PlatformAnalytics {
  id: string;
  date: string;
  total_active_users: number;
  new_users: number;
  total_messages: number;
  total_events: number;
  total_articles: number;
  average_session_duration: number | null;
  created_at: string;
}

export interface CircleAnalytics {
  id: string;
  circle_name: string;
  date: string;
  active_members: number;
  new_members: number;
  posts_count: number;
  events_count: number;
  created_at: string;
}
