"use client";

import { useState, useCallback, useEffect } from "react";
import type { ProgressState, UserProfile } from "@/types";
import { DEFAULT_PROFILE } from "@/types";
import { getStepKey, getDocKey } from "./utils";
import { getMyProfileAction, saveMyProfileAction } from "@/features/profile/actions";

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

/* ─── Profile (Supabase `public.profiles`) ───────────────────────── */
export function useProfile(initialProfile?: UserProfile | null) {
  const [profile, setProfile] = useState<UserProfile>(() =>
    initialProfile ? { ...DEFAULT_PROFILE, ...initialProfile } : { ...DEFAULT_PROFILE },
  );
  const [hydrated, setHydrated] = useState(!!initialProfile);

  useEffect(() => {
    let cancelled = false;
    getMyProfileAction()
      .then((p) => {
        if (!cancelled) {
          setProfile(p);
          setHydrated(true);
        }
      })
      .catch(() => {
        if (!cancelled) setHydrated(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const saveProfile = useCallback(async (next: UserProfile) => {
    const { error } = await saveMyProfileAction(next);
    if (error) throw new Error(error);
    setProfile(next);
  }, []);

  const resetProfile = useCallback(async () => {
    const blank = { ...DEFAULT_PROFILE };
    const { error } = await saveMyProfileAction(blank);
    if (error) throw new Error(error);
    setProfile(blank);
  }, []);

  return { profile, saveProfile, resetProfile, hydrated };
}
