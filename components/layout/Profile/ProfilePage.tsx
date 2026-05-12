"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast as showToast } from "react-hot-toast";
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
import { CountryCombobox } from "@/components/ui/CountryCombobox";
import { StudentTypeCombobox } from "@/components/ui/StudentTypeCombobox";
import { getCompletionBySection, getCompletionPct, getInitials } from "@/lib/helpers";

/* ─── Constants ────────────────────────────────────────────────────── */
const SECTIONS = [
    { id: "personal", label: "Personal", icon: User },
    { id: "academic", label: "Academic", icon: GraduationCap },
    { id: "stay", label: "Stay", icon: MapPin },
    { id: "account", label: "Account", icon: KeyRound },
] as const;

/* ─── Sub-components ───────────────────────────────────────────────── */
function FieldRow({ label, icon: Icon, children, hint }: {
    label: string; icon?: React.FC<{ className?: string }>;
    children: React.ReactNode; hint?: string;
}) {
    return (
        <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5 text-[13px] text-sand-700">
                {Icon && <Icon className="w-3.5 h-3.5 text-muted-foreground" />}
                {label}
            </Label>
            {children}
            {hint && <p className="text-[11px] text-muted-foreground leading-relaxed">{hint}</p>}
        </div>
    );
}

/* ─── Save toast ───────────────────────────────────────────────────── */
function SaveToast({ state }: { state: "saved" | "error" | null }) {
    if (!state) return null;
    return (
        <div className={cn(
            "fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-sm font-medium border transition-all animate-fade-up",
            state === "saved"
                ? "bg-forest-50 text-forest-600 border-forest-200"
                : "bg-coral-50 text-coral-600 border-coral-200"
        )}>
            {state === "saved"
                ? <><CheckCircle2 className="w-4 h-4" /> Profile saved</>
                : <><AlertCircle className="w-4 h-4" /> Couldn&apos;t save — try again</>
            }
        </div>
    );
}

/* ─── Section: Personal ─────────────────────────────────────────────── */
function SectionPersonal({ draft, onChange }: { draft: UserProfile; onChange: (k: keyof UserProfile, v: string) => void }) {
    return (
        <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
                <FieldRow label="First name" icon={User}>
                    <Input placeholder="Mia" value={draft.firstName} onChange={(e) => onChange("firstName", e.target.value)} autoComplete="given-name" />
                </FieldRow>
                <FieldRow label="Last name">
                    <Input placeholder="Andersson" value={draft.lastName} onChange={(e) => onChange("lastName", e.target.value)} autoComplete="family-name" />
                </FieldRow>
            </div>
            <FieldRow label="Email address" icon={Mail}>
                <Input type="email" placeholder="you@university.edu" value={draft.email} onChange={(e) => onChange("email", e.target.value)} autoComplete="email" />
            </FieldRow>
            <div className="grid grid-cols-2 gap-4">
                <FieldRow label="Phone number" icon={Phone} hint="Include country code, e.g. +46 70 123 45 67">
                    <Input type="tel" placeholder="+46 70 123 45 67" value={draft.phone} onChange={(e) => onChange("phone", e.target.value)} autoComplete="tel" />
                </FieldRow>
                <FieldRow label="Date of birth" icon={Calendar}>
                    <Input type="date" value={draft.dateOfBirth} onChange={(e) => onChange("dateOfBirth", e.target.value)} />
                </FieldRow>
            </div>
            <FieldRow label="Country" icon={Globe} hint="Country on your passport or national ID">
                <CountryCombobox
                    id="profile-country"
                    value={draft.country}
                    onChange={(v) => onChange("country", v)}
                />
            </FieldRow>
        </div>
    );
}

/* ─── Section: Academic ─────────────────────────────────────────────── */
function SectionAcademic({ draft, onChange }: ProfileSectionProps) {
    return (
        <div className="space-y-5">
            <FieldRow label="Student type" icon={GraduationCap} hint="How you are studying or staying in France">
                <StudentTypeCombobox
                    id="profile-student-type"
                    value={draft.studentType}
                    onChange={(v) => onChange("studentType", v)}
                />
            </FieldRow>

            <FieldRow label="University / Institution" icon={Building2}>
                <Input placeholder="Sciences Po Paris" value={draft.university} onChange={(e) => onChange("university", e.target.value)} />
            </FieldRow>
            <div className="grid grid-cols-2 gap-4">
                <FieldRow label="Programme / Field of study" icon={GraduationCap}>
                    <Input placeholder="International Relations" value={draft.program} onChange={(e) => onChange("program", e.target.value)} />
                </FieldRow>
                <FieldRow label="Academic year" icon={Clock}>
                    <Input placeholder="2024–2025" value={draft.academicYear} onChange={(e) => onChange("academicYear", e.target.value)} />
                </FieldRow>
            </div>
            <FieldRow label="Campus city" icon={MapPin}>
                <Input placeholder="Paris" value={draft.campusCity} onChange={(e) => onChange("campusCity", e.target.value)} />
            </FieldRow>
        </div>
    );
}

function YesNoChoice({ value, onPick }: { value: UserProfile["alreadyInFrance"]; onPick: (v: Exclude<UserProfile["alreadyInFrance"], "">) => void }) {
    return (
        <div className="grid max-w-md grid-cols-2 gap-2.5">
            {(["yes", "no"] as const).map((v) => (
                <button
                    key={v}
                    type="button"
                    onClick={() => onPick(v)}
                    className={cn(
                        "rounded-lg border px-3 py-2.5 text-sm font-medium transition-all",
                        value === v
                            ? "border-forest-400 bg-forest-50 text-forest-800"
                            : "border-border bg-card text-foreground hover:border-sand-300 hover:bg-sand-50",
                    )}
                >
                    {v === "yes" ? "Yes" : "No"}
                </button>
            ))}
        </div>
    );
}

/* ─── Section: Stay in France ──────────────────────────────────────── */
function SectionStay({ draft, onChange }: ProfileSectionProps) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label className="text-[13px] text-sand-700">Have you already arrived in France?</Label>
                <YesNoChoice
                    value={draft.alreadyInFrance}
                    onPick={(v) => onChange("alreadyInFrance", v)}
                />
            </div>

            {draft.alreadyInFrance === "yes" && (
                <div className="space-y-5 border-t border-border pt-5">
                    <FieldRow label="When did you arrive?" icon={Calendar} hint="Your first day in France on this stay">
                        <Input type="date" value={draft.arrivalDate} onChange={(e) => onChange("arrivalDate", e.target.value)} />
                    </FieldRow>
                    <FieldRow label="Which city are you in?" icon={MapPin}>
                        <Input placeholder="Paris" value={draft.addressCity} onChange={(e) => onChange("addressCity", e.target.value)} autoComplete="address-level2" />
                    </FieldRow>
                </div>
            )}

            {draft.alreadyInFrance === "no" && (
                <div className="space-y-5 border-t border-border pt-5">
                    <FieldRow label="When do you plan to arrive?" icon={Calendar} hint="Expected first day in France">
                        <Input type="date" value={draft.arrivalDate} onChange={(e) => onChange("arrivalDate", e.target.value)} />
                    </FieldRow>
                </div>
            )}

            <div className="space-y-2 border-t border-border pt-5">
                <Label className="text-[13px] text-sand-700">Do you already have accommodation?</Label>
                <YesNoChoice
                    value={draft.hasAccommodation}
                    onPick={(v) => onChange("hasAccommodation", v)}
                />
            </div>

            {draft.alreadyInFrance === "yes" && draft.arrivalDate && (() => {
                const arrival = new Date(draft.arrivalDate);
                const deadline = new Date(arrival);
                deadline.setMonth(deadline.getMonth() + 3);
                const today = new Date();
                const daysLeft = Math.floor((deadline.getTime() - today.getTime()) / 86400000);
                const isUrgent = daysLeft <= 30 && daysLeft >= 0;
                const isPast = daysLeft < 0;
                if (isPast || isUrgent) {
                    return (
                        <div
                            className={cn(
                                "flex items-start gap-3 rounded-lg p-4 text-sm",
                                isPast
                                    ? "border border-coral-200 bg-coral-50 text-coral-700"
                                    : "border border-gold-100 bg-gold-50 text-gold-700",
                            )}
                        >
                            <AlertCircle className="mt-0.5 size-4 shrink-0" />
                            <div>
                                <p className="font-medium">
                                    {isPast ? "OFII window may have passed" : `OFII deadline in ${daysLeft} day${daysLeft === 1 ? "" : "s"}`}
                                </p>
                                <p className="mt-0.5 text-[12px] opacity-80">
                                    {isPast
                                        ? "Contact your local OFII office immediately to regularise your situation."
                                        : `You must validate your visa online before ${deadline.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}.`}
                                </p>
                            </div>
                        </div>
                    );
                }
                return null;
            })()}
        </div>
    );
}

/* ─── Password updated toast (needs useSearchParams) ─────────────────── */
function ProfilePasswordToast() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (searchParams.get("passwordUpdated") !== "1") return;
        showToast.success("Password updated successfully.");
        router.replace("/profile", { scroll: false });
    }, [router, searchParams]);

    return null;
}

/* ─── Main profile page ─────────────────────────────────────────────── */
export function ProfilePage({ appUser, initialProfile }: ProfilePageProps) {
    const { profile, saveProfile, hydrated } = useProfile(initialProfile);
    const [activeSection, setActiveSection] = useState("personal");
    const [draft, setDraft] = useState<UserProfile>(profile);
    const [toast, setToast] = useState<"saved" | "error" | null>(null);
    const [dirty, setDirty] = useState(false);

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
        try {
            await saveProfile(draft);
            setDirty(false);
            setToast("saved");
            setTimeout(() => setToast(null), 3000);
        } catch {
            setToast("error");
            setTimeout(() => setToast(null), 3000);
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
                        <Button onClick={handleSave} size="sm" className="gap-1.5 h-8">
                            <Save className="w-3.5 h-3.5" />
                            Save changes
                        </Button>
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
                                    submitLabel="Update password"
                                />
                            )}

                            {activeSection !== "account" && (
                                <div className="flex justify-end mt-8 pt-6 border-t border-border">
                                    <Button onClick={handleSave} className="gap-2">
                                        <Save className="w-4 h-4" />
                                        Save changes
                                    </Button>
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
