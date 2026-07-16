import { RegisterForm } from "@/components/auth/RegisterForm";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("auth");
    return {
        title: `${t("registerPageTitle")} — LeGuide`,
        description: t("registerPageDescription"),
    };
}

export default function RegisterPage() {
    return <RegisterForm />;
}
