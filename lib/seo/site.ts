import { routing, type AppLocale } from "@/i18n/routing";

export const siteConfig = {
  name: "LeGuide",
  shortName: "LeGuide",
  description:
    "A step-by-step survival guide that helps international students navigate life and bureaucracy in France.",
  localeDefault: routing.defaultLocale,
  locales: routing.locales,
  themeColor: "#1a3d2e",
  backgroundColor: "#faf8f5",
} as const;

/** Absolute site origin (no trailing slash). Set `NEXT_PUBLIC_SITE_URL` in production. */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw) return raw.replace(/\/$/, "");
  return "http://localhost:3000";
}

export function absoluteUrl(path = "/"): string {
  const base = getSiteUrl();
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Path without locale → `/{locale}` or `/{locale}/guides/...`. */
export function localizedPath(locale: AppLocale, path = "/"): string {
  const normalized = !path || path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${normalized}`;
}

export function localizedUrl(locale: AppLocale, path = "/"): string {
  return absoluteUrl(localizedPath(locale, path));
}

/** hreflang map for a path that omits the locale segment. */
export function languageAlternates(path = "/"): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = localizedUrl(locale, path);
  }
  languages["x-default"] = localizedUrl(routing.defaultLocale, path);
  return languages;
}

export function ogLocale(locale: AppLocale): string {
  return locale === "fr" ? "fr_FR" : "en_GB";
}
