"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { WorkEntry } from "@/types";
import { todayISO } from "@/lib/helpers/time";
import {
  EntryFormFields,
  EntryModeToggle,
  useEntryFormState,
} from "@/components/layout/Boulot/EntryFormFields";

export function ManualEntryForm({
  onAdd,
}: {
  onAdd: (entry: Omit<WorkEntry, "id">) => void | Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const form = useEntryFormState();

  function openForm() {
    form.reset({ date: todayISO() });
    setOpen(true);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    try {
      await onAdd(form.toValues());
      form.reset({ date: todayISO() });
      setOpen(false);
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={openForm}
        className="w-full rounded-2xl border border-dashed border-stone-300 py-3 text-sm font-medium text-stone-600 hover:border-stone-400 hover:bg-white transition flex items-center justify-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Ajouter une journée manuellement
      </button>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-stone-200 bg-white p-4 space-y-3"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Nouvelle journée</p>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Fermer"
          className="text-stone-400 hover:text-stone-700 p-1"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <EntryModeToggle mode={form.mode} onChange={form.setMode} />

      <EntryFormFields
        mode={form.mode}
        date={form.date}
        startTime={form.startTime}
        endTime={form.endTime}
        hours={form.hours}
        breakMinutes={form.breakMinutes}
        note={form.note}
        onDate={form.setDate}
        onStartTime={form.setStartTime}
        onEndTime={form.setEndTime}
        onHours={form.setHours}
        onBreakMinutes={form.setBreakMinutes}
        onNote={form.setNote}
      />

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-xl bg-stone-900 text-white py-2.5 text-sm font-medium hover:bg-stone-800 transition disabled:opacity-60"
      >
        {saving ? "…" : "Ajouter"}
      </button>
    </form>
  );
}
