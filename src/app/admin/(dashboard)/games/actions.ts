"use server";

import { requireAdmin } from "@/lib/auth";
import { getServerClient } from "@/lib/supabase/server";
import { revalidatePublic } from "@/lib/admin/revalidate";

export type ActionResult = { error?: string; ok?: boolean; path?: string };

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

function localized(formData: FormData, field: string) {
  return {
    vi: String(formData.get(`${field}_vi`) ?? ""),
    en: String(formData.get(`${field}_en`) ?? ""),
  };
}

export async function saveGame(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await getServerClient();
  const id = String(formData.get("id") ?? "");
  const payload = {
    slug: String(formData.get("slug") ?? "").trim(),
    title: localized(formData, "title"),
    description: localized(formData, "description"),
    video_url: String(formData.get("video_url") ?? "").trim() || null,
    screenshot_path:
      String(formData.get("screenshot_path") ?? "").trim() || null,
    sort_order: Number(formData.get("sort_order") ?? 0),
    published: formData.get("published") === "on",
    updated_at: new Date().toISOString(),
  };
  if (!payload.slug) return { error: "Slug is required." };

  const { error } = id
    ? await supabase.from("games").update(payload).eq("id", id)
    : await supabase.from("games").insert(payload);
  if (error) return { error: error.message };
  revalidatePublic();
  return { ok: true };
}

export async function deleteGame(id: string): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await getServerClient();
  const { data: row } = await supabase
    .from("games")
    .select("screenshot_path")
    .eq("id", id)
    .maybeSingle();
  const { error } = await supabase.from("games").delete().eq("id", id);
  if (error) return { error: error.message };
  if (row?.screenshot_path) await removeMedia(supabase, row.screenshot_path);
  revalidatePublic();
  return { ok: true };
}

async function removeMedia(
  supabase: Awaited<ReturnType<typeof getServerClient>>,
  path: string
) {
  await supabase.storage.from("media").remove([path]);
  await supabase.from("media").delete().eq("path", path);
}

export async function removeScreenshot(
  formData: FormData
): Promise<ActionResult> {
  await requireAdmin();
  const path = String(formData.get("path") ?? "").trim();
  if (!path) return { ok: true };
  const supabase = await getServerClient();
  await removeMedia(supabase, path);
  return { ok: true };
}

export async function moveGame(
  id: string,
  direction: "up" | "down"
): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await getServerClient();
  const { data: rows } = await supabase
    .from("games")
    .select("id,sort_order")
    .order("sort_order");
  const list = rows ?? [];
  const index = list.findIndex((r) => r.id === id);
  const target = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || target < 0 || target >= list.length) return { ok: true };
  const a = list[index];
  const b = list[target];
  await supabase.from("games").update({ sort_order: b.sort_order }).eq("id", a.id);
  await supabase.from("games").update({ sort_order: a.sort_order }).eq("id", b.id);
  revalidatePublic();
  return { ok: true };
}

export async function uploadScreenshot(
  formData: FormData
): Promise<ActionResult> {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "No file provided." };
  }
  if (!IMAGE_TYPES.includes(file.type)) {
    return { error: "Only PNG, JPEG, WEBP or GIF images are allowed." };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { error: "Image must be smaller than 5MB." };
  }

  const supabase = await getServerClient();
  const ext = file.name.split(".").pop() || "png";
  const path = `games/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from("media")
    .upload(path, file, { contentType: file.type, upsert: false });
  if (error) return { error: error.message };

  await supabase.from("media").insert({ bucket: "media", path, alt: {} });
  const oldPath = String(formData.get("old_path") ?? "").trim();
  if (oldPath && oldPath !== path) await removeMedia(supabase, oldPath);
  return { ok: true, path };
}