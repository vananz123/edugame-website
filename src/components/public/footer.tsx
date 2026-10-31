import { useTranslations } from "next-intl";
import { GraduationCap } from "lucide-react";
import { Link } from "@/i18n/navigation";

export function Footer({
  github,
  email,
}: {
  github: string;
  email: string;
}) {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60 bg-muted/20">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 font-semibold">
              <GraduationCap className="size-5 text-primary" />
              <span>EduGame Studio</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{t("tagline")}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold">{t("productHeading")}</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#product" className="hover:text-foreground">
                  {t("about")}
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-foreground">
                  {t("features")}
                </a>
              </li>
              <li>
                <a href="#download" className="hover:text-foreground">
                  {t("download")}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">{t("personalHeading")}</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground"
                >
                  {t("github")}
                </a>
              </li>
              <li>
                <Link href="/" className="hover:text-foreground">
                  EduGame Studio
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">{t("contactHeading")}</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <a href={`mailto:${email}`} className="hover:text-foreground">
                  {t("email")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border/60 pt-6 text-sm text-muted-foreground">
          {t("rights", { year })}
        </div>
      </div>
    </footer>
  );
}