import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getBlogCategories } from "@/lib/i18n/blog-locale";
import { getPublicGuidePostsByCategory } from "@/features/guides/queries";
import { isAppLocale } from "@/lib/locale";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { routing, type AppLocale } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import type { BlogCategoryId } from "@/types/blog";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = (isAppLocale(localeParam) ? localeParam : routing.defaultLocale) as AppLocale;
  const t = await getTranslations({ locale, namespace: "guides" });
  return buildPageMetadata({
    title: t("pageTitle"),
    description: t("pageDescription"),
    path: "/guides",
    locale,
  });
}

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
  const localeRaw = await getLocale();
  const locale = isAppLocale(localeRaw) ? localeRaw : routing.defaultLocale;
  const t = await getTranslations("guides");
  const categories = getBlogCategories(locale);
  const { category: raw } = await searchParams;
  const category = raw && categories.some((c) => c.id === raw) ? raw : "all";
  const posts = await getPublicGuidePostsByCategory(category, locale);

  return (
    <main className="mx-auto max-w-6xl px-6 pb-20 pt-10 md:px-12 md:pt-14">
      <div className="mb-10 max-w-2xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-sand-400">{t("knowledgeBase")}</p>
        <h1 className="font-heading text-3xl font-light tracking-tight text-sand-800 md:text-4xl">
          {t("pageTitle")}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-sand-600">
          {t("pageDescription")}
        </p>
      </div>

      <div className="mb-10 flex flex-col gap-3">
        <p className="text-xs font-medium uppercase tracking-wide text-sand-400">{t("browseByTopic")}</p>
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
              {t("allArticles")}
            </Badge>
          </Link>
          {categories.map((c) => (
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
          const cat = categories.find((c) => c.id === post.category);
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
                    {t("minRead", { minutes: post.readingMinutes })} · {t("updated", { date: post.updated })}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {posts.length === 0 && (
        <p className="text-sand-500">{t("noArticles")}</p>
      )}

      <p className="mt-14 max-w-2xl text-xs leading-relaxed text-sand-400">
        {t("disclaimerPrefix")}{" "}
        <a href="https://www.service-public.fr" className="text-azure-600 underline underline-offset-2" target="_blank" rel="noreferrer">
          service-public.fr
        </a>{" "}
        {t("disclaimerSuffix")}
      </p>
    </main>
  );
}
