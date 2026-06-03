import { cache } from "react";
import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type { DbProgress } from "@/types";

interface StepProgressRow {
  item_id: string;
  sub_step_index: number;
}

interface ItemCompletionRow {
  item_id: string;
}

/** Pure mapper — fetches both progress tables for a given user, returns the DB slice of `ProgressState`. */
export async function fetchProgressForUser(
  supabase: SupabaseClient,
  userId: string,
): Promise<DbProgress> {
  const [steps, items] = await Promise.all([
    supabase
      .from("checklist_step_progress")
      .select("item_id, sub_step_index")
      .eq("user_id", userId),
    supabase
      .from("checklist_item_completion")
      .select("item_id")
      .eq("user_id", userId),
  ]);

  const completedSteps: Record<string, boolean> = {};
  if (steps.error) {
    console.error("[progress] step fetch error:", steps.error.message);
  } else if (steps.data) {
    for (const r of steps.data as StepProgressRow[]) {
      completedSteps[`${r.item_id}_${r.sub_step_index}`] = true;
    }
  }

  const completedItems: Record<string, boolean> = {};
  if (items.error) {
    console.error("[progress] item fetch error:", items.error.message);
  } else if (items.data) {
    for (const r of items.data as ItemCompletionRow[]) {
      completedItems[r.item_id] = true;
    }
  }

  return { completedSteps, completedItems };
}

/**
 * SSR-friendly entry point: resolves the current session, then fetches both
 * progress tables in parallel. Memoised per request via `react.cache` so
 * multiple Server Components in the same render share one round-trip.
 *
 * Returns the empty shape (no rows) if the user is not signed in — callers
 * shouldn't have to special-case that.
 */
export const getMyProgress = cache(async function getMyProgress(): Promise<DbProgress> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: auth } = await supabase.auth.getUser();
  const userId = auth.user?.id;
  if (!userId) return { completedSteps: {}, completedItems: {} };
  return fetchProgressForUser(supabase, userId);
});
