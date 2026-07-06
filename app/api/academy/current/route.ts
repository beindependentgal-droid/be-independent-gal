import { NextResponse } from "next/server";
import { createServerSupabase, getCurrentUserId } from "@/lib/supabase-server";
import { academyCourses } from "@/lib/academy-courses";

function getTrackFromCircle(circle: string) {
  const normalized = circle.toLowerCase();

  if (normalized.includes("learn")) return "Financial Independence";
  if (normalized.includes("earn")) return "Entrepreneurship";
  if (normalized.includes("connect")) return "Career Growth";
  if (normalized.includes("thrive")) return "Wellbeing & Mindset";

  return undefined;
}

export async function GET() {
  const supabase = await createServerSupabase();
  const userId = await getCurrentUserId();

  let selectedCourse =
    academyCourses.find((course) => course.featured) ?? academyCourses[0];
  let progress = 0.05;

  if (userId) {
    const { data: profile, error } = await supabase
      .from("user_profiles")
      .select("total_points, circles")
      .eq("id", userId)
      .single();

    if (!error && profile) {
      const points = Number(profile.total_points || 0);
      progress = Math.min(0.95, Math.max(0.1, points / 120));

      if (Array.isArray(profile.circles) && profile.circles.length > 0) {
        const mappedTrack = getTrackFromCircle(profile.circles[0]);
        const candidate = academyCourses.find(
          (course) => course.track === mappedTrack,
        );
        if (candidate) {
          selectedCourse = candidate;
        }
      }
    }
  }

  return NextResponse.json({
    id: selectedCourse.slug,
    title: selectedCourse.title,
    progress,
    description: selectedCourse.description,
    link: `/academy/${selectedCourse.slug}`,
  });
}
