"use client";

import { useState } from "react";
import { CONTENT_SCHEMAS } from "./schemas";
import { ContentEditor } from "./content-editor";
import { Badge } from "@/components/ui/badge";
import { cn } from "cn";

export type ContentRow = {
  key: string;
  content: Record<string, unknown>;
  status: string;
};

export function ContentManager({ rows }: { rows: ContentRow[] }) {
  const byKey = Object.fromEntries(rows.map((r) => [r.key, r]));
  const [selected, setSelected] = useState(CONTENT_SCHEMAS[0].key);
  const schema = CONTENT_SCHEMAS.find((s) => s.key === selected)!;
  const row = byKey[selected];

  return (
    <div className="grid gap-6 md:grid-cols-[200px_1fr]">
      <nav className="flex flex-row flex-wrap gap-1 md:flex-col">
        {CONTENT_SCHEMAS.map((s) => {
          const st = byKey[s.key]?.status;
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => setSelected(s.key)}
              className={cn(
                "flex items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors",
                selected === s.key
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground hover:bg-muted/50"
              )}
            >
              {s.label}
              {st === "published" ? (
                <Badge variant="secondary">Live</Badge>
              ) : st === "draft" ? (
                <Badge variant="outline">Draft</Badge>
              ) : null}
            </button>
          );
        })}
      </nav>

      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-medium">{schema.label}</h2>
          <p className="text-sm text-muted-foreground">{schema.description}</p>
        </div>
        <ContentEditor
          key={selected}
          schema={schema}
          initial={row?.content}
          status={row?.status}
        />
      </div>
    </div>
  );
}