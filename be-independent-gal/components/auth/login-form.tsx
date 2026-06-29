'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LoginFormProps {
  redirect?: string
  googleReturn?: boolean
}

export default function LoginForm({ redirect = '/community', googleReturn = false }: LoginFormProps) {
  const router = useRouter();
  const { signIn, signInWithProvider } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      router.replace(redirect);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setLoading(true);

    try {
      const nextPath = `/auth/login?redirect=${encodeURIComponent(redirect)}&from=google`;
      await signInWithProvider('google', nextPath);
    } catch (err: any) {
      setError(err?.message || 'Google sign-in could not be started. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          disabled={loading}
        />
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          disabled={loading}
        />
      </div>

      {googleReturn && (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm text-primary">
          Continuing Google sign-in. Complete your email and password to finish logging in.
        </div>
      )}

      {error && <div className="text-sm text-red-600">{error}</div>}

      <Button
        type="submit"
        disabled={loading}
        className="w-full rounded-full"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>

      <div className="mt-4 space-y-2">
        <Button type="button" variant="secondary" onClick={handleGoogle} className="w-full rounded-full">
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </Button>
      </div>
    </form>
  );
}
