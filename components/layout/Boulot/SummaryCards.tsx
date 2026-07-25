"use client";

import { useTranslations } from "next-intl";
import { estimateGrossSalary, estimateNetSalary, formatEuros, SMIC_HOURLY_GROSS } from "@/lib/helpers/salary";
import { formatDuration } from "@/lib/helpers/time";
import { cn } from "@/lib/utils";

export function SummaryCards({
  totalHours,
  daysWorked,
}: {
  totalHours: number;
  daysWorked: number;
}) {
  const t = useTranslations("boulot");
  const avg = daysWorked > 0 ? totalHours / daysWorked : 0;
  const gross = estimateGrossSalary(totalHours);
  const net = estimateNetSalary(totalHours);

  return (
    <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
      <Stat label={t("statHours")} value={formatDuration(totalHours)} />
      <Stat label={t("statDays")} value={String(daysWorked)} />
      <Stat label={t("statAverage")} value={formatDuration(avg)} />
      <Stat
        label={t("statSalary")}
        value={formatEuros(net)}
        sub={t("statSalarySub", {
          gross: formatEuros(gross),
          rate: SMIC_HOURLY_GROSS.toFixed(2),
        })}
        emphasize
        className="col-span-2 lg:col-span-1"
      />
    </div>
  );
}

function Stat({
  label,
  value,
  sub,
  emphasize,
  className,
}: {
  label: string;
  value: string;
  sub?: string;
  emphasize?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "min-w-0 rounded-xl border p-3.5 sm:rounded-2xl sm:p-4",
        emphasize
          ? "border-forest-200 bg-forest-50"
          : "border-border bg-card",
        className,
      )}
    >
      <p
        className={cn(
          "text-[11px] font-medium uppercase tracking-wide sm:text-xs sm:normal-case sm:tracking-normal",
          emphasize ? "text-forest-700" : "text-sand-500",
        )}
      >
        {label}
      </p>
      <p
        className={cn(
          "mt-1 truncate font-mono text-lg font-medium tabular-nums sm:text-xl",
          emphasize ? "text-forest-900" : "text-sand-800",
        )}
      >
        {value}
      </p>
      {sub ? (
        <p className={cn("mt-1 text-[11px] leading-snug", emphasize ? "text-forest-700/80" : "text-sand-400")}>
          {sub}
        </p>
      ) : null}
    </div>
  );
}
