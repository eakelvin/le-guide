"use client";

import { useCallback, useEffect, useState } from "react";
import type { WorkEntry } from "@/types";
import {
  addWorkEntryAction,
  deleteWorkEntryAction,
  migrateLocalWorkEntriesAction,
  updateWorkEntryAction,
} from "@/features/work/actions";

const LOCAL_ENTRIES_KEY = "work-log:entries";
const LOCAL_MIGRATED_KEY = "work-log:migrated-to-supabase";

function readLocalEntries(): WorkEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LOCAL_ENTRIES_KEY);
    return raw ? (JSON.parse(raw) as WorkEntry[]) : [];
  } catch {
    return [];
  }
}

function clearLocalEntries() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(LOCAL_ENTRIES_KEY);
  window.localStorage.setItem(LOCAL_MIGRATED_KEY, "1");
}

function alreadyMigrated(): boolean {
  if (typeof window === "undefined") return true;
  return window.localStorage.getItem(LOCAL_MIGRATED_KEY) === "1";
}

export function useWorkLog(initialEntries: WorkEntry[] = []) {
  const [entries, setEntries] = useState<WorkEntry[]>(initialEntries);
  const [ready, setReady] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      if (alreadyMigrated()) {
        if (!cancelled) setReady(true);
        return;
      }

      const local = readLocalEntries();
      if (local.length === 0) {
        clearLocalEntries();
        if (!cancelled) setReady(true);
        return;
      }

      const { data, error } = await migrateLocalWorkEntriesAction(local);
      if (!cancelled) {
        if (!error && data) {
          setEntries(data);
          clearLocalEntries();
        }
        setReady(true);
      }
    }

    void hydrate();
    return () => {
      cancelled = true;
    };
  }, []);

  const addEntry = useCallback(async (entry: Omit<WorkEntry, "id">) => {
    setPending(true);
    try {
      const { data, error } = await addWorkEntryAction(entry);
      if (error || !data) throw new Error(error ?? "Failed to add entry.");
      setEntries((prev) => [data, ...prev]);
      return data;
    } finally {
      setPending(false);
    }
  }, []);

  const deleteEntry = useCallback(async (id: string) => {
    setPending(true);
    try {
      const { error } = await deleteWorkEntryAction(id);
      if (error) throw new Error(error);
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } finally {
      setPending(false);
    }
  }, []);

  const updateEntry = useCallback(async (id: string, data: Omit<WorkEntry, "id">) => {
    setPending(true);
    try {
      const { data: updated, error } = await updateWorkEntryAction(id, data);
      if (error || !updated) throw new Error(error ?? "Failed to update entry.");
      setEntries((prev) => prev.map((e) => (e.id === id ? updated : e)));
      return updated;
    } finally {
      setPending(false);
    }
  }, []);

  return {
    ready,
    pending,
    entries,
    addEntry,
    deleteEntry,
    updateEntry,
  };
}
