import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import type { AppLocale } from "@/i18n/routing";
import type { BlogCategoryId, BlogPost, BlogSection } from "@/types/blog";
import {
  getPostBySlug as getPostBySlugFromFile,
  getPublicPostsByCategory as getPublicPostsByCategoryFromFile,
  getAllGuidePosts as getAllGuidePostsFromFile,
} from "@/lib/blog";

type GuideRow = {
  slug: string;
  locale: string;
  kind: string;
  title: string;
  excerpt: string;
  category: string;
  reading_minutes: number;
  updated_on: string;
  sections: BlogSection[] | null;
  recommendation: string | null;
  warning: string | null;
};

function rowToPost(row: GuideRow): BlogPost {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category as BlogCategoryId,
    readingMinutes: row.reading_minutes,
    updated: row.updated_on,
    sections: Array.isArray(row.sections) ? row.sections : [],
    recommendation: row.recommendation ?? undefined,
    warning: row.warning ?? undefined,
    kind: row.kind === "checklist" ? "checklist" : "editorial",
  };
}

/**
 * Fetch guide posts from Supabase when available; fall back to locale JSON files.
 * After `npm run seed:guides`, DB becomes the primary source (same pattern as checklist).
 */
export async function getGuidePostBySlug(
  slug: string,
  locale: AppLocale,
): Promise<BlogPost | undefined> {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data, error } = await supabase
      .from("guide_posts")
      .select("*")
      .eq("slug", slug)
      .eq("locale", locale)
      .maybeSingle();

    if (!error && data) return rowToPost(data as GuideRow);

    if (locale !== "en") {
      const { data: enData, error: enError } = await supabase
        .from("guide_posts")
        .select("*")
        .eq("slug", slug)
        .eq("locale", "en")
        .maybeSingle();
      if (!enError && enData) return rowToPost(enData as GuideRow);
    }
  } catch {
    // Table may not exist yet — fall through to JSON.
  }

  return getPostBySlugFromFile(slug, locale);
}

export async function getPublicGuidePostsByCategory(
  category: string | null,
  locale: AppLocale,
): Promise<BlogPost[]> {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    let query = supabase
      .from("guide_posts")
      .select("*")
      .eq("locale", locale)
      .eq("kind", "editorial")
      .order("updated_on", { ascending: false });

    if (category && category !== "all") {
      query = query.eq("category", category);
    }

    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      return (data as GuideRow[]).map(rowToPost);
    }

    if (locale !== "en") {
      let enQuery = supabase
        .from("guide_posts")
        .select("*")
        .eq("locale", "en")
        .eq("kind", "editorial")
        .order("updated_on", { ascending: false });
      if (category && category !== "all") {
        enQuery = enQuery.eq("category", category);
      }
      const { data: enData, error: enError } = await enQuery;
      if (!enError && enData && enData.length > 0) {
        return (enData as GuideRow[]).map(rowToPost);
      }
    }
  } catch {
    // fall through
  }

  return getPublicPostsByCategoryFromFile(category, locale);
}

export async function getAllGuidePostsFromDbOrFile(
  locale: AppLocale,
): Promise<BlogPost[]> {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data, error } = await supabase
      .from("guide_posts")
      .select("*")
      .eq("locale", locale);

    if (!error && data && data.length > 0) {
      return (data as GuideRow[]).map(rowToPost);
    }
  } catch {
    // fall through
  }
  return getAllGuidePostsFromFile(locale);
}
