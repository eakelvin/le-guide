"use client";

import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn, COLOR_CONFIG } from "@/lib/utils";
import {
    getArrivalSnapshot,
    getCategoryColorKey,
    getChecklistItemProgress,
    getChecklistItemStatus,
    getOfiiCountdown,
    getUnmetDependencies,
    isChecklistItemDone,
    isChecklistItemLocked,
    type ChecklistItemStatus,
} from "@/lib/helpers/checklist-helpers";
import type { ChecklistItem, ProgressState, UserProfile } from "@/types";
import { AlertTriangle, Lock } from "lucide-react";
import { CompleteProfileAlert } from "@/components/layout/Profile/CompleteProfileAlert";
import { DashboardBreadcrumb } from "@/components/layout/DashboardBreadcrumb";
import { getChecklistIcon } from "@/lib/data/checklist-icons";
import { useTranslations } from "next-intl";

interface Props {
    checklist: ChecklistItem[];
    progress: ProgressState;
    profile: UserProfile;
    onNavigate: (id: string) => void;
    name?: string | null;
    /** When false, hide the profile banner (profile already satisfies minimum fields). */
    showCompleteProfileBanner?: boolean;
}

function StatusBadge({
    status,
    colorBadge,
    label,
}: {
    status: ChecklistItemStatus;
    colorBadge: string;
    label: string;
}) {
    if (status === "complete") {
        return (
            <Badge variant="outline" className="border-transparent bg-forest-50 font-medium text-forest-700">
                {label}
            </Badge>
        );
    }
    if (status === "notStarted") {
        return (
            <Badge variant="outline" className={cn("border-transparent font-medium", colorBadge)}>
                {label}
            </Badge>
        );
    }
    return (
        <Badge variant="outline" className={cn(colorBadge, "border-transparent font-medium")}>
            {label}
        </Badge>
    );
}

export function DashboardHome({
    checklist,
    progress,
    profile,
    onNavigate,
    name,
    showCompleteProfileBanner = true,
}: Props) {
    const t = useTranslations("dashboard");
    const tCommon = useTranslations("common");

    const formatElapsed = (days: number): string => {
        if (days === 0) return t("elapsedToday");
        if (days < 30) return t("elapsedDays", { count: days });
        if (days < 365) return t("elapsedMonths", { count: Math.floor(days / 30) });
        return t("elapsedYears", { count: Math.floor(days / 365) });
    };

    const formatRemaining = (months: number, days: number): string => {
        const parts: string[] = [];
        if (months > 0) parts.push(t("remainingMonths", { count: months }));
        if (days > 0) parts.push(t("remainingDays", { count: days }));
        return parts.length > 0 ? parts.join(" ") : t("lessThanADay");
    };

    const formatWelcomeBlurb = ({
        arrived,
        planning,
        snapshot,
    }: {
        arrived: boolean;
        planning: boolean;
        snapshot: { days: number } | null;
    }): string => {
        if (arrived && snapshot) {
            return snapshot.days === 0
                ? t("welcomeArrivedToday")
                : t("welcomeArrivedAgo", { ago: formatElapsed(snapshot.days) });
        }
        if (planning && snapshot) {
            return snapshot.days === 0
                ? t("welcomeArriveToday")
                : t("welcomeArriveIn", { when: formatElapsed(snapshot.days) });
        }
        return t("welcomeAttention");
    };

    const statusLabel = (status: ChecklistItemStatus): string => {
        if (status === "complete") return t("statusComplete");
        if (status === "inProgress") return t("statusInProgress");
        return t("statusNotStarted");
    };

    const visaItem = checklist.find((it) => it.id === "visa-validation");
    const visaPending = visaItem ? !isChecklistItemDone(visaItem, progress) : false;
    const arrivedInFrance = profile.alreadyInFrance === "yes";
    const planningArrival = profile.alreadyInFrance === "no";
    const ofiiCountdown =
        visaPending && arrivedInFrance ? getOfiiCountdown(profile.arrivalDate) : null;
    const showVisaUrgent = ofiiCountdown !== null;
    const arrivalSnapshot = getArrivalSnapshot(profile.arrivalDate);
    const welcomeBlurb = formatWelcomeBlurb({
        arrived: arrivedInFrance,
        planning: planningArrival,
        snapshot: arrivalSnapshot,
    });

    return (
        <div className="animate-fade-up">
            <div className="border-b border-border bg-card px-4 pb-6 pt-6 sm:px-6 sm:pb-8 sm:pt-8 md:px-9 md:pt-10">
                <CardHeader className="gap-0 space-y-0 p-0">
                    <DashboardBreadcrumb />
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div className="space-y-2">
                            <CardTitle className="font-heading text-2xl font-normal leading-tight tracking-tight text-sand-800 sm:text-3xl md:text-[2rem]">
                                {name ? t("welcomeBackNamed", { name }) : t("welcomeBackGeneric")}
                            </CardTitle>
                            <CardDescription className="text-sm leading-relaxed text-sand-600">
                                {welcomeBlurb}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
            </div>

            <div className="space-y-5 px-4 py-6 sm:px-6 sm:py-7 md:px-9">
                {showCompleteProfileBanner ? <CompleteProfileAlert /> : null}

                {showVisaUrgent && ofiiCountdown ? (
                    <Alert className="border-coral-200 bg-coral-50 text-coral-900 shadow-none [&>svg]:text-coral-600">
                        <AlertTriangle className="size-4" aria-hidden />
                        <AlertTitle className="text-coral-950">
                            {ofiiCountdown.overdue ? t("overdue") : tCommon("urgent")}
                        </AlertTitle>
                        <AlertDescription className="text-coral-800">
                            {ofiiCountdown.overdue
                                ? t("ofiiOverdueBody", { count: ofiiCountdown.daysOverdue })
                                : t("ofiiRemainingBody", {
                                    remaining: formatRemaining(ofiiCountdown.months, ofiiCountdown.days),
                                })}
                        </AlertDescription>
                    </Alert>
                ) : null}

                <section>
                    <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-sand-400">{t("yourChecklist")}</h2>
                    {checklist.length === 0 ? (
                        <p className="text-sm text-sand-500">
                            {t("noChecklistItems")}
                        </p>
                    ) : (
                        <TooltipProvider delayDuration={200}>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
                                {checklist.map((item) => {
                                    const { done, total, pct } = getChecklistItemProgress(item, progress);
                                    const colorKey = getCategoryColorKey(item.category);
                                    const colors = COLOR_CONFIG[colorKey];
                                    const status = getChecklistItemStatus(item, progress);
                                    const locked = isChecklistItemLocked(item, checklist, progress);
                                    const unmet = locked ? getUnmetDependencies(item, checklist, progress) : [];

                                    const card = (
                                        <Card
                                            role="button"
                                            tabIndex={locked ? -1 : 0}
                                            aria-disabled={locked || undefined}
                                            aria-label={`${item.title}${locked ? ` ${t("lockedAria")}` : ""}`}
                                            size="sm"
                                            className={cn(
                                                "gap-4 py-4 shadow-xs ring-1 ring-border transition-[box-shadow,transform] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:gap-5 sm:py-5",
                                                locked
                                                    ? "cursor-not-allowed opacity-60"
                                                    : "cursor-pointer hover:-translate-y-px hover:shadow-sm",
                                            )}
                                            onClick={() => {
                                                if (locked) return;
                                                onNavigate(item.slug);
                                            }}
                                            onKeyDown={(e) => {
                                                if (locked) return;
                                                if (e.key === "Enter" || e.key === " ") {
                                                    e.preventDefault();
                                                    onNavigate(item.slug);
                                                }
                                            }}
                                        >
                                            <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-2 space-y-0 px-4 sm:px-6">
                                                <div
                                                    className={cn(
                                                        "flex size-10 items-center justify-center rounded-lg",
                                                        colors.light,
                                                        colors.text,
                                                    )}
                                                >
                                                    {getChecklistIcon(item.id)}
                                                </div>
                                                {locked ? (
                                                    <Badge
                                                        variant="outline"
                                                        className="border-transparent bg-sand-100 font-medium text-sand-600"
                                                    >
                                                        <Lock className="mr-1 size-3" aria-hidden />
                                                        {t("locked")}
                                                    </Badge>
                                                ) : (
                                                    <StatusBadge
                                                        status={status}
                                                        colorBadge={colors.badge}
                                                        label={statusLabel(status)}
                                                    />
                                                )}
                                            </CardHeader>
                                            <CardContent className="space-y-3 px-4 sm:px-6">
                                                <div>
                                                    <p className="text-sm font-semibold leading-snug text-sand-800">{item.title}</p>
                                                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-sand-500">
                                                        {item.shortDescription}
                                                    </p>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-[11px] text-sand-400">
                                                        <span>
                                                            {total > 0
                                                                ? t("stepsDone", { done, total })
                                                                : t("noSubSteps")}
                                                        </span>
                                                        <span className="font-medium text-sand-700">{pct}%</span>
                                                    </div>
                                                    <Progress
                                                        value={pct}
                                                        className="h-[3px] rounded-full bg-sand-100"
                                                        indicatorClassName={cn(colors.progress)}
                                                    />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );

                                    if (!locked) {
                                        return <div key={item.id}>{card}</div>;
                                    }

                                    return (
                                        <Tooltip key={item.id}>
                                            <TooltipTrigger asChild>{card}</TooltipTrigger>
                                            <TooltipContent side="top" className="max-w-xs text-xs leading-relaxed">
                                                {t("completeFirst")}{" "}
                                                <span className="font-medium">
                                                    {unmet.map((u) => u.title).join(", ")}
                                                </span>
                                            </TooltipContent>
                                        </Tooltip>
                                    );
                                })}
                            </div>
                        </TooltipProvider>
                    )}
                </section>
            </div>
        </div>
    );
}
