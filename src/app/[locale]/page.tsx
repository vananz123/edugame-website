import { setRequestLocale } from "next-intl/server";
import { getPublicData } from "@/lib/data/public";
import type { Locale } from "@/lib/data/types";
import { Navbar } from "@/components/public/navbar";
import { Hero } from "@/components/public/hero";
import { StatsStrip } from "@/components/public/stats-strip";
import { Highlights } from "@/components/public/highlights";
import { GameShowcase } from "@/components/public/game-showcase";
import { Features } from "@/components/public/features";
import { CtaSection } from "@/components/public/cta-section";
import { Footer } from "@/components/public/footer";

export const revalidate = 60;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const data = await getPublicData(locale as Locale);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero data={data.hero} />
        <StatsStrip />
        <Highlights />
        <GameShowcase data={data.games} limit={3} showViewAll />
        <Features data={data.features} limit={3} showViewAll />
        <CtaSection />
      </main>
      <Footer github={data.about.github} email={data.about.email} />
    </>
  );
}
