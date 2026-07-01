import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// Disable static generation for this API route
export const dynamic = 'force-dynamic';

function getServiceRoleClient() {
  const supabaseUrl = process.env.SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  // Return null during build time if credentials are missing
  if (!supabaseUrl || !serviceRoleKey) {
    if (process.env.NODE_ENV === 'production' && !process.env.NEXT_DEPLOYMENT_URL) {
      return null;
    }
    return createClient(supabaseUrl || '', serviceRoleKey || '', {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getServiceRoleClient();
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing authorization" },
        { status: 401 },
      );
    }

    const token = authHeader.substring(7);
    const { data: userData, error: userError } =
      await supabase.auth.getUser(token);

    if (userError || !userData.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      full_name,
      bio,
      avatar_url,
      profession,
      industry,
      business,
      city,
      phone,
      experience,
      why_joining,
    } = body;
    const userId = userData.user.id;

    const upsertUserProfiles = async () => {
      return supabase.from("user_profiles").upsert(
        {
          user_id: userId,
          full_name,
          bio: bio || "",
          avatar_url: avatar_url || "",
          profession: profession || "",
          industry: industry || "",
          business: business || "",
          city: city || "",
          phone: phone || "",
          experience: experience || "",
          why_joining: why_joining || "",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      );
    };

    const upsertProfiles = async () => {
      const names = (full_name || "").trim().split(/\s+/);
      const first_name = names.shift() || "";
      const last_name = names.join(" ");

      return supabase.from("profiles").upsert(
        {
          id: userId,
          first_name,
          last_name,
          bio: bio || "",
          avatar_url: avatar_url || "",
          profession: profession || "",
          business: business || "",
          city: city || "",
          phone: phone || "",
          member_level: "New Member",
          join_reason: why_joining || "",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" },
      );
    };

    let result = await upsertUserProfiles();
    if (result.error && result.error.code === "PGRST205") {
      result = await upsertProfiles();
    }
    if (result.error) throw result.error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Profile save error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
