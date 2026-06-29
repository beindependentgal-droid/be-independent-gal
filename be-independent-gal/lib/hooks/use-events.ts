import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase-client';
import type { Database } from '@/lib/db-types';

type Event = Database['public']['Tables']['events']['Row'];
type EventRegistration = Database['public']['Tables']['event_registrations']['Row'];

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchEvents() {
      try {
        const { data, error: err } = await supabase
          .from('events')
          .select('*')
          .order('start_time', { ascending: true });

        if (err) throw err;
        setEvents(data || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch events'));
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, [supabase]);

  return { events, loading, error };
}

export function useEventById(id: string) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchEvent() {
      try {
        const { data, error: err } = await supabase
          .from('events')
          .select('*')
          .eq('id', id)
          .single();

        if (err) throw err;
        setEvent(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch event'));
      } finally {
        setLoading(false);
      }
    }

    fetchEvent();
  }, [id, supabase]);

  return { event, loading, error };
}

export function useUserEventRegistrations(userId: string) {
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchRegistrations() {
      try {
        const { data, error: err } = await supabase
          .from('event_registrations')
          .select('*')
          .eq('user_id', userId);

        if (err) throw err;
        setRegistrations(data || []);
      } finally {
        setLoading(false);
      }
    }

    fetchRegistrations();
  }, [userId, supabase]);

  return { registrations, loading };
}
