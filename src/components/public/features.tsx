import { useTranslations } from "next-intl";
import {
  BookOpen,
  Sparkles,
  Users,
  Cpu,
  WifiOff,
  HeartHandshake,
} from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type FeatureItem = { title: string; description: string };

const icons = [BookOpen, Sparkles, Users, Cpu, WifiOff, HeartHandshake];

export function Features() {
  const t = useTranslations("features");
  const items = t.raw("items") as FeatureItem[];

  return (
    <section id="features" className="border-t border-border/60">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <h2 className="text-3xl font-semibold tracking-tight">{t("heading")}</h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((feature, i) => {
            const Icon = icons[i % icons.length];
            return (
              <Card key={i}>
                <CardHeader>
                  <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}