import { cookies } from "next/headers";
import { routing, type AppLocale } from "@/i18n/routing";

const LOCALE_COOKIE = "NEXT_LOCALE";

export function isAppLocale(value: string): value is AppLocale {
  return routing.locales.includes(value as AppLocale);
}

/** Resolve locale from next-intl cookie (e.g. OAuth callback outside `[locale]` routes). */
export async function getLocaleFromCookie(): Promise<AppLocale> {
  const cookieStore = await cookies();
  const value = cookieStore.get(LOCALE_COOKIE)?.value;
  return value && isAppLocale(value) ? value : routing.defaultLocale;
}

/** Prefix a path that omits the locale segment (e.g. `/dashboard` → `/fr/dashboard`). */
export function withLocalePath(locale: AppLocale, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (LOCALE_PATTERN.test(normalized)) return normalized;
  if (normalized === "/") return `/${locale}`;
  return `/${locale}${normalized}`;
}

const LOCALE_PATTERN = new RegExp(`^/(${routing.locales.join("|")})(/|$)`);
