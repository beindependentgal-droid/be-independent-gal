import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import process from "process";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

// Load .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, "..", ".env.local");
dotenv.config({ path: envPath });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    "Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars",
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function seed() {
  const raw = await fs.readFile(
    new URL("../data/circle-dashboard.json", import.meta.url),
    "utf-8",
  );
  const json = JSON.parse(raw);

  const entries = Object.entries(json.circleDashboard);

  for (const [id, data] of entries) {
    console.log(`Upserting ${id}...`);
    const res = await supabase
      .from("circle_dashboard")
      .upsert({ id, data })
      .select();
    if (res.error) {
      console.error("Error upserting", id, res.error);
    } else {
      console.log("Upserted", id);
    }
  }
}

seed()
  .then(() => console.log("Seeding complete"))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
