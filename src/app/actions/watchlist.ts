"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { MediaType, WatchStatus } from "@/types";

async function getUserId(): Promise<string> {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");
  return userId;
}

export async function createItem(data: {
  title: string;
  mediaType: MediaType;
  genre: string[];
  year: number;
  posterUrl: string;
  synopsis: string;
  status: WatchStatus;
  rating: number | null;
  tmdbId?: number | null;
}) {
  const userId = await getUserId();
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.from("watch_items").insert({
    user_id: userId,
    title: data.title,
    media_type: data.mediaType,
    genre: data.genre,
    year: data.year,
    poster_url: data.posterUrl,
    synopsis: data.synopsis,
    status: data.status,
    rating: data.rating,
    tmdb_id: data.tmdbId ?? null,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/watchlist");
  revalidatePath("/");
}

export async function updateStatus(id: string, status: WatchStatus) {
  await getUserId();
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from("watch_items")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/watchlist");
  revalidatePath(`/show/${id}`);
  revalidatePath("/");
}

export async function setRating(id: string, rating: number) {
  await getUserId();
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from("watch_items")
    .update({ rating, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath(`/show/${id}`);
  revalidatePath("/stats");
}

export async function setReview(id: string, review: string) {
  await getUserId();
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from("watch_items")
    .update({ review, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath(`/show/${id}`);
}

export async function deleteItem(id: string) {
  await getUserId();
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.from("watch_items").delete().eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/watchlist");
  revalidatePath("/");
}
