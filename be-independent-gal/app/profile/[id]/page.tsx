'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ProfileHeader } from '@/components/profiles/profile-header';
import { ActivityFeed } from '@/components/profiles/activity-feed';
import { MessageCircle, Plus } from 'lucide-react';

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  profession?: string;
  city?: string;
  avatar_url?: string;
  member_level?: string;
  points?: number;
  user_profile_extended?: {
    bio: string;
    skills: string[];
    interests: string[];
    mentoring_areas: string[];
  };
  badges?: any[];
}

interface Activity {
  id: string;
  type: string;
  title: string;
  points: number;
  created_at: string;
}

export default function ProfilePage() {
  const params = useParams();
  const profileId = params.id as string;
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('sb-auth-token');
        
        if (!token) {
          throw new Error('Not authenticated');
        }

        const res = await fetch(`/api/profiles/${profileId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to load profile');

        const profileData = await res.json();
        setProfile(profileData);

        // Fetch activities
        const activitiesRes = await fetch(`/api/profiles/${profileId}/activities`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (activitiesRes.ok) {
          const activitiesData = await activitiesRes.json();
          setActivities(activitiesData.activities || []);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (profileId) {
      fetchProfile();
    }
  }, [profileId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-64 bg-gray-200 rounded-lg" />
            <div className="h-96 bg-gray-200 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Profile Not Found
            </h1>
            <p className="text-gray-600">{error || 'Unable to load profile'}</p>
          </div>
        </div>
      </div>
    );
  }

  const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Profile Header */}
        <ProfileHeader
          name={fullName}
          profession={profile.profession}
          city={profile.city}
          avatar={profile.avatar_url}
          level={profile.member_level}
          points={profile.points}
          bio={profile.user_profile_extended?.bio}
          skills={profile.user_profile_extended?.skills}
          badges={profile.badges}
        />

        {/* Content Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* About Section */}
            {(profile.user_profile_extended?.interests ||
              profile.user_profile_extended?.mentoring_areas) && (
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
                
                {profile.user_profile_extended?.interests &&
                  profile.user_profile_extended.interests.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Interests</p>
                      <div className="flex flex-wrap gap-2">
                        {profile.user_profile_extended.interests.map((interest) => (
                          <span
                            key={interest}
                            className="px-3 py-1 rounded-full bg-brand/10 text-brand text-sm"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                {profile.user_profile_extended?.mentoring_areas &&
                  profile.user_profile_extended.mentoring_areas.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Mentoring In</p>
                      <div className="flex flex-wrap gap-2">
                        {profile.user_profile_extended.mentoring_areas.map((area) => (
                          <span
                            key={area}
                            className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm"
                          >
                            🎓 {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            )}

            {/* Activity Feed */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
              <ActivityFeed activities={activities} isLoading={false} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Action Buttons */}
            <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-2">
              <button className="w-full flex items-center justify-center gap-2 bg-brand text-white py-2 px-4 rounded-lg hover:bg-brand/90 transition-colors font-medium">
                <MessageCircle className="h-4 w-4" />
                Message
              </button>
              <button className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                <Plus className="h-4 w-4" />
                Request Mentorship
              </button>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Member Since</p>
                <p className="font-semibold text-gray-900">June 2024</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Points</p>
                <p className="font-semibold text-amber-600 text-lg">
                  ⭐ {profile.points || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
