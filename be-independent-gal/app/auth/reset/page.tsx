"use client";
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ResetPage() {
  const router = useRouter();
  const { sendPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      await sendPasswordReset(email);
      setMessage('If an account exists, a reset email (or magic link) has been sent.');
    } catch (err: any) {
      setMessage(err.message || 'Failed to send reset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-semibold mb-4">Reset password</h1>
          <p className="text-gray-600 mb-6">Enter your email and we'll send a reset link.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            {message && <div className="text-sm text-gray-700">{message}</div>}

            <Button type="submit" disabled={loading} className="w-full">{loading ? 'Sending...' : 'Send reset'}</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
