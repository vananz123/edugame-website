import { getPublicClient, getPublicMediaUrl } from "@/lib/supabase/public";
import type { Locale } from "./types";

type GuideRow = {
  slug: string;
  title: Record<string, string>;
  summary: Record<string, string>;
  body_md: Record<string, string>;
  cover_path: string | null;
  video_url: string | null;
  category: string | null;
  updated_at: string;
};

export type GuideListItem = {
  slug: string;
  title: string;
  summary: string;
  category: string | null;
  coverUrl: string | null;
  updatedAt: string;
};

export type GuideDetail = GuideListItem & {
  body: string;
  videoUrl: string | null;
};

function localized(value: Record<string, string> | null, locale: Locale) {
  return value?.[locale] || value?.vi || value?.en || "";
}

function toListItem(row: GuideRow, locale: Locale): GuideListItem {
  return {
    slug: row.slug,
    title: localized(row.title, locale),
    summary: localized(row.summary, locale),
    category: row.category,
    coverUrl: row.cover_path ? getPublicMediaUrl(row.cover_path) : null,
    updatedAt: row.updated_at,
  };
}

export async function getGuides(locale: Locale): Promise<GuideListItem[]> {
  const client = getPublicClient();
  if (!client) return [];
  const { data, error } = await client
    .from("guides")
    .select("slug,title,summary,cover_path,category,updated_at")
    .eq("published", true)
    .order("sort_order")
    .order("updated_at", { ascending: false });
  if (error || !data) return [];
  return (data as GuideRow[]).map((row) => toListItem(row, locale));
}

export async function getGuide(
  locale: Locale,
  slug: string
): Promise<GuideDetail | null> {
  const client = getPublicClient();
  if (!client) return null;
  const { data, error } = await client
    .from("guides")
    .select(
      "slug,title,summary,body_md,cover_path,video_url,category,updated_at"
    )
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error || !data) return null;
  const row = data as GuideRow;
  return {
    ...toListItem(row, locale),
    body: localized(row.body_md, locale),
    videoUrl: row.video_url,
  };
}

export async function getGuideIndex(): Promise<
  { slug: string; updatedAt: string }[]
> {
  const client = getPublicClient();
  if (!client) return [];
  const { data, error } = await client
    .from("guides")
    .select("slug,updated_at")
    .eq("published", true)
    .order("sort_order");
  if (error || !data) return [];
  return (data as { slug: string; updated_at: string }[]).map((row) => ({
    slug: row.slug,
    updatedAt: row.updated_at,
  }));
}
