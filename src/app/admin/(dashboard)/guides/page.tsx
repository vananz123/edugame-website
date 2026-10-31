import { getServerClient } from "@/lib/supabase/server";
import { GuideManager, type GuideRow } from "./guide-manager";

export default async function AdminGuidesPage() {
  const supabase = await getServerClient();
  const { data } = await supabase
    .from("guides")
    .select(
      "id,slug,title,summary,body_md,cover_path,video_url,category,sort_order,published"
    )
    .order("sort_order");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Guides</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Write bilingual user guides in Markdown, attach images or a video and
          publish them to /docs.
        </p>
      </div>
      <GuideManager guides={(data ?? []) as GuideRow[]} />
    </div>
  );
}
