"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

type LocaleSwitcherProps = {
  className?: string;
  variant?: "compact" | "pill";
};

export function LocaleSwitcher({ className, variant = "compact" }: LocaleSwitcherProps) {
  const t = useTranslations("common");
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const router = useRouter();

  function switchLocale(nextLocale: AppLocale) {
    if (nextLocale === locale) return;
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-0.5",
        variant === "pill" &&
          "rounded-full border border-sand-200 bg-card p-0.5 text-[12px] shadow-xs",
        className,
      )}
      role="group"
      aria-label={t("language")}
    >
      {routing.locales.map((code) => {
        const active = code === locale;
        return (
          <button
            key={code}
            type="button"
            onClick={() => switchLocale(code)}
            className={cn(
              "rounded-full px-2.5 py-1 font-medium transition-colors",
              variant === "pill" &&
                (active
                  ? "bg-forest-900 text-white"
                  : "text-sand-600 hover:text-sand-800"),
              variant === "compact" &&
                (active
                  ? "text-sand-800 underline underline-offset-4"
                  : "text-sand-500 hover:text-sand-700"),
            )}
            aria-current={active ? "true" : undefined}
          >
            {code.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
