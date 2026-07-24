import type { Metadata } from "next";
import type { AppLocale } from "@/i18n/routing";
import {
  absoluteUrl,
  getSiteUrl,
  languageAlternates,
  localizedPath,
  localizedUrl,
  ogLocale,
  siteConfig,
} from "@/lib/seo/site";

type RobotsConfig = NonNullable<Metadata["robots"]>;

export type BuildPageMetadataInput = {
  title: string;
  description: string;
  /** Path without locale, e.g. `/guides` or `/guides/slug`. */
  path: string;
  locale: AppLocale;
  /** When true, title is used as-is (no `%s | LeGuide` template). */
  absoluteTitle?: boolean;
  robots?: RobotsConfig;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  section?: string;
  images?: string[];
};

export function buildPageMetadata({
  title,
  description,
  path,
  locale,
  absoluteTitle = false,
  robots,
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
  section,
  images,
}: BuildPageMetadataInput): Metadata {
  const url = localizedUrl(locale, path);
  const ogImage = images?.[0] ?? absoluteUrl("/opengraph-image");
  const imageList = images?.length
    ? images.map((src) => ({ url: src.startsWith("http") ? src : absoluteUrl(src) }))
    : [{ url: ogImage, width: 1200, height: 630, alt: siteConfig.name }];

  return {
    metadataBase: new URL(getSiteUrl()),
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: localizedPath(locale, path),
      languages: languageAlternates(path),
    },
    robots,
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: siteConfig.name,
      locale: ogLocale(locale),
      alternateLocale: siteConfig.locales
        .filter((l) => l !== locale)
        .map((l) => ogLocale(l)),
      images: imageList,
      ...(type === "article"
        ? {
            publishedTime,
            modifiedTime: modifiedTime ?? publishedTime,
            authors,
            section,
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageList.map((img) => (typeof img.url === "string" ? img.url : String(img.url))),
    },
  };
}

export const noIndexRobots: RobotsConfig = {
  index: false,
  follow: false,
  googleBot: { index: false, follow: false },
};
