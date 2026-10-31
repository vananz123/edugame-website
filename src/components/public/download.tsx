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

export function Download({ data }: { data: DownloadData }) {
  const meta = [
    { label: data.versionLabel, value: data.version },
    { label: data.fileSizeLabel, value: data.fileSize },
    { label: data.releaseDateLabel, value: data.releaseDate },
  ];

  return (
    <section id="download" className="border-t border-border/60 bg-muted/20">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight">
            {data.heading}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {data.description}
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <Card>
            <CardHeader>
              <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <MonitorDown className="size-5" />
              </div>
              <CardTitle>{data.cardTitle}</CardTitle>
              <CardDescription>{data.requirements}</CardDescription>
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

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {data.releaseNotesLabel}
                </CardTitle>
                <CardDescription>{data.releaseNotes}</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{data.trialLabel}</CardTitle>
                <CardDescription>{data.trial}</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}