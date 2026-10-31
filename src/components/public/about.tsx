import { Code2, Mail, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AboutData } from "@/lib/data/types";
import { Reveal } from "./reveal";

export function About({ data }: { data: AboutData }) {
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div className="relative mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <Reveal>
          <div className="grid gap-10 rounded-3xl border border-border/70 bg-card/60 p-6 backdrop-blur sm:p-10 md:grid-cols-[auto_1fr] md:items-start">
            <div className="relative mx-auto md:mx-0">
              <div className="flex size-28 items-center justify-center rounded-full border border-border bg-muted text-foreground">
                <User className="size-12" />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-semibold tracking-tight">
                {data.heading}
              </h2>
              <p className="mt-3 text-xl font-semibold">{data.name}</p>
              <p className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-sm font-medium text-foreground">
                <Sparkles className="size-3.5" />
                {data.role}
              </p>
              <p className="mt-6 max-w-2xl text-muted-foreground">{data.bio}</p>
              <p className="mt-4 max-w-2xl text-muted-foreground">
                {data.motivation}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  nativeButton={false}
                  render={
                    <a
                      href={data.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                >
                  <Code2 className="size-4" />
                  {data.githubLabel}
                </Button>
                <Button
                  variant="outline"
                  nativeButton={false}
                  render={<a href={`mailto:${data.email}`} />}
                >
                  <Mail className="size-4" />
                  {data.contactLabel}
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
