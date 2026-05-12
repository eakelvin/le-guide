"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DEADLINES } from "@/lib/data/processes";
import { cn, COLOR_CONFIG, getProcessProgress } from "@/lib/utils";
import type { Process, ProgressState } from "@/types";
import Link from "next/link";
import { BookOpen, Home } from "lucide-react";
import { UserMenu } from "@/components/layout/UserMenu";

const ACTIVE_NAV_BORDER: Record<Process["colorKey"], string> = {
    coral: "border-l-coral-600",
    forest: "border-l-forest-600",
    azure: "border-l-azure-600",
    violet: "border-l-violet-600",
    gold: "border-l-gold-600",
};

interface SidebarProps {
    processes: Process[];
    progress: ProgressState;
    activeView: string;
    onNavigate: (view: string) => void;
    totalProgress: { done: number; total: number; pct: number };
    user?: { name?: string | null; email?: string | null; imageUrl?: string | null } | null;
    /** When false, hide the “Complete your profile” CTA (profile satisfies minimum checklist). */
    showCompleteProfileCta?: boolean;
}

const PROCESS_ICONS: Record<string, React.ReactNode> = {
    visa: (
        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="4" width="14" height="12" rx="2" />
            <path d="M3 8h14M7 12h2M11 12h2" />
        </svg>
    ),
    housing: (
        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 10L10 3l7 7v7a1 1 0 01-1 1H4a1 1 0 01-1-1v-7z" />
            <path d="M8 17v-6h4v6" />
        </svg>
    ),
    health: (
        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M10 3v14M3 10h14" />
        </svg>
    ),
    bank: (
        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="6" width="16" height="12" rx="2" />
            <path d="M2 10h16M6 15h2" />
        </svg>
    ),
    transport: (
        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 10h12M4 10a4 4 0 014-4h4a4 4 0 014 4v4H4v-4z" />
            <circle cx="7" cy="15" r="1.5" />
            <circle cx="13" cy="15" r="1.5" />
        </svg>
    ),
};

function StatusBadge({ pct, processId }: { pct: number; processId: string }) {
    if (processId === "visa" && pct < 100) {
        return (
            <Badge variant="outline" className="ml-auto shrink-0 text-[10px] border-transparent bg-coral-50 px-2 py-0.5 font-medium text-coral-600">
                Urgent
            </Badge>
        );
    }
    if (pct === 100) {
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
    processes,
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

    return (
        <aside className="flex h-screen w-64 min-w-[256px] flex-col overflow-y-auto border-r border-border bg-white text-foreground sticky top-0">
            <div className="border-b border-border px-6 py-7">
                <div className="font-heading text-xl font-normal tracking-tight text-sand-800">
                    Arrive<span className="text-forest-700">France</span>
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
                    {processes.map((proc) => {
                        const { pct } = getProcessProgress(proc, progress);
                        const isActive = activeView === proc.id;
                        const colors = COLOR_CONFIG[proc.colorKey];

                        return (
                            <Button
                                key={proc.id}
                                variant="ghost"
                                className={cn(
                                    "relative h-auto w-full justify-start gap-2.5 border-l-4 px-4 py-2.5 text-left text-[13px] font-normal hover:bg-accent rounded-md shadow-none border-y-0 border-r-0",
                                    isActive
                                        ? cn(ACTIVE_NAV_BORDER[proc.colorKey], colors.light, colors.text, "font-medium")
                                        : "border-l-transparent text-sand-600 hover:text-sand-800",
                                )}
                                onClick={() => onNavigate(proc.id)}
                            >
                                <span className={cn("shrink-0", isActive ? colors.text : "text-muted-foreground")}>
                                    {PROCESS_ICONS[proc.id]}
                                </span>
                                <span className="truncate">{proc.title}</span>
                                <StatusBadge pct={pct} processId={proc.id} />
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

                {/* <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-sand-400">Deadlines</p>
                <ul className="space-y-2">
                    {DEADLINES.map((d) => (
                        <li key={d.label} className="flex items-center justify-between gap-2">
                            <div className="text-foreground flex min-w-0 items-center gap-2 text-[12px]">
                                <span
                                    className={cn(
                                        "size-1.5 shrink-0 rounded-full",
                                        d.variant === "urgent" ? "bg-coral-500" : d.variant === "warn" ? "bg-gold-400" : "bg-sand-400",
                                    )}
                                />
                                <span className="truncate">{d.label}</span>
                            </div>
                            <span className="text-muted-foreground shrink-0 text-[11px] tabular-nums">
                                {d.daysLeft < 7 ? `${d.daysLeft} days` : `${Math.ceil(d.daysLeft / 7)}w`}
                            </span>
                        </li>
                    ))}
                </ul> */}

            </div>
        </aside>
    );
}
