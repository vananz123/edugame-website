import { ArrowRight, Download } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Reveal } from "./reveal";

export function CtaSection() {
  const t = useTranslations("cta");

  return (
    <section className="px-4 pb-20 sm:px-6">
      <Reveal className="mx-auto w-full max-w-6xl">
        <div className="relative overflow-hidden rounded-3xl bg-foreground px-6 py-14 text-background sm:px-12">
          <div className="relative flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <h2 className="text-3xl font-semibold tracking-tight text-balance">
                {t("title")}
              </h2>
              <p className="mt-3 text-background/70">{t("description")}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                className="bg-background text-foreground hover:bg-background/90"
                nativeButton={false}
                render={<Link href="/download" />}
              >
                <Download className="size-4" />
                {t("download")}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-background/30 bg-transparent text-background hover:bg-background/10 hover:text-background"
                nativeButton={false}
                render={<Link href="/docs" />}
              >
                {t("docs")}
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
