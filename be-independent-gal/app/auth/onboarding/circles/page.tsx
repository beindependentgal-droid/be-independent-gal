"use client";
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase-client';

const CIRCLES = [
  {
    id: 'learn',
    name: 'Learn',
    description: 'Expand your knowledge and skills',
    color: 'bg-blue-100 border-blue-300',
  },
  {
    id: 'connect',
    name: 'Connect',
    description: 'Build meaningful relationships',
    color: 'bg-purple-100 border-purple-300',
  },
  {
    id: 'earn',
    name: 'Earn',
    description: 'Grow your income and financial wellness',
    color: 'bg-green-100 border-green-300',
  },
  {
    id: 'thrive',
    name: 'Thrive',
    description: 'Achieve holistic well-being',
    color: 'bg-orange-100 border-orange-300',
  },
];

export default function CirclesOnboardingPage() {
  const router = useRouter();
  const [selectedCircles, setSelectedCircles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleCircle = (circleId: string) => {
    setSelectedCircles((prev) =>
      prev.includes(circleId)
        ? prev.filter((id) => id !== circleId)
        : [...prev, circleId]
    );
  };

  const handleComplete = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (selectedCircles.length === 0) {
      setError('Please select at least one circle');
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

      const response = await fetch('/api/auth/circles', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          selected_circles: selectedCircles,
        }),
      });

      if (!response.ok) throw new Error('Failed to save circles');

      // Redirect to home
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Failed to complete onboarding');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Select Your Circles</h1>
            <p className="text-gray-600">Step 3 of 3 - Choose circles to join</p>
          </div>

          <form onSubmit={handleComplete} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CIRCLES.map((circle) => (
                <button
                  key={circle.id}
                  type="button"
                  onClick={() => toggleCircle(circle.id)}
                  className={`p-4 border-2 rounded-lg transition-all text-left ${
                    selectedCircles.includes(circle.id)
                      ? `${circle.color} border-2`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  disabled={loading}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{circle.name}</h3>
                      <p className="text-sm text-gray-600">{circle.description}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedCircles.includes(circle.id)}
                      onChange={() => {}}
                      className="w-5 h-5 mt-1"
                    />
                  </div>
                </button>
              ))}
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}

            <Button
              type="submit"
              disabled={loading || selectedCircles.length === 0}
              className="w-full"
            >
              {loading ? 'Completing...' : 'Complete Onboarding'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
