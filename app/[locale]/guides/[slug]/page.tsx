import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GuideBreadcrumb } from "@/components/seo/GuideBreadcrumb";
import { JsonLd } from "@/components/seo/JsonLd";
import { RelatedGuides } from "@/components/seo/RelatedGuides";
import { getAllGuideSlugs, getRelatedGuides, isChecklistGuideSlug } from "@/lib/blog";
import { getBlogCategories, mergeChecklistGuidePost } from "@/lib/i18n/blog-locale";
import { getGuidePostBySlug } from "@/features/guides/queries";
import { getChecklistItemBySlug } from "@/features/checklist/queries";
import { isAppLocale } from "@/lib/locale";
import { blogPostingJsonLd } from "@/lib/seo/json-ld/article";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { routing, type AppLocale } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { cn } from "@/lib/utils";
import type { BlogCategoryId } from "@/types/blog";
import type { Metadata } from "next";
import { AlertTriangle, ArrowLeft, ArrowUpRight, Lightbulb } from "lucide-react";

const CATEGORY_BADGE: Record<BlogCategoryId, string> = {
  general: "border-transparent bg-azure-50 text-azure-700",
  alternance: "border-transparent bg-forest-50 text-forest-700",
  stage: "border-transparent bg-violet-50 text-violet-700",
  work: "border-transparent bg-gold-50 text-gold-700",
  admin: "border-transparent bg-coral-50 text-coral-700",
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getAllGuideSlugs().map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale: localeParam } = await params;
  const locale = (isAppLocale(localeParam) ? localeParam : routing.defaultLocale) as AppLocale;
  const t = await getTranslations({ locale, namespace: "guides" });
  const basePost = await getGuidePostBySlug(slug, locale);
  if (!basePost) return { title: t("articleFallbackTitle") };
  const checklistItem = isChecklistGuideSlug(slug) ? await getChecklistItemBySlug(slug) : null;
  const post = mergeChecklistGuidePost(basePost, checklistItem);
  return buildPageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/guides/${slug}`,
    locale,
    type: "article",
    publishedTime: post.updated,
    modifiedTime: post.updated,
    section: post.category,
    authors: ["LeGuide"],
  });
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale: localeParam } = await params;
  const locale = (isAppLocale(localeParam) ? localeParam : routing.defaultLocale) as AppLocale;
  const t = await getTranslations("guides");
  const basePost = await getGuidePostBySlug(slug, locale);
  if (!basePost) notFound();
  const checklistItem = isChecklistGuideSlug(slug) ? await getChecklistItemBySlug(slug) : null;
  const post = mergeChecklistGuidePost(basePost, checklistItem);
  const categories = getBlogCategories(locale);
  const cat = categories.find((c) => c.id === post.category);
  const isChecklistGuide = isChecklistGuideSlug(slug);
  const related = getRelatedGuides(slug, locale, 3);

  return (
    <article className="mx-auto w-full max-w-3xl px-6 pb-16 pt-6 sm:px-8 md:pt-8">
      <JsonLd data={blogPostingJsonLd(post, locale)} />
      <GuideBreadcrumb
        locale={locale}
        ariaLabel={t("breadcrumbAria")}
        items={[
          { label: t("homeCrumb"), href: "/" },
          { label: t("title"), href: "/guides" },
          { label: post.title },
        ]}
      />

      <header className="border-b border-sand-100 pb-8">
        <Badge
          variant="outline"
          className={cn(
            "mb-4 text-[10px] font-medium",
            isChecklistGuide ? CATEGORY_BADGE.admin : CATEGORY_BADGE[post.category],
          )}
        >
          {isChecklistGuide ? t("checklistGuide") : (cat?.label ?? post.category)}
        </Badge>

        <h1 className="font-heading text-3xl font-light tracking-tight text-sand-800 md:text-[2.25rem] md:leading-tight">
          {post.title}
        </h1>

        <p className="mt-3 text-base leading-relaxed text-sand-600">{post.excerpt}</p>

        <p className="mt-4 text-xs text-sand-400">
          {t("minReadUpdated", { minutes: post.readingMinutes, date: post.updated })}
        </p>

        <div className="mt-5">
          {isChecklistGuide ? (
            <Button className="h-auto w-full gap-1.5 whitespace-normal rounded-full bg-forest-900 px-4 py-2.5 text-center text-sm text-white hover:bg-forest-800 sm:w-auto" asChild>
              <Link href={`/dashboard?item=${slug}`}>
                <ArrowLeft className="size-4 shrink-0" aria-hidden />
                {t("backToChecklistStep")}
              </Link>
            </Button>
          ) : (
            <Button
              variant="outline"
              className="h-auto w-full gap-1.5 rounded-full border-sand-200 px-4 py-2.5 text-sm shadow-none sm:w-auto"
              asChild
            >
              <Link href="/dashboard">
                {t("openYourChecklist")}
                <ArrowUpRight className="size-3.5 shrink-0" aria-hidden />
              </Link>
            </Button>
          )}
        </div>
      </header>

      {post.warning ? (
        <div className="mt-8 flex gap-3 rounded-xl border border-coral-200 bg-coral-50 p-5 text-[15px] leading-relaxed text-coral-900 shadow-xs">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-coral-600" aria-hidden />
          <p>
            <strong className="font-medium text-coral-950">{t("headsUp")} </strong>
            {post.warning}
          </p>
        </div>
      ) : null}

      <div className={cn("space-y-10", post.warning ? "mt-8" : "mt-10")}>
        {post.sections.map((section, sectionIndex) => {
          if (!section.heading && section.paragraphs.every((p) => !p.trim()) && (!section.bullets || section.bullets.length === 0)) {
            return null;
          }
          return (
            <section key={section.heading || `section-${sectionIndex}`}>
              {section.heading ? (
                <h2 className="font-heading text-xl font-medium text-sand-800">{section.heading}</h2>
              ) : null}
              <div className={cn("space-y-3 text-[15px] leading-relaxed text-sand-700", section.heading && "mt-3")}>
                {section.paragraphs.filter((p) => p.trim()).map((p, i) => (
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
          );
        })}
      </div>

      {post.recommendation ? (
        <div className="mt-12 flex gap-3 rounded-xl border border-forest-200 bg-forest-50 p-5 text-[15px] leading-relaxed text-forest-900 shadow-xs">
          <Lightbulb className="mt-0.5 size-4 shrink-0 text-forest-700" aria-hidden />
          <p>
            <strong className="font-medium text-forest-900">{t("ourRecommendation")} </strong>
            {post.recommendation}
          </p>
        </div>
      ) : null}

      <RelatedGuides posts={related} title={t("relatedGuides")} />

      <footer className="mt-12 space-y-6 border-t border-sand-100 pt-8">
        <div className="rounded-xl border border-sand-200 bg-card p-6 text-sm leading-relaxed text-sand-600 shadow-xs">
          <strong className="font-medium text-sand-800">{t("disclaimerLabel")}</strong> {t("disclaimerFull")}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button variant="outline" className="rounded-full border-sand-200 shadow-none" asChild>
            <Link href="/guides">{t("moreGuides")}</Link>
          </Button>
          {isChecklistGuide ? (
            <Button className="gap-1.5 rounded-full bg-forest-900 text-white hover:bg-forest-800" asChild>
              <Link href={`/dashboard?item=${slug}`}>
                <ArrowLeft className="size-4" aria-hidden />
                {t("backToChecklistStepShort")}
              </Link>
            </Button>
          ) : null}
        </div>
      </footer>
    </article>
  );
}
