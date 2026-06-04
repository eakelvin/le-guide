import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BLOG_CATEGORIES, BLOG_POSTS, getPostBySlug } from "@/lib/blog";
import { cn } from "@/lib/utils";
import type { BlogCategoryId } from "@/types/blog";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";

const CATEGORY_BADGE: Record<BlogCategoryId, string> = {
  general: "border-transparent bg-azure-50 text-azure-700",
  alternance: "border-transparent bg-forest-50 text-forest-700",
  stage: "border-transparent bg-violet-50 text-violet-700",
  work: "border-transparent bg-gold-50 text-gold-700",
  admin: "border-transparent bg-coral-50 text-coral-700",
};

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Article | LeGuide" };
  return {
    title: `${post.title} | LeGuide`,
    description: post.excerpt,
  };
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const cat = BLOG_CATEGORIES.find((c) => c.id === post.category);

  return (
    <article className="mx-auto max-w-3xl px-6 pb-20 pt-8 md:px-12 md:pt-10">
      <Button variant="ghost" size="sm" className="mb-6 -ml-2 gap-1.5 text-sand-600 hover:text-sand-800" asChild>
        <Link href="/guides">
          <ArrowLeft className="size-4" aria-hidden />
          Back to guides
        </Link>
      </Button>

      <Badge variant="outline" className={cn("mb-4 text-[10px] font-medium", CATEGORY_BADGE[post.category])}>
        {cat?.label ?? post.category}
      </Badge>

      <h1 className="font-heading text-3xl font-light tracking-tight text-sand-800 md:text-[2.25rem] md:leading-tight">
        {post.title}
      </h1>

      <p className="mt-3 text-base leading-relaxed text-sand-600">{post.excerpt}</p>

      <p className="mt-4 text-xs text-sand-400">
        {post.readingMinutes} min read · Last updated {post.updated}
      </p>

      <div className="mt-10 space-y-10 border-t border-sand-100 pt-10">
        {post.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-heading text-xl font-medium text-sand-800">{section.heading}</h2>
            <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-sand-700">
              {section.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-14 rounded-xl border border-sand-200 bg-card p-6 text-sm leading-relaxed text-sand-600 shadow-xs">
        <strong className="font-medium text-sand-800">Disclaimer:</strong> This article summarizes common situations for
        international students in France. It is not legal advice. Rules change — check official sources and your
        school’s international office.
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button className="rounded-full bg-forest-900 text-white hover:bg-forest-800" asChild>
          <Link href="/dashboard">Open your checklist</Link>
        </Button>
        <Button variant="outline" className="rounded-full border-sand-200 shadow-none" asChild>
          <Link href="/guides">More guides</Link>
        </Button>
      </div>
    </article>
  );
}
