export interface AuthUser {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
    role?: string;
  };
}

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  bio: string;
  avatar_url: string;
  profession: string;
  industry: string;
  business: string;
  city: string;
  phone: string;
  experience: string;
  why_joining: string;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  notifications_enabled: boolean;
  email_digest: boolean;
  selected_circles: string[];
  created_at: string;
  updated_at: string;
}
