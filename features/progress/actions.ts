"use server";

import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

interface ActionResult {
  error?: string;
}

async function getSessionContext() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: auth } = await supabase.auth.getUser();
  return { supabase, userId: auth.user?.id ?? null };
}

/**
 * Mark a sub-step done (insert; no-op if already present).
 * `subStepIndex` is 0-based and matches `stepsSummary[i]` ordering.
 */
export async function markStepDoneAction(
  itemId: string,
  subStepIndex: number,
): Promise<ActionResult> {
  if (!Number.isInteger(subStepIndex) || subStepIndex < 0) {
    return { error: "Invalid sub-step index." };
  }
  const { supabase, userId } = await getSessionContext();
  if (!userId) return { error: "Not signed in." };

  const { error } = await supabase
    .from("checklist_step_progress")
    .upsert(
      { user_id: userId, item_id: itemId, sub_step_index: subStepIndex },
      { onConflict: "user_id,item_id,sub_step_index", ignoreDuplicates: true },
    );

  if (error) {
    console.error("[progress] mark step done error:", error.message);
    return { error: error.message };
  }
  return {};
}

export async function markStepUndoneAction(
  itemId: string,
  subStepIndex: number,
): Promise<ActionResult> {
  if (!Number.isInteger(subStepIndex) || subStepIndex < 0) {
    return { error: "Invalid sub-step index." };
  }
  const { supabase, userId } = await getSessionContext();
  if (!userId) return { error: "Not signed in." };

  const { error } = await supabase
    .from("checklist_step_progress")
    .delete()
    .eq("user_id", userId)
    .eq("item_id", itemId)
    .eq("sub_step_index", subStepIndex);

  if (error) {
    console.error("[progress] mark step undone error:", error.message);
    return { error: error.message };
  }
  return {};
}

/** Mark the whole item complete (independent of sub-step ticks). */
export async function markItemDoneAction(itemId: string): Promise<ActionResult> {
  const { supabase, userId } = await getSessionContext();
  if (!userId) return { error: "Not signed in." };

  const { error } = await supabase
    .from("checklist_item_completion")
    .upsert(
      { user_id: userId, item_id: itemId },
      { onConflict: "user_id,item_id", ignoreDuplicates: true },
    );

  if (error) {
    console.error("[progress] mark item done error:", error.message);
    return { error: error.message };
  }
  return {};
}

export async function markItemUndoneAction(itemId: string): Promise<ActionResult> {
  const { supabase, userId } = await getSessionContext();
  if (!userId) return { error: "Not signed in." };

  const { error } = await supabase
    .from("checklist_item_completion")
    .delete()
    .eq("user_id", userId)
    .eq("item_id", itemId);

  if (error) {
    console.error("[progress] mark item undone error:", error.message);
    return { error: error.message };
  }
  return {};
}
