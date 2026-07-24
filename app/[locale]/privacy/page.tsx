import { BlogHeader } from "@/components/layout/BlogHeader";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { isAppLocale } from "@/lib/locale";
import { routing, type AppLocale } from "@/i18n/routing";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type LegalSection = { heading: string; body: string };

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = (isAppLocale(localeParam) ? localeParam : routing.defaultLocale) as AppLocale;
  const t = await getTranslations({ locale, namespace: "legal" });

  return buildPageMetadata({
    title: t("privacy.title"),
    description: t("privacy.description"),
    path: "/privacy",
    locale,
  });
}

export default async function PrivacyPage({ params }: Props) {
  const { locale: localeParam } = await params;
  const locale = (isAppLocale(localeParam) ? localeParam : routing.defaultLocale) as AppLocale;
  const t = await getTranslations({ locale, namespace: "legal" });
  const sections = t.raw("privacy.sections") as LegalSection[];

  return (
    <div className="min-h-screen bg-canvas text-foreground">
      <BlogHeader />
      <article className="mx-auto w-full max-w-3xl px-6 pb-16 pt-10 sm:px-8">
        <p className="text-xs font-medium uppercase tracking-widest text-sand-400">{t("lastUpdated")}</p>
        <h1 className="mt-2 font-heading text-3xl font-light tracking-tight text-sand-800 md:text-4xl">
          {t("privacy.title")}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-sand-600">{t("privacy.intro")}</p>
        <div className="mt-10 space-y-8">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-heading text-xl font-medium text-sand-800">{section.heading}</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-sand-700">{section.body}</p>
            </section>
          ))}
        </div>
      </article>
    </div>
  );
}
