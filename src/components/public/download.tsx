import { Download as DownloadIcon, MonitorDown, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { DownloadData } from "@/lib/data/types";
import { Reveal } from "./reveal";

export function Download({ data }: { data: DownloadData }) {
  const meta = [
    { label: data.versionLabel, value: data.version },
    { label: data.fileSizeLabel, value: data.fileSize },
    { label: data.releaseDateLabel, value: data.releaseDate },
  ];

  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div className="relative mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <Card className="relative h-full overflow-hidden pt-0">
              <div className="h-1 w-full bg-foreground" />
              <CardHeader>
                <div className="mb-2 flex size-11 items-center justify-center rounded-xl bg-foreground text-background">
                  <MonitorDown className="size-5" />
                </div>
                <CardTitle className="text-xl">{data.cardTitle}</CardTitle>
                <CardDescription>{data.requirements}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <dl className="grid grid-cols-3 gap-3">
                  {meta.map((m) => (
                    <div
                      key={m.label}
                      className="rounded-xl border border-border/70 bg-muted/40 px-3 py-2.5"
                    >
                      <dt className="text-xs text-muted-foreground">{m.label}</dt>
                      <dd className="mt-1 text-sm font-semibold">{m.value}</dd>
                    </div>
                  ))}
                </dl>
                <div className="flex flex-wrap gap-3">
                  <Button
                    size="lg"
                    nativeButton={false}
                    render={<a href={data.windowsUrl} />}
                  >
                    <DownloadIcon className="size-4" />
                    {data.button}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    nativeButton={false}
                    render={<a href={data.trialUrl} />}
                  >
                    <PlayCircle className="size-4" />
                    {data.trialButton}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Reveal>

          <div className="space-y-6">
            <Reveal delay={100}>
              <Card className="h-full transition hover:border-foreground/20 hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-base">
                    {data.releaseNotesLabel}
                  </CardTitle>
                  <CardDescription>{data.releaseNotes}</CardDescription>
                </CardHeader>
              </Card>
            </Reveal>
            <Reveal delay={180}>
              <Card className="transition hover:border-foreground/20 hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-base">{data.trialLabel}</CardTitle>
                  <CardDescription>{data.trial}</CardDescription>
                </CardHeader>
              </Card>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
