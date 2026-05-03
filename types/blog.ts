export type BlogCategoryId = "general" | "alternance" | "stage" | "work";

export interface BlogCategory {
  id: BlogCategoryId;
  label: string;
  description: string;
}

export interface BlogSection {
  heading: string;
  paragraphs: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategoryId;
  readingMinutes: number;
  updated: string;
  sections: BlogSection[];
}
