"use client";

import { useState } from "react";
import { Pencil, Trash2, X } from "lucide-react";
import { WorkEntry } from "@/types";
import {
  entryHours,
  formatDateLabel,
  formatDuration,
  isHoursEntry,
} from "@/lib/helpers/time";
import {
  EntryFormFields,
  EntryModeToggle,
  useEntryFormState,
} from "@/components/layout/Boulot/EntryFormFields";

export function EntryList({
  entries,
  onUpdate,
  onDelete,
}: {
  entries: WorkEntry[];
  onUpdate: (id: string, patch: Omit<WorkEntry, "id">) => void | Promise<void>;
  onDelete: (id: string) => void | Promise<void>;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);

  if (entries.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-stone-300 p-8 text-center">
        <p className="text-sm text-stone-500">Aucune journée enregistrée ce mois-ci.</p>
      </div>
    );
  }

  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="rounded-2xl border border-stone-200 bg-white divide-y divide-stone-100">
      {sorted.map((entry) =>
        editingId === entry.id ? (
          <EntryEditForm
            key={entry.id}
            entry={entry}
            onSave={(patch) => {
              onUpdate(entry.id, patch);
              setEditingId(null);
            }}
            onCancel={() => setEditingId(null)}
          />
        ) : (
          <div
            key={entry.id}
            className="flex items-center justify-between gap-3 px-4 py-3 group"
          >
            <div>
              <p className="text-sm font-medium capitalize">
                {formatDateLabel(entry.date)}
              </p>
              <p className="text-xs text-stone-500 font-mono tabular-nums">
                {isHoursEntry(entry)
                  ? "Heures saisies"
                  : `${entry.startTime} – ${entry.endTime}${entry.breakMinutes > 0
                    ? ` · pause ${entry.breakMinutes}min`
                    : ""
                  }`}
              </p>
              {entry.note && (
                <p className="text-xs text-stone-400 mt-0.5">{entry.note}</p>
              )}
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium font-mono tabular-nums mr-2">
                {formatDuration(entryHours(entry))}
              </span>
              <button
                onClick={() => setEditingId(entry.id)}
                aria-label="Modifier cette journée"
                className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition text-stone-400 hover:text-stone-700 p-1"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(entry.id)}
                aria-label="Supprimer cette journée"
                className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition text-stone-400 hover:text-red-600 p-1"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
}

function EntryEditForm({
  entry,
  onSave,
  onCancel,
}: {
  entry: WorkEntry;
  onSave: (patch: Omit<WorkEntry, "id">) => void | Promise<void>;
  onCancel: () => void;
}) {
  const form = useEntryFormState(entry);
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    try {
      await onSave(form.toValues());
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="p-4 space-y-3 bg-stone-50">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Modifier la journée</p>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Annuler"
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

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-xl border border-stone-200 bg-white py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-100 transition"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex-1 rounded-xl bg-stone-900 text-white py-2.5 text-sm font-medium hover:bg-stone-800 transition disabled:opacity-60"
        >
          {saving ? "…" : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}
