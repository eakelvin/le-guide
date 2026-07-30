"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { LocaleSwitcher } from "@/components/layout/LocaleSwitcher";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export function BlogHeader() {
  const t = useTranslations("guides");
  const tCommon = useTranslations("common");
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const isGuides = segments[0] === "guides";
  const isArticle = isGuides && segments.length >= 2;
  const backHref = isArticle ? "/guides" : "/";
  const backLabel = isArticle ? t("allGuides") : tCommon("home");

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/75">
      <div
        className={cn(
          "mx-auto flex h-14 items-center justify-between gap-4 px-6 md:h-[60px] md:px-8",
          isArticle ? "max-w-3xl" : "max-w-6xl md:px-12",
        )}
      >
        <div className="flex min-w-0 items-center gap-3">
          <Button variant="ghost" size="sm" className="shrink-0 gap-1.5 px-2 text-sand-600" asChild>
            <Link href={backHref}>
              <ArrowLeft className="size-4" aria-hidden />
              <span className="hidden sm:inline">{backLabel}</span>
            </Link>
          </Button>
          <Logo size="sm" className="hidden sm:inline-flex" />
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <LocaleSwitcher variant="pill" />
          <Button size="sm" className="rounded-full bg-forest-900 text-white hover:bg-forest-800" asChild>
            <Link href="/dashboard">{tCommon("dashboard")}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
