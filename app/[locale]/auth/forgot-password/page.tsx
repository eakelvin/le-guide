import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("auth");
    return {
        title: `${t("forgotPasswordPageTitle")} — LeGuide`,
        description: t("forgotPasswordPageDescription"),
    };
}

export default function ForgotPasswordPage() {
    return <ForgotPasswordForm />;
}
