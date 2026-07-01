import { z } from 'zod';

// User Profile Validators
export const userProfileSchema = z.object({
  full_name: z.string().min(1).max(255).nullable(),
  bio: z.string().max(500).nullable(),
  avatar_url: z.string().url().nullable(),
  cover_image_url: z.string().url().nullable(),
  location: z.string().max(100).nullable(),
  website: z.string().url().nullable(),
  skills: z.array(z.string()),
  interests: z.array(z.string()),
  mentoring_areas: z.array(z.string()),
  is_mentor: z.boolean(),
});

export type UserProfileInput = z.infer<typeof userProfileSchema>;

// Message Validators
export const messageSchema = z.object({
  content: z.string().min(1).max(5000),
});

export type MessageInput = z.infer<typeof messageSchema>;

// Article Validators
export const articleSchema = z.object({
  title: z.string().min(5).max(500),
  slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/),
  content: z.string().min(10),
  excerpt: z.string().max(500).nullable(),
  featured_image_url: z.string().url().nullable(),
  circle_name: z.string().max(255).nullable(),
  status: z.enum(['draft', 'published', 'archived']),
});

export type ArticleInput = z.infer<typeof articleSchema>;

// Article Comment Validators
export const articleCommentSchema = z.object({
  content: z.string().min(1).max(5000),
  parent_comment_id: z.string().uuid().nullable(),
});

export type ArticleCommentInput = z.infer<typeof articleCommentSchema>;

// Event Validators
export const eventSchema = z.object({
  title: z.string().min(5).max(255),
  description: z.string().max(2000).nullable(),
  image_url: z.string().url().nullable(),
  event_type: z.string().max(50),
  circle_name: z.string().max(255).nullable(),
  start_time: z.string().datetime(),
  end_time: z.string().datetime(),
  location: z.string().max(255).nullable(),
  capacity: z.number().positive().nullable(),
  registration_url: z.string().url().nullable(),
  status: z.enum(['upcoming', 'ongoing', 'completed', 'cancelled']),
});

export type EventInput = z.infer<typeof eventSchema>;

// Challenge Validators
export const challengeSchema = z.object({
  title: z.string().min(5).max(255),
  description: z.string().max(2000).nullable(),
  circle_name: z.string().max(255).nullable(),
  start_date: z.string().datetime(),
  end_date: z.string().datetime(),
  points_reward: z.number().positive().default(50),
  difficulty: z.enum(['easy', 'medium', 'hard']),
});

export type ChallengeInput = z.infer<typeof challengeSchema>;

// Mentorship Request Validators
export const mentorshipRequestSchema = z.object({
  mentor_id: z.string().uuid(),
  message: z.string().max(500).nullable(),
});

export type MentorshipRequestInput = z.infer<typeof mentorshipRequestSchema>;

// Notification Preferences Validators
export const notificationPreferencesSchema = z.object({
  email_on_message: z.boolean(),
  email_on_mention: z.boolean(),
  email_on_event_reminder: z.boolean(),
  email_digest_frequency: z.enum(['daily', 'weekly', 'monthly', 'never']),
  push_notifications: z.boolean(),
  in_app_notifications: z.boolean(),
});

export type NotificationPreferencesInput = z.infer<typeof notificationPreferencesSchema>;

// Resource Validators
export const resourceSchema = z.object({
  title: z.string().min(5).max(255),
  description: z.string().max(1000).nullable(),
  resource_type: z.enum(['guide', 'template', 'tool', 'other']),
  file_url: z.string().url(),
  circle_name: z.string().max(255).nullable(),
});

export type ResourceInput = z.infer<typeof resourceSchema>;

// Moderation Flag Validators
export const moderationFlagSchema = z.object({
  content_type: z.enum(['message', 'article', 'comment', 'profile']),
  content_id: z.string().uuid(),
  reason: z.string().min(10).max(1000),
});

export type ModerationFlagInput = z.infer<typeof moderationFlagSchema>;
