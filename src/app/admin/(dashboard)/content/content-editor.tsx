"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { saveContent } from "./actions";
import type { ContentSchema, FieldDef } from "./schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

const LOCALES = ["vi", "en"] as const;
type Locale = (typeof LOCALES)[number];

type ItemRow = { title: string; description: string };
type ContentValue = Record<Locale, Record<string, unknown>>;

function normalize(
  initial: Record<string, unknown> | undefined,
  schema: ContentSchema
): ContentValue {
  const out = { vi: {}, en: {} } as ContentValue;
  for (const locale of LOCALES) {
    const src = (initial?.[locale] ?? {}) as Record<string, unknown>;
    for (const f of schema.fields) {
      const raw = src[f.name];
      if (f.type === "list") {
        out[locale][f.name] = Array.isArray(raw) ? raw.map(String) : [];
      } else if (f.type === "items") {
        out[locale][f.name] = Array.isArray(raw)
          ? (raw as ItemRow[]).map((r) => ({
              title: String(r?.title ?? ""),
              description: String(r?.description ?? ""),
            }))
          : [];
      } else {
        out[locale][f.name] = raw == null ? "" : String(raw);
      }
    }
  }
  return out;
}

export function ContentEditor({
  schema,
  initial,
  status,
}: {
  schema: ContentSchema;
  initial?: Record<string, unknown>;
  status?: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState<ContentValue>(() =>
    normalize(initial, schema)
  );
  const [published, setPublished] = useState(status === "published");
  const [busy, setBusy] = useState(false);

  function setField(locale: Locale, name: string, v: unknown) {
    setValue((prev) => ({
      ...prev,
      [locale]: { ...prev[locale], [name]: v },
    }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const fd = new FormData();
    fd.set("key", schema.key);
    fd.set("content_json", JSON.stringify(value));
    fd.set("status", published ? "published" : "draft");
    const res = await saveContent(fd);
    setBusy(false);
    if (res.error) {
      toast.error(res.error);
      return;
    }
    toast.success("Content saved.");
    router.refresh();
  }

  function renderField(f: FieldDef, locale: Locale) {
    const id = `${schema.key}-${f.name}-${locale}`;
    const val = value[locale][f.name];

    if (f.type === "list") {
      const lines = (val as string[]) ?? [];
      return (
        <Textarea
          id={id}
          rows={5}
          value={lines.join("\n")}
          onChange={(e) => setField(locale, f.name, e.target.value.split("\n"))}
        />
      );
    }

    if (f.type === "items") {
      const rows = (val as ItemRow[]) ?? [];
      const update = (next: ItemRow[]) => setField(locale, f.name, next);
      return (
        <div className="space-y-2">
          {rows.map((row, i) => (
            <div
              key={i}
              className="grid grid-cols-[1fr_1fr_auto] items-start gap-2"
            >
              <Input
                aria-label={`${f.label} ${i + 1} title (${locale})`}
                placeholder="Title"
                value={row.title}
                onChange={(e) =>
                  update(
                    rows.map((r, j) =>
                      j === i ? { ...r, title: e.target.value } : r
                    )
                  )
                }
              />
              <Input
                aria-label={`${f.label} ${i + 1} description (${locale})`}
                placeholder="Description"
                value={row.description}
                onChange={(e) =>
                  update(
                    rows.map((r, j) =>
                      j === i ? { ...r, description: e.target.value } : r
                    )
                  )
                }
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Remove item"
                onClick={() => update(rows.filter((_, j) => j !== i))}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => update([...rows, { title: "", description: "" }])}
          >
            <Plus className="size-4" />
            Add item
          </Button>
        </div>
      );
    }

    const str = (val as string) ?? "";
    if (f.type === "textarea") {
      return (
        <Textarea
          id={id}
          rows={4}
          value={str}
          onChange={(e) => setField(locale, f.name, e.target.value)}
        />
      );
    }
    return (
      <Input
        id={id}
        value={str}
        onChange={(e) => setField(locale, f.name, e.target.value)}
      />
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {schema.fields.map((f) => (
        <div key={f.name} className="space-y-3">
          <Label className="text-sm font-medium">{f.label}</Label>
          <div className="grid gap-4 md:grid-cols-2">
            {LOCALES.map((locale) => (
              <div key={locale} className="space-y-1.5">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  {locale}
                </span>
                {renderField(f, locale)}
              </div>
            ))}
          </div>
        </div>
      ))}

      <Separator />

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Switch
            id={`${schema.key}-published`}
            checked={published}
            onCheckedChange={setPublished}
          />
          <Label htmlFor={`${schema.key}-published`}>
            Published (visible on the public site)
          </Label>
        </div>
        <Button type="submit" disabled={busy}>
          {busy ? "Saving…" : "Save"}
        </Button>
      </div>
    </form>
  );
}