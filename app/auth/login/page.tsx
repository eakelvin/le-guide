import { LoginForm } from "@/components/auth/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign in — ArriveFrance",
    description: "Sign in to your ArriveFrance account.",
};

export default function LoginPage() {
    return <LoginForm />;
}
