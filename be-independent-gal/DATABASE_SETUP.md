# Database Setup Guide - Be Independent Gal

## Fresh Supabase Setup

You've deleted the old code and created a new Supabase database. Here's how to set it up:

### Step 1: Apply the Database Migration

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Go to **SQL Editor** 
4. Click **New Query**
5. Copy the entire contents from `/supabase/migrations/001_init_big_platform.sql`
6. Paste it into the query editor
7. Click **Run**

**The migration creates:**
- 50+ tables for all 10 features
- Row-Level Security (RLS) policies
- Indexes for performance
- Default gamification badges
- Search functionality

### Step 2: Verify the Migration

After running the migration, check that all tables were created:

```sql
SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;
```

You should see tables for:
- Profiles: `user_profiles`, `user_extended_profiles`, `user_activity`
- Messaging: `conversations`, `messages`, `message_read_receipts`
- Directory: `user_directory`
- Mentorship: `mentorship`, `mentorship_sessions`, `mentorship_requests`
- Events: `events`, `event_registrations`, `event_reminders`
- Gamification: `badges`, `user_badges`, `challenges`, `challenge_participants`, `leaderboards`
- Blog: `articles`, `article_comments`, `resources`
- Notifications: `notifications`, `notification_preferences`
- Analytics: `user_analytics`, `platform_analytics`, `circle_analytics`

### Step 3: Enable RLS (Row-Level Security)

RLS is already enabled on all tables via the migration. Verify it's working by checking one table:

```sql
SELECT tablename, rowsecurity FROM pg_class 
WHERE schemaname = 'public' AND tablename = 'user_profiles';
```

### Step 4: Test the Connection

In your application, verify you can query the database:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const { data, error } = await supabase
  .from('badges')
  .select('*')
  .limit(1);

if (error) console.error('Database error:', error);
else console.log('Database connected!', data);
```

### Step 5: Set Environment Variables

Make sure you have these in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Database Schema Overview

### User Profiles (3 tables)
- `user_profiles` - Basic profile info
- `user_extended_profiles` - Skills, interests, mentoring areas
- `user_activity` - Activity log for gamification

### Messaging (3 tables)
- `conversations` - Direct message threads
- `messages` - Individual messages
- `message_read_receipts` - Read status tracking

### Directory (1 table)
- `user_directory` - Full-text search index with skills

### Mentorship (3 tables)
- `mentorship` - Active mentor-mentee relationships
- `mentorship_sessions` - Scheduled sessions
- `mentorship_requests` - Matching requests

### Events (3 tables)
- `events` - Event details
- `event_registrations` - User registrations
- `event_reminders` - Automated reminders

### Gamification (5 tables)
- `badges` - Badge definitions (pre-populated)
- `user_badges` - Earned badges
- `challenges` - Time-limited challenges
- `challenge_participants` - Participation tracking
- `leaderboards` - Cached rankings

### Blog (3 tables)
- `articles` - Blog posts with full-text search
- `article_comments` - Nested comments
- `resources` - Downloadable guides

### Notifications (2 tables)
- `notifications` - In-app notifications
- `notification_preferences` - User preferences

### Analytics (3 tables)
- `user_analytics` - Daily user engagement
- `platform_analytics` - Daily platform metrics
- `circle_analytics` - Daily circle metrics

## RLS Policies

All tables have Row-Level Security policies:
- **SELECT** - Users can see their own data + public data
- **INSERT** - Only authenticated users can insert
- **UPDATE** - Users can only update their own data
- **DELETE** - Service role only (for admin operations)

For admin operations, use the `SUPABASE_SERVICE_ROLE_KEY`.

## Troubleshooting

### Migration fails with "relation does not exist"
- This means a table creation failed. Check the error message and re-run the migration.
- The migration is idempotent, so it's safe to run multiple times.

### RLS policies blocking queries
- Make sure you're authenticated in your app
- Check that the user's UUID matches the data being queried
- Use service role key for admin operations

### Performance issues
- All indexes are created in the migration
- Check that queries use indexed columns
- Use `EXPLAIN ANALYZE` to check query plans

## Next Steps

1. After migration runs successfully, the database is ready
2. Install dependencies: `npm install` or `pnpm install`
3. Start the dev server: `npm run dev`
4. Create an account to test authentication
5. Explore the features in the app

## Production Deployment

Before deploying to production:

1. Run migrations on production Supabase instance
2. Test all RLS policies with production data
3. Set all environment variables correctly
4. Run performance tests on large datasets
5. Enable database backups and monitoring
6. Set up automated daily backups
7. Configure connection pooling if needed

For more info, see the main README.md
