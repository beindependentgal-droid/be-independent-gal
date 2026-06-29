# Authentication & Onboarding Setup

This document covers the complete authentication and onboarding flow for the Be Independent Gal platform.

## Overview

The authentication system uses **Supabase Auth** (Email/Password) with a multi-step onboarding flow:

1. **Sign Up** - Create account with email/password
2. **Onboarding Step 1** - Complete profile (name, bio, avatar)
3. **Onboarding Step 2** - Set preferences (notifications, email digest)
4. **Onboarding Step 3** - Select circles to join
5. **Redirect to Home** - User is now fully onboarded

## Database Schema

### 1. Create Auth Tables in Supabase

Run the SQL from `auth-schema.sql` in your Supabase dashboard:

```sql
-- User profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  bio TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- User preferences table
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users ON DELETE CASCADE,
  notifications_enabled BOOLEAN DEFAULT true,
  email_digest BOOLEAN DEFAULT true,
  selected_circles TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS and create policies
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can read their own preferences" ON public.user_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" ON public.user_preferences
  FOR UPDATE USING (auth.uid() = user_id);

-- Grant permissions to service role
GRANT SELECT, INSERT, UPDATE ON public.user_profiles TO service_role;
GRANT SELECT, INSERT, UPDATE ON public.user_preferences TO service_role;
```

### 2. Grant Permissions

If you receive permission errors, run in Supabase SQL Editor:

```sql
GRANT SELECT, INSERT, UPDATE ON public.user_profiles TO service_role;
GRANT SELECT, INSERT, UPDATE ON public.user_preferences TO service_role;
```

## File Structure

```
app/
  auth/
    login/page.tsx                    # Login page
    sign-up/page.tsx                  # Sign up page
    onboarding/
      profile/page.tsx                # Step 1: Profile setup
      preferences/page.tsx            # Step 2: Preferences
      circles/page.tsx                # Step 3: Circle selection
  api/
    auth/
      profile/route.ts                # Save user profile
      preferences/route.ts            # Save preferences
      circles/route.ts                # Save circle selections

components/
  auth/
    sign-up-form.tsx                  # Sign up form component
    login-form.tsx                    # Login form component

lib/
  auth-context.tsx                    # Auth provider & hook
  auth-types.ts                       # TypeScript types
  supabase-client.ts                  # Browser Supabase client
```

## Usage

### AuthProvider Setup

The `AuthProvider` is already wrapped in `app/layout.tsx`:

```tsx
import { AuthProvider } from '@/lib/auth-context'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
```

### Using the Auth Hook

Access authentication in any client component:

```tsx
'use client'

import { useAuth } from '@/lib/auth-context'

export function MyComponent() {
  const { user, isAuthenticated, loading, signOut } = useAuth()

  if (loading) return <div>Loading...</div>
  if (!isAuthenticated) return <div>Not logged in</div>

  return (
    <div>
      <p>Welcome, {user?.email}</p>
      <button onClick={() => signOut()}>Logout</button>
    </div>
  )
}
```

### Auth Methods

```tsx
const { signUp, signIn, signOut } = useAuth()

// Sign up
await signUp('user@example.com', 'password123')

// Sign in
await signIn('user@example.com', 'password123')

// Sign out
await signOut()
```

## Protected Routes

To protect routes that require authentication, create a middleware or wrapper component:

```tsx
'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'

export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  if (loading) return <div>Loading...</div>
  if (!isAuthenticated) {
    router.push('/auth/login')
    return null
  }

  return children
}
```

## Auth Routes

- **Sign Up**: `/auth/sign-up`
- **Login**: `/auth/login`
- **Onboarding Profile**: `/auth/onboarding/profile`
- **Onboarding Preferences**: `/auth/onboarding/preferences`
- **Onboarding Circles**: `/auth/onboarding/circles`

## API Routes

### POST /api/auth/profile
Save user profile after sign up.

**Body:**
```json
{
  "full_name": "Jane Doe",
  "bio": "Passionate about learning",
  "avatar_url": "https://example.com/avatar.jpg"
}
```

**Requires:** Bearer token in Authorization header

### POST /api/auth/preferences
Save user notification preferences.

**Body:**
```json
{
  "notifications_enabled": true,
  "email_digest": true
}
```

**Requires:** Bearer token in Authorization header

### POST /api/auth/circles
Save selected circles for user.

**Body:**
```json
{
  "selected_circles": ["learn", "connect", "earn"]
}
```

**Requires:** Bearer token in Authorization header

## Environment Variables

Your `.env.local` should already have:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Alternatively, copy the example file and populate it:

```
cp .env.local.example .env.local
# edit .env.local and add your keys
```

You can run convenience npm scripts added to this repo:

```
# Run a connectivity and data smoke-test (requires SUPABASE_URL & SUPABASE_SERVICE_ROLE_KEY in .env.local)
npm run supabase:test

# Seed the database using data/circle-dashboard.json
npm run supabase:seed
```

## Testing

### 1. Test Sign Up Flow

1. Navigate to `http://localhost:3000/auth/sign-up`
2. Enter email and password
3. Should redirect to `/auth/onboarding/profile`
4. Complete all 3 onboarding steps
5. Should redirect to home page (`/`)

### 2. Test Login Flow

1. Navigate to `http://localhost:3000/auth/login`
2. Enter credentials
3. Should redirect to home page (`/`)

### 3. Verify Data in Supabase

1. Go to Supabase Dashboard
2. Check `user_profiles` table for new user
3. Check `user_preferences` table for preferences and circle selections

## Security Notes

- **Never** commit `.env.local` to version control
- **Service Role Key** is secret - only use on backend (Node.js)
- **Publishable Key** is safe to expose (used in browser)
- Use Row Level Security (RLS) policies to protect user data
- All API routes verify authentication with Bearer tokens

## Next Steps

1. Create a dashboard landing page that shows selected circles
2. Add social auth (Google, GitHub)
3. Implement email verification
4. Add password reset functionality
5. Create admin dashboard for user management

## Troubleshooting

### "Missing authorization" error on onboarding save

The API routes need the user's session token in the `Authorization` header. Update the form components to include this:

```tsx
const session = await supabase.auth.getSession()
const token = session.data.session?.access_token

const response = await fetch('/api/auth/profile', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify(data),
})
```

### Tables not found in Supabase

Make sure you ran the SQL from `auth-schema.sql` in the Supabase SQL Editor.

### RLS policy errors

If you see "new row violates row-level security policy", ensure RLS policies are correctly created and service role has permissions.
