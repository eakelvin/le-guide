"use client";

import { useCallback, useState } from "react";
import type { WorkEntry } from "@/types";
import {
  addWorkEntryAction,
  deleteWorkEntryAction,
  updateWorkEntryAction,
} from "@/features/work/actions";

export function useWorkLog(initialEntries: WorkEntry[] = []) {
  const [entries, setEntries] = useState<WorkEntry[]>(initialEntries);
  const [pending, setPending] = useState(false);

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
    pending,
    entries,
    addEntry,
    deleteEntry,
    updateEntry,
  };
}
