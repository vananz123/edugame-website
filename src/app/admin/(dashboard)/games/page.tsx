import { getServerClient } from "@/lib/supabase/server";
import { GameManager, type GameRow } from "./game-manager";

export default async function AdminGamesPage() {
  const supabase = await getServerClient();
  const { data } = await supabase
    .from("games")
    .select(
      "id,slug,title,description,screenshot_path,video_url,sort_order,published"
    )
    .order("sort_order");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Games</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create, edit, reorder and publish game showcase entries.
        </p>
      </div>
      <GameManager games={(data ?? []) as GameRow[]} />
    </div>
  );
}