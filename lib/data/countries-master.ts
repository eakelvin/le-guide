import raw from "./countries-master.json";

type CountryRow = {
  name?: { common?: string };
  translations?: {
    fra?: { common?: string };
  };
};

export type CountryOption = {
  /** Canonical English common name — stored in profile/auth metadata. */
  value: string;
  /** Localized label for the current UI locale. */
  label: string;
};

const rows = raw as CountryRow[];

function buildOptions(locale: "en" | "fr"): CountryOption[] {
  const options: CountryOption[] = [];
  for (const r of rows) {
    const value = r.name?.common?.trim();
    if (!value) continue;
    const fr = r.translations?.fra?.common?.trim();
    const label = locale === "fr" && fr ? fr : value;
    options.push({ value, label });
  }
  return options.sort((a, b) => a.label.localeCompare(b.label, locale === "fr" ? "fr" : "en"));
}

const OPTIONS_EN = buildOptions("en");
const OPTIONS_FR = buildOptions("fr");

/** Sorted English common names (canonical storage values). */
export const COUNTRY_NAMES: string[] = OPTIONS_EN.map((o) => o.value);

export function getCountryOptions(locale: string): CountryOption[] {
  return locale === "fr" ? OPTIONS_FR : OPTIONS_EN;
}

/** Resolve a stored value (English or French) to a display label for the locale. */
export function getCountryLabel(stored: string, locale: string): string {
  const trimmed = stored.trim();
  if (!trimmed) return "";
  const options = getCountryOptions(locale);
  const byValue = options.find((o) => o.value === trimmed);
  if (byValue) return byValue.label;
  const byLabel = options.find((o) => o.label.toLowerCase() === trimmed.toLowerCase());
  if (byLabel) return byLabel.label;
  // Cross-locale: stored French name while viewing English, or vice versa
  const other = getCountryOptions(locale === "fr" ? "en" : "fr");
  const cross = other.find(
    (o) => o.value === trimmed || o.label.toLowerCase() === trimmed.toLowerCase(),
  );
  if (cross) {
    const match = options.find((o) => o.value === cross.value);
    return match?.label ?? trimmed;
  }
  return trimmed;
}

/** Normalize any displayed/stored country string to the canonical English value. */
export function toCanonicalCountryName(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";
  const en = OPTIONS_EN.find(
    (o) => o.value === trimmed || o.label.toLowerCase() === trimmed.toLowerCase(),
  );
  if (en) return en.value;
  const fr = OPTIONS_FR.find((o) => o.label.toLowerCase() === trimmed.toLowerCase());
  return fr?.value ?? trimmed;
}
