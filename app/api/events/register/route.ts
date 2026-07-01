import { NextRequest } from "next/server";
import {
  requireAuth,
  successResponse,
  errorResponse,
  supabase,
  recordActivity,
  sendNotification,
} from "@/lib/api-utils";

// POST /api/events/register - Register for an event
export async function POST(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (authResult instanceof Response) return authResult;

  const { userId } = authResult;
  const { eventId } = await request.json();

  if (!eventId) {
    return errorResponse("eventId is required", 400);
  }

  try {
    // Get event details
    const { data: event } = await supabase
      .from("events")
      .select("*")
      .eq("id", eventId)
      .single();

    if (!event) {
      return errorResponse("Event not found", 404);
    }

    // Check capacity
    const { count: registrationCount } = await supabase
      .from("event_registrations")
      .select("*", { count: "exact" })
      .eq("event_id", eventId)
      .eq("status", "registered");

    if (event.capacity && registrationCount >= event.capacity) {
      return errorResponse("Event is at full capacity", 400);
    }

    // Create registration
    const { data: registration, error } = await supabase
      .from("event_registrations")
      .insert({
        event_id: eventId,
        user_id: userId,
        status: "registered",
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return errorResponse("Already registered for this event", 400);
      }
      throw error;
    }

    // Record activity
    await recordActivity(userId, "event_registered", 10, event.circle_id);

    // Create reminder for event
    const eventTime = new Date(event.start_time);
    const reminderTime = new Date(eventTime.getTime() - 24 * 60 * 60 * 1000); // 24 hours before

    await supabase.from("event_reminders").insert({
      event_registration_id: registration.id,
      scheduled_for: reminderTime.toISOString(),
    });

    // Notify organizer
    const { data: organizer } = await supabase
      .from("user_profiles")
      .select("first_name, last_name")
      .eq("id", event.organizer_id)
      .single();

    const { data: user } = await supabase
      .from("user_profiles")
      .select("first_name, last_name")
      .eq("id", userId)
      .single();

    const userName = user ? `${user.first_name} ${user.last_name}` : "A member";

    await sendNotification(
      event.organizer_id,
      "event_registration",
      `${userName} registered for ${event.title}`,
      undefined,
      userId,
    );

    return successResponse(registration, 201);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
