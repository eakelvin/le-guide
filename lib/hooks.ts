"use client";

import { useState, useCallback, useEffect } from "react";
import type { ProgressState, UserProfile } from "@/types";
import { DEFAULT_PROFILE } from "@/types";
import { getStepKey, getDocKey } from "./utils";

/* ─── Progress ───────────────────────────────────────────────────── */
const PROGRESS_KEY = "arrive-france-progress";

function loadProgress(): ProgressState {
  if (typeof window === "undefined") return { completedSteps: {}, checkedDocs: {} };
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? JSON.parse(raw) : { completedSteps: {}, checkedDocs: {} };
  } catch {
    return { completedSteps: {}, checkedDocs: {} };
  }
}

function saveProgress(state: ProgressState) {
  try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(state)); } catch {}
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressState>({ completedSteps: {}, checkedDocs: {} });

  useEffect(() => { setProgress(loadProgress()); }, []);

  const markStepDone = useCallback((processId: string, stepId: string) => {
    setProgress((prev) => {
      const next = { ...prev, completedSteps: { ...prev.completedSteps, [getStepKey(processId, stepId)]: true } };
      saveProgress(next); return next;
    });
  }, []);

  const markStepUndone = useCallback((processId: string, stepId: string) => {
    setProgress((prev) => {
      const next = { ...prev, completedSteps: { ...prev.completedSteps, [getStepKey(processId, stepId)]: false } };
      saveProgress(next); return next;
    });
  }, []);

  const toggleDoc = useCallback((processId: string, stepId: string, index: number) => {
    setProgress((prev) => {
      const key = getDocKey(processId, stepId, index);
      const next = { ...prev, checkedDocs: { ...prev.checkedDocs, [key]: !prev.checkedDocs[key] } };
      saveProgress(next); return next;
    });
  }, []);

  return { progress, markStepDone, markStepUndone, toggleDoc };
}

/* ─── Profile ────────────────────────────────────────────────────── */
const PROFILE_KEY = "arrive-france-profile";

function loadProfile(): UserProfile {
  if (typeof window === "undefined") return { ...DEFAULT_PROFILE };
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? { ...DEFAULT_PROFILE, ...JSON.parse(raw) } : { ...DEFAULT_PROFILE };
  } catch {
    return { ...DEFAULT_PROFILE };
  }
}

function saveProfileToStorage(p: UserProfile) {
  try { localStorage.setItem(PROFILE_KEY, JSON.stringify(p)); } catch {}
}

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile>({ ...DEFAULT_PROFILE });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setProfile(loadProfile());
    setHydrated(true);
  }, []);

  const saveProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updates };
      saveProfileToStorage(next);
      return next;
    });
  }, []);

  const resetProfile = useCallback(() => {
    const blank = { ...DEFAULT_PROFILE };
    setProfile(blank);
    saveProfileToStorage(blank);
  }, []);

  return { profile, saveProfile, resetProfile, hydrated };
}
