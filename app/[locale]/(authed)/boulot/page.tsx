import WorkCalculator from "@/components/layout/Boulot/workCalculator";
import { requireAppUser } from "@/features/auth/session";
import { getMyWorkEntriesAction } from "@/features/work/actions";
import { noIndexRobots } from "@/lib/seo/metadata";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("boulot");
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    robots: noIndexRobots,
  };
}

export default async function BoulotPage() {
  await requireAppUser();
  const initialEntries = await getMyWorkEntriesAction();
  return <WorkCalculator initialEntries={initialEntries} />;
}
