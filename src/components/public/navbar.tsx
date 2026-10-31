"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, GraduationCap } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LanguageSwitcher } from "./language-switcher";

const items = [
  { key: "about", href: "/about" },
  { key: "games", href: "/games" },
  { key: "features", href: "/features" },
  { key: "docs", href: "/docs" },
  { key: "download", href: "/download" },
] as const;

const linkClass =
  "rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground";

export function Navbar() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="flex size-8 items-center justify-center rounded-xl bg-foreground text-background">
            <GraduationCap className="size-4.5" />
          </span>
          <span>EduGame Studio</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {items.map((it) => (
            <Link
              key={it.key}
              href={it.href}
              className={cn(
                linkClass,
                isActive(it.href) &&
                  "bg-muted font-medium text-foreground shadow-[inset_0_-2px_0_0_var(--foreground)]"
              )}
            >
              {t(it.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Button
            size="sm"
            className="hidden sm:inline-flex"
            nativeButton={false}
            render={<Link href="/download" />}
          >
            {tc("download")}
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label={tc("menu")}
                />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="sr-only">{tc("menu")}</SheetTitle>
              <nav className="mt-6 flex flex-col gap-1">
                {items.map((it) => (
                  <Link
                    key={it.key}
                    href={it.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      linkClass,
                      isActive(it.href) &&
                        "bg-muted font-medium text-foreground"
                    )}
                  >
                    {t(it.key)}
                  </Link>
                ))}
                <Button
                  className="mt-4"
                  nativeButton={false}
                  render={<Link href="/download" onClick={() => setOpen(false)} />}
                >
                  {tc("download")}
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
