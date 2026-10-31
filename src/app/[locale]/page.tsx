import { setRequestLocale } from "next-intl/server";
import { Navbar } from "@/components/public/navbar";
import { Hero } from "@/components/public/hero";
import { About } from "@/components/public/about";
import { ProductOverview } from "@/components/public/product-overview";
import { GameShowcase } from "@/components/public/game-showcase";
import { Features } from "@/components/public/features";
import { Download } from "@/components/public/download";
import { Footer } from "@/components/public/footer";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <About />
        <ProductOverview />
        <GameShowcase />
        <Features />
        <Download />
      </main>
      <Footer />
    </>
  );
}