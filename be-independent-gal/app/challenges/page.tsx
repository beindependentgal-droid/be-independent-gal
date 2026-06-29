import { Metadata } from 'next';
import { getActiveChallenges } from '@/app/actions/gamification-actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Challenges | Be Independent Gal',
  description: 'Take on challenges and earn points',
};

export default async function ChallengesPage() {
  const challenges = await getActiveChallenges();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Community Challenges</h1>
          <p className="text-xl text-gray-600">
            Earn points, gain badges, and level up with challenges
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {challenges.map((challenge) => {
            const daysLeft = Math.ceil(
              (new Date(challenge.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
            );

            return (
              <div
                key={challenge.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  {challenge.title}
                </h2>
                {challenge.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {challenge.description}
                  </p>
                )}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">Difficulty</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getDifficultyColor(
                        challenge.difficulty
                      )}`}
                    >
                      {challenge.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">Points</span>
                    <span className="text-lg font-bold text-purple-600">
                      +{challenge.points_reward}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">Time Left</span>
                    <span className="text-sm text-gray-600">
                      {daysLeft} {daysLeft === 1 ? 'day' : 'days'}
                    </span>
                  </div>
                </div>
                {challenge.circle_name && (
                  <Badge variant="secondary" className="mb-4">
                    {challenge.circle_name}
                  </Badge>
                )}
                <Button className="w-full">Join Challenge</Button>
              </div>
            );
          })}
        </div>

        {challenges.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No active challenges. Check back soon!</p>
          </div>
        )}
      </div>
    </main>
  );
}
