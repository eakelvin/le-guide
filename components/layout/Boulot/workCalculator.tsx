"use client";

import { useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { ChevronLeft } from "lucide-react";
import toast from "react-hot-toast";
import type { WorkEntry } from "@/types";
import { useWorkLog } from "@/lib/helpers/useWorkLog";
import { entryHours, monthKey } from "@/lib/helpers/time";
import { currentMonthKey } from "@/lib/helpers/helpers";
import { SummaryCards } from "@/components/layout/Boulot/SummaryCards";
import { MonthPicker } from "@/components/layout/Boulot/MonthPicker";
import { EntryList } from "@/components/layout/Boulot/EntryList";
import { ManualEntryForm } from "@/components/layout/Boulot/ManualEntryForm";

export default function WorkCalculator({
  initialEntries = [],
}: {
  initialEntries?: WorkEntry[];
}) {
  const t = useTranslations("boulot");
  const tCommon = useTranslations("common");
  const { ready, entries, addEntry, updateEntry, deleteEntry } = useWorkLog(initialEntries);
  const [month, setMonth] = useState(currentMonthKey());

  const monthEntries = useMemo(
    () => entries.filter((e) => monthKey(e.date) === month),
    [entries, month],
  );

  const totalHours = useMemo(
    () => monthEntries.reduce((sum, e) => sum + entryHours(e), 0),
    [monthEntries],
  );

  const daysWorked = useMemo(
    () => new Set(monthEntries.map((e) => e.date)).size,
    [monthEntries],
  );

  async function handleAdd(entry: Omit<WorkEntry, "id">) {
    try {
      await addEntry(entry);
    } catch {
      toast.error(t("saveError"));
    }
  }

  async function handleUpdate(id: string, patch: Omit<WorkEntry, "id">) {
    try {
      await updateEntry(id, patch);
    } catch {
      toast.error(t("saveError"));
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteEntry(id);
    } catch {
      toast.error(t("deleteError"));
    }
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-forest-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-lg items-center px-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground no-underline transition-colors hover:text-foreground"
          >
            <ChevronLeft className="size-4 shrink-0" aria-hidden />
            <span className="truncate">
              {tCommon("dashboard")}
              <span className="mx-1.5 text-sand-300">/</span>
              <span className="font-medium text-foreground">{t("title")}</span>
            </span>
          </Link>
        </div>
      </div>

      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-8 space-y-6">
        <header>
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">
            {t("eyebrow")}
          </p>
          <h1 className="text-2xl font-medium mt-1">{t("heading")}</h1>
          <p className="mt-1 text-sm text-stone-500">{t("subtitle")}</p>
        </header>

        <section className="space-y-3">
          <MonthPicker month={month} onChange={setMonth} />
          <SummaryCards totalHours={totalHours} daysWorked={daysWorked} />
        </section>

        <section className="space-y-3">
          <ManualEntryForm onAdd={handleAdd} />
          <EntryList
            entries={monthEntries}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        </section>

        <p className="text-center text-[11px] text-stone-400 pt-2">{t("disclaimer")}</p>
      </main>
    </div>
  );
}
