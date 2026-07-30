import type { BlogPost } from "@/types/blog";
import type { AppLocale } from "@/i18n/routing";
import { absoluteUrl, getSiteUrl, localizedUrl, siteConfig } from "@/lib/seo/site";

export function blogPostingJsonLd(post: BlogPost, locale: AppLocale) {
  const url = localizedUrl(locale, `/guides/${post.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.updated,
    dateModified: post.updated,
    inLanguage: locale,
    articleSection: post.category,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    author: {
      "@type": "Organization",
      name: siteConfig.name,
      url: getSiteUrl(),
      logo: absoluteUrl(siteConfig.logoMark),
    },
    publisher: {
      "@id": `${getSiteUrl()}/#organization`,
    },
    url,
  };
}
