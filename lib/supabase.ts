import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (
  process.env.SUPABASE_URL || ""
).trim();

const supabaseKey = (
  process.env.SUPABASE_ANON_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  ""
).trim();

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    "Supabase URL or Key is missing. Please check SUPABASE_URL and SUPABASE_ANON_KEY in your .env file."
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  },
});

