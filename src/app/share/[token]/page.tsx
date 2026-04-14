import Link from "next/link";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { rowToWatchItem } from "@/types";
import ShareWatchlistClient from "./ShareWatchlistClient";

export default async function SharePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const supabase = createAdminSupabaseClient();

  // Look up the share token
  const { data: link } = await supabase
    .from("share_links")
    .select("user_id")
    .eq("token", token)
    .single();

  if (!link) {
    return (
      <div className="text-center py-32">
        <div className="font-heading text-8xl text-white/5">404</div>
        <p className="text-white/45 tracking-wider mt-4">This share link is invalid or has been revoked.</p>
        <Link href="/" className="inline-block mt-8 px-6 py-2.5 bg-primary text-white font-heading tracking-wider">
          GO HOME
        </Link>
      </div>
    );
  }

  // Fetch the user's watchlist (bypassing RLS via admin client)
  const { data: rows } = await supabase
    .from("watch_items")
    .select("*")
    .eq("user_id", link.user_id)
    .order("updated_at", { ascending: false });

  const items = (rows || []).map(rowToWatchItem);

  return (
    <div className="page-enter">
      <ShareWatchlistClient items={items} />
    </div>
  );
}
