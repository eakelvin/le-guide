import type { MetadataRoute } from "next";
import { getAllGuidePosts, getPublicGuidePosts } from "@/lib/blog";
import { languageAlternates, localizedUrl } from "@/lib/seo/site";
import { routing } from "@/i18n/routing";

const STATIC_PATHS = ["/", "/guides", "/privacy", "/terms"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const publicSlugs = new Set(getPublicGuidePosts("en").map((p) => p.slug));
  const posts = getAllGuidePosts("en");
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const path of STATIC_PATHS) {
      entries.push({
        url: localizedUrl(locale, path),
        lastModified: new Date(),
        changeFrequency: path === "/" ? "weekly" : "monthly",
        priority: path === "/" ? 1 : path === "/guides" ? 0.9 : 0.5,
        alternates: { languages: languageAlternates(path) },
      });
    }

    for (const post of posts) {
      const path = `/guides/${post.slug}`;
      entries.push({
        url: localizedUrl(locale, path),
        lastModified: new Date(post.updated),
        changeFrequency: "monthly",
        priority: publicSlugs.has(post.slug) ? 0.8 : 0.6,
        alternates: { languages: languageAlternates(path) },
      });
    }
  }

  return entries;
}
