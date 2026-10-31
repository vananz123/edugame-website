"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, GraduationCap } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LanguageSwitcher } from "./language-switcher";

const items = [
  { key: "about", href: "#about" },
  { key: "product", href: "#product" },
  { key: "games", href: "#games" },
  { key: "features", href: "#features" },
  { key: "download", href: "#download" },
] as const;

export function Navbar() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <GraduationCap className="size-5 text-primary" />
          <span>EduGame Studio</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {items.map((it) => (
            <a
              key={it.key}
              href={it.href}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {t(it.key)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Button
            size="sm"
            className="hidden sm:inline-flex"
            nativeButton={false}
            render={<a href="#download" />}
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
                  <a
                    key={it.key}
                    href={it.href}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {t(it.key)}
                  </a>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}