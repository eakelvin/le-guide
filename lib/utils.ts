import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Process, ProgressState, UserProfile } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getStepKey(processId: string, stepId: string) {
  return `${processId}_${stepId}`;
}

export function isStepDone(
  process: Process,
  stepId: string,
  progress: ProgressState
): boolean {
  const step = process.steps.find((s) => s.id === stepId);
  if (step?.defaultDone) return true;
  return progress.completedSteps[getStepKey(process.id, stepId)] === true;
}

export function getProcessProgress(process: Process, progress: ProgressState) {
  const done = process.steps.filter((s) =>
    isStepDone(process, s.id, progress)
  ).length;
  return { done, total: process.steps.length, pct: Math.round((done / process.steps.length) * 100) };
}

export function getTotalProgress(processes: Process[], progress: ProgressState) {
  let done = 0, total = 0;
  processes.forEach((p) => {
    p.steps.forEach((s) => {
      total++;
      if (isStepDone(p, s.id, progress)) done++;
    });
  });
  return { done, total, pct: total > 0 ? Math.round((done / total) * 100) : 0 };
}

export function isStepActive(
  process: Process,
  stepIndex: number,
  progress: ProgressState
): boolean {
  const s = process.steps[stepIndex];
  if (isStepDone(process, s.id, progress)) return false;
  if (stepIndex === 0) return true;
  const prev = process.steps[stepIndex - 1];
  return isStepDone(process, prev.id, progress);
}

export const COLOR_CONFIG = {
  coral:  { dot: "bg-coral-600",  ring: "ring-coral-200",  light: "bg-coral-50",  text: "text-coral-600",  border: "border-coral-200",  badge: "bg-coral-50 text-coral-600",  progress: "bg-coral-400" },
  forest: { dot: "bg-forest-600", ring: "ring-forest-200", light: "bg-forest-50", text: "text-forest-600", border: "border-forest-200", badge: "bg-forest-50 text-forest-600", progress: "bg-forest-400" },
  azure:  { dot: "bg-azure-600",  ring: "ring-azure-200",  light: "bg-azure-50",  text: "text-azure-600",  border: "border-azure-200",  badge: "bg-azure-50 text-azure-600",  progress: "bg-azure-400" },
  violet: { dot: "bg-violet-600", ring: "ring-violet-200", light: "bg-violet-50", text: "text-violet-600", border: "border-violet-200", badge: "bg-violet-50 text-violet-600", progress: "bg-violet-400" },
  gold:   { dot: "bg-gold-200",   ring: "ring-gold-100",   light: "bg-gold-50",   text: "text-gold-600",   border: "border-gold-100",   badge: "bg-gold-50 text-gold-600",     progress: "bg-gold-200" },
} as const;

export const TAG_CONFIG = {
  time:   "bg-azure-50 text-azure-600",
  cost:   "bg-gold-50 text-gold-600",
  docs:   "bg-violet-50 text-violet-600",
  urgent: "bg-coral-50 text-coral-600",
} as const;

export const TIP_CONFIG = {
  tip:    { bg: "bg-azure-50",  text: "text-azure-600",  icon: "ℹ" },
  warn:   { bg: "bg-gold-50",   text: "text-gold-600",   icon: "!" },
  urgent: { bg: "bg-coral-50",  text: "text-coral-600",  icon: "⚠" },
} as const;

