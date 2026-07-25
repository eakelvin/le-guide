import { estimateGrossSalary, estimateNetSalary, formatEuros, SMIC_HOURLY_GROSS } from "@/lib/helpers/salary";
import { formatDuration } from "@/lib/helpers/time";

export function SummaryCards({
  totalHours,
  daysWorked,
}: {
  totalHours: number;
  daysWorked: number;
}) {
  const avg = daysWorked > 0 ? totalHours / daysWorked : 0;
  const gross = estimateGrossSalary(totalHours);
  const net = estimateNetSalary(totalHours);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <Stat label="Heures" value={formatDuration(totalHours)} />
      <Stat label="Jours travaillés" value={String(daysWorked)} />
      <Stat label="Moyenne / jour" value={formatDuration(avg)} />
      <Stat
        label="Estimation salaire"
        value={formatEuros(net)}
        sub={`${formatEuros(gross)} brut · SMIC ${SMIC_HOURLY_GROSS.toFixed(2)}€/h`}
      />
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4">
      <p className="text-xs text-stone-500">{label}</p>
      <p className="mt-1 text-xl font-medium font-mono tabular-nums">{value}</p>
      {sub && <p className="mt-1 text-[11px] text-stone-400">{sub}</p>}
    </div>
  );
}
