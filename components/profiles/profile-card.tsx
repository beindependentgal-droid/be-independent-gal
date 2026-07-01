'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Badge, Star, MessageCircle } from 'lucide-react';

interface Badge {
  id: string;
  name: string;
  icon_url: string;
  color: string;
}

interface ProfileCardProps {
  userId: string;
  name: string;
  profession?: string;
  city?: string;
  avatar?: string;
  level?: string;
  points?: number;
  bio?: string;
  badges?: Badge[];
  isMentor?: boolean;
}

export function ProfileCard({
  userId,
  name,
  profession,
  city,
  avatar,
  level,
  points,
  bio,
  badges,
  isMentor,
}: ProfileCardProps) {
  return (
    <Link href={`/profile/${userId}`}>
      <div className="group h-full rounded-lg border border-gray-200 bg-white p-4 transition-all hover:shadow-md hover:border-brand">
        {/* Header with avatar and info */}
        <div className="flex gap-3 mb-3">
          <div className="relative h-12 w-12 flex-shrink-0">
            {avatar ? (
              <Image
                src={avatar}
                alt={name}
                fill
                className="rounded-full object-cover"
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-brand to-accent" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate text-gray-900">
              {name}
            </h3>
            {profession && (
              <p className="text-xs text-gray-500 truncate">{profession}</p>
            )}
            {city && (
              <p className="text-xs text-gray-400">{city}</p>
            )}
          </div>
        </div>

        {/* Bio */}
        {bio && (
          <p className="text-xs text-gray-600 line-clamp-2 mb-3">
            {bio}
          </p>
        )}

        {/* Level and points */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {level && (
            <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-brand/10 text-brand">
              {level}
            </span>
          )}
          {points !== undefined && (
            <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-amber-50 text-amber-700">
              ⭐ {points} pts
            </span>
          )}
          {isMentor && (
            <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-green-50 text-green-700">
              🎓 Mentor
            </span>
          )}
        </div>

        {/* Badges */}
        {badges && badges.length > 0 && (
          <div className="flex gap-1 mb-3 flex-wrap">
            {badges.slice(0, 3).map((badge) => (
              <div
                key={badge.id}
                className="text-lg"
                title={badge.name}
              >
                {badge.icon_url}
              </div>
            ))}
            {badges.length > 3 && (
              <span className="text-xs text-gray-500">+{badges.length - 3}</span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t border-gray-100">
          <button className="flex-1 flex items-center justify-center gap-1 text-xs font-medium text-brand hover:bg-brand/5 py-2 rounded-md transition-colors">
            <MessageCircle className="h-3 w-3" />
            Message
          </button>
        </div>
      </div>
    </Link>
  );
}
