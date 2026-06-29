"use client";
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createClient } from '@/lib/supabase-client';

export default function ProfileOnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleNext = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) {
      setError('Name is required');
      return;
    }

    setLoading(true);
    try {
            const supabase = createClient();
            const session = await supabase.auth.getSession();
            const token = session.data.session?.access_token;

            if (!token) {
              setError('Authentication error - please login again');
              return;
            }

      const headers = new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      });

      const response = await fetch('/api/auth/profile', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          full_name: fullName,
          bio: bio,
          avatar_url: avatarUrl,
        }),
      });

      if (!response.ok) throw new Error('Failed to save profile');

      // Move to preferences step
      router.push('/auth/onboarding/preferences');
    } catch (err: any) {
      setError(err.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Complete Your Profile</h1>
            <p className="text-gray-600">Step 1 of 3</p>
          </div>

          <form onSubmit={handleNext} className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
                placeholder="Your name"
                required
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="avatar">Avatar URL</Label>
              <Input
                id="avatar"
                type="url"
                value={avatarUrl}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAvatarUrl(e.target.value)}
                placeholder="https://..."
                disabled={loading}
              />
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Saving...' : 'Continue'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
