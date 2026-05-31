/**
 * Hand-picked checklist item IDs to surface in the left sidebar.
 *
 * Order matters — items render top-to-bottom in this order.
 * Unknown ids (e.g. items archived in the DB) are silently skipped, so it's
 * safe to leave entries here even if `steps.json` changes later.
 */
export const SIDEBAR_ITEM_IDS = [
    "visa-validation",
    "find-housing",
    "online-bank-account",
    "student-social-security",
    "navigo",
] as const;

export type SidebarItemId = (typeof SIDEBAR_ITEM_IDS)[number];
