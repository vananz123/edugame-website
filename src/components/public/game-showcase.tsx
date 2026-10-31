import { useTranslations } from "next-intl";
import { ImageIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type GameItem = { title: string; description: string };

export function GameShowcase() {
  const t = useTranslations("games");
  const items = t.raw("items") as GameItem[];

  return (
    <section id="games" className="border-t border-border/60 bg-muted/20">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight">
            {t("heading")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("description")}
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((game, i) => (
            <Card key={i} className="overflow-hidden pt-0">
              <div className="flex aspect-video items-center justify-center border-b border-border bg-muted/40 text-muted-foreground">
                <div className="flex flex-col items-center gap-1.5 px-4 text-center">
                  <ImageIcon className="size-7" />
                  <span className="text-xs">{t("screenshotPlaceholder")}</span>
                </div>
              </div>
              <CardHeader>
                <CardTitle>{game.title}</CardTitle>
                <CardDescription>{game.description}</CardDescription>
              </CardHeader>
              <CardContent />
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}