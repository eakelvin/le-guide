import type { BlogCategory, BlogPost, GuidesFile } from "@/types/blog";
import guidesEn from "@/lib/data/guides.en.json";
import guidesFr from "@/lib/data/guides.fr.json";
import type { AppLocale } from "@/i18n/routing";

const BY_LOCALE: Record<AppLocale, GuidesFile> = {
  en: guidesEn as GuidesFile,
  fr: guidesFr as GuidesFile,
};

function getGuidesFile(locale: AppLocale = "en"): GuidesFile {
  return BY_LOCALE[locale] ?? BY_LOCALE.en;
}

/** English categories (backward-compatible export for callers that don't pass locale). */
export const BLOG_CATEGORIES: BlogCategory[] = (guidesEn as GuidesFile).categories.filter(
  (c) => c.id !== "admin",
);

export function getGuideCategories(locale: AppLocale = "en"): BlogCategory[] {
  return getGuidesFile(locale).categories.filter((c) => c.id !== "admin");
}

export function getAllGuidePosts(locale: AppLocale = "en"): BlogPost[] {
  return getGuidesFile(locale).posts;
}

/** Editorial articles shown on the public `/guides` index (excludes checklist walkthroughs). */
export function getPublicGuidePosts(locale: AppLocale = "en"): BlogPost[] {
  return getAllGuidePosts(locale).filter((p) => p.kind !== "checklist");
}

export function getPublicPostsByCategory(
  category: string | null,
  locale: AppLocale = "en",
): BlogPost[] {
  const editorial = getPublicGuidePosts(locale);
  if (!category || category === "all") return editorial;
  return editorial.filter((p) => p.category === category);
}

/** All posts (editorial + checklist-item walkthroughs) reachable at `/guides/[slug]`. */
export const BLOG_POSTS: BlogPost[] = getAllGuidePosts("en");

export function getPostBySlug(slug: string, locale: AppLocale = "en"): BlogPost | undefined {
  const localized = getAllGuidePosts(locale).find((p) => p.slug === slug);
  if (localized) return localized;
  if (locale !== "en") {
    return getAllGuidePosts("en").find((p) => p.slug === slug);
  }
  return undefined;
}

export function getAllGuideSlugs(): string[] {
  return getAllGuidePosts("en").map((p) => p.slug);
}

export function getChecklistGuidePosts(locale: AppLocale = "en"): BlogPost[] {
  return getAllGuidePosts(locale).filter((p) => p.kind === "checklist");
}

/** True when a checklist item has a deep-linked walkthrough at `/guides/[slug]`. */
export function hasGuideForSlug(slug: string): boolean {
  return isChecklistGuideSlug(slug);
}

/**
 * True when the slug corresponds to one of the curated checklist-step walkthroughs
 * (i.e. a guide that maps 1:1 to a `ChecklistItem.slug`).
 */
export function isChecklistGuideSlug(slug: string): boolean {
  return getChecklistGuidePosts("en").some((p) => p.slug === slug);
}

export function categoryMeta(id: string, locale: AppLocale = "en") {
  return getGuidesFile(locale).categories.find((c) => c.id === id);
}

/** Same-category guides for internal linking (excludes the current slug). */
export function getRelatedGuides(
  slug: string,
  locale: AppLocale = "en",
  limit = 3,
): BlogPost[] {
  const current = getPostBySlug(slug, locale);
  if (!current) return [];
  return getAllGuidePosts(locale)
    .filter((p) => p.slug !== slug && p.category === current.category)
    .slice(0, limit);
}
