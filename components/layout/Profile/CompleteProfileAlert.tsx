"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { UserRound } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function CompleteProfileAlert() {
    const t = useTranslations("profile");
    return (
        <Link href="/profile" className="block no-underline">
            <Alert className="cursor-pointer border-azure-100 bg-azure-50 text-azure-900 shadow-none transition-colors hover:bg-azure-100 [&>svg]:text-azure-600">
                <UserRound className="size-4" aria-hidden />
                <AlertTitle className="text-azure-950">{t("completeAlertTitle")}</AlertTitle>
                <AlertDescription className="text-azure-700">
                    {t("completeAlertBody")}{" "}
                    <span className="font-medium text-azure-800">{t("completeAlertCta")}</span>
                </AlertDescription>
            </Alert>
        </Link>
    );
}
