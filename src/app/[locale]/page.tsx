import { setRequestLocale } from "next-intl/server";
import { getPublicData } from "@/lib/data/public";
import type { Locale } from "@/lib/data/types";
import { Navbar } from "@/components/public/navbar";
import { Hero } from "@/components/public/hero";
import { About } from "@/components/public/about";
import { ProductOverview } from "@/components/public/product-overview";
import { GameShowcase } from "@/components/public/game-showcase";
import { Features } from "@/components/public/features";
import { Download } from "@/components/public/download";
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
        <About data={data.about} />
        <ProductOverview data={data.product} />
        <GameShowcase data={data.games} />
        <Features data={data.features} />
        <Download data={data.download} />
      </main>
      <Footer github={data.about.github} email={data.about.email} />
    </>
  );
}