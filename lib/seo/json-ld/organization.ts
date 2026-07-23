import { absoluteUrl, getSiteUrl, siteConfig } from "@/lib/seo/site";

export function organizationJsonLd() {
  return {
    "@type": "Organization",
    "@id": `${getSiteUrl()}/#organization`,
    name: siteConfig.name,
    url: getSiteUrl(),
    logo: absoluteUrl("/icon"),
    description: siteConfig.description,
  };
}

export function websiteJsonLd() {
  return {
    "@type": "WebSite",
    "@id": `${getSiteUrl()}/#website`,
    url: getSiteUrl(),
    name: siteConfig.name,
    description: siteConfig.description,
    publisher: { "@id": `${getSiteUrl()}/#organization` },
    inLanguage: ["fr", "en"],
  };
}

export function organizationGraphJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [organizationJsonLd(), websiteJsonLd()],
  };
}
