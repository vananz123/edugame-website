import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import { Markdown } from "@/components/public/markdown";
import { Badge } from "@/components/ui/badge";
import { getGuide } from "@/lib/data/guides";
import { getPublicData } from "@/lib/data/public";
import type { Locale } from "@/lib/data/types";
import { getVideoEmbedUrl } from "@/lib/video";

export const revalidate = 60;

function formatDate(value: string, locale: string) {
  try {
    return new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-US", {
      dateStyle: "medium",
      timeZone: "UTC",
    }).format(new Date(value));
  } catch {
    return "";
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const guide = await getGuide(locale as Locale, slug);
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.summary,
    alternates: {
      canonical: `/${locale}/docs/${slug}`,
      languages: {
        vi: `/vi/docs/${slug}`,
        en: `/en/docs/${slug}`,
      },
    },
    openGraph: {
      title: guide.title,
      description: guide.summary,
      type: "article",
      ...(guide.coverUrl ? { images: [guide.coverUrl] } : {}),
    },
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "docs" });
  const [guide, data] = await Promise.all([
    getGuide(locale as Locale, slug),
    getPublicData(locale as Locale),
  ]);
  if (!guide) notFound();

  const embedUrl = getVideoEmbedUrl(guide.videoUrl);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <article className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
          <Link
            href="/docs"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            {t("back")}
          </Link>

          <header className="mt-6 space-y-3 border-b border-border pb-6">
            {guide.category ? (
              <Badge variant="secondary">{guide.category}</Badge>
            ) : null}
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {guide.title}
            </h1>
            {guide.summary ? (
              <p className="text-muted-foreground">{guide.summary}</p>
            ) : null}
            <p className="text-sm text-muted-foreground">
              {t("updated")} {formatDate(guide.updatedAt, locale)}
            </p>
          </header>

          {guide.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={guide.coverUrl}
              alt=""
              className="mt-6 w-full rounded-xl border border-border"
            />
          ) : null}

          {embedUrl ? (
            <section className="mt-6">
              <h2 className="mb-2 text-sm font-semibold text-muted-foreground">
                {t("video")}
              </h2>
              <div className="relative aspect-video overflow-hidden rounded-xl border border-border">
                <iframe
                  src={embedUrl}
                  title={guide.title}
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </section>
          ) : null}

          {guide.body ? (
            <div className="mt-8">
              <Markdown>{guide.body}</Markdown>
            </div>
          ) : null}
        </article>
      </main>
      <Footer github={data.about.github} email={data.about.email} />
    </>
  );
}
