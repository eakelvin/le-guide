"use server";

import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import type { WorkEntry } from "@/types";
import { WORK_ENTRY_DUPLICATE_DATE } from "./constants";
import {
  fetchWorkEntriesForUser,
  fetchWorkEntryForDate,
  workEntryRowToWorkEntry,
  workEntryToInsertRow,
  type WorkEntryRow,
} from "./queries";

type ActionResult<T = void> = { error?: string; data?: T };

async function getSessionContext() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: auth } = await supabase.auth.getUser();
  return { supabase, userId: auth.user?.id ?? null };
}

function validateEntry(entry: Omit<WorkEntry, "id">): string | null {
  if (!entry.date || !/^\d{4}-\d{2}-\d{2}$/.test(entry.date)) {
    return "Invalid date.";
  }
  if (entry.hours != null) {
    if (typeof entry.hours !== "number" || Number.isNaN(entry.hours) || entry.hours < 0) {
      return "Invalid hours.";
    }
    return null;
  }
  if (!entry.startTime || !entry.endTime) {
    return "Start and end times are required.";
  }
  if (entry.breakMinutes < 0) return "Invalid break minutes.";
  return null;
}

export async function getMyWorkEntriesAction(): Promise<WorkEntry[]> {
  const { supabase, userId } = await getSessionContext();
  if (!userId) return [];
  return fetchWorkEntriesForUser(supabase, userId);
}

export async function addWorkEntryAction(
  entry: Omit<WorkEntry, "id">,
): Promise<ActionResult<WorkEntry>> {
  const validationError = validateEntry(entry);
  if (validationError) return { error: validationError };

  const { supabase, userId } = await getSessionContext();
  if (!userId) return { error: "Not signed in." };

  const existing = await fetchWorkEntryForDate(supabase, userId, entry.date);
  if (existing) return { error: WORK_ENTRY_DUPLICATE_DATE };

  const { data, error } = await supabase
    .from("work_entries")
    .insert(workEntryToInsertRow(userId, entry))
    .select("id, user_id, work_date, start_time, end_time, hours, break_minutes, note")
    .single();

  if (error || !data) {
    console.error("[work_entries] add error:", error?.message);
    if (error?.code === "23505") return { error: WORK_ENTRY_DUPLICATE_DATE };
    return { error: error?.message ?? "Failed to add entry." };
  }

  return { data: workEntryRowToWorkEntry(data as WorkEntryRow) };
}

export async function updateWorkEntryAction(
  id: string,
  entry: Omit<WorkEntry, "id">,
): Promise<ActionResult<WorkEntry>> {
  if (!id) return { error: "Missing entry id." };
  const validationError = validateEntry(entry);
  if (validationError) return { error: validationError };

  const { supabase, userId } = await getSessionContext();
  if (!userId) return { error: "Not signed in." };

  const conflicting = await fetchWorkEntryForDate(supabase, userId, entry.date, id);
  if (conflicting) return { error: WORK_ENTRY_DUPLICATE_DATE };

  const row = workEntryToInsertRow(userId, entry);
  const { user_id: _userId, ...patch } = row;

  const { data, error } = await supabase
    .from("work_entries")
    .update(patch)
    .eq("id", id)
    .eq("user_id", userId)
    .select("id, user_id, work_date, start_time, end_time, hours, break_minutes, note")
    .single();

  if (error || !data) {
    console.error("[work_entries] update error:", error?.message);
    if (error?.code === "23505") return { error: WORK_ENTRY_DUPLICATE_DATE };
    return { error: error?.message ?? "Failed to update entry." };
  }

  return { data: workEntryRowToWorkEntry(data as WorkEntryRow) };
}

export async function deleteWorkEntryAction(id: string): Promise<ActionResult> {
  if (!id) return { error: "Missing entry id." };

  const { supabase, userId } = await getSessionContext();
  if (!userId) return { error: "Not signed in." };

  const { error } = await supabase
    .from("work_entries")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    console.error("[work_entries] delete error:", error.message);
    return { error: error.message };
  }
  return {};
}
