import raw from "./countries-master.json";

type CountryRow = {
    name?: { common?: string };
    cca2?: string;
};

const rows = raw as CountryRow[];

/** Sorted English common names from `countries-master` dataset (same shape as countries.json). */
export const COUNTRY_NAMES: string[] = [...new Set(
    rows
        .map((r) => r.name?.common?.trim())
        .filter((n): n is string => typeof n === "string" && n.length > 0),
)].sort((a, b) => a.localeCompare(b, "en"));
