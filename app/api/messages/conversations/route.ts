import { NextRequest } from "next/server";
import { requireAuth, successResponse, errorResponse, supabase, getPaginationParams, recordActivity } from '@/lib/api-utils'

// GET /api/messages/conversations - List user's conversations
export async function GET(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (authResult instanceof Response) return authResult;

  const { userId } = authResult;
  const { pageSize, offset } = getPaginationParams(request);

  try {
    // Get conversations where user is a participant
    const {
      data: conversations,
      error,
      count,
    } = await supabase
      .from("conversations")
      .select(
        `
        *,
        messages!inner(id, content, sender_id, created_at, read_at),
        participant_1:participant_1_id(id, first_name, last_name, avatar_url),
        participant_2:participant_2_id(id, first_name, last_name, avatar_url)
      `,
        { count: "exact" },
      )
      .or(`participant_1_id.eq.${userId},participant_2_id.eq.${userId}`)
      .order("updated_at", { ascending: false })
      .range(offset, offset + pageSize - 1);

    if (error) throw error;

    // Get the other participant for each conversation
    const formattedConversations = (conversations || []).map((conv: Record<string, unknown>) => {
      const otherParticipant = conv.participant_1_id === userId ? conv.participant_2 : conv.participant_1
      const lastMessage = (conv.messages || [])[0]

      return {
        id: conv.id,
        otherParticipant,
        lastMessage,
        updatedAt: conv.updated_at,
        createdAt: conv.created_at,
      }
    })

    return successResponse({
      conversations: formattedConversations,
      total: count,
      page: Math.floor(offset / pageSize) + 1,
      pageSize,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    return errorResponse(message, 500)
  }
}

// POST /api/messages/conversations - Create or get conversation with a user
export async function POST(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (authResult instanceof Response) return authResult;

  const { userId } = authResult;
  const { otherUserId } = await request.json();

  if (!otherUserId) {
    return errorResponse("otherUserId is required", 400);
  }

  if (userId === otherUserId) {
    return errorResponse("Cannot create conversation with yourself", 400);
  }

  try {
    // Ensure consistent ordering of participants
    const [p1, p2] =
      userId < otherUserId ? [userId, otherUserId] : [otherUserId, userId];

    // Try to find existing conversation
    let { data: conversation } = await supabase
      .from("conversations")
      .select("*")
      .eq("participant_1_id", p1)
      .eq("participant_2_id", p2)
      .single();

    // Create if doesn't exist
    if (!conversation) {
      const { data: newConv, error: createError } = await supabase
        .from("conversations")
        .insert({
          participant_1_id: p1,
          participant_2_id: p2,
        })
        .select()
        .single();

      if (createError) throw createError;
      conversation = newConv;

      // Record activity
      await recordActivity(userId, "conversation_started", 5);
    }

    return successResponse(conversation, 201);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    return errorResponse(message, 500)
  }
}
