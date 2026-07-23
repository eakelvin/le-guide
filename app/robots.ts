import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo/site";
import { routing } from "@/i18n/routing";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          ...routing.locales.flatMap((locale) => [
            `/${locale}/dashboard`,
            `/${locale}/profile`,
            `/${locale}/auth/`,
          ]),
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
