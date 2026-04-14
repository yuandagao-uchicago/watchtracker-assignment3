"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function addComment(tmdbId: number, mediaType: "movie" | "tv", content: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const user = await currentUser();
  const userName = user?.firstName
    ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ""}`
    : user?.emailAddresses?.[0]?.emailAddress?.split("@")[0] || "Anonymous";

  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.from("comments").insert({
    user_id: userId,
    user_name: userName,
    tmdb_id: tmdbId,
    media_type: mediaType,
    content: content.trim(),
  });

  if (error) throw new Error(error.message);
  revalidatePath(`/show/`);
}

export async function deleteComment(commentId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId)
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
  revalidatePath(`/show/`);
}
