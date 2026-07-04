import { NextRequest } from "next/server";
import {
  requireAuth,
  successResponse,
  errorResponse,
  supabase,
  getPaginationParams,
  recordActivity,
  sendNotification,
} from "@/lib/api-utils";

// GET /api/messages/[conversationId] - Get messages in a conversation
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> },
) {
  const { conversationId } = await params;
  const authResult = await requireAuth(request);
  if (authResult instanceof Response) return authResult;

  const { userId } = authResult;
  const { pageSize, offset } = getPaginationParams(request);

  try {
    // Verify user is participant and load conversation details
    const { data: conversationDetails, error: convError } = await supabase
      .from("conversations")
      .select(
        `id, participant_1_id, participant_2_id, participant_1:participant_1_id(id, first_name, last_name, avatar_url), participant_2:participant_2_id(id, first_name, last_name, avatar_url)`
      )
      .eq("id", conversationId)
      .single();

    if (convError || !conversationDetails) {
      return errorResponse("Conversation not found", 404);
    }

    if (
      conversationDetails.participant_1_id !== userId &&
      conversationDetails.participant_2_id !== userId
    ) {
      return errorResponse("Unauthorized", 403);
    }

    // Get messages
    const {
      data: messages,
      error: messagesError,
      count,
    } = await supabase
      .from("messages")
      .select("*, sender:sender_id(id, first_name, last_name, avatar_url)", {
        count: "exact",
      })
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: false })
      .range(offset, offset + pageSize - 1);

    if (messagesError) throw messagesError;

    const otherParticipant =
      conversationDetails.participant_1_id === userId
        ? conversationDetails.participant_2
        : conversationDetails.participant_1;
    const conversation = {
      id: conversationDetails.id,
      participant_1_id: conversationDetails.participant_1_id,
      participant_2_id: conversationDetails.participant_2_id,
      otherParticipant,
    };

    return successResponse({
      conversation,
      messages: messages?.reverse(),
      total: count,
      page: Math.floor(offset / pageSize) + 1,
      pageSize,
    });
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}

// POST /api/messages/[conversationId] - Send a message
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> },
) {
  const { conversationId } = await params;
  const authResult = await requireAuth(request);
  if (authResult instanceof Response) return authResult;

  const { userId } = authResult;
  const contentType = request.headers.get("content-type") || "";
  let content = "";
  let attachment: File | null = null;

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    content = String(formData.get("content") || "");
    const attachmentEntry = formData.get("attachment");
    attachment = attachmentEntry instanceof File ? attachmentEntry : null;
  } else {
    const body = await request.json();
    content = String(body.content || "");
  }

  if (!content.trim() && !attachment) {
    return errorResponse("Message content or attachment is required", 400);
  }

  try {
    // Verify user is participant
    const { data: conversation } = await supabase
      .from("conversations")
      .select("participant_1_id, participant_2_id")
      .eq("id", conversationId)
      .single();

    if (!conversation) {
      return errorResponse("Conversation not found", 404);
    }

    if (
      conversation.participant_1_id !== userId &&
      conversation.participant_2_id !== userId
    ) {
      return errorResponse("Unauthorized", 403);
    }

    // Insert message and include sender metadata
    const { data: message, error: insertError } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        sender_id: userId,
        content: content.trim(),
      })
      .select("*, sender:sender_id(id, first_name, last_name, avatar_url)")
      .single();

    if (insertError) throw insertError;

    // Update conversation timestamp
    await supabase
      .from("conversations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", conversationId);

    // Record activity
    await recordActivity(userId, "message_sent", 2);

    // Send notification to other participant
    const otherUserId =
      conversation.participant_1_id === userId
        ? conversation.participant_2_id
        : conversation.participant_1_id;

    const { data: sender } = await supabase
      .from("user_profiles")
      .select("first_name, last_name")
      .eq("id", userId)
      .single();

    const senderName = sender
      ? `${sender.first_name} ${sender.last_name}`
      : "Someone";

    await sendNotification(
      otherUserId,
      "message",
      `New message from ${senderName}`,
      content.substring(0, 100),
      userId,
      `/messages/${conversationId}`,
    );

    return successResponse(message, 201);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
