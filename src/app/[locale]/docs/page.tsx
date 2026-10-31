import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, BookOpen } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import { Badge } from "@/components/ui/badge";
import { getGuides } from "@/lib/data/guides";
import { getPublicData } from "@/lib/data/public";
import type { Locale } from "@/lib/data/types";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "docs" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}/docs`,
      languages: { vi: "/vi/docs", en: "/en/docs" },
    },
  };
}

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

export default async function DocsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "docs" });
  const [data, guides] = await Promise.all([
    getPublicData(locale as Locale),
    getGuides(locale as Locale),
  ]);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {t("title")}
            </h1>
            <p className="mt-3 text-muted-foreground">{t("description")}</p>
          </div>

          {guides.length ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {guides.map((guide) => (
                <Link
                  key={guide.slug}
                  href={`/docs/${guide.slug}`}
                  className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary/50"
                >
                  <div className="aspect-video w-full overflow-hidden bg-muted">
                    {guide.coverUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={guide.coverUrl}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        <BookOpen className="size-8" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    {guide.category ? (
                      <Badge variant="secondary" className="self-start">
                        {guide.category}
                      </Badge>
                    ) : null}
                    <h2 className="text-lg leading-snug font-semibold group-hover:text-primary">
                      {guide.title}
                    </h2>
                    {guide.summary ? (
                      <p className="line-clamp-3 text-sm text-muted-foreground">
                        {guide.summary}
                      </p>
                    ) : null}
                    <div className="mt-auto flex items-center justify-between gap-3 pt-2 text-xs text-muted-foreground">
                      <span>
                        {t("updated")} {formatDate(guide.updatedAt, locale)}
                      </span>
                      <span className="inline-flex items-center gap-1 text-primary">
                        {t("readMore")}
                        <ArrowRight className="size-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-10 flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center">
              <BookOpen className="size-10 text-muted-foreground" />
              <p className="mt-4 font-medium">{t("empty")}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("emptyHint")}
              </p>
            </div>
          )}
        </section>
      </main>
      <Footer github={data.about.github} email={data.about.email} />
    </>
  );
}
