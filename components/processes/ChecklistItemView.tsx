"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn, COLOR_CONFIG } from "@/lib/utils";
import {
    getCategoryColorKey,
    getChecklistItemProgress,
    isChecklistItemDone,
    isChecklistStepDone,
    showsOfficialLinksOnStepOne,
} from "@/lib/helpers/checklist-helpers";
import { getChecklistIcon } from "@/lib/data/checklist-icons";
import { hasGuideForSlug } from "@/lib/blog";
import { DashboardBreadcrumb } from "@/components/layout/DashboardBreadcrumb";
import type { ChecklistItem, ChecklistOfficialLink, ChecklistStepSummary, ProgressState } from "@/types";
import { AlertTriangle, ArrowUpRight, Clock, ExternalLink, Info, Timer } from "lucide-react";

const CONTENT_WIDTH = "mx-auto w-full max-w-3xl";
const SECTION_GAP = "mb-8";

interface ChecklistItemViewProps {
    item: ChecklistItem;
    progress: ProgressState;
    onMarkDone: (itemId: string, stepKey: string, totalSteps?: number) => void;
    onMarkUndone: (itemId: string, stepKey: string) => void;
    /** Marks the entire item complete and ticks all sub-steps. */
    onMarkItemDone: (itemId: string, stepCount?: number) => void;
    onMarkItemUndone: (itemId: string, stepCount?: number) => void;
    onBack: () => void;
    profileDerivedCompletionReason?: string | null;
}

interface StepCardProps {
    item: ChecklistItem;
    step: ChecklistStepSummary;
    index: number;
    progress: ProgressState;
    commonOptions?: string[];
    officialLinks?: ChecklistOfficialLink[];
    readOnlyComplete?: boolean;
    onMarkDone: (itemId: string, stepKey: string, totalSteps?: number) => void;
    onMarkUndone: (itemId: string, stepKey: string) => void;
}

/**
 * Document checkboxes are intentionally NOT persisted (no DB, no localStorage).
 * They are session-only working notes — resetting on navigation is the desired
 * behaviour. If a student wants to track which docs they've gathered for the
 * long term, the per-item completion (final button) is the source of truth.
 */
function RequirementsSection({ item }: { item: ChecklistItem }) {
    const [checked, setChecked] = useState<boolean[]>(() =>
        item.requirements.map(() => false),
    );

    if (item.requirements.length === 0) return null;
    const colorKey = getCategoryColorKey(item.category);

    const toggle = (i: number) =>
        setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)));

    return (
        <section className={SECTION_GAP}>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-sand-400">
                Documents Needed
            </h2>
            <div className="rounded-lg border border-border bg-card p-4">
                <div className="flex flex-col gap-2.5">
                    {item.requirements.map((req, i) => {
                        const isChecked = checked[i] === true;
                        return (
                            <label
                                key={i}
                                className={cn(
                                    "flex cursor-pointer items-start gap-2.5 text-left hover:opacity-90",
                                    isChecked && "text-muted-foreground",
                                )}
                            >
                                <Checkbox
                                    checked={isChecked}
                                    className="mt-0.5 shrink-0 data-[state=checked]:text-primary-foreground"
                                    style={
                                        isChecked
                                            ? {
                                                borderColor: getColor(colorKey),
                                                backgroundColor: getColor(colorKey),
                                            }
                                            : undefined
                                    }
                                    onCheckedChange={() => toggle(i)}
                                />
                                <span
                                    className={cn(
                                        "flex-1 text-[13px] leading-relaxed",
                                        isChecked ? "text-muted-foreground line-through" : "text-foreground",
                                    )}
                                >
                                    {req.name}
                                    {!req.required && (
                                        <span className="ml-1.5 text-[11px] text-sand-400">(optional)</span>
                                    )}
                                </span>
                            </label>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function ItemMetaLine({
    icon: Icon,
    children,
}: {
    icon: typeof Clock;
    children: React.ReactNode;
}) {
    return (
        <p className="flex items-start gap-1.5 text-[12px] leading-relaxed text-sand-500">
            <Icon className="mt-0.5 size-3 shrink-0" aria-hidden />
            <span>{children}</span>
        </p>
    );
}

function ItemHeaderMeta({
    estimatedTime,
    recommendedTiming,
    hasGuide,
}: {
    estimatedTime: string | null;
    recommendedTiming: string | null;
    hasGuide: boolean;
}) {
    if (!estimatedTime && !recommendedTiming) return null;

    return (
        <div className={cn("space-y-1", hasGuide ? "mt-2.5" : "mt-2")}>
            {estimatedTime ? (
                <ItemMetaLine icon={Timer}>Est. {estimatedTime}</ItemMetaLine>
            ) : null}
            {recommendedTiming ? (
                <ItemMetaLine icon={Clock}>{recommendedTiming}</ItemMetaLine>
            ) : null}
        </div>
    );
}

function WhyThisMattersSection({ text }: { text: string | null }) {
    if (!text) return null;
    return (
        <section className={SECTION_GAP}>
            <div className="flex gap-3 rounded-lg bg-azure-50 p-4">
                <Info className="mt-0.5 size-4 shrink-0 text-azure-600" aria-hidden />
                <div className="min-w-0 space-y-1.5">
                    <h2 className="text-[11px] font-semibold uppercase tracking-widest text-azure-700">
                        Why This Matters
                    </h2>
                    <p className="text-[13px] leading-relaxed text-azure-900">{text}</p>
                </div>
            </div>
        </section>
    );
}

function WarningsSection({ warnings }: { warnings: string[] }) {
    if (warnings.length === 0) return null;
    return (
        <section className={SECTION_GAP}>
            <div className="flex gap-3 rounded-lg bg-coral-50 p-4">
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-coral-600" aria-hidden />
                <div className="min-w-0 space-y-2">
                    <h2 className="text-[11px] font-semibold uppercase tracking-widest text-coral-700">
                        Warnings
                    </h2>
                    <ul className="space-y-2">
                        {warnings.map((warning, i) => (
                            <li
                                key={i}
                                className="flex items-start gap-2.5 text-[13px] leading-relaxed text-coral-900"
                            >
                                <span
                                    className="mt-2 size-1 shrink-0 rounded-full bg-coral-400"
                                    aria-hidden
                                />
                                <span className="flex-1">{warning}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}

function StepOfficialLinks({ links }: { links: ChecklistOfficialLink[] }) {
    if (links.length === 0) return null;
    return (
        <div className="mt-3">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Official links
            </p>
            <div className="flex flex-col items-start gap-2">
                {links.map((link, i) => (
                    <Button
                        key={i}
                        variant="outline"
                        size="sm"
                        className="h-auto max-w-full gap-1.5 whitespace-normal py-2 text-left text-xs font-normal"
                        asChild
                    >
                        <a href={link.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="size-3.5 shrink-0" aria-hidden />
                            {link.label}
                        </a>
                    </Button>
                ))}
            </div>
        </div>
    );
}

function StepCommonOptions({ options }: { options: string[] }) {
    if (options.length === 0) return null;
    return (
        <div className="mt-3">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Common options
            </p>
            <div className="flex flex-wrap gap-1.5">
                {options.map((option, i) => (
                    <span
                        key={i}
                        className="rounded-full border border-border bg-sand-50 px-2.5 py-0.5 text-[11px] leading-relaxed text-foreground"
                    >
                        {option}
                    </span>
                ))}
            </div>
        </div>
    );
}

/**
 * Solid hex map for inline styles where Tailwind utility classes can't reach
 * (the round step button background and the active-step ring use this).
 * Mirrors `ProcessView`'s local `getColor` since the two views share the
 * same visual treatment.
 */
function getColor(colorKey: "coral" | "azure" | "forest" | "gold"): string {
    const map: Record<typeof colorKey, string> = {
        coral: "#993C1D",
        azure: "#185FA5",
        forest: "#3B6D11",
        gold: "#B07D2F",
    };
    return map[colorKey];
}

function isStepActive(item: ChecklistItem, index: number, progress: ProgressState): boolean {
    if (isChecklistStepDone(item.id, index, progress)) return false;
    if (index === 0) return true;
    return isChecklistStepDone(item.id, index - 1, progress);
}

function StepCard({
    item,
    step,
    index,
    progress,
    commonOptions = [],
    officialLinks = [],
    readOnlyComplete = false,
    onMarkDone,
    onMarkUndone,
}: StepCardProps) {
    const stepKey = String(index);
    const done = isChecklistStepDone(item.id, index, progress);
    const active = isStepActive(item, index, progress);
    const colorKey = getCategoryColorKey(item.category);
    const colors = COLOR_CONFIG[colorKey];
    const isLast = index === item.stepsSummary.length - 1;

    return (
        <div className="flex gap-0">
            <div className="flex w-9 shrink-0 flex-col items-center">
                <button
                    type="button"
                    disabled={readOnlyComplete}
                    onClick={() => (done ? onMarkUndone(item.id, stepKey) : onMarkDone(item.id, stepKey))}
                    className={cn(
                        "flex size-7 shrink-0 items-center justify-center rounded-full border-[1.5px] text-xs font-medium transition-all",
                        readOnlyComplete && "cursor-default",
                        done
                            ? "border-transparent text-white"
                            : active
                                ? cn("bg-background", colors.border, colors.text, "ring-[3px]", colors.ring)
                                : "border-border bg-background text-muted-foreground",
                    )}
                    style={
                        done
                            ? {
                                backgroundColor: getColor(colorKey),
                                borderColor: "transparent",
                            }
                            : undefined
                    }
                    aria-label={
                        readOnlyComplete
                            ? `Step ${index + 1} complete from your profile`
                            : done
                                ? `Mark step ${index + 1} not done`
                                : `Mark step ${index + 1} done`
                    }
                >
                    {done ? "✓" : index + 1}
                </button>
                {!isLast && <div className="bg-border my-1 min-h-6 w-px flex-1" />}
            </div>

            <div className={cn("min-w-0 flex-1 pl-4", isLast ? "pb-2" : "pb-7")}>
                <p
                    className={cn(
                        "mb-1 mt-0.5 text-sm font-medium leading-snug",
                        done ? "text-muted-foreground line-through" : "text-foreground",
                    )}
                >
                    {step.summary}
                </p>
                {step.description ? (
                    <p
                        className={cn(
                            "text-[13px] leading-relaxed",
                            done ? "text-muted-foreground/80" : "text-muted-foreground",
                        )}
                    >
                        {step.description}
                    </p>
                ) : null}
                {index === 0 ? <StepOfficialLinks links={officialLinks} /> : null}
                {index === 0 ? <StepCommonOptions options={commonOptions} /> : null}
            </div>
        </div>
    );
}

function ItemCompletionActions({
    item,
    colorKey,
    itemDone,
    itemDoneFromProfile,
    profileDerivedCompletionReason,
    onMarkItemDone,
    onMarkItemUndone,
}: {
    item: ChecklistItem;
    colorKey: "coral" | "azure" | "forest" | "gold";
    itemDone: boolean;
    itemDoneFromProfile: boolean;
    profileDerivedCompletionReason?: string | null;
    onMarkItemDone: (itemId: string, stepCount?: number) => void;
    onMarkItemUndone: (itemId: string, stepCount?: number) => void;
}) {
    if (itemDoneFromProfile) {
        return (
            <div className="space-y-2">
                <p className="text-xs leading-relaxed text-sand-500">
                    {profileDerivedCompletionReason} To change this status, update your profile.
                </p>
                <Button variant="outline" size="sm" asChild>
                    <Link href="/profile">Update profile</Link>
                </Button>
            </div>
        );
    }

    if (itemDone) {
        return (
            <Button variant="outline" size="sm" onClick={() => onMarkItemUndone(item.id, item.stepsSummary.length)}>
                Mark as not done
            </Button>
        );
    }

    return (
        <div className="space-y-2">
            <Button
                size="sm"
                className="text-white shadow-none"
                style={{ backgroundColor: getColor(colorKey) }}
                onClick={() => onMarkItemDone(item.id, item.stepsSummary.length)}
            >
                Mark as done
            </Button>
            <p className="text-xs leading-relaxed text-sand-500">
                Marks this step complete and checks off all sub-steps.
            </p>
        </div>
    );
}

export function ChecklistItemView({
    item,
    progress,
    onMarkDone,
    onMarkUndone,
    onMarkItemDone,
    onMarkItemUndone,
    onBack,
    profileDerivedCompletionReason,
}: ChecklistItemViewProps) {
    const { done, total, pct } = getChecklistItemProgress(item, progress);
    const colorKey = getCategoryColorKey(item.category);
    const colors = COLOR_CONFIG[colorKey];
    const itemDone = isChecklistItemDone(item, progress);
    const itemDoneFromProfile = Boolean(profileDerivedCompletionReason);
    const hasGuide = hasGuideForSlug(item.slug);

    return (
        <div className="animate-fade-up">
            <div className="border-b border-border bg-card px-4 pb-6 pt-6 sm:px-6 sm:pb-8 sm:pt-8 md:px-9">
                <div className={cn(CONTENT_WIDTH, "flex flex-col gap-6")}>
                    <DashboardBreadcrumb current={item.title} onDashboardClick={onBack} />

                    <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex min-w-0 items-start gap-3.5">
                            <div
                                className={cn(
                                    "flex size-12 shrink-0 items-center justify-center rounded-xl ring-2 ring-border/60",
                                    colors.light,
                                    colors.text,
                                )}
                            >
                                {getChecklistIcon(item.id, "h-6 w-6")}
                            </div>
                            <div className="min-w-0">
                                <h1 className="font-heading text-2xl font-normal tracking-tight text-sand-800 sm:text-[1.75rem]">
                                    {item.title}
                                </h1>
                                <p className="mt-1 text-[13px] leading-relaxed text-sand-500">
                                    {item.shortDescription}
                                </p>
                                {hasGuide ? (
                                    <Link
                                        href={`/guides/${item.slug}`}
                                        className={cn(
                                            "mt-2.5 inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[12px] font-medium no-underline transition-colors",
                                            colors.border,
                                            colors.text,
                                            "hover:bg-accent",
                                        )}
                                    >
                                        Read the full guide
                                        <ArrowUpRight className="size-3.5" aria-hidden />
                                    </Link>
                                ) : null}
                                <ItemHeaderMeta
                                    estimatedTime={item.estimatedTime}
                                    recommendedTiming={item.recommendedTiming}
                                    hasGuide={hasGuide}
                                />
                            </div>
                        </div>

                        <div className="shrink-0 text-right">
                            {itemDone ? (
                                <>
                                    <p className="text-base font-semibold text-forest-700">Complete</p>
                                    <p className="text-xs text-sand-400">
                                        {itemDoneFromProfile ? "From your profile" : "Marked as done"}
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p className={cn("text-2xl font-semibold tabular-nums", colors.text)}>{pct}%</p>
                                    <p className="text-xs text-sand-400">
                                        {done} of {total} done
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-4 py-6 sm:px-6 sm:py-7 md:px-9">
                <div className={CONTENT_WIDTH}>
                    {item.stepsSummary.length > 0 ? (
                        <section className={SECTION_GAP}>
                            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-sand-400">
                                Steps
                            </h2>
                            {item.stepsSummary.map((step, i) => (
                                <StepCard
                                    key={i}
                                    item={item}
                                    step={step}
                                    index={i}
                                    progress={progress}
                                    commonOptions={i === 0 ? item.commonOptions : undefined}
                                    officialLinks={
                                        i === 0 && showsOfficialLinksOnStepOne(item.id)
                                            ? item.officialLinks
                                            : undefined
                                    }
                                    readOnlyComplete={itemDoneFromProfile}
                                    onMarkDone={(itemId, stepKey) =>
                                        onMarkDone(itemId, stepKey, item.stepsSummary.length)
                                    }
                                    onMarkUndone={onMarkUndone}
                                />
                            ))}
                            <div className="mt-4">
                                <ItemCompletionActions
                                    item={item}
                                    colorKey={colorKey}
                                    itemDone={itemDone}
                                    itemDoneFromProfile={itemDoneFromProfile}
                                    profileDerivedCompletionReason={profileDerivedCompletionReason}
                                    onMarkItemDone={onMarkItemDone}
                                    onMarkItemUndone={onMarkItemUndone}
                                />
                            </div>
                        </section>
                    ) : (
                        <div className={SECTION_GAP}>
                            <ItemCompletionActions
                                item={item}
                                colorKey={colorKey}
                                itemDone={itemDone}
                                itemDoneFromProfile={itemDoneFromProfile}
                                profileDerivedCompletionReason={profileDerivedCompletionReason}
                                onMarkItemDone={onMarkItemDone}
                                onMarkItemUndone={onMarkItemUndone}
                            />
                        </div>
                    )}

                    <RequirementsSection item={item} />
                    <WarningsSection warnings={item.warnings} />
                </div>
            </div>
        </div>
    );
}
