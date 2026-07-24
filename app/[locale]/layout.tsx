import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { AppToaster } from "@/components/providers/app-toaster";
import { routing, type AppLocale } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getSiteUrl, siteConfig } from "@/lib/seo/site";
import { cn } from "@/lib/utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: siteConfig.backgroundColor },
    { media: "(prefers-color-scheme: dark)", color: siteConfig.themeColor },
  ],
};

export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = (routing.locales.includes(localeParam as AppLocale)
    ? localeParam
    : routing.defaultLocale) as AppLocale;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    ...buildPageMetadata({
      title: t("title"),
      description: t("description"),
      path: "/",
      locale,
      absoluteTitle: true,
    }),
    metadataBase: new URL(getSiteUrl()),
    title: {
      default: t("title"),
      template: t("titleTemplate"),
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={cn(
        "h-full antialiased font-sans",
        geistSans.variable,
        geistMono.variable,
      )}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
        <AppToaster />
      </body>
    </html>
  );
}
