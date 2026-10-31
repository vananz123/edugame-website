import Image from "next/image";
import { ImageIcon } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { GamesData } from "@/lib/data/types";

export function GameShowcase({ data }: { data: GamesData }) {
  return (
    <section id="games" className="border-t border-border/60 bg-muted/20">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight">
            {data.heading}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {data.description}
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((game, i) => (
            <Card key={i} className="overflow-hidden pt-0">
              <div className="relative flex aspect-video items-center justify-center border-b border-border bg-muted/40 text-muted-foreground">
                {game.screenshotUrl ? (
                  <Image
                    src={game.screenshotUrl}
                    alt={game.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1.5 px-4 text-center">
                    <ImageIcon className="size-7" />
                    <span className="text-xs">{data.screenshotPlaceholder}</span>
                  </div>
                )}
              </div>
              <CardHeader>
                <CardTitle>{game.title}</CardTitle>
                <CardDescription>{game.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}