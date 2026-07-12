import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Cookie-free client for public, cacheable reads (no `cookies()` call).
 * Keeps routes off the dynamic-rendering path so they can be ISR'd.
 * RLS still applies — only use for data anon users are allowed to read.
 */
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
