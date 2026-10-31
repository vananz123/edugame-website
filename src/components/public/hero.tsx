import { useTranslations } from "next-intl";
import { Download, ArrowRight, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 text-center sm:px-6 sm:py-28">
        <Badge variant="secondary" className="mb-6">
          {t("badge")}
        </Badge>
        <h1 className="mx-auto max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl md:text-6xl">
          {t("title")}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground text-pretty">
          {t("description")}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="lg" nativeButton={false} render={<a href="#download" />}>
            <Download className="size-4" />
            {t("ctaPrimary")}
          </Button>
          <Button
            size="lg"
            variant="outline"
            nativeButton={false}
            render={<a href="#product" />}
          >
            {t("ctaSecondary")}
            <ArrowRight className="size-4" />
          </Button>
        </div>

        <div className="mx-auto mt-16 max-w-4xl">
          <div className="flex aspect-video items-center justify-center rounded-xl border border-border bg-muted/40 text-muted-foreground">
            <div className="flex flex-col items-center gap-2 px-4">
              <ImageIcon className="size-10" />
              <span className="text-sm">{t("screenshotAlt")}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}