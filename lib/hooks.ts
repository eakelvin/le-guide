"use client";

import { useState, useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
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

function allStepsDone(
  itemId: string,
  totalSteps: number,
  completedSteps: Record<string, boolean>,
): boolean {
  if (totalSteps <= 0) return false;
  return Array.from({ length: totalSteps }, (_, i) =>
    completedSteps[getStepKey(itemId, String(i))] === true,
  ).every(Boolean);
}

function stepKeysForItem(itemId: string, stepCount: number): Record<string, boolean> {
  const keys: Record<string, boolean> = {};
  for (let i = 0; i < stepCount; i++) {
    keys[getStepKey(itemId, String(i))] = true;
  }
  return keys;
}

export function useProgress(initialProgress?: Partial<DbProgress>) {
  const t = useTranslations("dashboard");
  const [progress, setProgress] = useState<ProgressState>(() => ({
    completedSteps: { ...(initialProgress?.completedSteps ?? {}) },
    completedItems: { ...(initialProgress?.completedItems ?? {}) },
  }));

  const showSaveError = useCallback(() => {
    toast.error(t("progressSaveError"));
  }, [t]);

  const markStepDone = useCallback(
    async (itemId: string, stepKey: string, totalSteps?: number) => {
      const k = getStepKey(itemId, stepKey);
      const idx = parseSubStepIndex(stepKey);
      let shouldCompleteItem = false;

      setProgress((prev) => {
        const completedSteps = { ...prev.completedSteps, [k]: true };
        shouldCompleteItem =
          prev.completedItems[itemId] !== true &&
          totalSteps != null &&
          totalSteps > 0 &&
          allStepsDone(itemId, totalSteps, completedSteps);

        return {
          completedSteps,
          completedItems: shouldCompleteItem
            ? { ...prev.completedItems, [itemId]: true }
            : prev.completedItems,
        };
      });

      if (idx === null) return;

      const { error } = await markStepDoneAction(itemId, idx);
      if (error) {
        setProgress((prev) => ({
          ...prev,
          completedSteps: { ...prev.completedSteps, [k]: false },
          completedItems: shouldCompleteItem
            ? { ...prev.completedItems, [itemId]: false }
            : prev.completedItems,
        }));
        showSaveError();
        return;
      }

      if (shouldCompleteItem) {
        const { error: itemError } = await markItemDoneAction(itemId);
        if (itemError) {
          setProgress((prev) => ({
            ...prev,
            completedItems: { ...prev.completedItems, [itemId]: false },
          }));
          showSaveError();
        }
      }
    },
    [showSaveError],
  );

  const markStepUndone = useCallback(async (itemId: string, stepKey: string) => {
    const k = getStepKey(itemId, stepKey);
    const idx = parseSubStepIndex(stepKey);
    let wasItemDone = false;

    setProgress((prev) => {
      wasItemDone = prev.completedItems[itemId] === true;
      return {
        completedSteps: { ...prev.completedSteps, [k]: false },
        completedItems: wasItemDone
          ? { ...prev.completedItems, [itemId]: false }
          : prev.completedItems,
      };
    });

    if (idx === null) return;

    const { error } = await markStepUndoneAction(itemId, idx);
    if (error) {
      setProgress((prev) => ({
        ...prev,
        completedSteps: { ...prev.completedSteps, [k]: true },
        completedItems: wasItemDone
          ? { ...prev.completedItems, [itemId]: true }
          : prev.completedItems,
      }));
      showSaveError();
      return;
    }

    if (wasItemDone) {
      const { error: itemError } = await markItemUndoneAction(itemId);
      if (itemError) {
        setProgress((prev) => ({
          ...prev,
          completedItems: { ...prev.completedItems, [itemId]: true },
        }));
        showSaveError();
      }
    }
  }, [showSaveError]);

  const markItemDone = useCallback(async (itemId: string, stepCount = 0) => {
    const tickedSteps = stepKeysForItem(itemId, stepCount);

    setProgress((prev) => ({
      completedItems: { ...prev.completedItems, [itemId]: true },
      completedSteps: { ...prev.completedSteps, ...tickedSteps },
    }));

    if (stepCount > 0) {
      const stepResults = await Promise.all(
        Array.from({ length: stepCount }, (_, i) => markStepDoneAction(itemId, i)),
      );
      const stepError = stepResults.find((r) => r.error)?.error;
      if (stepError) {
        setProgress((prev) => {
          const completedSteps = { ...prev.completedSteps };
          for (let i = 0; i < stepCount; i++) {
            delete completedSteps[getStepKey(itemId, String(i))];
          }
          return {
            completedItems: { ...prev.completedItems, [itemId]: false },
            completedSteps,
          };
        });
        showSaveError();
        return;
      }
    }

    const { error } = await markItemDoneAction(itemId);
    if (error) {
      setProgress((prev) => {
        const completedSteps = { ...prev.completedSteps };
        for (let i = 0; i < stepCount; i++) {
          delete completedSteps[getStepKey(itemId, String(i))];
        }
        return {
          completedItems: { ...prev.completedItems, [itemId]: false },
          completedSteps,
        };
      });
      showSaveError();
    }
  }, [showSaveError]);

  const markItemUndone = useCallback(async (itemId: string, stepCount = 0) => {
    const clearedKeys = Array.from({ length: stepCount }, (_, i) =>
      getStepKey(itemId, String(i)),
    );

    setProgress((prev) => {
      const completedSteps = { ...prev.completedSteps };
      for (const key of clearedKeys) {
        delete completedSteps[key];
      }
      return {
        completedItems: { ...prev.completedItems, [itemId]: false },
        completedSteps,
      };
    });

    const { error } = await markItemUndoneAction(itemId);
    if (error) {
      setProgress((prev) => ({
        ...prev,
        completedItems: { ...prev.completedItems, [itemId]: true },
      }));
      showSaveError();
      return;
    }

    if (stepCount > 0) {
      const stepResults = await Promise.all(
        Array.from({ length: stepCount }, (_, i) => markStepUndoneAction(itemId, i)),
      );
      const stepError = stepResults.find((r) => r.error)?.error;
      if (stepError) {
        showSaveError();
      }
    }
  }, [showSaveError]);

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

  // Skip the round-trip when the caller already hydrated us from the server.
  useEffect(() => {
    if (initialProfile) return;
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
  }, [initialProfile]);

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
