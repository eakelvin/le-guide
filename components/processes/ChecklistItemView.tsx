"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { cn, COLOR_CONFIG, getDocKey } from "@/lib/utils";
import {
    getCategoryColorKey,
    getChecklistItemProgress,
    isChecklistStepDone,
} from "@/lib/helpers/checklist-helpers";
import { getChecklistIcon } from "@/lib/data/checklist-icons";
import type { ChecklistItem, ProgressState } from "@/types";
import { AlertTriangle, ChevronLeft, Clock, Info } from "lucide-react";

/** Sentinel "step id" used when storing doc-checkbox state for item-level requirements. */
const REQUIREMENTS_DOC_KEY = "requirements";

interface ChecklistItemViewProps {
    item: ChecklistItem;
    progress: ProgressState;
    onMarkDone: (itemId: string, stepKey: string) => void;
    onMarkUndone: (itemId: string, stepKey: string) => void;
    /** Toggles a single document/requirement checkbox. Wired through `useProgress.toggleDoc`. */
    onToggleDoc: (itemId: string, stepKey: string, index: number) => void;
    onBack: () => void;
}

interface RequirementsSectionProps {
    item: ChecklistItem;
    progress: ProgressState;
    onToggleDoc: (itemId: string, stepKey: string, index: number) => void;
}

function RequirementsSection({ item, progress, onToggleDoc }: RequirementsSectionProps) {
    if (item.requirements.length === 0) return null;
    const colorKey = getCategoryColorKey(item.category);

    return (
        <section className="mb-8">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-sand-400">
                Documents Needed
            </h2>
            <div className="rounded-lg border border-border bg-card p-4">
                <div className="flex flex-col gap-2.5">
                    {item.requirements.map((req, i) => {
                        const key = getDocKey(item.id, REQUIREMENTS_DOC_KEY, i);
                        const checked = progress.checkedDocs[key] === true;
                        return (
                            <label
                                key={i}
                                className={cn(
                                    "flex cursor-pointer items-start gap-2.5 text-left hover:opacity-90",
                                    checked && "text-muted-foreground",
                                )}
                            >
                                <Checkbox
                                    checked={checked}
                                    className="mt-0.5 shrink-0 data-[state=checked]:text-primary-foreground"
                                    style={
                                        checked
                                            ? {
                                                borderColor: getColor(colorKey),
                                                backgroundColor: getColor(colorKey),
                                            }
                                            : undefined
                                    }
                                    onCheckedChange={() => onToggleDoc(item.id, REQUIREMENTS_DOC_KEY, i)}
                                />
                                <span
                                    className={cn(
                                        "flex-1 text-[13px] leading-relaxed",
                                        checked ? "text-muted-foreground line-through" : "text-foreground",
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

function TimingChip({ timing }: { timing: string | null }) {
    if (!timing) return null;
    return (
        <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-sand-100 px-2.5 py-1 text-[11px] font-medium text-sand-600">
            <Clock className="size-3" aria-hidden />
            <span className="leading-none">{timing}</span>
        </div>
    );
}

function WhyThisMattersSection({ text }: { text: string | null }) {
    if (!text) return null;
    return (
        <section className="mb-6">
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
        <section className="mb-6">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-coral-600">
                Warnings
            </h2>
            <div className="space-y-2">
                {warnings.map((warning, i) => (
                    <div key={i} className="flex gap-3 rounded-lg bg-coral-50 p-4">
                        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-coral-600" aria-hidden />
                        <p className="flex-1 text-[13px] leading-relaxed text-coral-900">{warning}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

function CommonOptionsSection({ options }: { options: string[] }) {
    if (options.length === 0) return null;
    return (
        <section className="mb-6">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-sand-400">
                Common Options
            </h2>
            <div className="rounded-lg border border-border bg-card p-4">
                <ul className="space-y-2">
                    {options.map((option, i) => (
                        <li
                            key={i}
                            className="flex items-start gap-2.5 text-[13px] leading-relaxed text-foreground"
                        >
                            <span
                                className="mt-2 size-1 shrink-0 rounded-full bg-sand-400"
                                aria-hidden
                            />
                            <span className="flex-1">{option}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}

interface StepCardProps {
    item: ChecklistItem;
    summary: string;
    index: number;
    progress: ProgressState;
    onMarkDone: (itemId: string, stepKey: string) => void;
    onMarkUndone: (itemId: string, stepKey: string) => void;
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

function StepCard({ item, summary, index, progress, onMarkDone, onMarkUndone }: StepCardProps) {
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
                    onClick={() => (done ? onMarkUndone(item.id, stepKey) : onMarkDone(item.id, stepKey))}
                    className={cn(
                        "flex size-7 shrink-0 items-center justify-center rounded-full border-[1.5px] text-xs font-medium transition-all",
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
                    aria-label={done ? `Mark step ${index + 1} not done` : `Mark step ${index + 1} done`}
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
                    {summary}
                </p>
            </div>
        </div>
    );
}

export function ChecklistItemView({
    item,
    progress,
    onMarkDone,
    onMarkUndone,
    onToggleDoc,
    onBack,
}: ChecklistItemViewProps) {
    const { done, total, pct } = getChecklistItemProgress(item, progress);
    const colorKey = getCategoryColorKey(item.category);
    const colors = COLOR_CONFIG[colorKey];
    const allDone = total > 0 && done === total;

    const markAllDone = () => {
        item.stepsSummary.forEach((_, i) => onMarkDone(item.id, String(i)));
    };
    const markAllUndone = () => {
        item.stepsSummary.forEach((_, i) => onMarkUndone(item.id, String(i)));
    };

    return (
        <div className="animate-fade-up">
            <div className="border-b border-border bg-card px-9 pb-10 pt-8">
                <div className="mx-auto flex max-w-5xl flex-col gap-6">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="-ml-2 h-auto gap-1 px-2 py-1 text-xs font-normal text-sand-500 shadow-none hover:text-sand-800 has-[>svg]:px-2"
                        onClick={onBack}
                    >
                        <ChevronLeft className="size-4" aria-hidden />
                        Dashboard
                    </Button>

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
                                <p className="mt-1 text-[13px] text-sand-500">{item.shortDescription}</p>
                                <TimingChip timing={item.recommendedTiming} />
                            </div>
                        </div>

                        <div className="shrink-0 text-right">
                            <p className={cn("text-2xl font-semibold tabular-nums", colors.text)}>{pct}%</p>
                            <p className="text-xs text-sand-400">
                                {done} of {total} done
                            </p>
                        </div>
                    </div>

                    <Progress
                        value={pct}
                        className="h-[5px] max-w-full overflow-hidden rounded-full bg-sand-100"
                        indicatorClassName={cn(colors.progress)}
                    />
                </div>
            </div>

            <div className="px-9 py-7">
                <div className="max-w-2xl">
                    <WhyThisMattersSection text={item.whyThisMatters} />
                    <WarningsSection warnings={item.warnings} />
                    <RequirementsSection
                        item={item}
                        progress={progress}
                        onToggleDoc={onToggleDoc}
                    />
                    <CommonOptionsSection options={item.commonOptions} />
                    {item.stepsSummary.length === 0 ? (
                        <p className="text-sm text-sand-500">No sub-steps yet for this item.</p>
                    ) : (
                        <>
                            {item.stepsSummary.map((summary, i) => (
                                <StepCard
                                    key={i}
                                    item={item}
                                    summary={summary}
                                    index={i}
                                    progress={progress}
                                    onMarkDone={onMarkDone}
                                    onMarkUndone={onMarkUndone}
                                />
                            ))}
                            <div className="mt-4">
                                {allDone ? (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={markAllUndone}
                                    >
                                        Mark all as not done
                                    </Button>
                                ) : (
                                    <Button
                                        size="sm"
                                        className="text-white shadow-none"
                                        style={{ backgroundColor: getColor(colorKey) }}
                                        onClick={markAllDone}
                                    >
                                        Mark all as done
                                    </Button>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
