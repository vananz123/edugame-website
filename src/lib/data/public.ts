import vi from "../../../messages/vi.json";
import en from "../../../messages/en.json";
import { getPublicClient, getPublicMediaUrl } from "@/lib/supabase/public";
import type { Locale, PublicData } from "./types";

const messages = { vi, en };
const GITHUB_FALLBACK = "https://github.com/vananz123";

type SiteRow = { key: string; content: Record<string, unknown> };
type GameRow = {
  title: Record<string, string>;
  description: Record<string, string>;
  screenshot_path: string | null;
  video_url: string | null;
};
type DownloadRow = {
  version: string;
  windows_url: string;
  file_size: string;
  release_date: string | null;
  system_requirements: Record<string, string>;
  release_notes: Record<string, string>;
  trial_url: string | null;
};

// Đọc nội dung published từ Supabase; fallback về messages khi DB trống/chưa áp dụng.
export async function getPublicData(locale: Locale): Promise<PublicData> {
  const f = messages[locale];
  const client = getPublicClient();

  const site: Record<string, Record<string, unknown>> = {};
  let gameRows: GameRow[] = [];
  let dl: DownloadRow | null = null;

  if (client) {
    const [siteRes, gamesRes, dlRes] = await Promise.all([
      client.from("site_content").select("key,content").eq("status", "published"),
      client
        .from("games")
        .select("title,description,screenshot_path,video_url")
        .eq("published", true)
        .order("sort_order"),
      client
        .from("downloads")
        .select(
          "version,windows_url,file_size,release_date,system_requirements,release_notes,trial_url"
        )
        .eq("published", true)
        .limit(1)
        .maybeSingle(),
    ]);
    if (!siteRes.error && siteRes.data) {
      for (const row of siteRes.data as SiteRow[]) site[row.key] = row.content;
    }
    if (!gamesRes.error && gamesRes.data) gameRows = gamesRes.data as GameRow[];
    if (!dlRes.error) dl = dlRes.data as DownloadRow | null;
  }

  const loc = <T,>(key: string, fallback: T): T =>
    (site[key]?.[locale] as T) ?? fallback;

  const contact = loc("contact", {
    github: GITHUB_FALLBACK,
    email: f.about.email,
  });
  const aboutBase = loc("about", f.about);
  const heroBase = loc("hero", f.hero);
  const productBase = loc("product", f.product);
  const featuresBase = loc("features", f.features);

  return {
    hero: { ...f.hero, ...heroBase },
    about: {
      heading: f.about.heading,
      name: aboutBase.name,
      role: aboutBase.role,
      bio: aboutBase.bio,
      motivation: aboutBase.motivation,
      github: contact.github,
      githubLabel: f.about.github,
      contactLabel: f.about.contact,
      email: contact.email,
    },
    product: { ...f.product, ...productBase },
    features: { ...f.features, ...featuresBase },
    games: {
      heading: f.games.heading,
      description: f.games.description,
      screenshotPlaceholder: f.games.screenshotPlaceholder,
      items: gameRows.length
        ? gameRows.map((g) => ({
            title: g.title[locale],
            description: g.description[locale],
            screenshotUrl: g.screenshot_path
              ? getPublicMediaUrl(g.screenshot_path)
              : null,
            videoUrl: g.video_url,
          }))
        : f.games.items,
    },
    download: {
      heading: f.download.heading,
      description: f.download.description,
      cardTitle: f.download.cardTitle,
      button: f.download.button,
      versionLabel: f.download.versionLabel,
      version: dl?.version || f.download.version,
      fileSizeLabel: f.download.fileSizeLabel,
      fileSize: dl?.file_size || f.download.fileSize,
      releaseDateLabel: f.download.releaseDateLabel,
      releaseDate: dl?.release_date || f.download.releaseDate,
      requirementsLabel: f.download.requirementsLabel,
      requirements:
        dl?.system_requirements?.[locale] || f.download.requirements,
      releaseNotesLabel: f.download.releaseNotesLabel,
      releaseNotes: dl?.release_notes?.[locale] || f.download.releaseNotes,
      trialLabel: f.download.trialLabel,
      trial: f.download.trial,
      trialButton: f.download.trialButton,
      windowsUrl: dl?.windows_url || "#",
      trialUrl: dl?.trial_url || "#",
    },
  };
}