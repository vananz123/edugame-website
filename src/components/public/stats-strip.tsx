import { Bot, Layers, Monitor, WifiOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { Reveal } from "./reveal";

const icons = [Layers, Bot, WifiOff, Monitor];

type Stat = { value: string; label: string };

export function StatsStrip() {
  const t = useTranslations("home");
  const stats = t.raw("stats") as Stat[];

  return (
    <section className="relative border-b border-border/60 bg-background">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-4 px-4 py-10 sm:px-6 lg:grid-cols-4">
        {stats.map((stat, i) => {
          const Icon = icons[i % icons.length];
          return (
            <Reveal key={stat.label} delay={i * 80}>
              <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground">
                  <Icon className="size-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-lg font-semibold leading-tight">{stat.value}</p>
                  <p className="truncate text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
