'use client';

import { Heart, MessageSquare, TrendingUp, Zap, Book } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Activity {
  id: string;
  type: string;
  title: string;
  description?: string;
  points: number;
  timestamp: string;
  icon?: string;
}

interface ActivityFeedProps {
  activities: Activity[];
  isLoading?: boolean;
}

const activityIcons: Record<string, any> = {
  post: TrendingUp,
  comment: MessageSquare,
  like: Heart,
  challenge: Zap,
  article: Book,
  message: MessageSquare,
  event_attended: TrendingUp,
};

const activityColors: Record<string, string> = {
  post: 'bg-blue-50 text-blue-700',
  comment: 'bg-purple-50 text-purple-700',
  like: 'bg-red-50 text-red-700',
  challenge: 'bg-yellow-50 text-yellow-700',
  article: 'bg-green-50 text-green-700',
  message: 'bg-secondary- text-secondary-',
  event_attended: 'bg-indigo-50 text-indigo-700',
};

export function ActivityFeed({ activities, isLoading }: ActivityFeedProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-16 bg-gray-200 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No activity yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => {
        const Icon = activityIcons[activity.type] || TrendingUp;
        const colorClass = activityColors[activity.type] || 'bg-gray-50 text-gray-700';

        return (
          <div
            key={activity.id}
            className="flex gap-4 p-4 rounded-lg border border-gray-200 hover:border-brand/50 transition-colors"
          >
            <div className={`${colorClass} rounded-lg p-2 flex-shrink-0`}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 text-sm">
                {activity.title}
              </p>
              {activity.description && (
                <p className="text-sm text-gray-600 line-clamp-1">
                  {activity.description}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {formatDistanceToNow(new Date(activity.timestamp), {
                  addSuffix: true,
                })}
              </p>
            </div>
            {activity.points > 0 && (
              <div className="text-right flex-shrink-0">
                <p className="font-semibold text-amber-600">
                  +{activity.points} pts
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
