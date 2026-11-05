import type { ReactNode } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  Gamepad2,
  Download,
  BookOpen,
  Settings,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { logoutAction } from "@/app/admin/login/actions";
import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";

const nav = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/content", label: "Content", icon: FileText },
  { href: "/admin/games", label: "Games", icon: Gamepad2 },
  { href: "/admin/guides", label: "Guides", icon: BookOpen },
  { href: "/admin/downloads", label: "Downloads", icon: Download },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireAdmin();

  return (
    <div className="flex min-h-screen flex-1">
      <aside className="hidden w-60 flex-col border-r border-border bg-muted/20 md:flex">
        <div className="flex h-16 items-center gap-2 border-b border-border px-4 font-semibold">
          <BrandMark className="size-7" />
          EduGame Admin
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="space-y-2 border-t border-border p-3">
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          <form action={logoutAction}>
            <Button variant="outline" size="sm" className="w-full">
              <LogOut className="size-4" />
              Sign out
            </Button>
          </form>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border px-4 md:px-6">
          <span className="font-semibold md:hidden">EduGame Admin</span>
          <Link
            href="/vi"
            className="ml-auto flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ExternalLink className="size-4" />
            View site
          </Link>
        </header>

        <nav className="flex gap-1 overflow-x-auto border-b border-border px-2 py-2 md:hidden">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>

      <Toaster position="top-right" />
    </div>
  );
}