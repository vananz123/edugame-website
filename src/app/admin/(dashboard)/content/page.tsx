import { getServerClient } from "@/lib/supabase/server";
import { ContentManager, type ContentRow } from "./content-manager";

export default async function AdminContentPage() {
  const supabase = await getServerClient();
  const { data } = await supabase
    .from("site_content")
    .select("key,content,status")
    .order("key");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Content</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Edit the bilingual landing-page sections. Toggle Published to make a
          section live; drafts stay hidden and the site falls back to defaults.
        </p>
      </div>
      <ContentManager rows={(data ?? []) as ContentRow[]} />
    </div>
  );
}