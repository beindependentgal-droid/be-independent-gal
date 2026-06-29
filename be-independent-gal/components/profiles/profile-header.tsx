'use client';

import Image from 'next/image';
import { Badge, Copy, Share2, Settings } from 'lucide-react';

interface Badge {
  id: string;
  name: string;
  icon_url: string;
  color: string;
}

interface ProfileHeaderProps {
  name: string;
  profession?: string;
  city?: string;
  avatar?: string;
  level?: string;
  points?: number;
  bio?: string;
  badges?: Badge[];
  isMentor?: boolean;
  skills?: string[];
  isOwnProfile?: boolean;
  onSettingsClick?: () => void;
}

export function ProfileHeader({
  name,
  profession,
  city,
  avatar,
  level,
  points,
  bio,
  badges,
  isMentor,
  skills,
  isOwnProfile,
  onSettingsClick,
}: ProfileHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-brand/10 to-accent/10 rounded-lg p-6 md:p-8 mb-6">
      <div className="flex gap-6 mb-6">
        {/* Avatar */}
        <div className="relative h-24 w-24 md:h-32 md:w-32 flex-shrink-0">
          {avatar ? (
            <Image
              src={avatar}
              alt={name}
              fill
              className="rounded-full object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <div className="h-full w-full rounded-full bg-gradient-to-br from-brand to-accent border-4 border-white shadow-lg" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                {name}
              </h1>
              {profession && (
                <p className="text-lg text-gray-600 mt-1">{profession}</p>
              )}
            </div>
            {isOwnProfile && (
              <button
                onClick={onSettingsClick}
                className="p-2 rounded-lg hover:bg-white/50 transition-colors"
                title="Edit profile"
              >
                <Settings className="h-6 w-6 text-gray-700" />
              </button>
            )}
          </div>

          {city && (
            <p className="text-gray-600 mb-3">📍 {city}</p>
          )}

          {/* Stats */}
          <div className="flex gap-6 mb-4">
            {level && (
              <div>
                <p className="text-sm text-gray-600">Level</p>
                <p className="font-semibold text-lg">{level}</p>
              </div>
            )}
            {points !== undefined && (
              <div>
                <p className="text-sm text-gray-600">Points</p>
                <p className="font-semibold text-lg">⭐ {points}</p>
              </div>
            )}
          </div>

          {/* Badges */}
          {badges && badges.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {badges.slice(0, 5).map((badge) => (
                <div
                  key={badge.id}
                  className="text-2xl"
                  title={badge.name}
                >
                  {badge.icon_url}
                </div>
              ))}
              {badges.length > 5 && (
                <span className="text-sm text-gray-500 pt-1">+{badges.length - 5} more</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bio */}
      {bio && (
        <p className="text-gray-700 mb-4">
          {bio}
        </p>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">Skills</p>
          <div className="flex gap-2 flex-wrap">
            {skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 rounded-full bg-white/60 text-sm text-gray-700"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Mentor badge */}
      {isMentor && (
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50">
          <span className="text-lg">🎓</span>
          <span className="font-medium text-green-900">Certified Mentor</span>
        </div>
      )}
    </div>
  );
}
