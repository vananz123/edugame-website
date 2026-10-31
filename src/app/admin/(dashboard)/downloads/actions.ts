"use server";

import { requireAdmin } from "@/lib/auth";
import { getServerClient } from "@/lib/supabase/server";
import { revalidatePublic } from "@/lib/admin/revalidate";
import type { ActionResult } from "../games/actions";

function localized(formData: FormData, field: string) {
  return {
    vi: String(formData.get(`${field}_vi`) ?? ""),
    en: String(formData.get(`${field}_en`) ?? ""),
  };
}

export async function saveDownload(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await getServerClient();
  const id = String(formData.get("id") ?? "");
  const releaseDate = String(formData.get("release_date") ?? "").trim();
  const payload = {
    version: String(formData.get("version") ?? "").trim(),
    windows_url: String(formData.get("windows_url") ?? "").trim(),
    file_size: String(formData.get("file_size") ?? "").trim(),
    release_date: releaseDate || null,
    system_requirements: localized(formData, "requirements"),
    release_notes: localized(formData, "notes"),
    trial_url: String(formData.get("trial_url") ?? "").trim() || null,
    published: formData.get("published") === "on",
    updated_at: new Date().toISOString(),
  };

  const { error } = id
    ? await supabase.from("downloads").update(payload).eq("id", id)
    : await supabase.from("downloads").insert(payload);
  if (error) return { error: error.message };
  revalidatePublic();
  return { ok: true };
}