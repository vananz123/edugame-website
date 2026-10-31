import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// Anon client cho public reads (không cookie, không session).
export function getPublicClient(): SupabaseClient | null {
  if (!url || !key) return null;
  return createClient(url, key);
}

export function getPublicMediaUrl(path: string, bucket = "media"): string {
  return `${url}/storage/v1/object/public/${bucket}/${path}`;
}