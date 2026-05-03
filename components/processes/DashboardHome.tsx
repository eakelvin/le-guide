"use client";

import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn, COLOR_CONFIG, getProcessProgress } from "@/lib/utils";
import type { Process, ProgressState } from "@/types";
import { AlertTriangle } from "lucide-react";

interface Props {
    processes: Process[];
    progress: ProgressState;
    onNavigate: (id: string) => void;
}

const PROCESS_ICONS: Record<string, React.ReactNode> = {
    visa: (
        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="4" width="14" height="12" rx="2" />
            <path d="M3 8h14M7 12h2M11 12h2" />
        </svg>
    ),
    housing: (
        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 10L10 3l7 7v7a1 1 0 01-1 1H4a1 1 0 01-1-1v-7z" />
            <path d="M8 17v-6h4v6" />
        </svg>
    ),
    health: (
        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M10 3v14M3 10h14" />
        </svg>
    ),
    bank: (
        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="6" width="16" height="12" rx="2" />
            <path d="M2 10h16M6 15h2" />
        </svg>
    ),
    transport: (
        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 10h12M4 10a4 4 0 014-4h4a4 4 0 014 4v4H4v-4z" />
            <circle cx="7" cy="15" r="1.5" />
            <circle cx="13" cy="15" r="1.5" />
        </svg>
    ),
};

const TIMELINE = [
    { label: "Week 1–2", text: "OFII + Bank", chipClass: "bg-coral-50 text-coral-600" },
    { label: "Week 3–4", text: "CAF Dossier", chipClass: "bg-forest-50 text-forest-600" },
    { label: "Month 2", text: "CPAM + Transport", chipClass: "bg-azure-50 text-azure-600" },
    { label: "Month 3", text: "Follow-ups", chipClass: "bg-sand-100 text-sand-600" },
];

/** Card labels match the reference: sidebar can still show “Urgent” for visa. */
function processStatus(_proc: Process, pct: number) {
    if (pct === 100) return "Complete" as const;
    if (pct > 0) return "In progress" as const;
    return "Not started" as const;
}

function ProcessStatusBadge({
    status,
    colorBadge,
}: {
    status: ReturnType<typeof processStatus>;
    colorBadge: string;
}) {
    if (status === "Complete") {
        return (
            <Badge variant="outline" className="border-transparent bg-forest-50 font-medium text-forest-700">
                {status}
            </Badge>
        );
    }
    if (status === "Not started") {
        return (
            <Badge variant="outline" className={cn("border-transparent font-medium", colorBadge)}>
                {status}
            </Badge>
        );
    }
    return (
        <Badge variant="outline" className={cn(colorBadge, "border-transparent font-medium")}>
            {status}
        </Badge>
    );
}

export function DashboardHome({ processes, progress, onNavigate }: Props) {
    return (
        <div className="animate-fade-up">
            <div className="border-b border-border bg-card px-9 pb-8 pt-10">
                <CardHeader className="gap-0 space-y-0 p-0">
                    <p className="mb-2 text-xs text-sand-400">
                        <span>ArriveFrance</span>
                        <span aria-hidden className="mx-1 text-sand-300">
                            &gt;
                        </span>
                        <span className="font-medium text-sand-800">Dashboard</span>
                    </p>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div className="space-y-2">
                            <CardTitle className="font-heading font-normal text-3xl tracking-tight text-sand-800 sm:text-[2rem] leading-tight">
                                Welcome back, [Mia] 👋
                            </CardTitle>
                            <CardDescription className="max-w-md text-sm leading-relaxed text-sand-600">
                                You arrived in France [12] days ago. Here&apos;s what needs your attention this week.
                            </CardDescription>
                        </div>
                        <Badge variant="outline" className="shrink-0 border-gold-200 bg-gold-50 font-medium text-gold-600">
                            Month 1 of 12
                        </Badge>
                    </div>
                </CardHeader>
            </div>

            <div className="space-y-8 px-9 py-7">
                <Card className="gap-0 border-coral-200 bg-coral-50 shadow-none ring-0 py-3">
                    <CardContent className="flex gap-3 text-sm leading-relaxed text-coral-800">
                        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-coral-600" aria-hidden />
                        <div>
                            <strong className="font-semibold text-coral-900">Urgent:</strong> Your OFII visa validation appointment
                            must be completed within 3 months of arrival. You have approximately{" "}
                            <strong>2 months 18 days</strong> remaining. Do this first.
                        </div>
                    </CardContent>
                </Card>

                <section>
                    <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-sand-400">Your Processes</h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {processes.map((proc) => {
                            const { done, total, pct } = getProcessProgress(proc, progress);
                            const colors = COLOR_CONFIG[proc.colorKey];
                            const status = processStatus(proc, pct);

                            return (
                                <Card
                                    key={proc.id}
                                    role="button"
                                    tabIndex={0}
                                    size="sm"
                                    className={cn(
                                        "cursor-pointer gap-5 py-5 shadow-xs ring-1 ring-border transition-[box-shadow,transform] hover:-translate-y-px hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                    )}
                                    onClick={() => onNavigate(proc.id)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault();
                                            onNavigate(proc.id);
                                        }
                                    }}
                                >
                                    <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-2 space-y-0 px-6">
                                        <div
                                            className={cn(
                                                "flex size-10 items-center justify-center rounded-lg",
                                                colors.light,
                                                colors.text,
                                            )}
                                        >
                                            {PROCESS_ICONS[proc.id]}
                                        </div>
                                        <ProcessStatusBadge status={status} colorBadge={colors.badge} />
                                    </CardHeader>
                                    <CardContent className="space-y-3 px-6">
                                        <div>
                                            <p className="text-sm font-semibold leading-snug text-sand-800">{proc.title}</p>
                                            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-sand-500">{proc.subtitle}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-[11px] text-sand-400">
                                                <span>
                                                    {done} of {total} steps done
                                                </span>
                                                <span className="font-medium text-sand-700">{pct}%</span>
                                            </div>
                                            <Progress
                                                value={pct}
                                                className="h-[3px] rounded-full bg-sand-100"
                                                indicatorClassName={cn(colors.progress)}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </section>

                <section>
                    <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-sand-400">
                        Suggested Timeline — First 3 Months
                    </h2>
                    <Card className="gap-0 shadow-xs">
                        <CardContent className="px-6 pt-6">
                            <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                                {TIMELINE.map((t) => (
                                    <div key={t.label} className="min-w-0">
                                        <p className="mb-2 text-center text-[10px] leading-tight text-sand-400">{t.label}</p>
                                        <div
                                            className={cn(
                                                "flex h-10 items-center justify-center rounded-md px-1 text-center text-[11px] font-medium",
                                                t.chipClass,
                                            )}
                                        >
                                            {t.text}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs leading-relaxed text-sand-500">
                                Complete OFII and open a bank account first — both CAF and CPAM require a French IBAN. Bank accounts
                                can take 5–10 business days to activate.
                            </p>
                        </CardContent>
                    </Card>
                </section>
            </div>
        </div>
    );
}
