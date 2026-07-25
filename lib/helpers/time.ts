import { WorkEntry } from "@/types";

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function entryHours(entry: WorkEntry): number {
  if (entry.hours != null) {
    return Math.max(0, entry.hours);
  }
  if (!entry.startTime || !entry.endTime) return 0;
  let mins = timeToMinutes(entry.endTime) - timeToMinutes(entry.startTime);
  if (mins < 0) mins += 24 * 60; // overnight shift
  mins -= entry.breakMinutes || 0;
  return Math.max(0, mins) / 60;
}

export function isHoursEntry(entry: WorkEntry): boolean {
  return entry.hours != null;
}

export function formatHours(hours: number): string {
  const rounded = Math.round(hours * 100) / 100;
  return `${rounded}h`;
}

export function formatDuration(hours: number): string {
  const totalMinutes = Math.round(hours * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return m === 0 ? `${h}h` : `${h}h${m.toString().padStart(2, "0")}`;
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function monthKey(date: string): string {
  return date.slice(0, 7); // YYYY-MM
}

const WEEKDAY_LABELS = [
  "dimanche",
  "lundi",
  "mardi",
  "mercredi",
  "jeudi",
  "vendredi",
  "samedi",
];

const MONTH_LABELS = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];

export function formatDateLabel(dateISO: string): string {
  const d = new Date(dateISO + "T00:00:00");
  const weekday = WEEKDAY_LABELS[d.getDay()];
  const day = d.getDate();
  const month = MONTH_LABELS[d.getMonth()];
  return `${weekday.charAt(0).toUpperCase() + weekday.slice(1)} ${day} ${month}`;
}

export function formatMonthLabel(monthISO: string): string {
  const [year, month] = monthISO.split("-").map(Number);
  return `${MONTH_LABELS[month - 1].charAt(0).toUpperCase()}${MONTH_LABELS[
    month - 1
  ].slice(1)} ${year}`;
}
