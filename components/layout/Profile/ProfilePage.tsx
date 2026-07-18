"use client";

import { useState, useEffect, Suspense } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import {
    User, GraduationCap, MapPin, Save,
    CheckCircle2, ChevronRight, Pencil,
    Globe, Building2, KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
}: {
    saving: boolean;
    onClick: () => void;
    size?: "default" | "sm";
    className?: string;
}) {
    const t = useTranslations("profile");
    return (
        <Button onClick={onClick} size={size} className={cn("gap-1.5", className)} disabled={saving}>
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
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-5 h-5 rounded-full border-2 border-forest-600 border-t-transparent animate-spin" />
            </div>
        );
    }

    const ActiveIcon = SECTION_ICONS[activeSection];

    return (
        <div className="min-h-screen bg-background">
            <Suspense fallback={null}>
                <ProfilePasswordToast />
            </Suspense>
            <div className="sticky top-0 z-40 bg-background/90 backdrop-blur border-b border-border">
                <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Link href="/dashboard" className="hover:text-foreground transition-colors">{tCommon("dashboard")}</Link>
                        <ChevronRight className="w-3.5 h-3.5" />
                        <span className="text-foreground font-medium">{t("title")}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                        {dirty && (
                            <span className="text-[12px] text-muted-foreground flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-gold-200 animate-pulse" />
                                {t("unsavedChanges")}
                            </span>
                        )}
                        <SaveChangesButton saving={saving} onClick={handleSave} size="sm" className="h-8" />
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-8">
                <div className="flex items-start gap-5 mb-8 p-6 bg-card border border-border rounded-xl">
                    <div className="relative shrink-0">
                        {appUser.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element -- OAuth avatar URLs are external and dynamic
                            <img
                                src={appUser.imageUrl}
                                alt=""
                                className="w-16 h-16 rounded-full object-cover border-2 border-forest-100"
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-forest-50 border-2 border-forest-100 flex items-center justify-center text-xl font-semibold text-forest-600">
                                {initials}
                            </div>
                        )}
                        <button className="absolute -bottom-0.5 -right-0.5 w-6 h-6 bg-forest-900 rounded-full flex items-center justify-center shadow">
                            <Pencil className="w-3 h-3 text-white" />
                        </button>
                    </div>

                    <div className="flex-1 min-w-0">
                        <h1 className="text-xl font-serif font-light tracking-tight text-foreground truncate">
                            {fullName}
                        </h1>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5">
                            {draft.university && (
                                <span className="text-[13px] text-muted-foreground flex items-center gap-1">
                                    <Building2 className="w-3.5 h-3.5" /> {draft.university}
                                </span>
                            )}
                            {studentTypeLabel && (
                                <span className="text-[13px] text-muted-foreground flex items-center gap-1">
                                    <GraduationCap className="w-3.5 h-3.5" />
                                    {studentTypeLabel}
                                </span>
                            )}
                            {draft.country && (
                                <span className="text-[13px] text-muted-foreground flex items-center gap-1">
                                    <Globe className="w-3.5 h-3.5" /> {getCountryLabel(draft.country, locale)}
                                </span>
                            )}
                        </div>

                        <div className="mt-3 max-w-xs">
                            <div className="flex justify-between text-[11px] mb-1">
                                <span className="text-muted-foreground">{t("profileCompletion")}</span>
                                <span className={cn("font-medium", pct === 100 ? "text-forest-600" : "text-muted-foreground")}>
                                    {pct}%
                                </span>
                            </div>
                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                <div
                                    className={cn("h-full rounded-full transition-all duration-500", pct === 100 ? "bg-forest-400" : "bg-forest-600")}
                                    style={{ width: `${pct}%` }}
                                />
                            </div>
                            {pct < 100 && (
                                <p className="text-[11px] text-muted-foreground mt-1">
                                    {t("completionHint")}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-[220px_1fr] gap-6">
                    <div className="space-y-1">
                        {SECTION_IDS.map((id) => {
                            const Icon = SECTION_ICONS[id];
                            const c = sectionCompletionMap[id];
                            const complete = c.done === c.total;
                            return (
                                <button
                                    key={id}
                                    onClick={() => setActiveSection(id)}
                                    className={cn(
                                        "w-full flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-lg text-[13.5px] font-medium transition-all border",
                                        activeSection === id
                                            ? "bg-forest-50 border-forest-200 text-forest-800"
                                            : "bg-transparent border-transparent text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                                    )}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <Icon className="w-4 h-4 shrink-0" />
                                        {sectionLabels[id]}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        {id === "account" ? (
                                            <span className="text-[10px] font-normal uppercase tracking-wider text-muted-foreground">
                                                {t("security")}
                                            </span>
                                        ) : (
                                            <>
                                                <span className="text-[11px] text-muted-foreground">{c.done}/{c.total}</span>
                                                {complete && <CheckCircle2 className="w-3.5 h-3.5 text-forest-500" />}
                                            </>
                                        )}
                                    </div>
                                </button>
                            );
                        })}

                        <Separator className="my-3" />

                        <Link
                            href="/dashboard"
                            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-[13.5px] text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-all no-underline"
                        >
                            <ChevronRight className="w-4 h-4 rotate-180" />
                            {t("backToDashboard")}
                        </Link>
                    </div>

                    <Card className="border-border/60">
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg font-serif font-light tracking-tight flex items-center gap-2">
                                        <ActiveIcon className="w-4.5 h-4.5 text-muted-foreground" />
                                        {sectionTitles[activeSection]}
                                    </CardTitle>
                                    <CardDescription className="mt-1">
                                        {sectionDescs[activeSection]}
                                    </CardDescription>
                                </div>
                                {activeSection !== "account" && (
                                    <div className={cn(
                                        "text-xs font-medium px-2.5 py-1 rounded-full",
                                        sectionCompletionMap[activeSection].done === sectionCompletionMap[activeSection].total
                                            ? "bg-forest-50 text-forest-600"
                                            : "bg-muted text-muted-foreground"
                                    )}>
                                        {t("filledCount", {
                                            done: sectionCompletionMap[activeSection].done,
                                            total: sectionCompletionMap[activeSection].total,
                                        })}
                                    </div>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
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
                                <div className="flex justify-end mt-8 pt-6 border-t border-border">
                                    <SaveChangesButton saving={saving} onClick={handleSave} className="gap-2" />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            <SaveToast state={toast} />
        </div>
    );
}
