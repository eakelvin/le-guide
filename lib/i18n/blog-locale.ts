import type { AppLocale } from "@/i18n/routing";
import type { BlogCategory, BlogPost } from "@/types/blog";
import {
  getAllGuidePosts,
  getGuideCategories,
  getPostBySlug as getPostBySlugFromFile,
  getPublicPostsByCategory as getPublicPostsByCategoryFromFile,
} from "@/lib/blog";

export function getBlogCategories(locale: AppLocale): BlogCategory[] {
  return getGuideCategories(locale);
}

export function getPublicPostsByCategory(
  category: string | null,
  locale: AppLocale,
): BlogPost[] {
  return getPublicPostsByCategoryFromFile(category, locale);
}

export function getPostBySlug(slug: string, locale: AppLocale): BlogPost | undefined {
  return getPostBySlugFromFile(slug, locale);
}

export function getLocalizedBlogPosts(locale: AppLocale): BlogPost[] {
  return getAllGuidePosts(locale);
}

/** Merge Supabase checklist copy onto a checklist-linked guide post. */
export function mergeChecklistGuidePost(
  post: BlogPost,
  checklist?: { title: string; shortDescription: string } | null,
): BlogPost {
  if (!checklist) return post;
  return {
    ...post,
    title: checklist.title,
    excerpt: checklist.shortDescription,
  };
}
