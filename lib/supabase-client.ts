import { createBrowserClient } from "@supabase/ssr";

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

function createMissingClient() {
  const createMissingChannel = () => ({
    on: () => createMissingChannel(),
    subscribe: async () => "SUBSCRIBED",
    unsubscribe: async () => undefined,
  });

  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
      signOut: async () => ({ error: null }),
      signUp: async () => {
        throw new Error(
          "Authentication is unavailable because Supabase is not configured.",
        );
      },
      signInWithPassword: async () => {
        throw new Error(
          "Authentication is unavailable because Supabase is not configured.",
        );
      },
      signInWithOAuth: async () => {
        throw new Error(
          "Authentication is unavailable because Supabase is not configured.",
        );
      },
      signInWithOtp: async () => {
        throw new Error(
          "Authentication is unavailable because Supabase is not configured.",
        );
      },
      onAuthStateChange: () => ({
        data: {
          subscription: {
            unsubscribe: () => undefined,
          },
        },
      }),
    },
    channel: createMissingChannel,
    removeChannel: () => true,
  } as any;
}

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return createMissingClient();
  }

  if (!browserClient) {
    browserClient = createBrowserClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }

  return browserClient;
}
