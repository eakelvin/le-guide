"use client";

import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { ChevronsUpDown, Languages, LayoutDashboard, LogOut, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutAction } from "@/features/auth/logout";
import { routing, type AppLocale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const LOCALE_LABELS: Record<AppLocale, string> = {
  fr: "Français",
  en: "English",
};

export function UserMenu({
  name,
  email,
  imageUrl,
  align = "end",
  variant = "icon",
}: {
  name?: string | null;
  email?: string | null;
  imageUrl?: string | null;
  align?: "start" | "end" | "center";
  /**
   * Trigger style:
   *  - "icon" (default) → avatar-only circle, used in the navbar.
   *  - "row" → full-width row with avatar + name + email + chevron, for sidebar footers.
   */
  variant?: "icon" | "row";
}) {
  const t = useTranslations("auth");
  const tCommon = useTranslations("common");
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const router = useRouter();
  const fallback =
    (name ?? email ?? "U")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("") || "U";

  function switchLocale(nextLocale: string) {
    if (!routing.locales.includes(nextLocale as AppLocale)) return;
    if (nextLocale === locale) return;
    router.replace(pathname, { locale: nextLocale as AppLocale });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={name ?? email ?? tCommon("accountMenu")}
        className={cn(
          "outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          variant === "row"
            ? "flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-sand-50"
            : "rounded-full",
        )}
      >
        <Avatar className="size-9 shrink-0 ring-2 ring-border">
          {imageUrl ? <AvatarImage src={imageUrl} alt={name ?? tCommon("userAvatar")} /> : null}
          <AvatarFallback className="bg-sand-100 text-xs font-medium text-sand-700">
            {fallback}
          </AvatarFallback>
        </Avatar>
        {variant === "row" ? (
          <>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-sand-800">{name ?? tCommon("account")}</p>
              {email ? <p className="truncate text-[11px] text-sand-500">{email}</p> : null}
            </div>
            <ChevronsUpDown className="size-4 shrink-0 text-sand-400" aria-hidden />
          </>
        ) : null}
      </DropdownMenuTrigger>

      <DropdownMenuContent align={align} className="w-56">
        <DropdownMenuLabel className="space-y-0.5">
          <p className="text-sm font-medium leading-none text-sand-800">{name ?? tCommon("account")}</p>
          {email ? <p className="text-xs font-normal text-sand-500">{email}</p> : null}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard">
            <LayoutDashboard className="mr-2 size-4" aria-hidden />
            {tCommon("dashboard")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/profile">
            <User className="mr-2 size-4" aria-hidden />
            {tCommon("profile")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="flex items-center gap-2 px-2 py-1.5 text-[11px] font-medium uppercase tracking-wide text-sand-400">
          <Languages className="size-3.5" aria-hidden />
          {tCommon("language")}
        </DropdownMenuLabel>
        <DropdownMenuRadioGroup value={locale} onValueChange={switchLocale}>
          {routing.locales.map((code) => (
            <DropdownMenuRadioItem key={code} value={code}>
              {LOCALE_LABELS[code]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <form action={logoutAction}>
          <DropdownMenuItem asChild>
            <button type="submit" className="w-full">
              <LogOut className="mr-2 size-4" aria-hidden />
              {t("signOut")}
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
