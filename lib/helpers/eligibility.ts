import type { StudentGroup } from "@/types";
import raw from "@/lib/data/countries-master.json";

/**
 * ISO 3166-1 alpha-2 codes for countries whose students are treated as
 * "EU students" for French residency purposes: EU 27 + EEA (Iceland,
 * Liechtenstein, Norway) + Switzerland. They typically don't need a visa
 * or residence permit to study in France.
 */
const EU_EEA_CH_CODES: ReadonlySet<string> = new Set([
    "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR",
    "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL",
    "PL", "PT", "RO", "SK", "SI", "ES", "SE",
    "IS", "LI", "NO",
    "CH",
]);

type CountryRow = { name?: { common?: string }; cca2?: string };

/** Lowercased common-name → uppercase cca2 code. Built once at module load. */
const NAME_TO_CCA2: ReadonlyMap<string, string> = (() => {
    const map = new Map<string, string>();
    for (const row of raw as CountryRow[]) {
        const name = row.name?.common?.trim().toLowerCase();
        if (name && row.cca2) map.set(name, row.cca2.toUpperCase());
    }
    return map;
})();

/** Returns true for EU 27 + EEA + Switzerland. Unknown countries return false. */
export function isEuEeaSwiss(country: string | null | undefined): boolean {
    if (!country) return false;
    const cca2 = NAME_TO_CCA2.get(country.trim().toLowerCase());
    return cca2 ? EU_EEA_CH_CODES.has(cca2) : false;
}

/**
 * Maps a stored profile `country` (English common name) to the matching
 * `StudentGroup`. Defaults to `"non_eu_students"` for unrecognised values.
 */
export function getStudentGroup(country: string | null | undefined): StudentGroup {
    return isEuEeaSwiss(country) ? "eu_students" : "non_eu_students";
}
