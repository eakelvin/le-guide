"use client";

import { useState } from "react";
import { CalendarPlus, Pencil, Trash2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { WorkEntry } from "@/types";
import {
  entryHours,
  formatDateLabel,
  formatDuration,
  isHoursEntry,
} from "@/lib/helpers/time";
import { Button } from "@/components/ui/button";
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
  const t = useTranslations("boulot");
  const [editingId, setEditingId] = useState<string | null>(null);

  if (entries.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-sand-300 bg-sand-50/60 px-5 py-10 text-center sm:rounded-2xl sm:px-8 sm:py-12">
        <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-card text-sand-500 ring-1 ring-border">
          <CalendarPlus className="size-5" aria-hidden />
        </div>
        <p className="mt-3 font-heading text-sm font-medium text-sand-800">{t("emptyTitle")}</p>
        <p className="mx-auto mt-1 max-w-xs text-sm leading-relaxed text-sand-500">{t("emptyBody")}</p>
      </div>
    );
  }

  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="divide-y divide-sand-100 overflow-hidden rounded-xl border border-border bg-card shadow-xs sm:rounded-2xl">
      {sorted.map((entry) =>
        editingId === entry.id ? (
          <EntryEditForm
            key={entry.id}
            entry={entry}
            onSave={async (patch) => {
              await onUpdate(entry.id, patch);
              setEditingId(null);
            }}
            onCancel={() => setEditingId(null)}
          />
        ) : (
          <div
            key={entry.id}
            className="flex items-start gap-3 px-3.5 py-3.5 sm:items-center sm:px-4 sm:py-3.5"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium capitalize text-sand-800">
                {formatDateLabel(entry.date)}
              </p>
              <p className="mt-0.5 text-xs tabular-nums text-sand-500">
                {isHoursEntry(entry)
                  ? t("hoursEntered")
                  : `${entry.startTime} – ${entry.endTime}${
                      entry.breakMinutes > 0
                        ? ` ${t("breakLabel", { minutes: entry.breakMinutes })}`
                        : ""
                    }`}
              </p>
              {entry.note ? (
                <p className="mt-1 line-clamp-2 text-xs text-sand-400">{entry.note}</p>
              ) : null}
            </div>
            <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
              <span className="mr-1 font-mono text-sm font-medium tabular-nums text-sand-800 sm:mr-2">
                {formatDuration(entryHours(entry))}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setEditingId(entry.id)}
                aria-label={t("editEntry")}
                className="size-9 text-sand-500 hover:text-sand-800"
              >
                <Pencil className="size-4" aria-hidden />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (window.confirm(t("confirmDelete"))) {
                    void onDelete(entry.id);
                  }
                }}
                aria-label={t("deleteEntry")}
                className="size-9 text-sand-500 hover:text-coral-700"
              >
                <Trash2 className="size-4" aria-hidden />
              </Button>
            </div>
          </div>
        ),
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
  const t = useTranslations("boulot");
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
    <form onSubmit={submit} className="space-y-4 bg-sand-50/80 p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="font-heading text-sm font-medium text-sand-800">{t("editDay")}</p>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onCancel}
          aria-label={t("cancel")}
          className="size-9 shrink-0 text-sand-500"
        >
          <X className="size-4" aria-hidden />
        </Button>
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

      <div className="flex flex-col-reverse gap-2 min-[400px]:flex-row">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="h-11 flex-1 rounded-xl bg-card sm:h-10"
        >
          {t("cancel")}
        </Button>
        <Button
          type="submit"
          disabled={saving}
          className="h-11 flex-1 rounded-xl bg-forest-900 text-white hover:bg-forest-800 sm:h-10"
        >
          {saving ? t("saving") : t("save")}
        </Button>
      </div>
    </form>
  );
}
