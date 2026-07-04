import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BLOG_CATEGORIES, getPublicPostsByCategory } from "@/lib/blog";
import { cn } from "@/lib/utils";
import type { BlogCategoryId } from "@/types/blog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guides for students in France | LeGuide",
  description:
    "Practical articles on alternance, internships (stages), working on a student visa, and student life in France — for international students.",
};

const CATEGORY_BADGE: Record<BlogCategoryId, string> = {
  general: "border-transparent bg-azure-50 text-azure-700",
  alternance: "border-transparent bg-forest-50 text-forest-700",
  stage: "border-transparent bg-violet-50 text-violet-700",
  work: "border-transparent bg-gold-50 text-gold-700",
  admin: "border-transparent bg-coral-50 text-coral-700",
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: raw } = await searchParams;
  const category = raw && BLOG_CATEGORIES.some((c) => c.id === raw) ? raw : "all";
  const posts = getPublicPostsByCategory(category);

  return (
    <main className="mx-auto max-w-6xl px-6 pb-20 pt-10 md:px-12 md:pt-14">
      <div className="mb-10 max-w-2xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-sand-400">Knowledge base</p>
        <h1 className="font-heading text-3xl font-light tracking-tight text-sand-800 md:text-4xl">
          Guides for life & work as a student in France
        </h1>
        <p className="mt-3 text-base leading-relaxed text-sand-600">
          Articles on <strong className="font-medium text-sand-800">alternance</strong>,{" "}
          <strong className="font-medium text-sand-800">internships</strong>, working within your permit, and everyday
          student life. Step-by-step walkthroughs for your checklist live in the dashboard — open any item and use{" "}
          <strong className="font-medium text-sand-800">Read the full guide</strong> when you need more detail.
        </p>
      </div>

      <div className="mb-10 flex flex-col gap-3">
        <p className="text-xs font-medium uppercase tracking-wide text-sand-400">Browse by topic</p>
        <div className="flex flex-wrap gap-2">
          <Link href="/guides">
            <Badge
              variant="outline"
              className={cn(
                "cursor-pointer px-3 py-1 text-xs font-medium transition-colors",
                category === "all"
                  ? "border-forest-600 bg-forest-50 text-forest-800"
                  : "border-border text-sand-600 hover:bg-sand-50",
              )}
            >
              All articles
            </Badge>
          </Link>
          {BLOG_CATEGORIES.map((c) => (
            <Link key={c.id} href={`/guides?category=${c.id}`}>
              <Badge
                variant="outline"
                className={cn(
                  "cursor-pointer px-3 py-1 text-xs font-medium transition-colors",
                  category === c.id
                    ? "border-forest-600 bg-forest-50 text-forest-800"
                    : "border-border text-sand-600 hover:bg-sand-50",
                )}
              >
                {c.label}
              </Badge>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => {
          const cat = BLOG_CATEGORIES.find((c) => c.id === post.category);
          return (
            <Link key={post.slug} href={`/guides/${post.slug}`} className="group block no-underline">
              <Card className="h-full transition-[box-shadow,transform] hover:-translate-y-px hover:shadow-md">
                <CardHeader className="space-y-3">
                  <Badge variant="outline" className={cn("w-fit text-[10px] font-medium", CATEGORY_BADGE[post.category])}>
                    {cat?.label ?? post.category}
                  </Badge>
                  <CardTitle className="font-heading text-lg font-medium leading-snug text-sand-800 group-hover:text-forest-900">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3 text-sm leading-relaxed text-sand-600">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-[11px] text-sand-400">
                    {post.readingMinutes} min read · Updated {post.updated}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {posts.length === 0 && (
        <p className="text-sand-500">No articles in this category yet.</p>
      )}

      <p className="mt-14 max-w-2xl text-xs leading-relaxed text-sand-400">
        LeGuide does not provide legal advice. Procedures and thresholds change — verify on{" "}
        <a href="https://www.service-public.fr" className="text-azure-600 underline underline-offset-2" target="_blank" rel="noreferrer">
          service-public.fr
        </a>{" "}
        and with your institution.
      </p>
    </main>
  );
}
