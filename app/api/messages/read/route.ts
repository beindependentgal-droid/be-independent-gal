import { NextRequest } from "next/server";
import { requireAuth, supabase } from "@/lib/api-utils";
import { DEFAULT_CONVERSATION_ID } from "@/lib/messages-demo";

const isRecoverableReadError = (message: string) =>
  /permission denied|relation .* does not exist|table .* does not exist|does not exist|not found/i.test(
    message,
  );

export async function PATCH(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!("userId" in auth)) return auth;
  const userId = auth.userId;

  const body = await request.json().catch(() => ({}));
  const { conversationId, messageIds } = body;
  if (!conversationId || !Array.isArray(messageIds))
    return new Response(JSON.stringify({ error: "Invalid payload" }), {
      status: 400,
    });
  if (
    conversationId === DEFAULT_CONVERSATION_ID ||
    conversationId.startsWith("demo-")
  ) {
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  }

  const inserts = messageIds.map((mid: string) => ({
    message_id: mid,
    profile_id: userId,
    read_at: new Date().toISOString(),
  }));
  try {
    const { error } = await supabase.from("message_reads").insert(inserts);
    if (error) {
      const message = error.message || "Failed to mark messages as read";
      if (isRecoverableReadError(message)) {
        return new Response(JSON.stringify({ ok: true, fallback: true }), {
          status: 200,
        });
      }
      return new Response(JSON.stringify({ error: message }), {
        status: 500,
      });
    }

    // notify senders about read status (optional)
    // clients subscribed to message_reads will receive realtime updates

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    if (isRecoverableReadError(message)) {
      return new Response(JSON.stringify({ ok: true, fallback: true }), {
        status: 200,
      });
    }
    return new Response(
      JSON.stringify({ error: message || "Failed to mark messages as read" }),
      {
        status: 500,
      },
    );
  }
}
