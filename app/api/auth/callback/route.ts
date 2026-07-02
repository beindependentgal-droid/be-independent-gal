import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const code = body?.code;
  const next =
    typeof body?.next === "string" && body.next.startsWith("/")
      ? body.next
      : "/dashboard";

  if (!code) {
    return new Response(JSON.stringify({ error: "Missing OAuth code." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return new Response(
      JSON.stringify({ error: "Supabase environment variables are missing." }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options),
        );
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    console.error("Supabase OAuth callback error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "OAuth exchange failed." }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  return new Response(JSON.stringify({ redirect: next }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
