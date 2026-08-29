import type { SupabaseClient } from "@supabase/supabase-js";
import type { WorkEntry } from "@/types";

export type WorkEntryRow = {
  id: string;
  user_id: string;
  work_date: string;
  start_time: string | null;
  end_time: string | null;
  hours: number | string | null;
  break_minutes: number;
  note: string | null;
};

export function workEntryRowToWorkEntry(row: WorkEntryRow): WorkEntry {
  const hours =
    row.hours == null || row.hours === ""
      ? undefined
      : typeof row.hours === "number"
        ? row.hours
        : Number(row.hours);

  return {
    id: row.id,
    date: row.work_date,
    startTime: row.start_time ?? undefined,
    endTime: row.end_time ?? undefined,
    hours: hours != null && !Number.isNaN(hours) ? hours : undefined,
    breakMinutes: row.break_minutes ?? 0,
    note: row.note ?? undefined,
  };
}

export function workEntryToInsertRow(
  userId: string,
  entry: Omit<WorkEntry, "id"> & { id?: string },
) {
  const isHours = entry.hours != null;
  return {
    ...(entry.id ? { id: entry.id } : {}),
    user_id: userId,
    work_date: entry.date,
    start_time: isHours ? null : entry.startTime ?? null,
    end_time: isHours ? null : entry.endTime ?? null,
    hours: isHours ? entry.hours : null,
    break_minutes: isHours ? 0 : entry.breakMinutes ?? 0,
    note: entry.note?.trim() ? entry.note.trim() : null,
  };
}

export async function fetchWorkEntryForDate(
  supabase: SupabaseClient,
  userId: string,
  workDate: string,
  excludeId?: string,
): Promise<WorkEntry | null> {
  let query = supabase
    .from("work_entries")
    .select("id, user_id, work_date, start_time, end_time, hours, break_minutes, note")
    .eq("user_id", userId)
    .eq("work_date", workDate);

  if (excludeId) {
    query = query.neq("id", excludeId);
  }

  const { data, error } = await query.maybeSingle();

  if (error) {
    console.error("[work_entries] fetch by date error", error.message);
    return null;
  }

  return data ? workEntryRowToWorkEntry(data as WorkEntryRow) : null;
}

export async function fetchWorkEntriesForUser(
  supabase: SupabaseClient,
  userId: string,
): Promise<WorkEntry[]> {
  const { data, error } = await supabase
    .from("work_entries")
    .select("id, user_id, work_date, start_time, end_time, hours, break_minutes, note")
    .eq("user_id", userId)
    .order("work_date", { ascending: false });

  if (error) {
    console.error("[work_entries] fetch error", error.message);
    return [];
  }

  return ((data ?? []) as WorkEntryRow[]).map(workEntryRowToWorkEntry);
}
