import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function buildPageMetadata(
  locale: string,
  page: "about" | "games" | "features" | "download"
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "pages" });
  const title = t(`${page}.title`);
  const description = t(`${page}.description`);

  return {
    title: `${title} · EduGame Studio`,
    description,
    alternates: {
      canonical: `/${locale}/${page}`,
      languages: { vi: `/vi/${page}`, en: `/en/${page}` },
    },
    openGraph: {
      title,
      description,
      locale: locale === "vi" ? "vi_VN" : "en_US",
      type: "website",
    },
  };
}
