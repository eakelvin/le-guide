"use client";

import { useTranslations } from "next-intl";
import { siteConfig } from "@/lib/seo/site";

interface DashboardBreadcrumbProps {
    /** Current page label shown after Dashboard (e.g. checklist item title). */
    current?: string;
    /** When set, Dashboard becomes a clickable link back to the home view. */
    onDashboardClick?: () => void;
}

export function DashboardBreadcrumb({ current, onDashboardClick }: DashboardBreadcrumbProps) {
    const t = useTranslations("dashboard");
    const isDashboardCurrent = !current && !onDashboardClick;
    const dashboardLabel = t("breadcrumbDashboard");

    return (
        <nav aria-label={t("breadcrumbAria")} className="mb-2 text-xs text-sand-400">
            <span>{siteConfig.name}</span>
            <span aria-hidden className="mx-1 text-sand-300">
                &gt;
            </span>
            {onDashboardClick ? (
                <button
                    type="button"
                    onClick={onDashboardClick}
                    className="text-sand-400 underline-offset-2 transition-colors hover:text-sand-800 hover:underline"
                >
                    {dashboardLabel}
                </button>
            ) : (
                <span className={isDashboardCurrent ? "font-medium text-sand-800" : undefined}>
                    {dashboardLabel}
                </span>
            )}
            {current ? (
                <>
                    <span aria-hidden className="mx-1 text-sand-300">
                        &gt;
                    </span>
                    <span className="font-medium text-sand-800">{current}</span>
                </>
            ) : null}
        </nav>
    );
}
