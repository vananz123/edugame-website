import Image from "next/image";
import { ArrowRight, ImageIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { GamesData } from "@/lib/data/types";
import { Reveal } from "./reveal";

export function GameShowcase({
  data,
  limit,
  showViewAll = false,
}: {
  data: GamesData;
  limit?: number;
  showViewAll?: boolean;
}) {
  const t = useTranslations("home");
  const items = limit ? data.items.slice(0, limit) : data.items;

  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div className="relative mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <Reveal>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-tight">
                {data.heading}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                {data.description}
              </p>
            </div>
            {showViewAll ? (
              <Link
                href="/games"
                className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-foreground"
              >
                {t("viewAllGames")}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            ) : null}
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((game, i) => (
            <Reveal key={`${game.title}-${i}`} delay={(i % 3) * 90}>
              <Card className="group h-full overflow-hidden pt-0 transition duration-300 hover:-translate-y-1 hover:border-foreground/20 hover:shadow-lg">
                <div className="relative aspect-video overflow-hidden border-b border-border">
                  {game.screenshotUrl ? (
                    <Image
                      src={game.screenshotUrl}
                      alt={game.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted">
                      <div className="flex flex-col items-center gap-1.5 px-4 text-center text-muted-foreground">
                        <ImageIcon className="size-7" />
                        <span className="text-xs font-medium">
                          {data.screenshotPlaceholder}
                        </span>
                      </div>
                    </div>
                  )}
                  <span className="absolute top-3 left-3 rounded-full bg-background/90 px-2.5 py-1 text-xs font-semibold text-foreground shadow-sm">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <CardHeader>
                  <CardTitle>{game.title}</CardTitle>
                  <CardDescription>{game.description}</CardDescription>
                </CardHeader>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
