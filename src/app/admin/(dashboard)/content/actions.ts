"use server";

import { requireAdmin } from "@/lib/auth";
import { getServerClient } from "@/lib/supabase/server";
import { revalidatePublic } from "@/lib/admin/revalidate";
import type { ActionResult } from "../games/actions";

export async function saveContent(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const key = String(formData.get("key") ?? "");
  const status = String(formData.get("status") ?? "draft");
  let content: unknown;
  try {
    content = JSON.parse(String(formData.get("content_json") ?? "{}"));
  } catch {
    return { error: "Invalid content JSON." };
  }
  if (!key) return { error: "Missing content key." };

  const supabase = await getServerClient();
  const { error } = await supabase.from("site_content").upsert(
    {
      key,
      content,
      status: status === "published" ? "published" : "draft",
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" }
  );
  if (error) return { error: error.message };
  revalidatePublic();
  return { ok: true };
}