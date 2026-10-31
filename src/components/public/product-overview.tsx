import { useTranslations } from "next-intl";
import { Check } from "lucide-react";

export function ProductOverview() {
  const t = useTranslations("product");
  const points = t.raw("points") as string[];

  return (
    <section id="product" className="border-t border-border/60">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight">
            {t("heading")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("description")}
          </p>
        </div>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {points.map((point) => (
            <li
              key={point}
              className="flex items-start gap-3 rounded-lg border border-border bg-card p-4"
            >
              <Check className="mt-0.5 size-5 shrink-0 text-primary" />
              <span className="text-sm">{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}