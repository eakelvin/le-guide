// SMIC (salaire minimum interprofessionnel de croissance) — France
// Rate in effect since June 1, 2026 (arrêté du 22 mai 2026).
// Source: legifrance.gouv.fr / service-public.gouv.fr
export const SMIC_HOURLY_GROSS = 12.31; // EUR/hour, gross
export const SMIC_NET_RATIO = 0.792; // ~20.8% average employee social contributions
export const SMIC_HOURLY_NET = Math.round(SMIC_HOURLY_GROSS * SMIC_NET_RATIO * 100) / 100;

export function estimateGrossSalary(hours: number): number {
  return Math.round(hours * SMIC_HOURLY_GROSS * 100) / 100;
}

export function estimateNetSalary(hours: number): number {
  return Math.round(hours * SMIC_HOURLY_NET * 100) / 100;
}

export function formatEuros(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}
