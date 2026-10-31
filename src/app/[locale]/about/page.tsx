import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPublicData } from "@/lib/data/public";
import type { Locale } from "@/lib/data/types";
import { buildPageMetadata } from "@/lib/page-metadata";
import { Navbar } from "@/components/public/navbar";
import { PageHeader } from "@/components/public/page-header";
import { About } from "@/components/public/about";
import { ProductOverview } from "@/components/public/product-overview";
import { CtaSection } from "@/components/public/cta-section";
import { Footer } from "@/components/public/footer";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, "about");
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const data = await getPublicData(locale as Locale);
  const t = await getTranslations("pages");

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <PageHeader
          title={t("about.title")}
          description={t("about.description")}
        />
        <About data={data.about} />
        <ProductOverview data={data.product} />
        <CtaSection />
      </main>
      <Footer github={data.about.github} email={data.about.email} />
    </>
  );
}
