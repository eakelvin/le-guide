import { cloneElement, type ReactElement, type ReactNode } from "react";

/**
 * One icon per `checklist_items.id`. Each is a stroke-based SVG matching the
 * existing process-icon style so we can reuse `bg-{color}-50 text-{color}-600`
 * classes around it. Update this map when adding new checklist items.
 *
 * The default size is `w-5 h-5` (used in dashboard cards). Pass a different
 * className to `getChecklistIcon` to override at the call site (e.g. the
 * sidebar uses `w-4 h-4`).
 */
const ICON_PROPS = {
    viewBox: "0 0 20 20",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 1.5,
};

type IconElement = ReactElement<{ className?: string }>;

export const CHECKLIST_ICONS: Record<string, IconElement> = {
    "sim-card": (
        <svg {...ICON_PROPS}>
            <rect x="5" y="2" width="10" height="16" rx="2" />
            <rect x="7" y="9" width="6" height="6" rx="1" />
            <path d="M9 11h2M9 13h2" />
        </svg>
    ),
    "find-housing": (
        <svg {...ICON_PROPS}>
            <path d="M3 10L10 3l7 7v7a1 1 0 01-1 1H4a1 1 0 01-1-1v-7z" />
            <path d="M8 17v-6h4v6" />
        </svg>
    ),
    "online-bank-account": (
        <svg {...ICON_PROPS}>
            <rect x="3" y="6" width="14" height="10" rx="2" />
            <path d="M3 9h14" />
            <circle cx="14" cy="13" r="1" />
        </svg>
    ),
    "navigo": (
        <svg {...ICON_PROPS}>
            <path d="M4 10h12M4 10a4 4 0 014-4h4a4 4 0 014 4v4H4v-4z" />
            <circle cx="7" cy="15" r="1.5" />
            <circle cx="13" cy="15" r="1.5" />
        </svg>
    ),
    "visa-validation": (
        <svg {...ICON_PROPS}>
            <rect x="3" y="3" width="14" height="14" rx="2" />
            <path d="M7 10l2 2 4-4" />
        </svg>
    ),
    "traditional-bank-account": (
        <svg {...ICON_PROPS}>
            <path d="M3 9l7-5 7 5" />
            <path d="M4 9v7M16 9v7M8 9v7M12 9v7" />
            <path d="M3 17h14" />
        </svg>
    ),
    "student-social-security": (
        <svg {...ICON_PROPS}>
            <path d="M10 3l6 3v5c0 3.5-2.5 6-6 7-3.5-1-6-3.5-6-7V6l6-3z" />
            <path d="M10 8v4M8 10h4" />
        </svg>
    ),
    "caf-application": (
        <svg {...ICON_PROPS}>
            <path d="M5 3h7l3 3v11a1 1 0 01-1 1H5a1 1 0 01-1-1V4a1 1 0 011-1z" />
            <path d="M12 3v3h3" />
            <path d="M7 11h6M7 14h4" />
        </svg>
    ),
    "declaration-of-tax": (
        <svg {...ICON_PROPS}>
            <rect x="4" y="3" width="12" height="14" rx="1.5" />
            <path d="M7 7h6M7 10h6M7 13h3" />
        </svg>
    ),
};

/** Fallback icon used when an item id has no entry in the map above. */
export const CHECKLIST_FALLBACK_ICON: IconElement = (
    <svg {...ICON_PROPS}>
        <circle cx="10" cy="10" r="6" />
        <path d="M7 10l2 2 4-4" />
    </svg>
);

export function getChecklistIcon(id: string, className: string = "w-5 h-5"): ReactNode {
    const icon = CHECKLIST_ICONS[id] ?? CHECKLIST_FALLBACK_ICON;
    return cloneElement(icon, { className });
}
