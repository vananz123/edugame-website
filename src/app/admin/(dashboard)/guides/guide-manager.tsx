"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowDown,
  ArrowUp,
  Copy,
  ImagePlus,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import {
  saveGuide,
  deleteGuide,
  moveGuide,
  uploadCover,
  removeCover,
} from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type GuideRow = {
  id: string;
  slug: string;
  title: { vi: string; en: string };
  summary: { vi: string; en: string };
  body_md: { vi: string; en: string };
  cover_path: string | null;
  video_url: string | null;
  category: string | null;
  sort_order: number;
  published: boolean;
};

const publicUrl = (path: string) =>
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${path}`;

export function GuideManager({ guides }: { guides: GuideRow[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<GuideRow | null>(null);
  const [published, setPublished] = useState(false);
  const [coverPath, setCoverPath] = useState("");
  const [busy, setBusy] = useState(false);

  const openNew = () => {
    setEditing(null);
    setPublished(false);
    setCoverPath("");
    setOpen(true);
  };
  const openEdit = (g: GuideRow) => {
    setEditing(g);
    setPublished(g.published);
    setCoverPath(g.cover_path ?? "");
    setOpen(true);
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    fd.set("published", published ? "on" : "off");
    fd.set("cover_path", coverPath);
    if (editing) fd.set("id", editing.id);
    const res = await saveGuide(fd);
    setBusy(false);
    if (res.error) {
      toast.error(res.error);
      return;
    }
    toast.success("Guide saved.");
    setOpen(false);
    router.refresh();
  }

  async function onUploadCover(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.set("file", file);
    fd.set("old_path", coverPath);
    const res = await uploadCover(fd);
    if (res.error) {
      toast.error(res.error);
      return;
    }
    setCoverPath(res.path ?? "");
    toast.success("Cover uploaded.");
  }

  async function onRemoveCover() {
    if (!coverPath) return;
    const fd = new FormData();
    fd.set("path", coverPath);
    const res = await removeCover(fd);
    if (res.error) {
      toast.error(res.error);
      return;
    }
    setCoverPath("");
    toast.success("Cover removed.");
  }

  async function onCopyCoverUrl() {
    if (!coverPath) return;
    try {
      await navigator.clipboard.writeText(`![](${publicUrl(coverPath)})`);
      toast.success("Markdown image copied.");
    } catch {
      toast.error("Could not copy. Select the URL manually.");
    }
  }

  async function onDelete(g: GuideRow) {
    if (!window.confirm(`Delete guide "${g.title.vi}"?`)) return;
    const res = await deleteGuide(g.id);
    if (res.error) toast.error(res.error);
    else {
      toast.success("Guide deleted.");
      router.refresh();
    }
  }

  async function onMove(g: GuideRow, dir: "up" | "down") {
    const res = await moveGuide(g.id, dir);
    if (res.error) toast.error(res.error);
    else router.refresh();
  }

  return (
    <div className="space-y-4">
      <Button onClick={openNew}>
        <Plus className="size-4" />
        Add guide
      </Button>

      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Order</TableHead>
              <TableHead>Title (VI)</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-40 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {guides.map((g) => (
              <TableRow key={g.id}>
                <TableCell>{g.sort_order}</TableCell>
                <TableCell className="font-medium">{g.title.vi}</TableCell>
                <TableCell className="text-muted-foreground">
                  {g.slug}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {g.category ?? "—"}
                </TableCell>
                <TableCell>
                  {g.published ? (
                    <Badge>Published</Badge>
                  ) : (
                    <Badge variant="secondary">Draft</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => onMove(g, "up")}
                      aria-label="Move up"
                    >
                      <ArrowUp className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => onMove(g, "down")}
                      aria-label="Move down"
                    >
                      <ArrowDown className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => openEdit(g)}
                      aria-label="Edit"
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => onDelete(g)}
                      aria-label="Delete"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {guides.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground"
                >
                  No guides yet. Apply migration 0003, then add one.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit guide" : "Add guide"}</DialogTitle>
          </DialogHeader>
          <form
            key={editing?.id ?? "new"}
            onSubmit={onSubmit}
            className="space-y-4"
          >
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  name="slug"
                  defaultValue={editing?.slug ?? ""}
                  placeholder="auto from VI title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sort_order">Order</Label>
                <Input
                  id="sort_order"
                  name="sort_order"
                  type="number"
                  defaultValue={editing?.sort_order ?? guides.length + 1}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  name="category"
                  defaultValue={editing?.category ?? ""}
                  placeholder="Getting started"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title_vi">Title (VI)</Label>
                <Input
                  id="title_vi"
                  name="title_vi"
                  defaultValue={editing?.title.vi ?? ""}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title_en">Title (EN)</Label>
                <Input
                  id="title_en"
                  name="title_en"
                  defaultValue={editing?.title.en ?? ""}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="summary_vi">Summary (VI)</Label>
                <Textarea
                  id="summary_vi"
                  name="summary_vi"
                  rows={2}
                  defaultValue={editing?.summary.vi ?? ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="summary_en">Summary (EN)</Label>
                <Textarea
                  id="summary_en"
                  name="summary_en"
                  rows={2}
                  defaultValue={editing?.summary.en ?? ""}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="body_md_vi">Body Markdown (VI)</Label>
                <Textarea
                  id="body_md_vi"
                  name="body_md_vi"
                  rows={10}
                  className="font-mono text-sm"
                  defaultValue={editing?.body_md.vi ?? ""}
                  placeholder={"## Bắt đầu\n\nNội dung hướng dẫn…\n\n![](image-url)"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="body_md_en">Body Markdown (EN)</Label>
                <Textarea
                  id="body_md_en"
                  name="body_md_en"
                  rows={10}
                  className="font-mono text-sm"
                  defaultValue={editing?.body_md.en ?? ""}
                  placeholder={"## Getting started\n\nGuide content…"}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Markdown: headings, bold, lists, tables, code and images
              (&quot;![](url)&quot;). Raw HTML is not rendered.
            </p>

            <div className="space-y-2">
              <Label htmlFor="video_url">
                Video URL (YouTube, Vimeo or Google Drive — optional)
              </Label>
              <Input
                id="video_url"
                name="video_url"
                defaultValue={editing?.video_url ?? ""}
                placeholder="https://youtu.be/…"
              />
            </div>

            <div className="space-y-2">
              <Label>Cover image</Label>
              <div className="flex flex-wrap items-center gap-3">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-muted">
                  <ImagePlus className="size-4" />
                  Upload image
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    className="hidden"
                    onChange={onUploadCover}
                  />
                </label>
                {coverPath ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={publicUrl(coverPath)}
                      alt="Cover preview"
                      className="h-12 w-20 rounded border border-border object-cover"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={onCopyCoverUrl}
                    >
                      <Copy className="size-4" />
                      Copy Markdown
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={onRemoveCover}
                    >
                      <Trash2 className="size-4" />
                      Remove
                    </Button>
                  </>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    No cover
                  </span>
                )}
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

            <DialogFooter>
              <Button type="submit" disabled={busy}>
                {busy ? "Saving…" : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
