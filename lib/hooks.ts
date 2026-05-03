"use client";

import { useState, useCallback, useEffect } from "react";
import type { ProgressState } from "@/types";
import { getStepKey, getDocKey } from "./utils";

const STORAGE_KEY = "arrive-france-progress";

function loadProgress(): ProgressState {
  if (typeof window === "undefined") return { completedSteps: {}, checkedDocs: {} };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { completedSteps: {}, checkedDocs: {} };
  } catch {
    return { completedSteps: {}, checkedDocs: {} };
  }
}

function saveProgress(state: ProgressState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressState>({ completedSteps: {}, checkedDocs: {} });

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const update = useCallback((next: ProgressState) => {
    setProgress(next);
    saveProgress(next);
  }, []);

  const markStepDone = useCallback((processId: string, stepId: string) => {
    setProgress((prev) => {
      const next = { ...prev, completedSteps: { ...prev.completedSteps, [getStepKey(processId, stepId)]: true } };
      saveProgress(next);
      return next;
    });
  }, []);

  const markStepUndone = useCallback((processId: string, stepId: string) => {
    setProgress((prev) => {
      const next = { ...prev, completedSteps: { ...prev.completedSteps, [getStepKey(processId, stepId)]: false } };
      saveProgress(next);
      return next;
    });
  }, []);

  const toggleDoc = useCallback((processId: string, stepId: string, index: number) => {
    setProgress((prev) => {
      const key = getDocKey(processId, stepId, index);
      const next = { ...prev, checkedDocs: { ...prev.checkedDocs, [key]: !prev.checkedDocs[key] } };
      saveProgress(next);
      return next;
    });
  }, []);

  const resetAll = useCallback(() => {
    update({ completedSteps: {}, checkedDocs: {} });
  }, [update]);

  return { progress, markStepDone, markStepUndone, toggleDoc, resetAll };
}
