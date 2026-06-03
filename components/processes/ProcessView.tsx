"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  cn,
  COLOR_CONFIG,
  TAG_CONFIG,
  TIP_CONFIG,
  getProcessProgress,
  isStepActive,
  isStepDone,
} from "@/lib/utils";
import type { Process, ProgressState, Step } from "@/types";
import { ChevronLeft, ExternalLink } from "lucide-react";

interface ProcessViewProps {
  process: Process;
  progress: ProgressState;
  onMarkDone: (processId: string, stepId: string) => void;
  onMarkUndone: (processId: string, stepId: string) => void;
  onBack: () => void;
}

interface StepCardProps {
  step: Step;
  index: number;
  process: Process;
  progress: ProgressState;
  onMarkDone: (processId: string, stepId: string) => void;
  onMarkUndone: (processId: string, stepId: string) => void;
}

function getColor(colorKey: string) {
  const map: Record<string, string> = {
    coral: "#993C1D",
    forest: "#3B6D11",
    azure: "#185FA5",
    violet: "#534AB7",
    gold: "#B07D2F",
  };
  return map[colorKey] ?? "#3B6D11";
}

function StepCard({
  step,
  index,
  process,
  progress,
  onMarkDone,
  onMarkUndone,
}: StepCardProps) {
  const done = isStepDone(process, step.id, progress);
  const active = isStepActive(process, index, progress);
  const colors = COLOR_CONFIG[process.colorKey];
  const isLast = index === process.steps.length - 1;
  // Session-only doc checkboxes (not persisted anywhere).
  const docCount = step.documents?.length ?? 0;
  const [docChecked, setDocChecked] = useState<boolean[]>(() =>
    Array.from({ length: docCount }, () => false),
  );
  const toggleDoc = (i: number) =>
    setDocChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)));

  return (
    <div className="flex gap-0">
      <div className="flex w-9 shrink-0 flex-col items-center">
        <button
          type="button"
          onClick={() => (done ? onMarkUndone(process.id, step.id) : onMarkDone(process.id, step.id))}
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
                  backgroundColor: getColor(process.colorKey),
                  borderColor: "transparent",
                }
              : undefined
          }
          aria-label={done ? `Mark "${step.title}" not done` : `Mark "${step.title}" done`}
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
          {step.title}
        </p>

        <div>
          <p className="text-muted-foreground mb-3 text-[13px] leading-relaxed">{step.description}</p>

          {step.tags && step.tags.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1.5">
              {step.tags.map((tag, i) => (
                <Badge key={i} variant="outline" className={cn("font-normal rounded-full px-2.5 py-0.5 text-[11px]", TAG_CONFIG[tag.variant])}>
                  {tag.text}
                </Badge>
              ))}
            </div>
          )}

          {step.tip && (
            <div
              className={cn(
                "mb-3 flex gap-2.5 rounded-lg p-3 text-[13px] leading-relaxed",
                TIP_CONFIG[step.tip.variant].bg,
                TIP_CONFIG[step.tip.variant].text,
              )}
            >
              <span className="mt-0.5 shrink-0 text-sm">{TIP_CONFIG[step.tip.variant].icon}</span>
              <span>{step.tip.message}</span>
            </div>
          )}

          {step.documents && step.documents.length > 0 && (
            <div className="mb-3">
              <p className="text-muted-foreground mb-2 text-[11px] font-semibold uppercase tracking-wide">
                Documents needed
              </p>
              <div className="flex flex-col gap-2">
                {step.documents.map((doc, i) => {
                  const checked = docChecked[i] === true;
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
                                borderColor: getColor(process.colorKey),
                                backgroundColor: getColor(process.colorKey),
                              }
                            : undefined
                        }
                        onCheckedChange={() => toggleDoc(i)}
                      />
                      <span
                        className={cn(
                          "text-[13px] leading-relaxed flex-1",
                          checked ? "line-through text-muted-foreground" : "text-foreground",
                        )}
                      >
                        {doc}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {step.link && (
            <Button variant="outline" size="sm" className="mb-3 h-auto gap-1.5 py-2 text-xs font-normal" asChild>
              <a href={step.link.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="size-3.5 shrink-0" />
                {step.link.label}
              </a>
            </Button>
          )}

          <div className="mt-2 flex gap-2">
            {!done ? (
              <Button size="sm" className="text-white shadow-none" style={{ backgroundColor: getColor(process.colorKey) }} onClick={() => onMarkDone(process.id, step.id)}>
                Mark as done
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={() => onMarkUndone(process.id, step.id)}>
                Undo
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const PROCESS_ICONS: Record<string, React.ReactNode> = {
  visa: (
    <svg className="h-6 w-6" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="4" width="14" height="12" rx="2" />
      <path d="M3 8h14M7 12h2M11 12h2" />
    </svg>
  ),
  housing: (
    <svg className="h-6 w-6" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 10L10 3l7 7v7a1 1 0 01-1 1H4a1 1 0 01-1-1v-7z" />
      <path d="M8 17v-6h4v6" />
    </svg>
  ),
  health: (
    <svg className="h-6 w-6" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M10 3v14M3 10h14" />
    </svg>
  ),
  bank: (
    <svg className="h-6 w-6" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="6" width="16" height="12" rx="2" />
      <path d="M2 10h16M6 15h2" />
    </svg>
  ),
  transport: (
    <svg className="h-6 w-6" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 10h12M4 10a4 4 0 014-4h4a4 4 0 014 4v4H4v-4z" />
      <circle cx="7" cy="15" r="1.5" />
      <circle cx="13" cy="15" r="1.5" />
    </svg>
  ),
};

export function ProcessView({
  process,
  progress,
  onMarkDone,
  onMarkUndone,
  onBack,
}: ProcessViewProps) {
  const { done, total, pct } = getProcessProgress(process, progress);
  const colors = COLOR_CONFIG[process.colorKey];

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
                {PROCESS_ICONS[process.id]}
              </div>
              <div className="min-w-0">
                <h1 className="font-heading text-2xl font-normal tracking-tight text-sand-800 sm:text-[1.75rem]">
                  {process.title}
                </h1>
                <p className="mt-1 text-[13px] text-sand-500">{process.subtitle}</p>
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
          {process.steps.map((step, i) => (
            <StepCard
              key={step.id}
              step={step}
              index={i}
              process={process}
              progress={progress}
              onMarkDone={onMarkDone}
              onMarkUndone={onMarkUndone}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
