"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Sidebar } from "./Sidebar";
import { getTotalProgress } from "@/lib/utils";
import { PROCESSES } from "@/lib/processes";
import { useProgress, useProfile } from "@/lib/hooks";
import { DashboardHome } from "../processes/DashboardHome";
import { ProcessView } from "../processes/ProcessView";
import type { AppUser } from "@/lib/supabase/user";
import { isProfileMinimumComplete } from "@/lib/profile-completion";
import { CompleteProfileAlert } from "@/components/layout/Profile/CompleteProfileAlert";

export type ActiveView = "home" | string; // string = process id

export function DashboardShell({
    initialUser,
    showSignedInToast = false,
    showPasswordUpdatedToast = false,
}: {
    initialUser: AppUser | null;
    showSignedInToast?: boolean;
    showPasswordUpdatedToast?: boolean;
}) {
    const router = useRouter();
    const signedInToasted = useRef(false);
    const passwordUpdatedToasted = useRef(false);
    const [activeView, setActiveView] = useState<ActiveView>("home");
    const { progress, markStepDone, markStepUndone, toggleDoc } = useProgress();
    const { profile, hydrated: profileHydrated } = useProfile();
    const [user] = useState<AppUser | null>(initialUser);
    const profileReady = isProfileMinimumComplete(profile);

    useEffect(() => {
        if (!showSignedInToast || signedInToasted.current) return;
        signedInToasted.current = true;
        toast.success("Signed in successfully.");
        router.replace("/dashboard", { scroll: false });
    }, [showSignedInToast, router]);

    useEffect(() => {
        if (!showPasswordUpdatedToast || passwordUpdatedToasted.current) return;
        passwordUpdatedToasted.current = true;
        toast.success("Password updated successfully.");
        router.replace("/dashboard", { scroll: false });
    }, [showPasswordUpdatedToast, router]);

    const totalProgress = getTotalProgress(PROCESSES, progress);
    const activeProcess = PROCESSES.find((p) => p.id === activeView);
    const greetingName = useMemo(() => {
        const n = user?.name?.trim();
        if (n) return n.split(/\s+/)[0] ?? n;
        return null;
    }, [user?.name]);

    if (!profileHydrated) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white">
                <p className="text-sm text-muted-foreground">Loading…</p>
            </div>
        );
    }

    if (!profileReady) {
        return (
            <div className="flex min-h-screen flex-col bg-white">
                <main className="bg-canvas flex flex-1 flex-col overflow-y-auto">
                    <div className="animate-fade-up">
                        <div className="border-b border-border bg-card px-9 pb-8 pt-10">
                            <p className="mb-2 text-xs text-sand-400">
                                <span>ArriveFrance</span>
                                <span aria-hidden className="mx-1 text-sand-300">
                                    &gt;
                                </span>
                                <span className="font-medium text-sand-800">Dashboard</span>
                            </p>
                            <div className="space-y-2">
                                <h1 className="font-heading font-normal text-3xl tracking-tight text-sand-800 sm:text-[2rem] leading-tight">
                                    Welcome back{greetingName ? `, ${greetingName}` : ""} 👋
                                </h1>
                                <p className="text-sm leading-relaxed text-sand-600">
                                    Complete your profile to unlock your personalised checklist and processes.
                                </p>
                            </div>
                        </div>
                        <div className="px-9 py-7">
                            <CompleteProfileAlert />
                        </div>
                    </div>
                </main>
            </div>
        );
    }

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
                        showCompleteProfileBanner={false}
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
