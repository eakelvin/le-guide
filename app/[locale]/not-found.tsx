import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("notFound");
  return {
    title: t("title"),
    robots: { index: false, follow: true },
  };
}

export default async function LocaleNotFound() {
  const t = await getTranslations("notFound");
  const tCommon = await getTranslations("common");

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sand-400">404</p>
      <h1 className="mt-3 font-heading text-3xl font-light tracking-tight text-sand-800">
        {t("heading")}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-sand-600">{t("body")}</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button className="rounded-full bg-forest-900 text-white hover:bg-forest-800" asChild>
          <Link href="/">{tCommon("home")}</Link>
        </Button>
        <Button variant="outline" className="rounded-full border-sand-200 shadow-none" asChild>
          <Link href="/guides">{tCommon("guides")}</Link>
        </Button>
      </div>
    </main>
  );
}
