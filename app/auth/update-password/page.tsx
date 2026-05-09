import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { UpdatePasswordForm } from "@/components/auth/UpdatePasswordForm";
import { AUTH_ROUTES } from "@/lib/auth-routes";
import { getAppUser } from "@/lib/supabase/user";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "New password — ArriveFrance",
    description: "Choose a new password for your account.",
};

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
            title="Set a new password"
            description={
                recoveryFlow
                    ? "Your email was verified. Choose a new password for your account."
                    : "Enter your current password, then choose a new one."
            }
            submitLabel="Save new password"
        />
    );
}
