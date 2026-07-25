"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { WorkEntry } from "@/types";
import { entryHours, isHoursEntry } from "@/lib/helpers/time";
import { cn } from "@/lib/utils";

export type EntryMode = "times" | "hours";

export type EntryFormValues = Omit<WorkEntry, "id">;

const inputClass =
  "mt-1.5 h-11 w-full min-w-0 rounded-lg border border-border bg-background px-3 text-sm text-sand-800 shadow-xs outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 sm:h-10";

export function EntryModeToggle({
  mode,
  onChange,
}: {
  mode: EntryMode;
  onChange: (mode: EntryMode) => void;
}) {
  const t = useTranslations("boulot");

  return (
    <div
      className="grid grid-cols-2 rounded-xl border border-border bg-sand-50 p-1"
      role="tablist"
      aria-label={t("modeTimes")}
    >
      <button
        type="button"
        role="tab"
        aria-selected={mode === "times"}
        onClick={() => onChange("times")}
        className={cn(
          "rounded-lg py-2.5 text-xs font-medium transition sm:py-2",
          mode === "times"
            ? "bg-card text-sand-900 shadow-xs"
            : "text-sand-500 hover:text-sand-700",
        )}
      >
        {t("modeTimes")}
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={mode === "hours"}
        onClick={() => onChange("hours")}
        className={cn(
          "rounded-lg py-2.5 text-xs font-medium transition sm:py-2",
          mode === "hours"
            ? "bg-card text-sand-900 shadow-xs"
            : "text-sand-500 hover:text-sand-700",
        )}
      >
        {t("modeHours")}
      </button>
    </div>
  );
}

export function useEntryFormState(initial?: WorkEntry) {
  const initialMode: EntryMode =
    initial && isHoursEntry(initial) ? "hours" : "times";

  const [mode, setMode] = useState<EntryMode>(initialMode);
  const [date, setDate] = useState(initial?.date ?? "");
  const [startTime, setStartTime] = useState(initial?.startTime ?? "09:00");
  const [endTime, setEndTime] = useState(initial?.endTime ?? "17:00");
  const [hours, setHours] = useState(
    initial && isHoursEntry(initial)
      ? String(initial.hours)
      : initial
        ? String(Math.round(entryHours(initial) * 100) / 100)
        : "8",
  );
  const [breakMinutes, setBreakMinutes] = useState(initial?.breakMinutes ?? 0);
  const [note, setNote] = useState(initial?.note ?? "");

  function reset(defaults: { date: string }) {
    setMode("times");
    setDate(defaults.date);
    setStartTime("09:00");
    setEndTime("17:00");
    setHours("8");
    setBreakMinutes(0);
    setNote("");
  }

  function toValues(): EntryFormValues {
    if (mode === "hours") {
      return {
        date,
        hours: Number(hours),
        breakMinutes: 0,
        note: note || undefined,
      };
    }
    return {
      date,
      startTime,
      endTime,
      breakMinutes,
      note: note || undefined,
    };
  }

  return {
    mode,
    setMode,
    date,
    setDate,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    hours,
    setHours,
    breakMinutes,
    setBreakMinutes,
    note,
    setNote,
    reset,
    toValues,
  };
}

export function EntryFormFields({
  mode,
  date,
  startTime,
  endTime,
  hours,
  breakMinutes,
  note,
  onDate,
  onStartTime,
  onEndTime,
  onHours,
  onBreakMinutes,
  onNote,
}: {
  mode: EntryMode;
  date: string;
  startTime: string;
  endTime: string;
  hours: string;
  breakMinutes: number;
  note: string;
  onDate: (v: string) => void;
  onStartTime: (v: string) => void;
  onEndTime: (v: string) => void;
  onHours: (v: string) => void;
  onBreakMinutes: (v: number) => void;
  onNote: (v: string) => void;
}) {
  const t = useTranslations("boulot");

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2">
        <label className="min-w-0 text-xs font-medium text-sand-500">
          {t("fieldDate")}
          <input
            type="date"
            required
            value={date}
            onChange={(e) => onDate(e.target.value)}
            className={inputClass}
          />
        </label>

        {mode === "hours" ? (
          <label className="min-w-0 text-xs font-medium text-sand-500">
            {t("fieldHours")}
            <input
              type="number"
              required
              min={0.25}
              max={24}
              step={0.25}
              inputMode="decimal"
              value={hours}
              onChange={(e) => onHours(e.target.value)}
              className={inputClass}
            />
          </label>
        ) : (
          <label className="min-w-0 text-xs font-medium text-sand-500">
            {t("fieldBreak")}
            <input
              type="number"
              min={0}
              step={5}
              inputMode="numeric"
              value={breakMinutes}
              onChange={(e) => onBreakMinutes(Number(e.target.value))}
              className={inputClass}
            />
          </label>
        )}

        {mode === "times" ? (
          <>
            <label className="min-w-0 text-xs font-medium text-sand-500">
              {t("fieldStart")}
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => onStartTime(e.target.value)}
                className={inputClass}
              />
            </label>
            <label className="min-w-0 text-xs font-medium text-sand-500">
              {t("fieldEnd")}
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => onEndTime(e.target.value)}
                className={inputClass}
              />
            </label>
          </>
        ) : null}
      </div>

      <label className="block min-w-0 text-xs font-medium text-sand-500">
        {t("fieldNote")}
        <input
          type="text"
          value={note}
          onChange={(e) => onNote(e.target.value)}
          placeholder={t("notePlaceholder")}
          className={inputClass}
        />
      </label>
    </div>
  );
}
