'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Loader, Trophy, Medal } from 'lucide-react';

interface LeaderboardEntry {
  id: string;
  rank: number;
  total_points: number;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string;
    member_level?: string;
  };
}

export default function LeaderboardPage() {
  const router = useRouter();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<'all_time' | 'month' | 'week'>('all_time');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('sb-auth-token');
        
        if (!token) {
          router.push('/login');
          return;
        }

        const res = await fetch(`/api/gamification/leaderboard?period=${period}&pageSize=50`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Failed to load leaderboard');

        const data = await res.json();
        setLeaderboard(data.leaderboard || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [period, router]);

  const getMedalIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="h-10 w-10 text-amber-500" />
            <h1 className="text-4xl font-bold text-gray-900">Leaderboard</h1>
          </div>
          <p className="text-gray-600">
            See who&apos;s leading the community with their contributions
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex gap-2 mb-6 justify-center">
          {(['all_time', 'month', 'week'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                period === p
                  ? 'bg-brand text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {p === 'all_time' ? 'All Time' : p === 'month' ? 'This Month' : 'This Week'}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 rounded-lg bg-red-50 text-red-700 mb-6">
            {error}
          </div>
        )}

        {/* Loading */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="h-8 w-8 animate-spin text-brand" />
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-600">No entries yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Top 3 Special Display */}
            {leaderboard.slice(0, 3).map((entry, idx) => (
              <div
                key={entry.id}
                className={`flex items-center gap-4 p-6 rounded-lg border-2 ${
                  idx === 0
                    ? 'bg-amber-50 border-amber-200'
                    : idx === 1
                    ? 'bg-gray-100 border-gray-300'
                    : 'bg-orange-50 border-orange-200'
                }`}
              >
                <div className="text-4xl font-bold min-w-fit">
                  {getMedalIcon(entry.rank)}
                </div>
                <div className="relative h-16 w-16 flex-shrink-0">
                  {entry.user.avatar_url ? (
                    <Image
                      src={entry.user.avatar_url}
                      alt={entry.user.first_name}
                      fill
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-brand to-accent" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-lg text-gray-900">
                    {entry.user.first_name} {entry.user.last_name}
                  </p>
                  {entry.user.member_level && (
                    <p className="text-sm text-gray-600">{entry.user.member_level}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-amber-600">
                    {entry.total_points}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">points</p>
                </div>
              </div>
            ))}

            {/* Rest of Leaderboard */}
            {leaderboard.length > 3 && (
              <div className="mt-8">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 px-4">
                  Rankings 4-{leaderboard.length}
                </h3>
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  {leaderboard.slice(3).map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-center gap-4 p-4 border-t border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <div className="text-lg font-bold text-gray-500 min-w-fit w-8">
                        #{entry.rank}
                      </div>
                      <div className="relative h-10 w-10 flex-shrink-0">
                        {entry.user.avatar_url ? (
                          <Image
                            src={entry.user.avatar_url}
                            alt={entry.user.first_name}
                            fill
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand to-accent" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {entry.user.first_name} {entry.user.last_name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-amber-600">
                          ⭐ {entry.total_points}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
