import { NextRequest } from "next/server";
import { requireAuth, supabase, getPaginationParams } from "@/lib/api-utils";
import { userIsMember } from "@/lib/messages";
import {
  DEFAULT_CONVERSATION_ID,
  getDemoConversationMessages,
} from "@/lib/messages-demo";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> },
) {
  const { conversationId } = await params;
  const auth = await requireAuth(request);
  if (!("userId" in auth)) {
    if (
      conversationId === DEFAULT_CONVERSATION_ID ||
      conversationId.startsWith("demo-")
    ) {
      const demoMessages = getDemoConversationMessages(conversationId);
      return new Response(
        JSON.stringify({
          messages: demoMessages.map((message) => ({
            ...message,
            reactions: message.reactions || [],
            read: true,
          })),
        }),
        { status: 200 },
      );
    }
    return auth;
  }
  const userId = auth.userId;

  const isMember = await userIsMember(conversationId, userId);
  if (!isMember)
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
    });

  const { pageSize } = getPaginationParams(request);
  const url = new URL(request.url);
  const cursor = url.searchParams.get("cursor");

  let query = supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .eq("deleted", false)
    .order("created_at", { ascending: false })
    .limit(pageSize);
  if (cursor) query = query.lt("created_at", cursor);

  const { data: messages, error } = await query;
  if (error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });

  const messageIds = (messages || []).map(
    (m: Record<string, unknown>) => m.id as string,
  );
  const { data: reactions } = await supabase
    .from("message_reactions")
    .select("*")
    .in("message_id", messageIds);
  const { data: reads } = await supabase
    .from("message_reads")
    .select("*")
    .in("message_id", messageIds)
    .eq("profile_id", userId);

  const reactionMap: Record<string, Record<string, unknown>[]> = {};
  (reactions || []).forEach((r: Record<string, unknown>) => {
    const mid = r.message_id as string;
    reactionMap[mid] = reactionMap[mid] || [];
    reactionMap[mid].push(r);
  });

  const readSet = new Set(
    (reads || []).map((r: Record<string, unknown>) => r.message_id as string),
  );

  const result = (messages || []).map((m: Record<string, unknown>) => ({
    id: m.id,
    sender_id: m.sender_id,
    body: m.body,
    data: m.data,
    created_at: m.created_at,
    edited: m.edited,
    deleted: m.deleted,
    reactions: reactionMap[m.id as string] || [],
    read: readSet.has(m.id as string),
  }));

  return new Response(JSON.stringify({ messages: result }), { status: 200 });
}
