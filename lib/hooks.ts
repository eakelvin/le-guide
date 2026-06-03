"use client";

import { useState, useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import type { DbProgress, ProgressState, UserProfile } from "@/types";
import { DEFAULT_PROFILE } from "@/types";
import { getStepKey } from "./utils";
import { getMyProfileAction, saveMyProfileAction } from "@/features/profile/actions";
import {
  markStepDoneAction,
  markStepUndoneAction,
  markItemDoneAction,
  markItemUndoneAction,
} from "@/features/progress/actions";

/* ─── Progress ───────────────────────────────────────────────────── */

/** Sub-step keys are stringified non-negative integers; anything else is rejected by the server action. */
function parseSubStepIndex(stepKey: string): number | null {
  if (!/^\d+$/.test(stepKey)) return null;
  const n = Number(stepKey);
  return Number.isInteger(n) && n >= 0 ? n : null;
}

export function useProgress(initialProgress?: Partial<DbProgress>) {
  const [progress, setProgress] = useState<ProgressState>(() => ({
    completedSteps: { ...(initialProgress?.completedSteps ?? {}) },
    completedItems: { ...(initialProgress?.completedItems ?? {}) },
  }));

  const markStepDone = useCallback(async (itemId: string, stepKey: string) => {
    const k = getStepKey(itemId, stepKey);
    setProgress((prev) => ({
      ...prev,
      completedSteps: { ...prev.completedSteps, [k]: true },
    }));
    const idx = parseSubStepIndex(stepKey);
    if (idx === null) return;
    const { error } = await markStepDoneAction(itemId, idx);
    if (error) {
      setProgress((prev) => ({
        ...prev,
        completedSteps: { ...prev.completedSteps, [k]: false },
      }));
      toast.error("Couldn't save your progress.");
    }
  }, []);

  const markStepUndone = useCallback(async (itemId: string, stepKey: string) => {
    const k = getStepKey(itemId, stepKey);
    setProgress((prev) => ({
      ...prev,
      completedSteps: { ...prev.completedSteps, [k]: false },
    }));
    const idx = parseSubStepIndex(stepKey);
    if (idx === null) return;
    const { error } = await markStepUndoneAction(itemId, idx);
    if (error) {
      setProgress((prev) => ({
        ...prev,
        completedSteps: { ...prev.completedSteps, [k]: true },
      }));
      toast.error("Couldn't save your progress.");
    }
  }, []);

  const markItemDone = useCallback(async (itemId: string) => {
    setProgress((prev) => ({
      ...prev,
      completedItems: { ...prev.completedItems, [itemId]: true },
    }));
    const { error } = await markItemDoneAction(itemId);
    if (error) {
      setProgress((prev) => ({
        ...prev,
        completedItems: { ...prev.completedItems, [itemId]: false },
      }));
      toast.error("Couldn't save your progress.");
    }
  }, []);

  const markItemUndone = useCallback(async (itemId: string) => {
    setProgress((prev) => ({
      ...prev,
      completedItems: { ...prev.completedItems, [itemId]: false },
    }));
    const { error } = await markItemUndoneAction(itemId);
    if (error) {
      setProgress((prev) => ({
        ...prev,
        completedItems: { ...prev.completedItems, [itemId]: true },
      }));
      toast.error("Couldn't save your progress.");
    }
  }, []);

  return {
    progress,
    markStepDone,
    markStepUndone,
    markItemDone,
    markItemUndone,
  };
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
