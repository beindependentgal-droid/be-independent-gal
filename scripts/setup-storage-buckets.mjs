import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

const buckets = [
  { name: "avatars", public: true },
  { name: "banners", public: true },
  { name: "documents", public: false },
  { name: "media", public: true },
];

for (const bucket of buckets) {
  const { data, error } = await supabase.storage.createBucket(bucket.name, {
    public: bucket.public,
    fileSizeLimit: 1024 * 1024 * 5,
  });

  if (error && error.message?.includes("already exists")) {
    console.log(`Bucket already exists: ${bucket.name}`);
    continue;
  }

  if (error) {
    console.error(`Failed to create bucket ${bucket.name}:`, error.message);
    continue;
  }

  console.log(`Created bucket: ${bucket.name}`);
}
