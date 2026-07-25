"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { WorkEntry } from "@/types";
import { todayISO } from "@/lib/helpers/time";
import { Button } from "@/components/ui/button";
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
  const t = useTranslations("boulot");
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
      <Button
        type="button"
        variant="outline"
        onClick={openForm}
        className="h-auto w-full justify-center gap-2 rounded-xl border-dashed border-sand-300 bg-transparent py-3.5 text-sm font-medium text-sand-700 shadow-none hover:border-forest-300 hover:bg-forest-50 hover:text-forest-800 sm:rounded-2xl"
      >
        <Plus className="size-4" aria-hidden />
        {t("addDay")}
      </Button>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-4 rounded-xl border border-border bg-card p-4 shadow-xs sm:rounded-2xl sm:p-5"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="font-heading text-sm font-medium text-sand-800 sm:text-base">{t("newDay")}</p>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setOpen(false)}
          aria-label={t("close")}
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
          onClick={() => setOpen(false)}
          className="h-11 flex-1 rounded-xl sm:h-10"
        >
          {t("cancel")}
        </Button>
        <Button
          type="submit"
          disabled={saving}
          className="h-11 flex-1 rounded-xl bg-forest-900 text-white hover:bg-forest-800 sm:h-10"
        >
          {saving ? t("saving") : t("add")}
        </Button>
      </div>
    </form>
  );
}
