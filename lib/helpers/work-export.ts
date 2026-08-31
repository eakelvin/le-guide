import type { WorkEntry } from "@/types";
import { entryHours, isHoursEntry } from "@/lib/helpers/time";

export type WorkCsvHeaders = {
  date: string;
  start: string;
  end: string;
  breakMinutes: string;
  hours: string;
  note: string;
  total: string;
  totalDays: string;
};

function escapeCsvField(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function formatHoursCell(entry: WorkEntry): string {
  const hours = entryHours(entry);
  return String(Math.round(hours * 100) / 100);
}

export function buildWorkMonthCsv(entries: WorkEntry[], headers: WorkCsvHeaders): string {
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  const headerRow = [
    headers.date,
    headers.start,
    headers.end,
    headers.breakMinutes,
    headers.hours,
    headers.note,
  ];

  const rows = sorted.map((entry) => {
    const manual = isHoursEntry(entry);
    return [
      entry.date,
      manual ? "" : (entry.startTime ?? ""),
      manual ? "" : (entry.endTime ?? ""),
      manual ? "" : String(entry.breakMinutes ?? 0),
      formatHoursCell(entry),
      entry.note ?? "",
    ].map(escapeCsvField);
  });

  const totalHours = sorted.reduce((sum, entry) => sum + entryHours(entry), 0);
  const daysWorked = sorted.length;

  const totalDaysRow = [
    headers.totalDays,
    String(daysWorked),
    "",
    "",
    "",
    "",
  ].map(escapeCsvField);

  const totalHoursRow = [
    headers.total,
    "",
    "",
    "",
    String(Math.round(totalHours * 100) / 100),
    "",
  ].map(escapeCsvField);

  return [
    headerRow.join(","),
    ...rows.map((r) => r.join(",")),
    totalDaysRow.join(","),
    totalHoursRow.join(","),
  ].join("\n");
}

export function downloadWorkMonthCsv(filename: string, csv: string) {
  const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
