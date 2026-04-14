"use server";

import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

async function getUserId(): Promise<string> {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");
  return userId;
}

export async function generateShareLink(): Promise<string> {
  const userId = await getUserId();
  const supabase = await createServerSupabaseClient();

  // Check if link already exists
  const { data: existing } = await supabase
    .from("share_links")
    .select("token")
    .eq("user_id", userId)
    .single();

  if (existing?.token) return existing.token;

  // Generate new token
  const token = crypto.randomUUID().replace(/-/g, "").slice(0, 16);

  const { error } = await supabase.from("share_links").insert({
    user_id: userId,
    token,
  });

  if (error) throw new Error(error.message);
  return token;
}

export async function revokeShareLink(): Promise<void> {
  const userId = await getUserId();
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from("share_links")
    .delete()
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
}
