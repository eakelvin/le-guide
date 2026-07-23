import { LandingPage } from "@/components/layout/LandingPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { getAppUser } from "@/features/auth/user";
import { getLandingContent } from "@/lib/data/landing-content";
import { isAppLocale } from "@/lib/locale";
import { faqPageJsonLd } from "@/lib/seo/json-ld/faq";
import { organizationGraphJsonLd } from "@/lib/seo/json-ld/organization";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { routing, type AppLocale } from "@/i18n/routing";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = (isAppLocale(localeParam) ? localeParam : routing.defaultLocale) as AppLocale;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return buildPageMetadata({
    title: t("title"),
    description: t("description"),
    path: "/",
    locale,
    absoluteTitle: true,
  });
}

export default async function Home({ params }: Props) {
  const { locale: localeParam } = await params;
  const locale = (isAppLocale(localeParam) ? localeParam : routing.defaultLocale) as AppLocale;
  const user = await getAppUser();
  const faqs = getLandingContent(locale).faqs;

  return (
    <>
      <JsonLd data={organizationGraphJsonLd()} />
      <JsonLd data={faqPageJsonLd(faqs)} />
      <LandingPage initialUser={user} />
    </>
  );
}
