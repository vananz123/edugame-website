import { ArrowRight, BookOpen, Cpu, Gamepad2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Reveal } from "./reveal";

const highlights = [
  { key: "create", icon: BookOpen, href: "/features" },
  { key: "ai", icon: Cpu, href: "/features" },
  { key: "play", icon: Gamepad2, href: "/games" },
] as const;

export function Highlights() {
  const t = useTranslations("home");

  return (
    <section className="border-b border-border/60">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <Reveal>
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight">
              {t("highlightsHeading")}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {t("highlightsSubtitle")}
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {highlights.map((item, i) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.key} delay={i * 90}>
                <Link
                  href={item.href}
                  className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-foreground text-background">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="text-lg font-semibold">
                    {t(`highlights.${item.key}.title`)}
                  </h3>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">
                    {t(`highlights.${item.key}.description`)}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium">
                    {t("highlightsMore")}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
