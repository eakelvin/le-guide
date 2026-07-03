"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export function BlogHeader() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const isGuides = segments[0] === "guides";
  const isArticle = isGuides && segments.length >= 2;
  const backHref = isArticle ? "/guides" : "/";
  const backLabel = isArticle ? "All guides" : "Home";

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
          {/* <Link
            href="/guides"
            className="font-heading truncate text-lg font-normal tracking-tight text-sand-800 no-underline md:text-[18px]"
          >
            Le<span className="text-forest-900">Guide</span>
          </Link> */}
        </div>
        <Button size="sm" className="shrink-0 rounded-full bg-forest-900 text-white hover:bg-forest-800" asChild>
          <Link href="/dashboard">Dashboard</Link>
        </Button>
      </div>
    </header>
  );
}
