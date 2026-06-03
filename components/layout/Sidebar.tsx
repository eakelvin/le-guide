"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn, COLOR_CONFIG } from "@/lib/utils";
import {
    getCategoryColorKey,
    getChecklistItemProgress,
} from "@/lib/helpers/checklist-helpers";
import { getChecklistIcon } from "@/lib/data/checklist-icons";
import { SIDEBAR_ITEM_IDS } from "@/lib/data/sidebar-items";
import type { ChecklistItem, ProgressState } from "@/types";
import Link from "next/link";
import { useMemo } from "react";
import { BookOpen, Home } from "lucide-react";
import { UserMenu } from "@/components/layout/UserMenu";

type SidebarColorKey = "coral" | "azure" | "forest" | "gold";

const ACTIVE_NAV_BORDER: Record<SidebarColorKey, string> = {
    coral: "border-l-coral-600",
    azure: "border-l-azure-600",
    forest: "border-l-forest-600",
    gold: "border-l-gold-600",
};

interface SidebarProps {
    /** Full active checklist; the sidebar slices to SIDEBAR_ITEM_IDS internally. */
    checklist: ChecklistItem[];
    progress: ProgressState;
    activeView: string;
    onNavigate: (view: string) => void;
    totalProgress: { done: number; total: number; pct: number };
    user?: { name?: string | null; email?: string | null; imageUrl?: string | null } | null;
    /** When false, hide the “Complete your profile” CTA (profile satisfies minimum checklist). */
    showCompleteProfileCta?: boolean;
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
    if (itemId === "visa-validation" && !itemDone) {
        return (
            <Badge variant="outline" className="ml-auto shrink-0 text-[10px] border-transparent bg-coral-50 px-2 py-0.5 font-medium text-coral-600">
                Urgent
            </Badge>
        );
    }
    if (itemDone) {
        return (
            <Badge variant="secondary" className="ml-auto shrink-0 text-[10px] bg-muted px-2 py-0.5 font-normal text-muted-foreground">
                Done
            </Badge>
        );
    }
    if (pct > 0) {
        return (
            <Badge variant="outline" className="ml-auto shrink-0 border-transparent bg-forest-50 px-2 py-0.5 font-medium text-forest-600 text-[10px]">
                Active
            </Badge>
        );
    }
    return (
        <Badge variant="outline" className="ml-auto shrink-0 text-[10px] bg-muted px-2 py-0.5 font-normal text-muted-foreground">
            To do
        </Badge>
    );
}

export function Sidebar({
    checklist,
    progress,
    activeView,
    onNavigate,
    totalProgress,
    user,
    showCompleteProfileCta = true,
}: SidebarProps) {
    const displayName = user?.name?.trim() || user?.email?.trim() || "Account";
    const fallback =
        displayName
            .split(/\s+/)
            .slice(0, 2)
            .map((p) => p[0]?.toUpperCase())
            .join("") || "U";

    // Resolve the 5 sidebar items in the configured order, dropping unknowns.
    const sidebarItems = useMemo(() => {
        const byId = new Map(checklist.map((it) => [it.id, it]));
        return SIDEBAR_ITEM_IDS
            .map((id) => byId.get(id))
            .filter((it): it is ChecklistItem => it !== undefined);
    }, [checklist]);

    return (
        <aside className="flex h-screen w-64 min-w-[256px] flex-col overflow-y-auto border-r border-border bg-white text-foreground sticky top-0">
            <div className="border-b border-border px-6 py-7">
                <div className="font-heading text-xl font-normal tracking-tight text-sand-800">
                    Le<span className="text-forest-700">Guide</span>
                </div>
                <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-sand-600">
                    Student Admin Guide
                </p>
            </div>

            <div className="border-b border-border px-5 py-4">
                <div className="flex items-center gap-2.5">
                    <div className="bg-forest-50 text-forest-700 flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-medium ring-2 ring-border">
                        {fallback}
                    </div>
                    <div className="min-w-0">
                        <p className="text-foreground truncate text-sm font-medium">{user?.name ?? "Student"}</p>
                        {showCompleteProfileCta ? (
                            <Link
                                href="/profile"
                                className="mt-0.5 block truncate text-xs font-medium text-azure-700 underline-offset-2 hover:text-azure-900 hover:underline"
                            >
                                Complete your profile
                            </Link>
                        ) : null}
                    </div>
                </div>
                <div className="mt-4 space-y-2">
                    <div className="text-muted-foreground flex justify-between text-[11px]">
                        <span>Overall progress</span>
                        <span className="text-foreground font-medium">{totalProgress.pct}%</span>
                    </div>
                    <Progress
                        value={totalProgress.pct}
                        className="h-1 rounded-full bg-secondary"
                        indicatorClassName="bg-forest-600"
                    />
                </div>
            </div>

            <nav className="flex flex-1 flex-col py-2">
                <p className="px-6 py-2 text-[10px] font-semibold uppercase tracking-widest text-sand-400">Getting started</p>
                <Button
                    variant="ghost"
                    className={cn(
                        "mx-2 h-auto justify-start gap-2 rounded-md border-l-4 border-y-0 border-r-0 px-3 py-2.5 text-[13px] font-normal shadow-none hover:bg-accent",
                        activeView === "home"
                            ? "border-l-forest-600 bg-forest-50 font-medium text-forest-900"
                            : "border-l-transparent text-sand-600 hover:text-sand-800",
                    )}
                    onClick={() => onNavigate("home")}
                >
                    <Home className="size-4 shrink-0 opacity-80" />
                    Dashboard
                </Button>

                <Button
                    variant="ghost"
                    className="mx-2 h-auto justify-start gap-2 rounded-md border-l-4 border-l-transparent border-y-0 border-r-0 px-3 py-2.5 text-[13px] font-normal text-sand-600 shadow-none hover:bg-accent hover:text-sand-800"
                    asChild
                >
                    <Link href="/guides">
                        <BookOpen className="size-4 shrink-0 opacity-80" />
                        Guides & resources
                    </Link>
                </Button>

                <p className="mt-4 px-6 py-2 text-[10px] font-semibold uppercase tracking-widest text-sand-400">
                    Administrative Steps
                </p>
                <div className="flex flex-col gap-0.5 px-2 pb-4">
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
                                    "relative h-auto w-full justify-start gap-2.5 border-l-4 px-4 py-2.5 text-left text-[13px] font-normal hover:bg-accent rounded-md shadow-none border-y-0 border-r-0",
                                    isActive
                                        ? cn(ACTIVE_NAV_BORDER[colorKey], colors.light, colors.text, "font-medium")
                                        : "border-l-transparent text-sand-600 hover:text-sand-800",
                                )}
                                onClick={() => onNavigate(item.slug)}
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

            <div className="mt-auto border-t border-border px-5 py-4">
                <div className="mb-4 flex items-center justify-between">
                    <UserMenu name={user?.name} email={user?.email} imageUrl={user?.imageUrl} align="start" />

                    <Link
                        href="/profile"
                        className={cn(
                            "w-full flex items-center gap-2.5 px-5 py-2.5 text-[13.5px] border-l-2 transition-all no-underline",
                            "text-sand-600 border-l-transparent hover:bg-sand-50 hover:text-sand-800"
                        )}
                    >
                        My Profile
                    </Link>
                </div>
            </div>
        </aside>
    );
}
