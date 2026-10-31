import { useTranslations } from "next-intl";
import { Download as DownloadIcon, MonitorDown, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Placeholder — URL thật sẽ được cấu hình qua Admin/Supabase ở Phase 3.
const DOWNLOAD_URL = "#";
const TRIAL_URL = "#";

export function Download() {
  const t = useTranslations("download");

  const meta = [
    { label: t("versionLabel"), value: t("version") },
    { label: t("fileSizeLabel"), value: t("fileSize") },
    { label: t("releaseDateLabel"), value: t("releaseDate") },
  ];

  return (
    <section id="download" className="border-t border-border/60 bg-muted/20">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight">
            {t("heading")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("description")}
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <Card>
            <CardHeader>
              <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <MonitorDown className="size-5" />
              </div>
              <CardTitle>{t("cardTitle")}</CardTitle>
              <CardDescription>{t("requirements")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <dl className="grid grid-cols-3 gap-4">
                {meta.map((m) => (
                  <div key={m.label}>
                    <dt className="text-xs text-muted-foreground">{m.label}</dt>
                    <dd className="mt-1 text-sm font-medium">{m.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="flex flex-wrap gap-3">
                <Button
                  size="lg"
                  nativeButton={false}
                  render={<a href={DOWNLOAD_URL} />}
                >
                  <DownloadIcon className="size-4" />
                  {t("button")}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  nativeButton={false}
                  render={<a href={TRIAL_URL} />}
                >
                  <PlayCircle className="size-4" />
                  {t("trialButton")}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {t("releaseNotesLabel")}
                </CardTitle>
                <CardDescription>{t("releaseNotes")}</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("trialLabel")}</CardTitle>
                <CardDescription>{t("trial")}</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}