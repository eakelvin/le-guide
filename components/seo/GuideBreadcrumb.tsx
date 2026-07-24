import { Link } from "@/i18n/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo/json-ld/breadcrumb";
import { localizedPath } from "@/lib/seo/site";
import type { AppLocale } from "@/i18n/routing";

type Crumb = {
  label: string;
  href?: string;
};

type GuideBreadcrumbProps = {
  locale: AppLocale;
  items: Crumb[];
  ariaLabel: string;
};

export function GuideBreadcrumb({ locale, items, ariaLabel }: GuideBreadcrumbProps) {
  const schemaItems = items.map((item) => ({
    name: item.label,
    path: item.href ? localizedPath(locale, item.href) : undefined,
  }));

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(schemaItems)} />
      <nav aria-label={ariaLabel} className="mb-6 text-xs text-sand-400">
        <ol className="flex flex-wrap items-center gap-x-1">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={`${item.label}-${index}`} className="flex items-center gap-x-1">
                {index > 0 ? (
                  <span aria-hidden className="text-sand-300">
                    &gt;
                  </span>
                ) : null}
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="text-sand-400 transition-colors hover:text-sand-800 hover:underline"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className={isLast ? "font-medium text-sand-800" : undefined} aria-current={isLast ? "page" : undefined}>
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
