import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { UpdatePasswordForm } from "@/components/auth/UpdatePasswordForm";
import { AUTH_ROUTES } from "@/lib/auth-routes";
import { getAppUser } from "@/features/auth/user";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("auth");
    return {
        title: t("updatePasswordPageTitle"),
        description: t("updatePasswordPageDescription"),
        robots: { index: false, follow: false },
    };
}

export default async function UpdatePasswordPage() {
    const user = await getAppUser();
    if (!user) {
        redirect(AUTH_ROUTES.forgotPassword);
    }

    const cookieStore = await cookies();
    const recoveryFlow = cookieStore.get("password_recovery_flow")?.value === "1";

    return (
        <UpdatePasswordForm
            next="/dashboard"
            requireCurrentPasswordField={!recoveryFlow}
            recoveryFlow={recoveryFlow}
        />
    );
}
