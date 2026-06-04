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
    getCategoryColorKey,
    getChecklistItemProgress,
    getChecklistItemStatus,
    getUnmetDependencies,
    isChecklistItemDone,
    isChecklistItemLocked,
    type ChecklistItemStatus,
} from "@/lib/helpers/checklist-helpers";
import type { ChecklistItem, ProgressState } from "@/types";
import { AlertTriangle, Lock } from "lucide-react";
import { CompleteProfileAlert } from "@/components/layout/Profile/CompleteProfileAlert";
import { getChecklistIcon } from "@/lib/data/checklist-icons";

interface Props {
    checklist: ChecklistItem[];
    progress: ProgressState;
    onNavigate: (id: string) => void;
    name?: string | null;
    /** When false, hide the profile banner (profile already satisfies minimum fields). */
    showCompleteProfileBanner?: boolean;
}

function StatusBadge({
    status,
    colorBadge,
}: {
    status: ChecklistItemStatus;
    colorBadge: string;
}) {
    if (status === "Complete") {
        return (
            <Badge variant="outline" className="border-transparent bg-forest-50 font-medium text-forest-700">
                {status}
            </Badge>
        );
    }
    if (status === "Not started") {
        return (
            <Badge variant="outline" className={cn("border-transparent font-medium", colorBadge)}>
                {status}
            </Badge>
        );
    }
    return (
        <Badge variant="outline" className={cn(colorBadge, "border-transparent font-medium")}>
            {status}
        </Badge>
    );
}

export function DashboardHome({
    checklist,
    progress,
    onNavigate,
    name,
    showCompleteProfileBanner = true,
}: Props) {

    const visaItem = checklist.find((it) => it.id === "visa-validation");
    const showVisaUrgent = visaItem ? !isChecklistItemDone(visaItem, progress) : false;

    return (
        <div className="animate-fade-up">
            <div className="border-b border-border bg-card px-9 pb-8 pt-10">
                <CardHeader className="gap-0 space-y-0 p-0">
                    <p className="mb-2 text-xs text-sand-400">
                        <span>LeGuide</span>
                        <span aria-hidden className="mx-1 text-sand-300">
                            &gt;
                        </span>
                        <span className="font-medium text-sand-800">Dashboard</span>
                    </p>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div className="space-y-2">
                            <CardTitle className="font-heading font-normal text-3xl tracking-tight text-sand-800 sm:text-[2rem] leading-tight">
                                Welcome back{name ? `, ${name}` : ""} 👋
                            </CardTitle>
                            <CardDescription className="text-sm leading-relaxed text-sand-600">
                                You arrived in France [12] days ago. Here&apos;s what needs your attention this week.
                            </CardDescription>
                        </div>
                        {/* <Badge variant="outline" className="shrink-0 border-gold-200 bg-gold-50 font-medium text-gold-600">
                            Month 1 of 12
                        </Badge> */}
                    </div>
                </CardHeader>
            </div>

            <div className="space-y-5 px-9 py-7">
                {showCompleteProfileBanner ? <CompleteProfileAlert /> : null}

                {showVisaUrgent ? (
                    <Alert className="border-coral-200 bg-coral-50 text-coral-900 shadow-none [&>svg]:text-coral-600">
                        <AlertTriangle className="size-4" aria-hidden />
                        <AlertTitle className="text-coral-950">Urgent</AlertTitle>
                        <AlertDescription className="text-coral-800">
                            Your OFII visa validation appointment must be completed within 3 months of arrival. You have
                            approximately <strong className="font-semibold text-coral-900">[2 months 18 days]</strong>{" "}
                            remaining. Do this first.
                        </AlertDescription>
                    </Alert>
                ) : null}

                <section>
                    <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-sand-400">Your Checklist</h2>
                    {checklist.length === 0 ? (
                        <p className="text-sm text-sand-500">
                            No checklist items yet.
                        </p>
                    ) : (
                        <TooltipProvider delayDuration={200}>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
                                            aria-label={`${item.title}${locked ? " (locked)" : ""}`}
                                            size="sm"
                                            className={cn(
                                                "gap-5 py-5 shadow-xs ring-1 ring-border transition-[box-shadow,transform] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
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
                                            <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-2 space-y-0 px-6">
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
                                                        Locked
                                                    </Badge>
                                                ) : (
                                                    <StatusBadge status={status} colorBadge={colors.badge} />
                                                )}
                                            </CardHeader>
                                            <CardContent className="space-y-3 px-6">
                                                <div>
                                                    <p className="text-sm font-semibold leading-snug text-sand-800">{item.title}</p>
                                                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-sand-500">
                                                        {item.shortDescription}
                                                    </p>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-[11px] text-sand-400">
                                                        <span>
                                                            {total > 0 ? `${done} of ${total} steps done` : "No sub-steps"}
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
                                                Complete first:{" "}
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

                {/* <section>
                    <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-sand-400">
                        Suggested Timeline — First 3 Months
                    </h2>
                    <Card className="gap-0 shadow-xs">
                        <CardContent className="px-6 pt-6">
                            <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                                {checklist.slice(1, 5).map((item) => (
                                    <div
                                        key={item.id}
                                        className={cn(
                                            "flex h-10 min-w-0 items-center justify-center rounded-md px-2 text-center text-[11px] font-medium",
                                            COLOR_CONFIG[getCategoryColorKey(item.category)].badge,
                                        )}
                                    >
                                        <span className="truncate">{item.title}</span>
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs leading-relaxed text-sand-500">
                                Complete OFII and open a bank account first — both CAF and CPAM require a French IBAN. Bank accounts
                                can take 5–10 business days to activate.
                            </p>
                        </CardContent>
                    </Card>
                </section> */}
            </div>
        </div>
    );
}
