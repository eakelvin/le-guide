import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Forgot password — LeGuide",
    description: "Reset your LeGuide account password.",
};

export default function ForgotPasswordPage() {
    return <ForgotPasswordForm />;
}
