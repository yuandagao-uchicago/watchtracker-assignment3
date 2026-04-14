import { createClient } from "@supabase/supabase-js";

// Server-only client that bypasses RLS. Used for public share pages.
// NEVER import this from client components.
export function createAdminSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
