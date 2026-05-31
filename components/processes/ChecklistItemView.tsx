"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn, COLOR_CONFIG } from "@/lib/utils";
import {
    getCategoryColorKey,
    getChecklistItemProgress,
    isChecklistStepDone,
} from "@/lib/helpers/checklist-helpers";
import { getChecklistIcon } from "@/lib/data/checklist-icons";
import type { ChecklistItem, ProgressState } from "@/types";
import { ChevronLeft } from "lucide-react";

interface ChecklistItemViewProps {
    item: ChecklistItem;
    progress: ProgressState;
    onMarkDone: (itemId: string, stepKey: string) => void;
    onMarkUndone: (itemId: string, stepKey: string) => void;
    onBack: () => void;
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

                <div className="mt-2 flex gap-2">
                    {!done ? (
                        <Button
                            size="sm"
                            className="text-white shadow-none"
                            style={{ backgroundColor: getColor(colorKey) }}
                            onClick={() => onMarkDone(item.id, stepKey)}
                        >
                            Mark as done
                        </Button>
                    ) : (
                        <Button variant="outline" size="sm" onClick={() => onMarkUndone(item.id, stepKey)}>
                            Undo
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

export function ChecklistItemView({
    item,
    progress,
    onMarkDone,
    onMarkUndone,
    onBack,
}: ChecklistItemViewProps) {
    const { done, total, pct } = getChecklistItemProgress(item, progress);
    const colorKey = getCategoryColorKey(item.category);
    const colors = COLOR_CONFIG[colorKey];

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
                    {item.stepsSummary.length === 0 ? (
                        <p className="text-sm text-sand-500">No sub-steps yet for this item.</p>
                    ) : (
                        item.stepsSummary.map((summary, i) => (
                            <StepCard
                                key={i}
                                item={item}
                                summary={summary}
                                index={i}
                                progress={progress}
                                onMarkDone={onMarkDone}
                                onMarkUndone={onMarkUndone}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
