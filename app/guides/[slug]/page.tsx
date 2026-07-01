import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BLOG_CATEGORIES, BLOG_POSTS, getPostBySlug, isChecklistGuideSlug } from "@/lib/blog";
import { cn } from "@/lib/utils";
import type { BlogCategoryId } from "@/types/blog";
import type { Metadata } from "next";
import { AlertTriangle, ArrowLeft, Lightbulb, House } from "lucide-react";

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
  const isChecklistGuide = isChecklistGuideSlug(slug);

  return (
    <article className="mx-auto max-w-3xl px-6 pb-20 pt-8 md:px-12 md:pt-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" size="sm" className="-ml-2 gap-1.5 text-sand-600 hover:text-sand-800" asChild>
          <Link href="/guides">
            <House className="size-4" aria-hidden />
            Back to guides
          </Link>
        </Button>
        {isChecklistGuide ? (
          <Button className="gap-1.5 rounded-full bg-forest-900 text-white hover:bg-forest-800" asChild>
            <Link href={`/dashboard?item=${slug}`}>
              <ArrowLeft className="size-4" aria-hidden />
              Back to this step in your checklist
            </Link>
          </Button>
        ) : (
          <Button className="rounded-full bg-forest-900 text-white hover:bg-forest-800" asChild>
            <Link href="/dashboard">Open your checklist</Link>
          </Button>
        )}
      </div>

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

      {post.warning ? (
        <div className="mt-8 flex gap-3 rounded-xl border border-coral-200 bg-coral-50 p-5 text-[15px] leading-relaxed text-coral-900 shadow-xs">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-coral-600" aria-hidden />
          <p>
            <strong className="font-medium text-coral-950">Heads up: </strong>
            {post.warning}
          </p>
        </div>
      ) : null}

      <div className="mt-6 space-y-10 border-t border-sand-100 pt-10">
        {post.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-heading text-xl font-medium text-sand-800">{section.heading}</h2>
            <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-sand-700">
              {section.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              {section.bullets && section.bullets.length > 0 ? (
                <ul className="list-disc space-y-2 pl-5 marker:text-sand-400">
                  {section.bullets.map((b, i) => {
                    if (typeof b === "string") {
                      return <li key={i}>{b}</li>;
                    }
                    const isExternal = !!b.href && /^https?:\/\//i.test(b.href);
                    const label = b.href ? (
                      isExternal ? (
                        <a
                          href={b.href}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="font-bold text-azure-700 underline-offset-2 hover:underline"
                        >
                          {b.label}
                        </a>
                      ) : (
                        <Link
                          href={b.href}
                          className="font-medium text-azure-700 underline-offset-2 hover:underline"
                        >
                          {b.label}
                        </Link>
                      )
                    ) : (
                      <strong className="font-medium text-sand-800">{b.label}</strong>
                    );
                    return (
                      <li key={i}>
                        {label}
                        {" — "}
                        {b.description}
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </div>
          </section>
        ))}
      </div>

      {post.recommendation ? (
        <div className="mt-12 flex gap-3 rounded-xl border border-forest-200 bg-forest-50 p-5 text-[15px] leading-relaxed text-forest-900 shadow-xs">
          <Lightbulb className="mt-0.5 size-4 shrink-0 text-forest-700" aria-hidden />
          <p>
            <strong className="font-medium text-forest-900">Our recommendation: </strong>
            {post.recommendation}
          </p>
        </div>
      ) : null}

      <div className="mt-8 rounded-xl border border-sand-200 bg-card p-6 text-sm leading-relaxed text-sand-600 shadow-xs">
        <strong className="font-medium text-sand-800">Disclaimer:</strong> This article summarizes common situations for
        international students in France. It is not legal advice. Rules change — check official sources and your
        school’s international office.
      </div>

      <div className="mt-8">
        <Button variant="outline" className="rounded-full border-sand-200 shadow-none" asChild>
          <Link href="/guides">More guides</Link>
        </Button>
      </div>
    </article>
  );
}
