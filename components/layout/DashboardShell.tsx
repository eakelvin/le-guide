"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Sidebar } from "./Sidebar";
import { getTotalProgress } from "@/lib/utils";
import { PROCESSES } from "@/lib/processes";
import { useProgress } from "@/lib/hooks";
import { DashboardHome } from "../processes/DashboardHome";
import { ProcessView } from "../processes/ProcessView";
import type { AppUser } from "@/lib/supabase/user";

export type ActiveView = "home" | string; // string = process id

export function DashboardShell({
    initialUser,
    showSignedInToast = false,
}: {
    initialUser: AppUser | null;
    showSignedInToast?: boolean;
}) {
    const router = useRouter();
    const signedInToasted = useRef(false);
    const [activeView, setActiveView] = useState<ActiveView>("home");
    const { progress, markStepDone, markStepUndone, toggleDoc } = useProgress();
    const [user] = useState<AppUser | null>(initialUser);

    useEffect(() => {
        if (!showSignedInToast || signedInToasted.current) return;
        signedInToasted.current = true;
        toast.success("Signed in successfully.");
        router.replace("/dashboard", { scroll: false });
    }, [showSignedInToast, router]);

    const totalProgress = getTotalProgress(PROCESSES, progress);
    const activeProcess = PROCESSES.find((p) => p.id === activeView);
    const greetingName = useMemo(() => {
        const n = user?.name?.trim();
        if (n) return n.split(/\s+/)[0] ?? n;
        return null;
    }, [user?.name]);

    return (
        <div className="flex min-h-screen bg-white">
            <Sidebar
                processes={PROCESSES}
                progress={progress}
                activeView={activeView}
                onNavigate={setActiveView}
                totalProgress={totalProgress}
                user={user}
            />
            <main className="bg-canvas flex flex-1 min-h-0 min-w-0 flex-col overflow-y-auto">
                {activeView === "home" || !activeProcess ? (
                    <DashboardHome
                        processes={PROCESSES}
                        progress={progress}
                        onNavigate={setActiveView}
                        name={greetingName}
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
