import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getGuideIndex } from "@/lib/data/guides";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const languages = Object.fromEntries(
    routing.locales.map((locale) => [locale, `${baseUrl}/${locale}`])
  );

  const home: MetadataRoute.Sitemap = routing.locales.map((locale) => ({
    url: `${baseUrl}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: locale === routing.defaultLocale ? 1 : 0.8,
    alternates: { languages },
  }));

  const pages = ["about", "games", "features", "download"] as const;
  const pageEntries: MetadataRoute.Sitemap = pages.flatMap((page) =>
    routing.locales.map((locale) => ({
      url: `${baseUrl}/${locale}/${page}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, `${baseUrl}/${l}/${page}`])
        ),
      },
    }))
  );

  const docs: MetadataRoute.Sitemap = routing.locales.map((locale) => ({
    url: `${baseUrl}/${locale}/docs`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${baseUrl}/${l}/docs`])
      ),
    },
  }));

  const guides = await getGuideIndex();
  const guideEntries: MetadataRoute.Sitemap = guides.flatMap((guide) =>
    routing.locales.map((locale) => ({
      url: `${baseUrl}/${locale}/docs/${guide.slug}`,
      lastModified: new Date(guide.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [
            l,
            `${baseUrl}/${l}/docs/${guide.slug}`,
          ])
        ),
      },
    }))
  );

  return [...home, ...pageEntries, ...docs, ...guideEntries];
}
