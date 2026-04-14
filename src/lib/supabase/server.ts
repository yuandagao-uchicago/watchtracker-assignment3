import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

export async function createServerSupabaseClient() {
  const { getToken } = await auth();
  // With Third-Party Auth, Clerk's default session token works directly
  // (no JWT template needed — Supabase verifies via Clerk's JWKS)
  const token = await getToken();

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    }
  );
}
