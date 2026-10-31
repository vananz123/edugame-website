"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { saveDownload } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type DownloadRow = {
  id: string;
  version: string;
  windows_url: string;
  file_size: string;
  release_date: string | null;
  system_requirements: { vi: string; en: string };
  release_notes: { vi: string; en: string };
  trial_url: string | null;
  published: boolean;
};

export function DownloadForm({ row }: { row: DownloadRow | null }) {
  const router = useRouter();
  const [published, setPublished] = useState(row?.published ?? false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    fd.set("published", published ? "on" : "off");
    if (row) fd.set("id", row.id);
    const res = await saveDownload(fd);
    setBusy(false);
    if (res.error) {
      toast.error(res.error);
      return;
    }
    toast.success("Download saved.");
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Current release</CardTitle>
      </CardHeader>
      <CardContent>
        <form key={row?.id ?? "new"} onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="version">Version</Label>
              <Input
                id="version"
                name="version"
                defaultValue={row?.version ?? ""}
                placeholder="1.0.0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="file_size">File size</Label>
              <Input
                id="file_size"
                name="file_size"
                defaultValue={row?.file_size ?? ""}
                placeholder="120 MB"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="release_date">Release date</Label>
              <Input
                id="release_date"
                name="release_date"
                type="date"
                defaultValue={row?.release_date ?? ""}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="windows_url">Windows download URL</Label>
            <Input
              id="windows_url"
              name="windows_url"
              defaultValue={row?.windows_url ?? ""}
              placeholder="https://..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="trial_url">Trial / demo URL (optional)</Label>
            <Input
              id="trial_url"
              name="trial_url"
              defaultValue={row?.trial_url ?? ""}
              placeholder="https://..."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="requirements_vi">System requirements (VI)</Label>
              <Textarea
                id="requirements_vi"
                name="requirements_vi"
                defaultValue={row?.system_requirements.vi ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="requirements_en">System requirements (EN)</Label>
              <Textarea
                id="requirements_en"
                name="requirements_en"
                defaultValue={row?.system_requirements.en ?? ""}
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="notes_vi">Release notes (VI)</Label>
              <Textarea
                id="notes_vi"
                name="notes_vi"
                defaultValue={row?.release_notes.vi ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes_en">Release notes (EN)</Label>
              <Textarea
                id="notes_en"
                name="notes_en"
                defaultValue={row?.release_notes.en ?? ""}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="published"
              checked={published}
              onCheckedChange={setPublished}
            />
            <Label htmlFor="published">Published</Label>
          </div>

          <Button type="submit" disabled={busy}>
            {busy ? "Saving…" : "Save"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}