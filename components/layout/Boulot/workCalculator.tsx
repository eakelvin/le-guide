"use client";

import { useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { AlertCircle, ChevronLeft, Download } from "lucide-react";
import toast from "react-hot-toast";
import type { WorkEntry } from "@/types";
import { WORK_ENTRY_DUPLICATE_DATE } from "@/features/work/constants";
import { useWorkLog } from "@/lib/helpers/useWorkLog";
import { entryHours, monthKey } from "@/lib/helpers/time";
import { buildWorkMonthCsv, downloadWorkMonthCsv } from "@/lib/helpers/work-export";
import { currentMonthKey } from "@/lib/helpers/helpers";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
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
  const { entries, addEntry, updateEntry, deleteEntry } = useWorkLog(initialEntries);
  const [month, setMonth] = useState(currentMonthKey());

  const existingDates = useMemo(() => new Set(entries.map((e) => e.date)), [entries]);

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
    if (existingDates.has(entry.date)) {
      toast.error(t("duplicateDayError"));
      return;
    }
    try {
      await addEntry(entry);
    } catch (error) {
      if (error instanceof Error && error.message === WORK_ENTRY_DUPLICATE_DATE) {
        toast.error(t("duplicateDayError"));
        return;
      }
      toast.error(t("saveError"));
    }
  }

  async function handleUpdate(id: string, patch: Omit<WorkEntry, "id">) {
    const otherEntryOnDate = entries.some((e) => e.id !== id && e.date === patch.date);
    if (otherEntryOnDate) {
      toast.error(t("duplicateDayError"));
      return;
    }
    try {
      await updateEntry(id, patch);
    } catch (error) {
      if (error instanceof Error && error.message === WORK_ENTRY_DUPLICATE_DATE) {
        toast.error(t("duplicateDayError"));
        return;
      }
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

  function handleExportCsv() {
    if (monthEntries.length === 0) {
      toast.error(t("exportEmpty"));
      return;
    }

    const csv = buildWorkMonthCsv(monthEntries, {
      date: t("csvDate"),
      start: t("csvStart"),
      end: t("csvEnd"),
      breakMinutes: t("csvBreak"),
      hours: t("csvHours"),
      note: t("csvNote"),
      total: t("csvTotal"),
      totalDays: t("csvTotalDays"),
    });

    downloadWorkMonthCsv(`leguide-work-hours-${month}.csv`, csv);
  }

  return (
    <div className="min-h-screen bg-canvas">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex h-14 max-w-2xl items-center px-4 sm:px-6">
          <Link
            href="/dashboard"
            className="inline-flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground no-underline transition-colors hover:text-foreground"
          >
            <ChevronLeft className="size-4 shrink-0" aria-hidden />
            <span className="truncate md:hidden">{t("title")}</span>
            <span className="hidden truncate md:inline">
              {tCommon("dashboard")}
              <span className="mx-1.5 text-sand-300">/</span>
              <span className="font-medium text-foreground">{t("title")}</span>
            </span>
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl space-y-6 px-4 py-6 sm:space-y-8 sm:px-6 sm:py-8">
        <div>
          <h1 className="mt-1 font-heading text-2xl font-light tracking-tight text-sand-800 sm:text-3xl">
            {t("heading")}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-sand-600">{t("subtitle")}</p>
        </div>

        <Alert className="border-azure-100 bg-azure-50 text-azure-900 shadow-none [&>svg]:text-azure-600">
          <AlertCircle className="size-4" aria-hidden />
          <AlertDescription className="text-azure-800">
            <span className="font-medium">{t("legalLimitTitle")}</span>{" "}
            {t("legalLimitBody")}{" "}
            <a
              href="https://www.irak.campusfrance.org/en/working-while-studying-in-france"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-azure-900 underline underline-offset-2"
            >
              {t("sourceCampusFrance")}
            </a>
            {" · "}
            <a
              href="https://france-visas.gouv.fr/en/etudiant"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-azure-900 underline underline-offset-2"
            >
              {t("sourceFranceVisas")}
            </a>
          </AlertDescription>
        </Alert>

        <section className="space-y-3" aria-label={t("heading")}>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
            <div className="min-w-0 flex-1">
              <MonthPicker month={month} onChange={setMonth} />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleExportCsv}
              disabled={monthEntries.length === 0}
              className="h-auto shrink-0 gap-2 rounded-xl border-sand-200 bg-card px-4 py-3 text-sm font-medium text-sand-700 shadow-none hover:bg-sand-50 sm:rounded-2xl sm:py-2.5"
            >
              <Download className="size-4 shrink-0" aria-hidden />
              {t("exportCsv")}
            </Button>
          </div>
          <SummaryCards totalHours={totalHours} daysWorked={daysWorked} />
        </section>

        <section className="space-y-3" aria-labelledby="boulot-entries-heading">
          <div className="flex items-end justify-between gap-3">
            <h2
              id="boulot-entries-heading"
              className="text-xs font-semibold uppercase tracking-widest text-sand-400"
            >
              {t("entriesHeading")}
            </h2>
            <span className="text-xs tabular-nums text-sand-500">
              {monthEntries.length}
            </span>
          </div>
          <ManualEntryForm onAdd={handleAdd} existingDates={existingDates} />
          <EntryList
            entries={monthEntries}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        </section>

        <p className="pb-4 text-center text-[11px] leading-relaxed text-sand-400 sm:pb-2">
          {t("disclaimer")}
        </p>
      </main>
    </div>
  );
}
