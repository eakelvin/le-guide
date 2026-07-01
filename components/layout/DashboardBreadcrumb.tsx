interface DashboardBreadcrumbProps {
    /** Current page label shown after Dashboard (e.g. checklist item title). */
    current?: string;
    /** When set, Dashboard becomes a clickable link back to the home view. */
    onDashboardClick?: () => void;
}

export function DashboardBreadcrumb({ current, onDashboardClick }: DashboardBreadcrumbProps) {
    const isDashboardCurrent = !current && !onDashboardClick;

    return (
        <nav aria-label="Breadcrumb" className="mb-2 text-xs text-sand-400">
            <span>LeGuide</span>
            <span aria-hidden className="mx-1 text-sand-300">
                &gt;
            </span>
            {onDashboardClick ? (
                <button
                    type="button"
                    onClick={onDashboardClick}
                    className="text-sand-400 underline-offset-2 transition-colors hover:text-sand-800 hover:underline"
                >
                    Dashboard
                </button>
            ) : (
                <span className={isDashboardCurrent ? "font-medium text-sand-800" : undefined}>
                    Dashboard
                </span>
            )}
            {current ? (
                <>
                    <span aria-hidden className="mx-1 text-sand-300">
                        &gt;
                    </span>
                    <span className="font-medium text-sand-800">{current}</span>
                </>
            ) : null}
        </nav>
    );
}
