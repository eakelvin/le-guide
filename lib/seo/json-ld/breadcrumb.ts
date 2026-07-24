import { absoluteUrl } from "@/lib/seo/site";

export type BreadcrumbItem = {
  name: string;
  /** Absolute URL, or omit for the current (last) crumb. */
  path?: string;
};

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.path
        ? { item: item.path.startsWith("http") ? item.path : absoluteUrl(item.path) }
        : {}),
    })),
  };
}
