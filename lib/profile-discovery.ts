import { supabase } from "./api-utils";

type ProfileCandidate = {
  id: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  profession?: string;
  city?: string;
  location?: string;
  headline?: string;
  bio?: string;
  skills?: string[];
  interests?: string[];
  member_level?: string;
  points?: number;
  created_at?: string;
  is_mentor?: boolean;
  circles?: string[];
};

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter(
      (item): item is string =>
        typeof item === "string" && item.trim().length > 0,
    );
  }

  if (typeof value === "string" && value.trim()) {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeProfileRow(
  row: Record<string, unknown>,
): ProfileCandidate | null {
  const id =
    (row.id as string | undefined) || (row.user_id as string | undefined);
  if (!id) return null;

  const fullName = (row.full_name as string | undefined) || "";
  const [firstName, ...rest] = fullName.trim().split(/\s+/);
  const lastName = rest.join(" ");

  return {
    id,
    first_name: (
      (row.first_name as string | undefined) ||
      firstName ||
      ""
    ).trim(),
    last_name: ((row.last_name as string | undefined) || lastName || "").trim(),
    avatar_url: (row.avatar_url as string | undefined) || "",
    profession:
      (row.profession as string | undefined) ||
      (row.job_title as string | undefined) ||
      "",
    city:
      (row.city as string | undefined) ||
      (row.location as string | undefined) ||
      "",
    location:
      (row.location as string | undefined) ||
      (row.city as string | undefined) ||
      "",
    headline:
      (row.headline as string | undefined) ||
      (row.bio as string | undefined) ||
      "",
    bio: (row.bio as string | undefined) || "",
    skills: toStringArray(row.skills || row.interests || []),
    interests: toStringArray(row.interests || row.skills || []),
    member_level: (row.member_level as string | undefined) || "New Member",
    points: typeof row.points === "number" ? row.points : 0,
    created_at: (row.created_at as string | undefined) || "",
    is_mentor: Boolean(row.is_mentor),
    circles: toStringArray(row.circles),
  };
}

function matchesFilters(
  candidate: ProfileCandidate,
  filters: {
    query?: string;
    skill?: string;
    circle?: string;
    isMentor?: boolean;
  },
) {
  const normalizedQuery = filters.query?.trim().toLowerCase() || "";
  if (normalizedQuery) {
    const haystack = [
      candidate.first_name,
      candidate.last_name,
      candidate.profession,
      candidate.city,
      candidate.headline,
      candidate.bio,
      ...(candidate.skills || []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    if (!haystack.includes(normalizedQuery)) return false;
  }

  if (filters.skill) {
    const skill = filters.skill.toLowerCase();
    if (!(candidate.skills || []).some((item) => item.toLowerCase() === skill))
      return false;
  }

  if (filters.circle) {
    const circle = filters.circle.toLowerCase();
    if (
      !(candidate.circles || []).some((item) => item.toLowerCase() === circle)
    )
      return false;
  }

  if (filters.isMentor && !candidate.is_mentor) return false;

  return true;
}

export async function fetchDiscoverableProfiles(filters: {
  query?: string;
  skill?: string;
  circle?: string;
  isMentor?: boolean;
  pageSize: number;
  offset: number;
}) {
  const queries = [
    supabase
      .from("profiles")
      .select(
        "id,first_name,last_name,avatar_url,profession,city,member_level,points,bio,skills,created_at,is_mentor,circles",
      )
      .limit(1000),
    supabase
      .from("user_profiles")
      .select(
        "user_id,full_name,avatar_url,profession,city,member_level,points,bio,skills,created_at,is_mentor,circles",
      )
      .limit(1000),
  ];

  const results = await Promise.allSettled(queries);
  const merged: ProfileCandidate[] = [];
  const seen = new Set<string>();

  results.forEach((result) => {
    if (result.status !== "fulfilled") return;
    const { data } = result.value as { data: Record<string, unknown>[] | null };
    (data || []).forEach((row) => {
      const normalized = normalizeProfileRow(row);
      if (!normalized || seen.has(normalized.id)) return;
      seen.add(normalized.id);
      merged.push(normalized);
    });
  });

  const filtered = merged.filter((candidate) =>
    matchesFilters(candidate, filters),
  );
  filtered.sort(
    (left, right) =>
      Number(right.points || 0) - Number(left.points || 0) ||
      (right.created_at || "").localeCompare(left.created_at || ""),
  );

  return {
    members: filtered.slice(filters.offset, filters.offset + filters.pageSize),
    total: filtered.length,
  };
}

export async function fetchSuggestedProfiles(
  userId: string,
  pageSize: number,
  offset: number,
) {
  const results = await Promise.allSettled([
    supabase
      .from("profiles")
      .select(
        "id,first_name,last_name,avatar_url,profession,city,member_level,points,bio,skills,created_at",
      )
      .neq("id", userId)
      .limit(Math.max(pageSize * 4, 100)),
    supabase
      .from("user_profiles")
      .select(
        "user_id,full_name,avatar_url,profession,city,member_level,points,bio,skills,created_at",
      )
      .limit(Math.max(pageSize * 4, 100)),
  ]);

  const merged: ProfileCandidate[] = [];
  const seen = new Set<string>();

  results.forEach((result) => {
    if (result.status !== "fulfilled") return;
    const { data } = result.value as { data: Record<string, unknown>[] | null };
    (data || []).forEach((row) => {
      const normalized = normalizeProfileRow(row);
      if (!normalized || normalized.id === userId || seen.has(normalized.id))
        return;
      seen.add(normalized.id);
      merged.push(normalized);
    });
  });

  return merged.slice(offset, offset + pageSize);
}
