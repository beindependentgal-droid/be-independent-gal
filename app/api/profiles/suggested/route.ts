import { NextRequest } from "next/server";
import {
  getUserIdFromRequest,
  successResponse,
  errorResponse,
  supabase,
  getPaginationParams,
} from "@/lib/api-utils";
import { fetchSuggestedProfiles } from "@/lib/profile-discovery";

const isRecoverableSuggestionError = (message: string) =>
  /permission denied|relation .* does not exist|table .* does not exist|does not exist|not found/i.test(
    message,
  );

// Enhanced suggestion engine: score candidates by shared interests, profession, city, circles and mutual connections
export async function GET(request: NextRequest) {
  const userId = await getUserIdFromRequest(request);
  const { pageSize, offset } = getPaginationParams(request);

  try {
    if (!userId)
      return successResponse({ members: [], total: 0, page: 1, pageSize });

    const profileTable = "user_profiles";
    const fallbackProfileTable = "profiles";

    const fetchProfiles = async (table: string) =>
      supabase
        .from(table)
        .select(
          "id, first_name, last_name, avatar_url, profession, bio, interests, location",
        )
        .neq("id", userId)
        .limit(Math.max(pageSize * 4, 100));

    // load current user from whichever profile table has the row
    const [
      { data: meData, error: meErr },
      { data: candidates, error: candErr },
    ] = await Promise.all([
      supabase.from(profileTable).select("*").eq("id", userId).maybeSingle(),
      fetchProfiles(profileTable),
    ]);

    const me: Record<string, unknown> =
      (meData as Record<string, unknown>) || {};

    let candidateRows = (candidates || []) as Record<string, unknown>[];
    if ((!candidateRows || candidateRows.length === 0) && !meErr) {
      const { data: fallbackCandidates } =
        await fetchProfiles(fallbackProfileTable);
      candidateRows = (fallbackCandidates || []) as Record<string, unknown>[];
    }

    if (meErr && !meData) {
      const { data: fallbackMeData } = await supabase
        .from(fallbackProfileTable)
        .select("*")
        .eq("id", userId)
        .maybeSingle();
      Object.assign(me, fallbackMeData || {});
    }

    if (candErr && !candidateRows.length) {
      const { data: fallbackCandidates } =
        await fetchProfiles(fallbackProfileTable);
      candidateRows = (fallbackCandidates || []) as Record<string, unknown>[];
    }

    const sharedCandidates = await fetchSuggestedProfiles(
      userId,
      pageSize,
      offset,
    );
    if (sharedCandidates.length) {
      candidateRows = sharedCandidates.map((member) => ({
        id: member.id,
        first_name: member.first_name,
        last_name: member.last_name,
        avatar_url: member.avatar_url,
        profession: member.profession,
        bio: member.bio,
        interests: member.interests,
        location: member.city,
      }));
    }

    // load connections and pending requests and blocked users to exclude
    const [
      { data: connections },
      { data: requestsFrom },
      { data: requestsTo },
      { data: blocked },
    ] = await Promise.all([
      supabase
        .from("connections")
        .select("requester,recipient,status")
        .or(`requester.eq.${userId},recipient.eq.${userId}`),
      supabase
        .from("connection_requests")
        .select("to_profile")
        .eq("from_profile", userId),
      supabase
        .from("connection_requests")
        .select("from_profile")
        .eq("to_profile", userId),
      supabase.from("blocked_users").select("blocked").eq("blocker", userId),
    ]);

    const connectedIds = new Set<string>();
    (connections || []).forEach((c: Record<string, unknown>) => {
      const status = c.status as string | undefined;
      const requester = c.requester as string | undefined;
      const recipient = c.recipient as string | undefined;
      if (status === "connected") {
        if (requester) connectedIds.add(requester);
        if (recipient) connectedIds.add(recipient);
      }
    });

    const requestedTo = new Set(
      (requestsFrom || []).map(
        (r: Record<string, unknown>) => r.to_profile as string,
      ),
    );
    const requestedFrom = new Set(
      (requestsTo || []).map(
        (r: Record<string, unknown>) => r.from_profile as string,
      ),
    );
    const blockedSet = new Set(
      (blocked || []).map((b: Record<string, unknown>) => b.blocked as string),
    );

    function scoreCandidate(candidate: Record<string, unknown>) {
      if (!candidate) return 0;
      const candidateId = candidate.id as string | undefined;
      if (!candidateId) return -1;
      if (connectedIds.has(candidateId)) return -1;
      if (requestedTo.has(candidateId) || requestedFrom.has(candidateId))
        return -1;
      if (blockedSet.has(candidateId)) return -1;

      let score = 0;
      // shared interests
      const myInterests = Array.isArray(me.interests)
        ? (me.interests as string[])
        : typeof me.interests === "string"
          ? (me.interests as string).split(",")
          : [];
      const theirInterests = Array.isArray(candidate.interests)
        ? (candidate.interests as string[])
        : typeof candidate.interests === "string"
          ? (candidate.interests as string).split(",")
          : [];
      const sharedInterests = myInterests.filter((i: string) =>
        theirInterests.includes(i),
      ).length;
      score += sharedInterests * 3;

      // same profession
      const myProf = me.profession as string | undefined;
      const theirProf = candidate.profession as string | undefined;
      if (myProf && theirProf && myProf === theirProf) score += 4;

      // same location
      const myLoc = me.location as string | undefined;
      const theirLoc = candidate.location as string | undefined;
      if (myLoc && theirLoc && myLoc === theirLoc) score += 2;

      // small boost for profile completeness
      if (candidate.avatar_url) score += 1;
      if (candidate.bio) score += 1;

      return score;
    }

    const scored = candidateRows
      .map((c: Record<string, unknown>) => ({
        candidate: c,
        score: scoreCandidate(c),
      }))
      .filter((s) => s.score >= 0);
    scored.sort((a, b) => b.score - a.score);

    let members = scored
      .slice(offset, offset + pageSize)
      .map((s) => s.candidate);
    if (!members.length && candidateRows.length) {
      members = candidateRows.slice(offset, offset + pageSize);
    }

    const total = Math.max(scored.length, candidateRows.length);
    return successResponse({
      members,
      total,
      page: Math.floor(offset / pageSize) + 1,
      pageSize,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    if (
      isRecoverableSuggestionError(message) ||
      /permission denied/i.test(message)
    ) {
      return successResponse({
        members: [],
        total: 0,
        page: 1,
        pageSize,
      });
    }
    return errorResponse(message || "Failed to load suggested members", 500);
  }
}
