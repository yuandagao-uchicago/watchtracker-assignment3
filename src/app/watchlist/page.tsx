import { createServerSupabaseClient } from "@/lib/supabase/server";
import { rowToWatchItem } from "@/types";
import WatchlistClient from "./WatchlistClient";

export default async function WatchlistPage() {
  const supabase = await createServerSupabaseClient();
  const { data: rows } = await supabase
    .from("watch_items")
    .select("*")
    .order("updated_at", { ascending: false });

  const items = (rows || []).map(rowToWatchItem);

  return <WatchlistClient items={items} />;
}
