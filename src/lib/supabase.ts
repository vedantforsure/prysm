import { createClient } from "@supabase/supabase-js";

// Empty strings count as "not set" (the .env.local placeholders start blank).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// During setup the env vars may be missing; fall back to harmless placeholders
// so the module can still be imported without throwing at build time.
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key"
);

// Storage bucket that holds the uploaded image files.
export const IMAGE_BUCKET = "images";

// Database table that holds one row per image + the prompt used to make it.
export const ENTRIES_TABLE = "image_prompts";
