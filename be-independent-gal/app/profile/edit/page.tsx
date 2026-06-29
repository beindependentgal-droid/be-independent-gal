'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Loader } from 'lucide-react';

interface ProfileFormData {
  first_name: string;
  last_name: string;
  profession: string;
  city: string;
  bio: string;
  skills: string;
  interests: string;
  mentoring_areas: string;
  avatar_url: string;
}

export default function EditProfilePage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ProfileFormData>({
    first_name: '',
    last_name: '',
    profession: '',
    city: '',
    bio: '',
    skills: '',
    interests: '',
    mentoring_areas: '',
    avatar_url: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('sb-auth-token');
        if (!token) {
          router.push('/login');
          return;
        }

        const res = await fetch('/api/profiles', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Failed to load profile');

        const profile = await res.json();
        setFormData({
          first_name: profile.first_name || '',
          last_name: profile.last_name || '',
          profession: profile.profession || '',
          city: profile.city || '',
          bio: profile.user_profile_extended?.bio || '',
          skills: (profile.user_profile_extended?.skills || []).join(', '),
          interests: (profile.user_profile_extended?.interests || []).join(', '),
          mentoring_areas: (profile.user_profile_extended?.mentoring_areas || []).join(', '),
          avatar_url: profile.avatar_url || '',
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem('sb-auth-token');
      if (!token) throw new Error('Not authenticated');

      const updateData = {
        ...formData,
        skills: formData.skills.split(',').map((s) => s.trim()).filter(Boolean),
        interests: formData.interests.split(',').map((i) => i.trim()).filter(Boolean),
        mentoring_areas: formData.mentoring_areas.split(',').map((m) => m.trim()).filter(Boolean),
      };

      const res = await fetch('/api/profiles', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!res.ok) throw new Error('Failed to update profile');

      setSuccess(true);
      setTimeout(() => {
        router.push('/profile');
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container max-w-2xl mx-auto px-4">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-2xl mx-auto px-4">
        {/* Header */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ChevronLeft className="h-5 w-5" />
          Back
        </button>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Profile</h1>

          {error && (
            <div className="mb-4 p-4 rounded-lg bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 rounded-lg bg-green-50 text-green-700 text-sm">
              Profile updated successfully! Redirecting...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>
            </div>

            {/* Professional Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profession
                </label>
                <input
                  type="text"
                  name="profession"
                  value={formData.profession}
                  onChange={handleChange}
                  placeholder="e.g., Software Engineer"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g., New York, NY"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself..."
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>

            {/* Skills, Interests, Mentoring */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skills (comma-separated)
              </label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="e.g., Python, Leadership, Finance"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Interests (comma-separated)
              </label>
              <input
                type="text"
                name="interests"
                value={formData.interests}
                onChange={handleChange}
                placeholder="e.g., Startups, Tech, Fashion"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                I can mentor in (comma-separated)
              </label>
              <input
                type="text"
                name="mentoring_areas"
                value={formData.mentoring_areas}
                onChange={handleChange}
                placeholder="e.g., Career Development, Negotiation"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-6 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-2 rounded-lg bg-brand text-white font-medium hover:bg-brand/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving && <Loader className="h-4 w-4 animate-spin" />}
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
