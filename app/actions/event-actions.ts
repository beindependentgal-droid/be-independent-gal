"use server";

import { createClient } from "@supabase/supabase-js";
import { eventSchema, eventRegistrationSchema } from "@/lib/db-validators";
import type { Event, EventRegistration } from "@/lib/db-types";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  if (!url || !serviceRoleKey) {
    return null;
  }

  try {
    return createClient(url, serviceRoleKey, {
      auth: { persistSession: false },
    });
  } catch {
    return null;
  }
}

function isRecoverableReadError(error: { code?: string } | null | undefined) {
  return (
    error?.code === "PGRST205" ||
    error?.code === "PGRST116" ||
    error?.code === "42501"
  );
}

const supabase = new Proxy({} as any, {
  get: (_, prop) => {
    return (getSupabase() as any)[prop];
  },
});

export async function getUpcomingEvents(limit = 20) {
  const client = getSupabase();
  if (!client) {
    return [];
  }

  const { data, error } = await client
    .from("events")
    .select("*")
    .in("status", ["upcoming", "ongoing"])
    .order("start_date", { ascending: true, nullsFirst: false })
    .limit(limit);

  if (error) {
    if (error.code === "PGRST205" || error.code === "PGRST116") {
      return [];
    }
    throw error;
  }

  return data;
}

export async function getEventsByCircle(circleName: string, limit = 20) {
  const client = getSupabase();
  if (!client) {
    return [];
  }

  const { data, error } = await client
    .from("events")
    .select("*")
    .eq("circle_name", circleName)
    .in("status", ["upcoming", "ongoing"])
    .order("start_date", { ascending: true, nullsFirst: false })
    .limit(limit);

  if (error) {
    if (error.code === "PGRST205" || error.code === "PGRST116") {
      return [];
    }
    throw error;
  }

  return data;
}

export async function getEventById(eventId: string): Promise<Event | null> {
  const client = getSupabase();
  if (!client) {
    return null;
  }

  const { data, error } = await client
    .from("events")
    .select("*")
    .eq("id", eventId)
    .single();

  if (error && !isRecoverableReadError(error)) throw error;
  return data || null;
}

export async function createEvent(
  organizerId: string,
  input: unknown,
): Promise<Event> {
  const validated = eventSchema.parse(input);

  const { data, error } = await supabase
    .from("events")
    .insert({
      ...validated,
      organizer_id: organizerId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateEvent(
  eventId: string,
  organizerId: string,
  input: unknown,
): Promise<Event> {
  const validated = eventSchema.parse(input);

  const { data, error } = await supabase
    .from("events")
    .update({
      ...validated,
      updated_at: new Date().toISOString(),
    })
    .eq("id", eventId)
    .eq("organizer_id", organizerId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function registerForEvent(
  eventId: string,
  userId: string,
): Promise<EventRegistration> {
  const { data, error } = await supabase
    .from("event_registrations")
    .insert({
      event_id: eventId,
      user_id: userId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function cancelEventRegistration(eventId: string, userId: string) {
  const { error } = await supabase
    .from("event_registrations")
    .update({ status: "cancelled" })
    .eq("event_id", eventId)
    .eq("user_id", userId);

  if (error) throw error;
}

export async function getEventRegistrations(eventId: string) {
  const { data, error } = await supabase
    .from("event_registrations")
    .select(
      `
      *,
      user:user_id(full_name, avatar_url)
    `,
    )
    .eq("event_id", eventId)
    .eq("status", "registered");

  if (error) throw error;
  return data;
}

export async function getUserEventRegistrations(userId: string) {
  const { data, error } = await supabase
    .from("event_registrations")
    .select(
      `
      *,
      event:event_id(*)
    `,
    )
    .eq("user_id", userId)
    .eq("status", "registered")
    .order("registered_at", { ascending: false });

  if (error) throw error;
  return data;
}
