"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, ImagePlus } from "lucide-react";
import {
  saveGame,
  deleteGame,
  moveGame,
  uploadScreenshot,
  removeScreenshot,
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type GameRow = {
  id: string;
  slug: string;
  title: { vi: string; en: string };
  description: { vi: string; en: string };
  screenshot_path: string | null;
  video_url: string | null;
  sort_order: number;
  published: boolean;
};

const publicUrl = (path: string) =>
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${path}`;

export function GameManager({ games }: { games: GameRow[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<GameRow | null>(null);
  const [published, setPublished] = useState(false);
  const [screenshotPath, setScreenshotPath] = useState("");
  const [busy, setBusy] = useState(false);

  const openNew = () => {
    setEditing(null);
    setPublished(false);
    setScreenshotPath("");
    setOpen(true);
  };
  const openEdit = (g: GameRow) => {
    setEditing(g);
    setPublished(g.published);
    setScreenshotPath(g.screenshot_path ?? "");
    setOpen(true);
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    fd.set("published", published ? "on" : "off");
    fd.set("screenshot_path", screenshotPath);
    if (editing) fd.set("id", editing.id);
    const res = await saveGame(fd);
    setBusy(false);
    if (res.error) {
      toast.error(res.error);
      return;
    }
    toast.success("Game saved.");
    setOpen(false);
    router.refresh();
  }

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.set("file", file);
    fd.set("old_path", screenshotPath);
    const res = await uploadScreenshot(fd);
    if (res.error) {
      toast.error(res.error);
      return;
    }
    setScreenshotPath(res.path ?? "");
    toast.success("Screenshot uploaded.");
  }

  async function onRemoveScreenshot() {
    if (!screenshotPath) return;
    const fd = new FormData();
    fd.set("path", screenshotPath);
    const res = await removeScreenshot(fd);
    if (res.error) {
      toast.error(res.error);
      return;
    }
    setScreenshotPath("");
    toast.success("Screenshot removed.");
  }

  async function onDelete(g: GameRow) {
    if (!window.confirm(`Delete game "${g.title.vi}"?`)) return;
    const res = await deleteGame(g.id);
    if (res.error) toast.error(res.error);
    else {
      toast.success("Game deleted.");
      router.refresh();
    }
  }

  async function onMove(g: GameRow, dir: "up" | "down") {
    const res = await moveGame(g.id, dir);
    if (res.error) toast.error(res.error);
    else router.refresh();
  }

  return (
    <div className="space-y-4">
      <Button onClick={openNew}>
        <Plus className="size-4" />
        Add game
      </Button>

      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Order</TableHead>
              <TableHead>Title (VI)</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-40 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {games.map((g) => (
              <TableRow key={g.id}>
                <TableCell>{g.sort_order}</TableCell>
                <TableCell className="font-medium">{g.title.vi}</TableCell>
                <TableCell className="text-muted-foreground">{g.slug}</TableCell>
                <TableCell>
                  {g.published ? (
                    <Badge>Published</Badge>
                  ) : (
                    <Badge variant="secondary">Hidden</Badge>
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
            {games.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No games yet. Run the seed migration or add one.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit game" : "Add game"}</DialogTitle>
          </DialogHeader>
          <form
            key={editing?.id ?? "new"}
            onSubmit={onSubmit}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  name="slug"
                  defaultValue={editing?.slug ?? ""}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sort_order">Order</Label>
                <Input
                  id="sort_order"
                  name="sort_order"
                  type="number"
                  defaultValue={editing?.sort_order ?? games.length + 1}
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
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="description_vi">Description (VI)</Label>
                <Textarea
                  id="description_vi"
                  name="description_vi"
                  defaultValue={editing?.description.vi ?? ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description_en">Description (EN)</Label>
                <Textarea
                  id="description_en"
                  name="description_en"
                  defaultValue={editing?.description.en ?? ""}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="video_url">Demo video URL (optional)</Label>
              <Input
                id="video_url"
                name="video_url"
                defaultValue={editing?.video_url ?? ""}
              />
            </div>

            <div className="space-y-2">
              <Label>Screenshot</Label>
              <div className="flex items-center gap-3">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-muted">
                  <ImagePlus className="size-4" />
                  Upload image
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    className="hidden"
                    onChange={onUpload}
                  />
                </label>
                {screenshotPath ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={publicUrl(screenshotPath)}
                      alt="Screenshot preview"
                      className="h-12 w-20 rounded border border-border object-cover"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={onRemoveScreenshot}
                    >
                      <Trash2 className="size-4" />
                      Remove
                    </Button>
                  </>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    No screenshot
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