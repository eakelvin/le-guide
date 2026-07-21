"use client";

import { useState, useEffect, Suspense } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import {
    User, GraduationCap, MapPin, Save,
    CheckCircle2, ChevronLeft,
    Globe, Building2, KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useProfile } from "@/lib/hooks";
import type { ProfilePageProps, ProfileFieldKey, UserProfile, StudentType } from "@/types";
import { UpdatePasswordForm } from "@/components/auth/UpdatePasswordForm";
import { getCompletionBySection, getCompletionPct, getInitials } from "@/lib/helpers/helpers";
import { getCountryLabel } from "@/lib/data/countries-master";
import { SectionPersonal, SectionAcademic, SectionStay, SaveToast, ProfilePasswordToast } from "./SubComponents";

const SECTION_IDS = ["personal", "academic", "stay", "account"] as const;
type SectionId = (typeof SECTION_IDS)[number];

const SECTION_ICONS = {
    personal: User,
    academic: GraduationCap,
    stay: MapPin,
    account: KeyRound,
} as const;

const STUDENT_TYPE_LABEL_KEYS: Record<StudentType, "studentTypeDegree" | "studentTypeExchange" | "studentTypeIntern" | "studentTypeLanguageSchool"> = {
    "degree-student": "studentTypeDegree",
    "exchange-student": "studentTypeExchange",
    intern: "studentTypeIntern",
    "language-school": "studentTypeLanguageSchool",
};

function SaveChangesButton({
    saving,
    onClick,
    size = "default",
    className,
    fullWidth = false,
}: {
    saving: boolean;
    onClick: () => void;
    size?: "default" | "sm";
    className?: string;
    fullWidth?: boolean;
}) {
    const t = useTranslations("profile");
    return (
        <Button
            onClick={onClick}
            size={size}
            className={cn("gap-1.5", fullWidth && "w-full", className)}
            disabled={saving}
        >
            {saving ? (
                <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
            ) : (
                <Save className={size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"} aria-hidden />
            )}
            {saving ? t("saving") : t("saveChanges")}
        </Button>
    );
}

function SectionNav({
    activeSection,
    onSelect,
    sectionLabels,
    sectionCompletionMap,
    variant,
}: {
    activeSection: SectionId;
    onSelect: (id: SectionId) => void;
    sectionLabels: Record<SectionId, string>;
    sectionCompletionMap: Record<SectionId, { done: number; total: number }>;
    variant: "tabs" | "sidebar";
}) {
    const t = useTranslations("profile");

    if (variant === "tabs") {
        return (
            <div className="-mx-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex w-max gap-2" role="tablist" aria-label={t("title")}>
                    {SECTION_IDS.map((id) => {
                        const Icon = SECTION_ICONS[id];
                        const c = sectionCompletionMap[id];
                        const complete = id !== "account" && c.done === c.total;
                        const active = activeSection === id;
                        return (
                            <button
                                key={id}
                                type="button"
                                role="tab"
                                aria-selected={active}
                                onClick={() => onSelect(id)}
                                className={cn(
                                    "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] font-medium transition-colors",
                                    active
                                        ? "border-forest-200 bg-forest-50 text-forest-800"
                                        : "border-border bg-card text-muted-foreground",
                                )}
                            >
                                <Icon className="size-3.5 shrink-0" aria-hidden />
                                {sectionLabels[id]}
                                {complete ? (
                                    <CheckCircle2 className="size-3.5 text-forest-500" aria-hidden />
                                ) : id !== "account" ? (
                                    <span className="text-[10px] tabular-nums text-muted-foreground">
                                        {c.done}/{c.total}
                                    </span>
                                ) : null}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    }

    return (
        <nav className="space-y-1" aria-label={t("title")}>
            {SECTION_IDS.map((id) => {
                const Icon = SECTION_ICONS[id];
                const c = sectionCompletionMap[id];
                const complete = c.done === c.total;
                return (
                    <button
                        key={id}
                        type="button"
                        onClick={() => onSelect(id)}
                        className={cn(
                            "flex w-full items-center justify-between gap-2.5 rounded-lg border px-3.5 py-2.5 text-[13.5px] font-medium transition-all",
                            activeSection === id
                                ? "border-forest-200 bg-forest-50 text-forest-800"
                                : "border-transparent bg-transparent text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                        )}
                    >
                        <div className="flex items-center gap-2.5">
                            <Icon className="size-4 shrink-0" aria-hidden />
                            {sectionLabels[id]}
                        </div>
                        <div className="flex items-center gap-1.5">
                            {id === "account" ? (
                                <span className="text-[10px] font-normal uppercase tracking-wider text-muted-foreground">
                                    {t("security")}
                                </span>
                            ) : (
                                <>
                                    <span className="text-[11px] text-muted-foreground">
                                        {c.done}/{c.total}
                                    </span>
                                    {complete && <CheckCircle2 className="size-3.5 text-forest-500" aria-hidden />}
                                </>
                            )}
                        </div>
                    </button>
                );
            })}
        </nav>
    );
}

export function ProfilePage({ appUser, initialProfile }: ProfilePageProps) {
    const t = useTranslations("profile");
    const tCommon = useTranslations("common");
    const locale = useLocale();
    const { profile, saveProfile, hydrated } = useProfile(initialProfile);
    const [activeSection, setActiveSection] = useState<SectionId>("personal");
    const [draft, setDraft] = useState<UserProfile>(profile);
    const [toast, setToast] = useState<"saved" | "error" | null>(null);
    const [dirty, setDirty] = useState(false);
    const [saving, setSaving] = useState(false);

    const sectionLabels: Record<SectionId, string> = {
        personal: t("sectionPersonal"),
        academic: t("sectionAcademic"),
        stay: t("sectionStay"),
        account: t("sectionAccount"),
    };

    const sectionTitles: Record<SectionId, string> = {
        personal: t("sectionPersonalTitle"),
        academic: t("sectionAcademicTitle"),
        stay: t("sectionStayTitle"),
        account: t("sectionAccountTitle"),
    };

    const sectionDescs: Record<SectionId, string> = {
        personal: t("sectionPersonalDesc"),
        academic: t("sectionAcademicDesc"),
        stay: t("sectionStayDesc"),
        account: t("sectionAccountDesc"),
    };

    useEffect(() => {
        if (!hydrated) return;
        setDraft(() => {
            const base = { ...profile };
            if (!(base.email ?? "").trim() && appUser.email) base.email = appUser.email;
            if (!(base.country ?? "").trim() && appUser.country?.trim()) base.country = appUser.country.trim();
            if (!(base.firstName ?? "").trim() && !(base.lastName ?? "").trim() && appUser.name?.trim()) {
                const parts = appUser.name.trim().split(/\s+/);
                base.firstName = parts[0] ?? "";
                if (parts.length > 1) base.lastName = parts.slice(1).join(" ");
            }
            return base;
        });
    }, [hydrated, profile, appUser]);

    function handleChange(key: ProfileFieldKey, value: string) {
        setDraft((prev) => {
            const next = { ...prev, [key]: value };
            if (key === "alreadyInFrance" && value === "no") next.addressCity = "";
            return next;
        });
        setDirty(true);
    }

    async function handleSave() {
        if (saving) return;
        setSaving(true);
        try {
            await saveProfile(draft);
            setDirty(false);
            setToast("saved");
            setTimeout(() => setToast(null), 3000);
        } catch {
            setToast("error");
            setTimeout(() => setToast(null), 3000);
        } finally {
            setSaving(false);
        }
    }

    const pct = getCompletionPct(draft);
    const initials = getInitials(draft);
    const comp = getCompletionBySection(draft);
    const fullName = [draft.firstName, draft.lastName].filter(Boolean).join(" ") || t("yourProfile");

    const sectionCompletionMap: Record<SectionId, { done: number; total: number }> = {
        personal: { done: comp.personal, total: comp.personalTotal },
        academic: { done: comp.academic, total: comp.academicTotal },
        stay: { done: comp.stay, total: comp.stayTotal },
        account: { done: comp.account, total: comp.accountTotal },
    };

    const studentTypeLabel = draft.studentType
        ? t(STUDENT_TYPE_LABEL_KEYS[draft.studentType as StudentType] ?? "studentType")
        : null;

    if (!hydrated) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-forest-600 border-t-transparent" />
            </div>
        );
    }

    const ActiveIcon = SECTION_ICONS[activeSection];
    const showMobileSaveBar = dirty && activeSection !== "account";

    return (
        <div className={cn("min-h-screen bg-background", showMobileSaveBar && "pb-24 md:pb-0")}>
            <Suspense fallback={null}>
                <ProfilePasswordToast />
            </Suspense>

            <div className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
                <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">
                    <Link
                        href="/dashboard"
                        className="inline-flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground no-underline transition-colors hover:text-foreground"
                    >
                        <ChevronLeft className="size-4 shrink-0" aria-hidden />
                        <span className="truncate md:hidden">{t("title")}</span>
                        <span className="hidden truncate md:inline">
                            {tCommon("dashboard")}
                            <span className="mx-1.5 text-sand-300">/</span>
                            <span className="font-medium text-foreground">{t("title")}</span>
                        </span>
                    </Link>
                    <div className="flex shrink-0 items-center gap-2">
                        {dirty && (
                            <span className="hidden items-center gap-1.5 text-[12px] text-muted-foreground sm:flex">
                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold-200" />
                                {t("unsavedChanges")}
                            </span>
                        )}
                        {dirty && (
                            <span
                                className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold-200 sm:hidden"
                                title={t("unsavedChanges")}
                                aria-label={t("unsavedChanges")}
                            />
                        )}
                        <SaveChangesButton
                            saving={saving}
                            onClick={handleSave}
                            size="sm"
                            className="hidden h-8 md:inline-flex"
                        />
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-5xl space-y-5 px-4 py-5 sm:space-y-8 sm:px-6 sm:py-8">
                <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
                    <div className="flex items-start gap-3.5 sm:gap-5">
                        <div className="shrink-0">
                            {appUser.imageUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element -- OAuth avatar URLs are external and dynamic
                                <img
                                    src={appUser.imageUrl}
                                    alt=""
                                    className="size-14 rounded-full border-2 border-forest-100 object-cover sm:size-16"
                                />
                            ) : (
                                <div className="flex size-14 items-center justify-center rounded-full border-2 border-forest-100 bg-forest-50 text-lg font-semibold text-forest-600 sm:size-16 sm:text-xl">
                                    {initials}
                                </div>
                            )}
                        </div>

                        <div className="min-w-0 flex-1">
                            <h1 className="truncate font-serif text-lg font-light tracking-tight text-foreground sm:text-xl">
                                {fullName}
                            </h1>
                            <div className="mt-1.5 flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:gap-x-4 sm:gap-y-1">
                                {draft.university && (
                                    <span className="flex items-center gap-1 truncate text-[13px] text-muted-foreground">
                                        <Building2 className="size-3.5 shrink-0" aria-hidden />
                                        <span className="truncate">{draft.university}</span>
                                    </span>
                                )}
                                {studentTypeLabel && (
                                    <span className="flex items-center gap-1 text-[13px] text-muted-foreground">
                                        <GraduationCap className="size-3.5 shrink-0" aria-hidden />
                                        {studentTypeLabel}
                                    </span>
                                )}
                                {draft.country && (
                                    <span className="flex items-center gap-1 text-[13px] text-muted-foreground">
                                        <Globe className="size-3.5 shrink-0" aria-hidden />
                                        {getCountryLabel(draft.country, locale)}
                                    </span>
                                )}
                            </div>

                            <div className="mt-3 w-full sm:max-w-xs">
                                <div className="mb-1 flex justify-between text-[11px]">
                                    <span className="text-muted-foreground">{t("profileCompletion")}</span>
                                    <span className={cn("font-medium", pct === 100 ? "text-forest-600" : "text-muted-foreground")}>
                                        {pct}%
                                    </span>
                                </div>
                                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                                    <div
                                        className={cn(
                                            "h-full rounded-full transition-all duration-500",
                                            pct === 100 ? "bg-forest-400" : "bg-forest-600",
                                        )}
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>
                                {pct < 100 && (
                                    <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                                        {t("completionHint")}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="md:hidden">
                    <SectionNav
                        variant="tabs"
                        activeSection={activeSection}
                        onSelect={setActiveSection}
                        sectionLabels={sectionLabels}
                        sectionCompletionMap={sectionCompletionMap}
                    />
                </div>

                <div className="grid gap-5 md:grid-cols-[220px_1fr] md:gap-6">
                    <div className="hidden md:block">
                        <SectionNav
                            variant="sidebar"
                            activeSection={activeSection}
                            onSelect={setActiveSection}
                            sectionLabels={sectionLabels}
                            sectionCompletionMap={sectionCompletionMap}
                        />
                        <Link
                            href="/dashboard"
                            className="mt-3 flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-[13.5px] text-muted-foreground no-underline transition-all hover:bg-muted/60 hover:text-foreground"
                        >
                            <ChevronLeft className="size-4" aria-hidden />
                            {t("backToDashboard")}
                        </Link>
                    </div>

                    <Card className="border-border/60">
                        <CardHeader className="space-y-3 px-4 pb-4 pt-5 sm:px-6 sm:pt-6">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                <div className="min-w-0">
                                    <CardTitle className="flex items-center gap-2 font-serif text-base font-light tracking-tight sm:text-lg">
                                        <ActiveIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                                        {sectionTitles[activeSection]}
                                    </CardTitle>
                                    <CardDescription className="mt-1 text-[13px] leading-relaxed sm:text-sm">
                                        {sectionDescs[activeSection]}
                                    </CardDescription>
                                </div>
                                {activeSection !== "account" && (
                                    <div
                                        className={cn(
                                            "w-fit shrink-0 rounded-full px-2.5 py-1 text-xs font-medium",
                                            sectionCompletionMap[activeSection].done ===
                                                sectionCompletionMap[activeSection].total
                                                ? "bg-forest-50 text-forest-600"
                                                : "bg-muted text-muted-foreground",
                                        )}
                                    >
                                        {t("filledCount", {
                                            done: sectionCompletionMap[activeSection].done,
                                            total: sectionCompletionMap[activeSection].total,
                                        })}
                                    </div>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="px-4 pb-5 sm:px-6 sm:pb-6">
                            {activeSection === "personal" && <SectionPersonal draft={draft} onChange={handleChange} />}
                            {activeSection === "academic" && <SectionAcademic draft={draft} onChange={handleChange} />}
                            {activeSection === "stay" && <SectionStay draft={draft} onChange={handleChange} />}
                            {activeSection === "account" && (
                                <UpdatePasswordForm
                                    variant="embedded"
                                    next="/profile"
                                    requireCurrentPasswordField={appUser.hasEmailPasswordIdentity}
                                />
                            )}

                            {activeSection !== "account" && (
                                <div className="mt-8 hidden justify-end border-t border-border pt-6 md:flex">
                                    <SaveChangesButton saving={saving} onClick={handleSave} className="gap-2" />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {showMobileSaveBar && (
                <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden">
                    <div className="mx-auto flex max-w-5xl items-center gap-3">
                        <p className="min-w-0 flex-1 truncate text-[12px] text-muted-foreground">
                            {t("unsavedChanges")}
                        </p>
                        <SaveChangesButton saving={saving} onClick={handleSave} size="sm" className="h-10 shrink-0 px-5" />
                    </div>
                </div>
            )}

            <SaveToast state={toast} />
        </div>
    );
}
