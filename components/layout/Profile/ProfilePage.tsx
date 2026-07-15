"use client";

import { useState, useEffect, Suspense } from "react";
import { Link } from "@/i18n/navigation";
import {
    User, GraduationCap, MapPin, Save,
    CheckCircle2, AlertCircle, ChevronRight, Pencil,
    Calendar, Phone, Globe, Building2, Mail,
    Clock, KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useProfile } from "@/lib/hooks";
import type { ProfilePageProps, ProfileFieldKey, ProfileSectionProps, UserProfile } from "@/types";
import { STUDENT_TYPE_OPTIONS } from "@/types";
import { UpdatePasswordForm } from "@/components/auth/UpdatePasswordForm";
import { getCompletionBySection, getCompletionPct, getInitials } from "@/lib/helpers/helpers";
import { SectionPersonal, SectionAcademic, SectionStay, SaveToast, ProfilePasswordToast } from "./SubComponents";

/* ─── Constants ────────────────────────────────────────────────────── */
const SECTIONS = [
    { id: "personal", label: "Personal", icon: User },
    { id: "academic", label: "Academic", icon: GraduationCap },
    { id: "stay", label: "Stay", icon: MapPin },
    { id: "account", label: "Account", icon: KeyRound },
] as const;

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
            {saving ? "Saving…" : "Save changes"}
        </Button>
    );
}

/* ─── Main profile page ─────────────────────────────────────────────── */
export function ProfilePage({ appUser, initialProfile }: ProfilePageProps) {
    const { profile, saveProfile, hydrated } = useProfile(initialProfile);
    const [activeSection, setActiveSection] = useState("personal");
    const [draft, setDraft] = useState<UserProfile>(profile);
    const [toast, setToast] = useState<"saved" | "error" | null>(null);
    const [dirty, setDirty] = useState(false);
    const [saving, setSaving] = useState(false);

    /* Sync draft from saved profile; seed empty fields from auth user */
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
    const fullName = [draft.firstName, draft.lastName].filter(Boolean).join(" ") || "Your Profile";

    const sectionCompletionMap: Record<string, { done: number; total: number }> = {
        personal: { done: comp.personal, total: comp.personalTotal },
        academic: { done: comp.academic, total: comp.academicTotal },
        stay: { done: comp.stay, total: comp.stayTotal },
        account: { done: comp.account, total: comp.accountTotal },
    };

    if (!hydrated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-5 h-5 rounded-full border-2 border-forest-600 border-t-transparent animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Suspense fallback={null}>
                <ProfilePasswordToast />
            </Suspense>
            {/* Top nav */}
            <div className="sticky top-0 z-40 bg-background/90 backdrop-blur border-b border-border">
                <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
                        <ChevronRight className="w-3.5 h-3.5" />
                        <span className="text-foreground font-medium">Profile</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                        {dirty && (
                            <span className="text-[12px] text-muted-foreground flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-gold-200 animate-pulse" />
                                Unsaved changes
                            </span>
                        )}
                        <SaveChangesButton saving={saving} onClick={handleSave} size="sm" className="h-8" />
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-8">
                {/* Header card */}
                <div className="flex items-start gap-5 mb-8 p-6 bg-card border border-border rounded-xl">
                    {/* Avatar */}
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

                    {/* Name + meta */}
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
                            {draft.studentType && (
                                <span className="text-[13px] text-muted-foreground flex items-center gap-1">
                                    <GraduationCap className="w-3.5 h-3.5" />
                                    {STUDENT_TYPE_OPTIONS.find((t) => t.value === draft.studentType)?.label}
                                </span>
                            )}
                            {draft.country && (
                                <span className="text-[13px] text-muted-foreground flex items-center gap-1">
                                    <Globe className="w-3.5 h-3.5" /> {draft.country}
                                </span>
                            )}
                        </div>

                        {/* Completion bar */}
                        <div className="mt-3 max-w-xs">
                            <div className="flex justify-between text-[11px] mb-1">
                                <span className="text-muted-foreground">Profile completion</span>
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
                                    Complete your profile so we can personalise your checklist
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Body: sidebar tabs + form */}
                <div className="grid grid-cols-[220px_1fr] gap-6">
                    {/* Section tabs */}
                    <div className="space-y-1">
                        {SECTIONS.map((sec) => {
                            const c = sectionCompletionMap[sec.id];
                            const complete = c.done === c.total;
                            return (
                                <button
                                    key={sec.id}
                                    onClick={() => setActiveSection(sec.id)}
                                    className={cn(
                                        "w-full flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-lg text-[13.5px] font-medium transition-all border",
                                        activeSection === sec.id
                                            ? "bg-forest-50 border-forest-200 text-forest-800"
                                            : "bg-transparent border-transparent text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                                    )}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <sec.icon className="w-4 h-4 shrink-0" />
                                        {sec.label}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        {sec.id === "account" ? (
                                            <span className="text-[10px] font-normal uppercase tracking-wider text-muted-foreground">
                                                Security
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
                            Back to dashboard
                        </Link>
                    </div>

                    {/* Form card */}
                    <Card className="border-border/60">
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg font-serif font-light tracking-tight flex items-center gap-2">
                                        {(() => {
                                            const s = SECTIONS.find((sec) => sec.id === activeSection)!;
                                            if (activeSection === "account") {
                                                return <><s.icon className="w-4.5 h-4.5 text-muted-foreground" /> Account security</>;
                                            }
                                            return <><s.icon className="w-4.5 h-4.5 text-muted-foreground" /> {s.label} information</>;
                                        })()}
                                    </CardTitle>
                                    <CardDescription className="mt-1">
                                        {activeSection === "personal" && "Your basic personal information"}
                                        {activeSection === "academic" && "Your university and study details"}
                                        {activeSection === "stay" && "Whether you’re in France yet, your dates and city, and housing"}
                                        {activeSection === "account" && "Change your password. If you signed up with Google only, set a password here to enable email sign-in as well."}
                                    </CardDescription>
                                </div>
                                {activeSection !== "account" && (
                                    <div className={cn(
                                        "text-xs font-medium px-2.5 py-1 rounded-full",
                                        sectionCompletionMap[activeSection].done === sectionCompletionMap[activeSection].total
                                            ? "bg-forest-50 text-forest-600"
                                            : "bg-muted text-muted-foreground"
                                    )}>
                                        {sectionCompletionMap[activeSection].done}/{sectionCompletionMap[activeSection].total} filled
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
