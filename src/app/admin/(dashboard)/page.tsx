import Link from "next/link";
import { BookOpen, Download, FileText, Gamepad2 } from "lucide-react";
import { getServerClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function AdminOverviewPage() {
  const supabase = await getServerClient();
  const [games, content, downloads, guides] = await Promise.all([
    supabase.from("games").select("id,published"),
    supabase.from("site_content").select("key,status"),
    supabase.from("downloads").select("id,published"),
    supabase.from("guides").select("id,published"),
  ]);

  const gameRows = games.data ?? [];
  const contentRows = content.data ?? [];
  const dlRows = downloads.data ?? [];
  const guideRows = guides.data ?? [];

  const stats = [
    {
      label: "Games",
      value: `${gameRows.filter((g) => g.published).length}/${gameRows.length}`,
      hint: "published / total",
      href: "/admin/games",
      icon: Gamepad2,
    },
    {
      label: "Content sections",
      value: `${contentRows.filter((c) => c.status === "published").length}/${contentRows.length}`,
      hint: "published / total",
      href: "/admin/content",
      icon: FileText,
    },
    {
      label: "Guides",
      value: `${guideRows.filter((g) => g.published).length}/${guideRows.length}`,
      hint: "published / total",
      href: "/admin/guides",
      icon: BookOpen,
    },
    {
      label: "Downloads",
      value: `${dlRows.filter((d) => d.published).length}/${dlRows.length}`,
      hint: "published / total",
      href: "/admin/downloads",
      icon: Download,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage the public website content without editing code.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="transition-colors hover:bg-muted/40">
              <CardHeader>
                <div className="mb-2 flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <s.icon className="size-4" />
                </div>
                <CardTitle className="text-2xl">{s.value}</CardTitle>
                <CardDescription>
                  {s.label} · {s.hint}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick actions</CardTitle>
          <CardDescription>Jump to a management area.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3 text-sm">
          <Link href="/admin/content" className="text-primary hover:underline">
            Edit content
          </Link>
          <Link href="/admin/games" className="text-primary hover:underline">
            Manage games
          </Link>
          <Link href="/admin/guides" className="text-primary hover:underline">
            Manage guides
          </Link>
          <Link href="/admin/downloads" className="text-primary hover:underline">
            Manage downloads
          </Link>
          <Link href="/admin/settings" className="text-primary hover:underline">
            Settings
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}