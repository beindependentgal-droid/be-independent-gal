import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = resolve(__dirname, "..", ".env.local");

dotenv.config({ path: envPath });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    "❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local",
  );
  process.exit(1);
}

console.log("🔌 Testing Supabase connection...\n");
console.log(`URL: ${SUPABASE_URL}`);
console.log(
  `Service Role Key: ${SUPABASE_SERVICE_ROLE_KEY.substring(0, 20)}...`,
);
console.log("");

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

try {
  // Test 1: Fetch all circle dashboard records
  console.log("📊 Test 1: Fetching circle_dashboard records...");
  const { data, error } = await supabase.from("circle_dashboard").select("id");

  if (error) {
    console.error("❌ Query failed:", error.message);
    process.exit(1);
  }

  if (!data) {
    console.error("❌ No data returned");
    process.exit(1);
  }

  console.log(`✅ Success! Found ${data.length} circle(s):`);
  data.forEach((record) => {
    console.log(`   - ${record.id}`);
  });

  // Test 2: Fetch a specific circle's full data
  console.log('\n📋 Test 2: Fetching full dashboard data for "learn"...');
  const { data: learnData, error: learnError } = await supabase
    .from("circle_dashboard")
    .select("*")
    .eq("id", "learn")
    .single();

  if (learnError) {
    console.error("❌ Query failed:", learnError.message);
    process.exit(1);
  }

  if (learnData) {
    console.log("✅ Success! Data structure:");
    console.log(`   - ID: ${learnData.id}`);
    console.log(`   - Has data: ${!!learnData.data}`);
    if (learnData.data) {
      console.log(`   - Feed posts: ${learnData.data.feed?.length || 0}`);
      console.log(`   - Members: ${learnData.data.members?.length || 0}`);
      console.log(`   - Events: ${learnData.data.events?.length || 0}`);
      console.log(
        `   - Notifications: ${learnData.data.notifications?.length || 0}`,
      );
    }
  }

  console.log("\n✨ All tests passed! Supabase connection is working.\n");
  process.exit(0);
} catch (err) {
  console.error("❌ Unexpected error:", err.message);
  process.exit(1);
}
