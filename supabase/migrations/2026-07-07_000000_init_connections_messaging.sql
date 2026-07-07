-- Migration: Add tables for member connections, messaging, presence, and notifications
-- Run with supabase migrations or psql against your database

-- profiles table is expected to exist; this migration adds complementary tables

-- Connections: records mutual connection state between two profiles
CREATE TABLE IF NOT EXISTS connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  recipient uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('not_connected','request_sent','request_received','connected','blocked')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (requester, recipient)
);

-- Connection requests for explicit tracking (optional separate table)
CREATE TABLE IF NOT EXISTS connection_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_profile uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  to_profile uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message text,
  status text NOT NULL CHECK (status IN ('pending','accepted','declined','cancelled')) DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  responded_at timestamptz NULL,
  UNIQUE (from_profile, to_profile)
);

-- Conversations metadata
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  is_group boolean DEFAULT false,
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Conversation members (participants)
CREATE TABLE IF NOT EXISTS conversation_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at timestamptz DEFAULT now(),
  is_admin boolean DEFAULT false,
  muted_until timestamptz NULL,
  archived boolean DEFAULT false,
  UNIQUE (conversation_id, profile_id)
);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
  body text NULL,
  data jsonb NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  edited boolean DEFAULT false,
  deleted boolean DEFAULT false
);

-- Message reactions
CREATE TABLE IF NOT EXISTS message_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reaction text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE (message_id, profile_id, reaction)
);

-- Message reads (per profile per message)
CREATE TABLE IF NOT EXISTS message_reads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  read_at timestamptz DEFAULT now(),
  UNIQUE (message_id, profile_id)
);

-- Attachments metadata
CREATE TABLE IF NOT EXISTS message_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  url text NOT NULL,
  mime text,
  size bigint DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Typing status (ephemeral: kept for realtime tracking)
CREATE TABLE IF NOT EXISTS typing_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  is_typing boolean DEFAULT true,
  updated_at timestamptz DEFAULT now(),
  UNIQUE (conversation_id, profile_id)
);

-- Online presence (update frequently)
CREATE TABLE IF NOT EXISTS online_presence (
  profile_id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('online','idle','offline')) DEFAULT 'offline',
  last_seen timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text,
  message text,
  data jsonb NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Blocked users
CREATE TABLE IF NOT EXISTS blocked_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  blocked uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE (blocker, blocked)
);

-- Indexes to optimize common lookups
CREATE INDEX IF NOT EXISTS idx_messages_conversation_created_at ON messages(conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_message_reads_profile ON message_reads(profile_id, read_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversation_members_profile ON conversation_members(profile_id);
CREATE INDEX IF NOT EXISTS idx_notifications_profile_created_at ON notifications(profile_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_connections_requester_recipient ON connections(requester, recipient);
