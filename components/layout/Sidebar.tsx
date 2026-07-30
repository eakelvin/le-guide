"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Logo } from "@/components/brand/Logo";
import { cn, COLOR_CONFIG } from "@/lib/utils";
import {
    getCategoryColorKey,
    getChecklistItemProgress,
} from "@/lib/helpers/checklist-helpers";
import { getChecklistIcon } from "@/lib/data/checklist-icons";
import { SIDEBAR_ITEM_IDS } from "@/lib/data/sidebar-items";
import type { ChecklistItem, ProgressState } from "@/types";
import { Link } from "@/i18n/navigation";
import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { BookOpen, Briefcase, Home } from "lucide-react";
import { UserMenu } from "@/components/layout/UserMenu";

type SidebarColorKey = "coral" | "azure" | "forest" | "gold";

const ACTIVE_NAV_BORDER: Record<SidebarColorKey, string> = {
    coral: "border-l-coral-600",
    azure: "border-l-azure-600",
    forest: "border-l-forest-600",
    gold: "border-l-gold-600",
};

export interface SidebarPanelProps {
    checklist: ChecklistItem[];
    progress: ProgressState;
    activeView: string;
    onNavigate: (view: string) => void;
    totalProgress: { done: number; total: number; pct: number };
    user?: { name?: string | null; email?: string | null; imageUrl?: string | null } | null;
    showCompleteProfileCta?: boolean;
    /** Called after navigation (e.g. close mobile drawer). */
    onAfterNavigate?: () => void;
    className?: string;
}

function StatusBadge({
    pct,
    itemId,
    itemDone,
}: {
    pct: number;
    itemId: string;
    itemDone: boolean;
}) {
    const t = useTranslations("common");
    if (itemId === "visa-validation" && !itemDone) {
        return (
            <Badge variant="outline" className="ml-auto shrink-0 text-[10px] border-transparent bg-coral-50 px-2 py-0.5 font-medium text-coral-600">
                {t("urgent")}
            </Badge>
        );
    }
    if (itemDone) {
        return (
            <Badge
                variant="outline"
                className="ml-auto shrink-0 border-transparent bg-forest-50 px-2 py-0.5 text-[10px] font-medium text-forest-700"
            >
                {t("done")}
            </Badge>
        );
    }
    if (pct > 0) {
        return (
            <Badge variant="outline" className="ml-auto shrink-0 border-transparent bg-forest-50 px-2 py-0.5 font-medium text-forest-600 text-[10px]">
                {t("active")}
            </Badge>
        );
    }
    return (
        <Badge
            variant="outline"
            className="ml-auto shrink-0 border-sand-200 bg-sand-50 px-2 py-0.5 text-[10px] font-medium text-sand-600"
        >
            {t("todo")}
        </Badge>
    );
}

export function SidebarPanel({
    checklist,
    progress,
    activeView,
    onNavigate,
    totalProgress,
    user,
    onAfterNavigate,
    className,
}: SidebarPanelProps) {
    const t = useTranslations("common");
    const tSidebar = useTranslations("sidebar");
    const sidebarItems = useMemo(() => {
        const byId = new Map(checklist.map((it) => [it.id, it]));
        return SIDEBAR_ITEM_IDS
            .map((id) => byId.get(id))
            .filter((it): it is ChecklistItem => it !== undefined);
    }, [checklist]);

    const navigate = (view: string) => {
        onNavigate(view);
        onAfterNavigate?.();
    };

    return (
        <div className={cn("flex h-full min-h-0 flex-col bg-white text-foreground", className)}>
            <div className="border-b border-border px-6 py-7">
                <Logo size="md" href="/" />
                <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-sand-600">
                    {tSidebar("tagline")}
                </p>
            </div>

            <nav className="flex min-h-0 flex-1 flex-col overflow-y-auto py-2">
                <p className="px-6 py-2 text-[10px] font-semibold uppercase tracking-widest text-sand-400">{tSidebar("gettingStarted")}</p>
                <Button
                    variant="ghost"
                    className={cn(
                        "mx-2 h-auto justify-start gap-2 rounded-md border-l-4 border-y-0 border-r-0 px-3 py-2.5 text-[13px] font-normal shadow-none hover:bg-accent",
                        activeView === "home"
                            ? "border-l-forest-600 bg-forest-50 font-medium text-forest-900"
                            : "border-l-transparent text-sand-600 hover:text-sand-800",
                    )}
                    onClick={() => navigate("home")}
                >
                    <Home className="size-4 shrink-0 opacity-80" />
                    {t("dashboard")}
                </Button>

                <Button
                    variant="ghost"
                    className="mx-2 h-auto justify-start gap-2 rounded-md border-l-4 border-l-transparent border-y-0 border-r-0 px-3 py-2.5 text-[13px] font-normal text-sand-600 shadow-none hover:bg-accent hover:text-sand-800"
                    asChild
                    onClick={onAfterNavigate}
                >
                    <Link href="/guides">
                        <BookOpen className="size-4 shrink-0 opacity-80" />
                        {tSidebar("guidesResources")}
                    </Link>
                </Button>

                <Button
                    variant="ghost"
                    className="mx-2 h-auto justify-start gap-2 rounded-md border-l-4 border-l-transparent border-y-0 border-r-0 px-3 py-2.5 text-[13px] font-normal text-sand-600 shadow-none hover:bg-accent hover:text-sand-800"
                    asChild
                    onClick={onAfterNavigate}
                >
                    <Link href="/boulot">
                        <Briefcase className="size-4 shrink-0 opacity-80" />
                        {tSidebar("boulot")}
                    </Link>
                </Button>

                <div className="mt-4 px-6">
                    <div className="flex items-center justify-between py-2">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-sand-400">
                            {tSidebar("adminSteps")}
                        </p>
                        <span className="text-[10px] font-semibold tabular-nums text-sand-500">
                            {totalProgress.pct}%
                        </span>
                    </div>
                    <Progress
                        value={totalProgress.pct}
                        className="h-1 rounded-full bg-secondary"
                        indicatorClassName="bg-forest-600"
                    />
                </div>
                <div className="mt-3 flex flex-col gap-0.5 px-2 pb-4">
                    {sidebarItems.map((item) => {
                        const { pct } = getChecklistItemProgress(item, progress);
                        const itemDone = progress.completedItems[item.id] === true;
                        const isActive = activeView === item.slug;
                        const colorKey = getCategoryColorKey(item.category);
                        const colors = COLOR_CONFIG[colorKey];

                        return (
                            <Button
                                key={item.id}
                                variant="ghost"
                                className={cn(
                                    "relative h-auto w-full justify-start gap-2.5 rounded-md border-l-4 border-y-0 border-r-0 px-4 py-2.5 text-left text-[13px] font-normal shadow-none hover:bg-accent",
                                    isActive
                                        ? cn(ACTIVE_NAV_BORDER[colorKey], colors.light, colors.text, "font-medium")
                                        : "border-l-transparent text-sand-600 hover:text-sand-800",
                                )}
                                onClick={() => navigate(item.slug)}
                            >
                                <span className={cn("shrink-0", isActive ? colors.text : "text-muted-foreground")}>
                                    {getChecklistIcon(item.id, "w-4 h-4")}
                                </span>
                                <span className="truncate">{item.title}</span>
                                <StatusBadge pct={pct} itemId={item.id} itemDone={itemDone} />
                            </Button>
                        );
                    })}
                </div>
            </nav>

            <div className="mt-auto shrink-0 border-t border-border px-3 py-3">
                <UserMenu
                    variant="row"
                    name={user?.name}
                    email={user?.email}
                    imageUrl={user?.imageUrl}
                    align="start"
                />
            </div>
        </div>
    );
}

/** Desktop sidebar — hidden below `md`. */
export function Sidebar(props: SidebarPanelProps) {
    return (
        <aside className="sticky top-0 hidden h-screen w-64 min-w-[256px] shrink-0 flex-col overflow-hidden border-r border-border md:flex">
            <SidebarPanel {...props} className="h-full" />
        </aside>
    );
}
