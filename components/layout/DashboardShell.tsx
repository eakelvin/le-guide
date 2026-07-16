"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { Sidebar } from "./Sidebar";
import { MobileDashboardNav } from "./MobileDashboardNav";
import { PROCESSES } from "@/lib/data/processes";
import {
    applyProfileDerivedProgress,
    getChecklistTotalProgress,
    getProfileDerivedCompletionReason,
} from "@/lib/helpers/checklist-helpers";
import { useProgress, useProfile } from "@/lib/hooks";
import { DashboardHome } from "../processes/DashboardHome";
import { ProcessView } from "../processes/ProcessView";
import { ChecklistItemView } from "../processes/ChecklistItemView";
import type { AppUser } from "@/features/auth/user";
import type { ChecklistItem, DbProgress, UserProfile } from "@/types";
import { isProfileMinimumComplete } from "@/lib/helpers/helpers";
import { CompleteProfileAlert } from "@/components/layout/Profile/CompleteProfileAlert";
import { DashboardBreadcrumb } from "@/components/layout/DashboardBreadcrumb";

export type ActiveView = "home" | string; // string = process id

export function
    DashboardShell({
        initialUser,
        initialChecklist,
        initialProgress,
        initialProfile,
        initialActiveView = "home",
        showSignedInToast = false,
        showPasswordUpdatedToast = false,
    }: {
        initialUser: AppUser | null;
        initialChecklist: ChecklistItem[];
        initialProgress: DbProgress;
        initialProfile: UserProfile;
        /** Server-resolved starting view (e.g. from `/dashboard?item=<slug>`). Defaults to home. */
        initialActiveView?: ActiveView;
        showSignedInToast?: boolean;
        showPasswordUpdatedToast?: boolean;
    }) {
    const t = useTranslations("dashboard");
    const tCommon = useTranslations("common");
    const router = useRouter();
    const signedInToasted = useRef(false);
    const passwordUpdatedToasted = useRef(false);
    const itemDeepLinkCleaned = useRef(false);
    const [activeView, setActiveView] = useState<ActiveView>(initialActiveView);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const {
        progress,
        markStepDone,
        markStepUndone,
        markItemDone,
        markItemUndone,
    } = useProgress(initialProgress);
    const { profile, hydrated: profileHydrated } = useProfile(initialProfile);
    const [user] = useState<AppUser | null>(initialUser);
    const profileReady = isProfileMinimumComplete(profile);

    useEffect(() => {
        if (!showSignedInToast || signedInToasted.current) return;
        signedInToasted.current = true;
        toast.success(t("signedInSuccess"));
        router.replace("/dashboard", { scroll: false });
    }, [showSignedInToast, router]);

    useEffect(() => {
        if (!showPasswordUpdatedToast || passwordUpdatedToasted.current) return;
        passwordUpdatedToasted.current = true;
        toast.success(t("passwordUpdatedSuccess"));
        router.replace("/dashboard", { scroll: false });
    }, [showPasswordUpdatedToast, router]);

    // Strip ?item=<slug> from the URL once we've consumed it for the initial view.
    // The active view is local React state, so the URL has done its job — keeping the
    // param around would just pin the user to that step on every refresh.
    useEffect(() => {
        if (itemDeepLinkCleaned.current) return;
        itemDeepLinkCleaned.current = true;
        if (initialActiveView !== "home") {
            router.replace("/dashboard", { scroll: false });
        }
    }, [initialActiveView, router]);

    useEffect(() => {
        setMobileNavOpen(false);
    }, [activeView]);

    const displayProgress = useMemo(
        () => applyProfileDerivedProgress(progress, profile, initialChecklist),
        [progress, profile, initialChecklist],
    );
    const totalProgress = getChecklistTotalProgress(initialChecklist, displayProgress);
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
                <p className="text-sm text-muted-foreground">{tCommon("loading")}</p>
            </div>
        );
    }

    if (!profileReady) {
        return (
            <div className="flex min-h-screen flex-col bg-white">
                <main className="bg-canvas flex flex-1 flex-col overflow-y-auto">
                    <div className="animate-fade-up">
                        <div className="border-b border-border bg-card px-4 pb-8 pt-6 sm:px-6 md:px-9 md:pt-10">
                            <DashboardBreadcrumb />
                            <div className="space-y-2">
                                <h1 className="font-heading font-normal text-3xl tracking-tight text-sand-800 sm:text-[2rem] leading-tight">
                                    {greetingName ? t("welcomeBackNamed", { name: greetingName }) : t("welcomeBackGeneric")}
                                </h1>
                                <p className="text-sm leading-relaxed text-sand-600">
                                    {t("completeProfileUnlock")}
                                </p>
                            </div>
                        </div>
                        <div className="px-4 py-7 sm:px-6 md:px-9">
                            <CompleteProfileAlert />
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    const sidebarProps = {
        checklist: initialChecklist,
        progress: displayProgress,
        activeView,
        onNavigate: setActiveView,
        totalProgress,
        user,
        showCompleteProfileCta: !isProfileMinimumComplete(profile),
    };

    return (
        <div className="flex min-h-screen flex-col bg-white md:flex-row">
            <Sidebar {...sidebarProps} />
            <div className="flex min-h-0 min-w-0 flex-1 flex-col">
                <MobileDashboardNav
                    {...sidebarProps}
                    open={mobileNavOpen}
                    onOpenChange={setMobileNavOpen}
                />
                <main className="bg-canvas flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto">
                {activeView === "home" ? (
                    <DashboardHome
                        checklist={initialChecklist}
                        progress={displayProgress}
                        profile={profile}
                        onNavigate={setActiveView}
                        name={greetingName}
                        showCompleteProfileBanner={!isProfileMinimumComplete(profile)}
                    />
                ) : activeChecklistItem ? (
                    <ChecklistItemView
                        item={activeChecklistItem}
                        progress={displayProgress}
                        profileDerivedCompletionReason={getProfileDerivedCompletionReason(
                            activeChecklistItem.id,
                            profile,
                        )}
                        onMarkDone={markStepDone}
                        onMarkUndone={markStepUndone}
                        onMarkItemDone={markItemDone}
                        onMarkItemUndone={markItemUndone}
                        onBack={() => setActiveView("home")}
                    />
                ) : activeProcess ? (
                    <ProcessView
                        process={activeProcess}
                        progress={displayProgress}
                        onMarkDone={markStepDone}
                        onMarkUndone={markStepUndone}
                        onBack={() => setActiveView("home")}
                    />
                ) : (
                    <DashboardHome
                        checklist={initialChecklist}
                        progress={displayProgress}
                        profile={profile}
                        onNavigate={setActiveView}
                        name={greetingName}
                        showCompleteProfileBanner={!isProfileMinimumComplete(profile)}
                    />
                )}
                </main>
            </div>
        </div>
    );
}
