"use server";

import { revalidatePath } from "next/cache";
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

function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function revalidateDocs() {
  revalidatePublic();
  revalidatePath("/vi/docs", "layout");
  revalidatePath("/en/docs", "layout");
}

export async function saveGuide(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await getServerClient();
  const id = String(formData.get("id") ?? "");
  const title = localized(formData, "title");
  const slug = slugify(
    String(formData.get("slug") ?? "").trim() || title.vi
  );
  if (!title.vi.trim()) return { error: "Title (VI) is required." };
  if (!slug) return { error: "Slug is required." };

  const payload = {
    slug,
    title,
    summary: localized(formData, "summary"),
    body_md: localized(formData, "body_md"),
    cover_path: String(formData.get("cover_path") ?? "").trim() || null,
    video_url: String(formData.get("video_url") ?? "").trim() || null,
    category: String(formData.get("category") ?? "").trim() || null,
    sort_order: Number(formData.get("sort_order") ?? 0) || 0,
    published: formData.get("published") === "on",
    updated_at: new Date().toISOString(),
  };

  const { error } = id
    ? await supabase.from("guides").update(payload).eq("id", id)
    : await supabase.from("guides").insert(payload);
  if (error) return { error: error.message };
  revalidateDocs();
  return { ok: true };
}

export async function deleteGuide(id: string): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await getServerClient();
  const { data: row } = await supabase
    .from("guides")
    .select("cover_path")
    .eq("id", id)
    .maybeSingle();
  const { error } = await supabase.from("guides").delete().eq("id", id);
  if (error) return { error: error.message };
  if (row?.cover_path) await removeMedia(supabase, row.cover_path);
  revalidateDocs();
  return { ok: true };
}

export async function moveGuide(
  id: string,
  direction: "up" | "down"
): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await getServerClient();
  const { data: rows } = await supabase
    .from("guides")
    .select("id,sort_order")
    .order("sort_order");
  const list = rows ?? [];
  const index = list.findIndex((r) => r.id === id);
  const target = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || target < 0 || target >= list.length) return { ok: true };
  const a = list[index];
  const b = list[target];
  await supabase.from("guides").update({ sort_order: b.sort_order }).eq("id", a.id);
  await supabase.from("guides").update({ sort_order: a.sort_order }).eq("id", b.id);
  revalidateDocs();
  return { ok: true };
}

export async function uploadCover(
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
  const path = `guides/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from("media")
    .upload(path, file, { contentType: file.type, upsert: false });
  if (error) return { error: error.message };

  await supabase.from("media").insert({ bucket: "media", path, alt: {} });
  const oldPath = String(formData.get("old_path") ?? "").trim();
  if (oldPath && oldPath !== path) await removeMedia(supabase, oldPath);
  return { ok: true, path };
}

export async function removeCover(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const path = String(formData.get("path") ?? "").trim();
  if (!path) return { ok: true };
  const supabase = await getServerClient();
  await removeMedia(supabase, path);
  return { ok: true };
}

async function removeMedia(
  supabase: Awaited<ReturnType<typeof getServerClient>>,
  path: string
) {
  await supabase.storage.from("media").remove([path]);
  await supabase.from("media").delete().eq("path", path);
}
