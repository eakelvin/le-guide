import type { AppLocale } from "@/i18n/routing";
import type { BlogCategory, BlogPost } from "@/types/blog";
import {
  BLOG_CATEGORIES,
  BLOG_POSTS,
  getPublicPostsByCategory as getPublicPostsByCategoryEn,
  getPostBySlug as getPostBySlugEn,
} from "@/lib/blog";

const FR_CATEGORIES: Record<string, { label: string; description: string }> = {
  general: {
    label: "Culture générale",
    description: "Droits, paperasse et vie étudiante quotidienne en France.",
  },
  alternance: {
    label: "Alternance",
    description: "Contrats d'apprentissage et de professionnalisation.",
  },
  stage: {
    label: "Stages",
    description: "Conventions de stage, durée, rémunération et stages à l'étranger.",
  },
  work: {
    label: "Travailler pendant ses études",
    description: "Jobs étudiants, heures et implications du titre de séjour.",
  },
  admin: {
    label: "Administratif",
    description: "Guides pas à pas pour vos démarches en France.",
  },
};

export function getBlogCategories(locale: AppLocale): BlogCategory[] {
  if (locale !== "fr") return BLOG_CATEGORIES;
  return BLOG_CATEGORIES.map((cat) => {
    const fr = FR_CATEGORIES[cat.id];
    return fr ? { ...cat, label: fr.label, description: fr.description } : cat;
  });
}

export function getPublicPostsByCategory(
  category: string | null,
  _locale: AppLocale,
): BlogPost[] {
  return getPublicPostsByCategoryEn(category);
}

export function getPostBySlug(slug: string, _locale: AppLocale): BlogPost | undefined {
  return getPostBySlugEn(slug);
}

export function getLocalizedBlogPosts(_locale: AppLocale): BlogPost[] {
  return BLOG_POSTS;
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
