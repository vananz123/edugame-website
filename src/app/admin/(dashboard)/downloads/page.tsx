import { getServerClient } from "@/lib/supabase/server";
import { DownloadForm, type DownloadRow } from "./download-form";

export default async function AdminDownloadsPage() {
  const supabase = await getServerClient();
  const { data } = await supabase
    .from("downloads")
    .select(
      "id,version,windows_url,file_size,release_date,system_requirements,release_notes,trial_url,published"
    )
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Downloads</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure the Windows download, version metadata and release notes.
        </p>
      </div>
      <DownloadForm row={(data ?? null) as DownloadRow | null} />
    </div>
  );
}