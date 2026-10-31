import { Check } from "lucide-react";
import type { ProductData } from "@/lib/data/types";
import { Reveal } from "./reveal";

export function ProductOverview({ data }: { data: ProductData }) {
  return (
    <section className="relative overflow-hidden border-b border-border/60 bg-muted/20">
      <div className="relative mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <Reveal>
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight">
              {data.heading}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {data.description}
            </p>
          </div>
        </Reveal>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.points.map((point, i) => (
            <Reveal key={point} delay={(i % 3) * 80}>
              <li className="flex h-full items-start gap-3 rounded-2xl border border-border/70 bg-card p-4 transition hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-md">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
                  <Check className="size-3.5" />
                </span>
                <span className="text-sm">{point}</span>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
