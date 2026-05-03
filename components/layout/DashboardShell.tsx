"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { getTotalProgress } from "@/lib/utils";
import { PROCESSES } from "@/lib/processes";
import { useProgress } from "@/lib/hooks";
import { DashboardHome } from "../processes/DashboardHome";
import { ProcessView } from "../processes/ProcessView";

export type ActiveView = "home" | string; // string = process id

export function DashboardShell() {
    const [activeView, setActiveView] = useState<ActiveView>("home");
    const { progress, markStepDone, markStepUndone, toggleDoc } = useProgress();

    const totalProgress = getTotalProgress(PROCESSES, progress);
    const activeProcess = PROCESSES.find((p) => p.id === activeView);

    return (
        <div className="flex min-h-screen bg-white">
            <Sidebar
                processes={PROCESSES}
                progress={progress}
                activeView={activeView}
                onNavigate={setActiveView}
                totalProgress={totalProgress}
            />
            <main className="bg-canvas flex flex-1 min-h-0 min-w-0 flex-col overflow-y-auto">
                {activeView === "home" || !activeProcess ? (
                    <DashboardHome
                        processes={PROCESSES}
                        progress={progress}
                        onNavigate={setActiveView}
                    />
                ) : (
                    <ProcessView
                        process={activeProcess}
                        progress={progress}
                        onMarkDone={markStepDone}
                        onMarkUndone={markStepUndone}
                        onToggleDoc={toggleDoc}
                        onBack={() => setActiveView("home")}
                    />
                )}
            </main>
        </div>
    );
}
