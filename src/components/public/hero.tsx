import { ArrowRight, Cpu, Download, Monitor, Sparkles, WifiOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { HeroData } from "@/lib/data/types";
import { Reveal } from "./reveal";

const chipIcons = [Monitor, WifiOff, Cpu];

export function Hero({ data }: { data: HeroData }) {
  const t = useTranslations("hero");
  const chips = t.raw("chips") as string[];

  return (
    <section className="relative overflow-hidden border-b border-border/60 bg-mesh">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <Reveal>
            <Badge variant="secondary" className="px-3 py-1">
              <Sparkles className="size-3.5" />
              {data.badge}
            </Badge>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-balance sm:text-5xl md:text-[3.4rem] md:leading-[1.05]">
              {data.title}
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground text-pretty">
              {data.description}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                nativeButton={false}
                render={<Link href="/download" />}
              >
                <Download className="size-4" />
                {data.ctaPrimary}
              </Button>
              <Button
                size="lg"
                variant="outline"
                nativeButton={false}
                render={<Link href="/games" />}
              >
                {data.ctaSecondary}
                <ArrowRight className="size-4" />
              </Button>
            </div>

            <ul className="mt-8 flex flex-wrap gap-2">
              {chips.map((chip, i) => {
                const Icon = chipIcons[i % chipIcons.length];
                return (
                  <li
                    key={chip}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground"
                  >
                    <Icon className="size-3.5" />
                    {chip}
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={150}>
          <div
            className="relative mx-auto w-full max-w-lg"
            aria-label={data.screenshotAlt}
            role="img"
          >
            <div className="rounded-2xl border border-border bg-card p-4 shadow-xl shadow-black/5">
              <div className="flex items-center gap-1.5 pb-3">
                <span className="size-2.5 rounded-full bg-muted-foreground/30" />
                <span className="size-2.5 rounded-full bg-muted-foreground/20" />
                <span className="size-2.5 rounded-full bg-muted-foreground/10" />
                <span className="ml-3 h-4 flex-1 rounded-full bg-muted" />
              </div>

              <div className="rounded-xl border border-border/70 bg-muted/30 p-4">
                <div className="h-16 rounded-lg bg-foreground/85" />
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <div className="h-14 rounded-lg bg-muted-foreground/10 ring-1 ring-border" />
                  <div className="h-14 rounded-lg bg-muted-foreground/15 ring-1 ring-border" />
                  <div className="h-14 rounded-lg bg-muted-foreground/10 ring-1 ring-border" />
                </div>
                <div className="mt-3 space-y-2">
                  <div className="h-3 w-4/5 rounded-full bg-muted-foreground/20" />
                  <div className="h-3 w-3/5 rounded-full bg-muted-foreground/10" />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="h-8 rounded-lg bg-muted" />
                <div className="h-8 rounded-lg bg-muted" />
                <div className="h-8 rounded-lg bg-muted" />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
