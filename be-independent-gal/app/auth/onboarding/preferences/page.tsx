"use client";
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase-client';

export default function PreferencesOnboardingPage() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailDigest, setEmailDigest] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleNext = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
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

      const response = await fetch('/api/auth/preferences', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          notifications_enabled: notificationsEnabled,
          email_digest: emailDigest,
        }),
      });

      if (!response.ok) throw new Error('Failed to save preferences');

      // Move to circle selection
      router.push('/auth/onboarding/circles');
    } catch (err: any) {
      setError(err.message || 'Failed to save preferences');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Your Preferences</h1>
            <p className="text-gray-600">Step 2 of 3</p>
          </div>

          <form onSubmit={handleNext} className="space-y-6">
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNotificationsEnabled(e.target.checked)}
                  disabled={loading}
                  className="w-4 h-4"
                />
                <span className="text-gray-700">Enable notifications</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailDigest}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmailDigest(e.target.checked)}
                  disabled={loading}
                  className="w-4 h-4"
                />
                <span className="text-gray-700">Receive weekly email digest</span>
              </label>
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
