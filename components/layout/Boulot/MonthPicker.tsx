import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatMonthLabel } from "@/lib/helpers/time";

export function MonthPicker({
  month,
  onChange,
}: {
  month: string; // YYYY-MM
  onChange: (month: string) => void;
}) {
  function shift(delta: number) {
    const [y, m] = month.split("-").map(Number);
    const d = new Date(y, m - 1 + delta, 1);
    onChange(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }

  return (
    <div className="flex items-center justify-between">
      <button
        onClick={() => shift(-1)}
        aria-label="Mois précédent"
        className="rounded-lg p-2 hover:bg-stone-100"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <p className="text-base font-medium capitalize">{formatMonthLabel(month)}</p>
      <button
        onClick={() => shift(1)}
        aria-label="Mois suivant"
        className="rounded-lg p-2 hover:bg-stone-100"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
