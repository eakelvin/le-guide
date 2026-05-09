import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Forgot password — ArriveFrance",
    description: "Reset your ArriveFrance account password.",
};

export default function ForgotPasswordPage() {
    return <ForgotPasswordForm />;
}
