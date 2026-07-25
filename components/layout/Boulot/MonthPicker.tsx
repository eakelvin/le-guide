"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { formatMonthLabel } from "@/lib/helpers/time";

export function MonthPicker({
  month,
  onChange,
}: {
  month: string; // YYYY-MM
  onChange: (month: string) => void;
}) {
  const t = useTranslations("boulot");

  function shift(delta: number) {
    const [y, m] = month.split("-").map(Number);
    const d = new Date(y, m - 1 + delta, 1);
    onChange(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }

  return (
    <div className="flex items-center justify-between gap-2 rounded-xl border border-border bg-card px-1.5 py-1.5 sm:rounded-2xl sm:px-2">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => shift(-1)}
        aria-label={t("prevMonth")}
        className="size-10 shrink-0 text-sand-600 sm:size-9"
      >
        <ChevronLeft className="size-5" aria-hidden />
      </Button>
      <p className="min-w-0 flex-1 truncate text-center font-heading text-base font-medium capitalize text-sand-800 sm:text-lg">
        {formatMonthLabel(month)}
      </p>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => shift(1)}
        aria-label={t("nextMonth")}
        className="size-10 shrink-0 text-sand-600 sm:size-9"
      >
        <ChevronRight className="size-5" aria-hidden />
      </Button>
    </div>
  );
}
