import { useTranslations } from "next-intl";
import { Code2, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const GITHUB_URL = "https://github.com/vananz123";

export function About() {
  const t = useTranslations("about");

  return (
    <section id="about" className="border-t border-border/60 bg-muted/20">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[auto_1fr] md:items-start">
          <div className="flex size-24 items-center justify-center rounded-full border border-border bg-background text-muted-foreground">
            <User className="size-10" />
          </div>
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">
              {t("heading")}
            </h2>
            <p className="mt-2 text-lg font-medium">{t("name")}</p>
            <p className="mt-1 text-sm text-primary">{t("role")}</p>
            <p className="mt-6 max-w-2xl text-muted-foreground">{t("bio")}</p>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              {t("motivation")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                variant="outline"
                nativeButton={false}
                render={
                  <a
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                <Code2 className="size-4" />
                {t("github")}
              </Button>
              <Button
                variant="outline"
                nativeButton={false}
                render={<a href={`mailto:${t("email")}`} />}
              >
                <Mail className="size-4" />
                {t("contact")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}