export type BlogCategoryId = "general" | "alternance" | "stage" | "work" | "admin";

export interface BlogCategory {
  id: BlogCategoryId;
  label: string;
  description: string;
}

/**
 * A bullet inside a `BlogSection`. Two shapes:
 *  - plain string: "Just a sentence."
 *  - labeled:      { label: "Free", description: "…", href?: "https://free.fr" }
 *    Renders as **Free** — description (bold lead-in). When `href` is set the
 *    label becomes a link (opens in a new tab for external URLs).
 */
export type BlogBullet =
  | string
  | { label: string; description: string; href?: string };

export interface BlogSection {
  heading: string;
  paragraphs: string[];
  /** Optional bullet list rendered after paragraphs (e.g. recommendations, options to compare). */
  bullets?: BlogBullet[];
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategoryId;
  readingMinutes: number;
  updated: string;
  sections: BlogSection[];
  recommendation?: string;
  warning?: string;
}
