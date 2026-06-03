"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Sidebar } from "./Sidebar";
import { PROCESSES } from "@/lib/data/processes";
import { getChecklistTotalProgress } from "@/lib/helpers/checklist-helpers";
import { useProgress, useProfile } from "@/lib/hooks";
import { DashboardHome } from "../processes/DashboardHome";
import { ProcessView } from "../processes/ProcessView";
import { ChecklistItemView } from "../processes/ChecklistItemView";
import type { AppUser } from "@/features/auth/user";
import type { ChecklistItem } from "@/types";
import { isProfileMinimumComplete } from "@/lib/helpers/helpers";
import { CompleteProfileAlert } from "@/components/layout/Profile/CompleteProfileAlert";

export type ActiveView = "home" | string; // string = process id

export function
    DashboardShell({
        initialUser,
        initialChecklist,
        showSignedInToast = false,
        showPasswordUpdatedToast = false,
    }: {
        initialUser: AppUser | null;
        initialChecklist: ChecklistItem[];
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

    const totalProgress = getChecklistTotalProgress(initialChecklist, progress);
    const activeProcess = PROCESSES.find((p) => p.id === activeView);
    const activeChecklistItem = useMemo(
        () =>
            activeView === "home"
                ? null
                : initialChecklist.find((it) => it.slug === activeView || it.id === activeView) ?? null,
        [activeView, initialChecklist],
    );
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
                                <span>LeGuide</span>
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
                checklist={initialChecklist}
                progress={progress}
                activeView={activeView}
                onNavigate={setActiveView}
                totalProgress={totalProgress}
                user={user}
                showCompleteProfileCta={!isProfileMinimumComplete(profile)}
            />
            <main className="bg-canvas flex flex-1 min-h-0 min-w-0 flex-col overflow-y-auto">
                {activeView === "home" ? (
                    <DashboardHome
                        checklist={initialChecklist}
                        progress={progress}
                        onNavigate={setActiveView}
                        name={greetingName}
                        showCompleteProfileBanner={!isProfileMinimumComplete(profile)}
                    />
                ) : activeChecklistItem ? (
                    <ChecklistItemView
                        item={activeChecklistItem}
                        progress={progress}
                        onMarkDone={markStepDone}
                        onMarkUndone={markStepUndone}
                        onToggleDoc={toggleDoc}
                        onBack={() => setActiveView("home")}
                    />
                ) : activeProcess ? (
                    <ProcessView
                        process={activeProcess}
                        progress={progress}
                        onMarkDone={markStepDone}
                        onMarkUndone={markStepUndone}
                        onToggleDoc={toggleDoc}
                        onBack={() => setActiveView("home")}
                    />
                ) : (
                    <DashboardHome
                        checklist={initialChecklist}
                        progress={progress}
                        onNavigate={setActiveView}
                        name={greetingName}
                        showCompleteProfileBanner={!isProfileMinimumComplete(profile)}
                    />
                )}
            </main>
        </div>
    );
}
