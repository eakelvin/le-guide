import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("auth");
    return {
        title: t("loginPageTitle"),
        description: t("loginPageDescription"),
        robots: { index: false, follow: false },
    };
}

function LoginFormFallback() {
    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-background" aria-hidden>
            <div className="hidden lg:block bg-muted/30" />
            <div className="flex items-center justify-center p-8">
                <div className="h-10 w-48 rounded-md bg-muted animate-pulse" />
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<LoginFormFallback />}>
            <LoginForm />
        </Suspense>
    );
}
