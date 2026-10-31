import {
  ArrowRight,
  BookOpen,
  Cpu,
  HeartHandshake,
  Sparkles,
  Users,
  WifiOff,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { FeaturesData } from "@/lib/data/types";
import { Reveal } from "./reveal";

const icons = [BookOpen, Sparkles, Users, Cpu, WifiOff, HeartHandshake];

export function Features({
  data,
  limit,
  showViewAll = false,
}: {
  data: FeaturesData;
  limit?: number;
  showViewAll?: boolean;
}) {
  const t = useTranslations("home");
  const items = limit ? data.items.slice(0, limit) : data.items;

  return (
    <section className="relative overflow-hidden border-b border-border/60 bg-muted/20">
      <div className="relative mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <Reveal>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-3xl font-semibold tracking-tight">
              {data.heading}
            </h2>
            {showViewAll ? (
              <Link
                href="/features"
                className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-foreground"
              >
                {t("viewAllFeatures")}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            ) : null}
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((feature, i) => {
            const Icon = icons[i % icons.length];
            return (
              <Reveal key={`${feature.title}-${i}`} delay={(i % 3) * 90}>
                <Card className="h-full transition duration-300 hover:-translate-y-1 hover:border-foreground/20 hover:shadow-lg">
                  <CardHeader>
                    <div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-foreground text-background">
                      <Icon className="size-5" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
