"use client";

import { useState } from "react";
import { WorkEntry } from "@/types";
import { entryHours, isHoursEntry } from "@/lib/helpers/time";

export type EntryMode = "times" | "hours";

export type EntryFormValues = Omit<WorkEntry, "id">;

const inputClass =
  "w-full rounded-lg border border-stone-200 bg-white px-2 py-1.5 text-sm text-stone-900";

export function EntryModeToggle({
  mode,
  onChange,
}: {
  mode: EntryMode;
  onChange: (mode: EntryMode) => void;
}) {
  return (
    <div className="grid grid-cols-2 rounded-lg border border-stone-200 p-0.5 bg-stone-50">
      <button
        type="button"
        onClick={() => onChange("times")}
        className={`rounded-md py-1.5 text-xs font-medium transition ${
          mode === "times"
            ? "bg-white text-stone-900 shadow-sm"
            : "text-stone-500 hover:text-stone-700"
        }`}
      >
        Horaires
      </button>
      <button
        type="button"
        onClick={() => onChange("hours")}
        className={`rounded-md py-1.5 text-xs font-medium transition ${
          mode === "hours"
            ? "bg-white text-stone-900 shadow-sm"
            : "text-stone-500 hover:text-stone-700"
        }`}
      >
        Heures
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
        : "8"
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
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <label className="text-xs text-stone-500 space-y-1">
          Date
          <input
            type="date"
            required
            value={date}
            onChange={(e) => onDate(e.target.value)}
            className={inputClass}
          />
        </label>

        {mode === "hours" ? (
          <label className="text-xs text-stone-500 space-y-1">
            Heures travaillées
            <input
              type="number"
              required
              min={0.25}
              max={24}
              step={0.25}
              value={hours}
              onChange={(e) => onHours(e.target.value)}
              className={inputClass}
            />
          </label>
        ) : (
          <label className="text-xs text-stone-500 space-y-1">
            Pause (min)
            <input
              type="number"
              min={0}
              step={5}
              value={breakMinutes}
              onChange={(e) => onBreakMinutes(Number(e.target.value))}
              className={inputClass}
            />
          </label>
        )}

        {mode === "times" && (
          <>
            <label className="text-xs text-stone-500 space-y-1">
              Arrivée
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => onStartTime(e.target.value)}
                className={inputClass}
              />
            </label>
            <label className="text-xs text-stone-500 space-y-1">
              Sortie
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => onEndTime(e.target.value)}
                className={inputClass}
              />
            </label>
          </>
        )}
      </div>

      <label className="text-xs text-stone-500 space-y-1 block">
        Note (optionnel)
        <input
          type="text"
          value={note}
          onChange={(e) => onNote(e.target.value)}
          placeholder="Ex. remplacement, formation..."
          className={inputClass}
        />
      </label>
    </>
  );
}
