# Be Independent Gal (BIG) — Women's Community Platform

A comprehensive Next.js application for building thriving women's communities. Features user profiles, private messaging, member directory, mentorship matching, event management, gamification, and more.

**Current Status**: Phase 1 Complete - 7/10 features production-ready, 3 features API-complete

## Features

### ✅ Complete & Ready
- **User Profiles** - Comprehensive profile editing with skills, interests, and mentoring areas
- **Private Messaging** - Real-time conversations between members
- **Member Directory** - Full-text search with skill and mentor filtering  
- **Mentorship System** - Request creation and automatic mentor matching
- **Event Registration** - Event management with capacity and reminders
- **Gamification** - Leaderboards, badges, challenges, and point system
- **Activity Tracking** - Automatic logging of all user actions

### 🔄 API Ready, UI In Development
- **Blog & Knowledge Base** - Articles, comments, and resources
- **Admin Dashboard** - User management and platform analytics
- **Notifications** - In-app and email notifications with preferences

## Quick start

1. Install dependencies

```bash
pnpm install
# or
npm install
```

2. Set environment variables (optional — required for Supabase)

Create a `.env.local` in the project root with:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

If those variables are not present the app will use `data/circle-dashboard.json` as a fallback data store.

3. Add Supabase schema

Run the SQL files on your Supabase project:

**Main schema** (existing): [supabase-schema.sql](supabase-schema.sql)

**Feature migrations** (NEW - 10 features): [schema-migrations.sql](schema-migrations.sql)
- 30+ new tables for messaging, mentorship, events, gamification, etc.
- Full Row-Level Security (RLS) policies
- Indexes for performance optimization

4. (Optional) Seed data

You can seed using the `data/circle-dashboard.json` file. Example using `psql` or `supabase` CLI to insert a row:

```sql
INSERT INTO circle_dashboard (id, data) VALUES ('learn', '<paste JSON here>');
```

Or use a small Node script to read `data/circle-dashboard.json` and upsert into Supabase.

5. Run the dev server

```bash
pnpm dev
# or
npm run dev
```

## New Feature Routes

All routes require bearer token authentication.

### Profiles
- `GET /api/profiles` - Get current user profile
- `PUT /api/profiles` - Update profile
- `GET /api/profiles/[id]` - Get user by ID
- `GET /api/profiles/[id]/activities` - Get user activity log

### Messaging
- `GET/POST /api/messages/conversations` - List or create conversations
- `GET/POST /api/messages/[conversationId]` - Get/send messages

### Directory
- `GET /api/directory/search` - Search members (full-text, skills, mentor filter)

### Mentorship  
- `GET/POST /api/mentorship/requests` - Mentorship requests

### Events
- `POST /api/events/register` - Register for event

### Gamification
- `GET /api/gamification/leaderboard` - Get leaderboards
- `GET/POST /api/gamification/challenges` - List/join challenges

### Articles
- `GET/POST /api/articles` - List/create articles
- `GET /api/articles/[slug]` - Get article by slug

### Notifications
- `GET /api/notifications` - Get notifications
- `PATCH /api/notifications/[id]/read` - Mark as read

### Admin (requires admin role)
- `GET /api/admin/users` - List all users
- `GET /api/analytics/dashboard` - Platform analytics

## Routes & Pages

### User Pages
- `/profile/[id]` - View user profile
- `/profile/edit` - Edit your profile
- `/messages` - Messages hub
- `/messages/[conversationId]` - Conversation view
- `/directory` - Search and discover members
- `/leaderboard` - Global leaderboard

## Documentation

- [BUILD_SUMMARY.md](BUILD_SUMMARY.md) - Overview of what was built
- [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md) - Detailed feature status
- [FEATURE_COMPLETION_REPORT.md](FEATURE_COMPLETION_REPORT.md) - Executive summary

## Testing the API

- GET dashboard: `GET /api/circles/{id}/dashboard`

```bash
curl http://localhost:3000/api/circles/learn/dashboard
```

- POST a new post to the feed:

```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"content":"Hello from curl"}' \
  http://localhost:3000/api/circles/learn/dashboard
```

If Supabase is configured, the request updates the `circle_dashboard` row for that circle. Otherwise the JSON file at `data/circle-dashboard.json` is updated.

## Files changed / relevant

- Supabase client: [lib/supabase.ts](lib/supabase.ts)
- Data helpers: [lib/db.ts](lib/db.ts)
- API route: [app/api/circles/[id]/dashboard/route.ts](app/api/circles/[id]/dashboard/route.ts)
- Local seed data: [data/circle-dashboard.json](data/circle-dashboard.json)
- Suggested schema: [supabase-schema.sql](supabase-schema.sql)

## Notes

- We use `SUPABASE_SERVICE_ROLE_KEY` on the server to perform reads/writes. Keep this key secret.
- Run TypeScript checks with:

```bash
npx tsc --noEmit
```

If you want, I can add a small Node seeding script to automate inserting `data/circle-dashboard.json` into Supabase — tell me and I’ll add it.
# be-independent-gal
