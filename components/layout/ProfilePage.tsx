"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast as showToast } from "react-hot-toast";
import {
    User, GraduationCap, MapPin, Shield, Save,
    CheckCircle2, AlertCircle, ChevronRight, Pencil,
    Calendar, Phone, Globe, Building2, Hash, Mail,
    HeartPulse, Clock, KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useProfile } from "@/lib/hooks";
import type { UserProfile, StudyLevel, VisaType } from "@/types";
import { UpdatePasswordForm } from "@/components/auth/UpdatePasswordForm";

/* ─── Constants ────────────────────────────────────────────────────── */
const STUDY_LEVELS: { value: StudyLevel; label: string }[] = [
    { value: "licence-1", label: "Licence 1 (L1)" },
    { value: "licence-2", label: "Licence 2 (L2)" },
    { value: "licence-3", label: "Licence 3 (L3)" },
    { value: "master-1", label: "Master 1 (M1)" },
    { value: "master-2", label: "Master 2 (M2)" },
    { value: "doctorat", label: "Doctorat (PhD)" },
    { value: "exchange", label: "Exchange student" },
    { value: "other", label: "Other" },
];

const VISA_TYPES: { value: VisaType; label: string; desc: string }[] = [
    { value: "student-d", label: "Long-stay student visa (D)", desc: "Standard visa for studies > 3 months" },
    { value: "student-vls-ts", label: "VLS-TS (student)", desc: "Visa long séjour valant titre de séjour" },
    { value: "student-vls-ts-campus-france", label: "VLS-TS via Campus France", desc: "Issued through Campus France process" },
    { value: "other", label: "Other / Not sure", desc: "" },
];

const SECTIONS = [
    { id: "personal", label: "Personal", icon: User },
    { id: "academic", label: "Academic", icon: GraduationCap },
    { id: "stay", label: "Stay", icon: MapPin },
    { id: "emergency", label: "Emergency", icon: HeartPulse },
];

/* ─── Helpers ──────────────────────────────────────────────────────── */
function getInitials(p: UserProfile) {
    const f = p.firstName?.trim()[0] ?? "";
    const l = p.lastName?.trim()[0] ?? "";
    return (f + l).toUpperCase() || "?";
}

function getCompletionPct(p: UserProfile): number {
    const required: (keyof UserProfile)[] = [
        "firstName", "lastName", "email", "nationality",
        "university", "program", "studyLevel",
        "arrivalDate", "visaType", "currentAddress", "addressCity",
    ];
    const filled = required.filter((k) => !!p[k]).length;
    return Math.round((filled / required.length) * 100);
}

function getCompletionBySection(p: UserProfile) {
    return {
        personal: ["firstName", "lastName", "email", "phone", "nationality", "dateOfBirth"].filter((k) => !!p[k as keyof UserProfile]).length,
        personalTotal: 6,
        academic: ["university", "program", "studyLevel", "studentId", "campusCity", "academicYear"].filter((k) => !!p[k as keyof UserProfile]).length,
        academicTotal: 6,
        stay: ["arrivalDate", "plannedDepartureDate", "visaType", "currentAddress", "addressCity", "addressPostalCode"].filter((k) => !!p[k as keyof UserProfile]).length,
        stayTotal: 6,
        emergency: ["emergencyContactName", "emergencyContactPhone", "emergencyContactRelation"].filter((k) => !!p[k as keyof UserProfile]).length,
        emergencyTotal: 3,
    };
}

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

function SelectNative({ value, onChange, children, className }: {
    value: string; onChange: (v: string) => void;
    children: React.ReactNode; className?: string;
}) {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={cn(
                "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                "disabled:cursor-not-allowed disabled:opacity-50",
                !value && "text-muted-foreground",
                className
            )}
        >
            {children}
        </select>
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
            <FieldRow label="Nationality" icon={Globe} hint="As it appears on your passport">
                <Input placeholder="Swedish" value={draft.nationality} onChange={(e) => onChange("nationality", e.target.value)} />
            </FieldRow>
        </div>
    );
}

/* ─── Section: Academic ─────────────────────────────────────────────── */
function SectionAcademic({ draft, onChange }: { draft: UserProfile; onChange: (k: keyof UserProfile, v: string) => void }) {
    return (
        <div className="space-y-5">
            <FieldRow label="University / Institution" icon={Building2}>
                <Input placeholder="Sciences Po Paris" value={draft.university} onChange={(e) => onChange("university", e.target.value)} />
            </FieldRow>
            <div className="grid grid-cols-2 gap-4">
                <FieldRow label="Programme / Field of study" icon={GraduationCap}>
                    <Input placeholder="International Relations" value={draft.program} onChange={(e) => onChange("program", e.target.value)} />
                </FieldRow>
                <FieldRow label="Study level">
                    <SelectNative value={draft.studyLevel} onChange={(v) => onChange("studyLevel", v)}>
                        <option value="" disabled>Select level…</option>
                        {STUDY_LEVELS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
                    </SelectNative>
                </FieldRow>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <FieldRow label="Student ID number" icon={Hash} hint="From your university card">
                    <Input placeholder="12345678" value={draft.studentId} onChange={(e) => onChange("studentId", e.target.value)} />
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

/* ─── Section: Stay in France ──────────────────────────────────────── */
function SectionStay({ draft, onChange }: { draft: UserProfile; onChange: (k: keyof UserProfile, v: string) => void }) {
    return (
        <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
                <FieldRow label="Arrival date in France" icon={Calendar} hint="Your first day in France this stay">
                    <Input type="date" value={draft.arrivalDate} onChange={(e) => onChange("arrivalDate", e.target.value)} />
                </FieldRow>
                <FieldRow label="Planned departure date" icon={Calendar} hint="Approximate is fine">
                    <Input type="date" value={draft.plannedDepartureDate} onChange={(e) => onChange("plannedDepartureDate", e.target.value)} />
                </FieldRow>
            </div>

            {/* Visa type picker */}
            <div className="space-y-1.5">
                <Label className="text-[13px] text-sand-700 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-muted-foreground" /> Visa type
                </Label>
                <div className="grid grid-cols-2 gap-2.5">
                    {VISA_TYPES.map((v) => (
                        <button
                            key={v.value}
                            type="button"
                            onClick={() => onChange("visaType", v.value)}
                            className={cn(
                                "text-left p-3.5 rounded-lg border text-sm transition-all",
                                draft.visaType === v.value
                                    ? "border-forest-400 bg-forest-50 text-forest-800"
                                    : "border-border bg-card hover:border-sand-300 hover:bg-sand-50 text-foreground"
                            )}
                        >
                            <div className="font-medium text-[12.5px] leading-tight">{v.label}</div>
                            {v.desc && <div className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{v.desc}</div>}
                        </button>
                    ))}
                </div>
                <p className="text-[11px] text-muted-foreground">
                    Not sure?{" "}
                    <a href="https://www.service-public.fr/particuliers/vosdroits/F16162" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground transition-colors">
                        Check service-public.fr
                    </a>
                </p>
            </div>

            <Separator />

            <div className="space-y-1">
                <p className="text-[12px] font-medium text-muted-foreground uppercase tracking-widest">Current address in France</p>
            </div>
            <FieldRow label="Street address" icon={MapPin}>
                <Input placeholder="12 rue de la Paix" value={draft.currentAddress} onChange={(e) => onChange("currentAddress", e.target.value)} autoComplete="street-address" />
            </FieldRow>
            <div className="grid grid-cols-2 gap-4">
                <FieldRow label="City">
                    <Input placeholder="Paris" value={draft.addressCity} onChange={(e) => onChange("addressCity", e.target.value)} autoComplete="address-level2" />
                </FieldRow>
                <FieldRow label="Postal code">
                    <Input placeholder="75001" value={draft.addressPostalCode} onChange={(e) => onChange("addressPostalCode", e.target.value)} autoComplete="postal-code" />
                </FieldRow>
            </div>

            {/* OFII deadline callout */}
            {draft.arrivalDate && (() => {
                const arrival = new Date(draft.arrivalDate);
                const deadline = new Date(arrival);
                deadline.setMonth(deadline.getMonth() + 3);
                const today = new Date();
                const daysLeft = Math.floor((deadline.getTime() - today.getTime()) / 86400000);
                const isUrgent = daysLeft <= 30 && daysLeft >= 0;
                const isPast = daysLeft < 0;
                if (isPast || isUrgent) return (
                    <div className={cn(
                        "flex items-start gap-3 rounded-lg p-4 text-sm",
                        isPast ? "bg-coral-50 border border-coral-200 text-coral-700"
                            : "bg-gold-50  border border-gold-100  text-gold-700"
                    )}>
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-medium">
                                {isPast ? "OFII window may have passed" : `OFII deadline in ${daysLeft} day${daysLeft === 1 ? "" : "s"}`}
                            </p>
                            <p className="text-[12px] mt-0.5 opacity-80">
                                {isPast
                                    ? "Contact your local OFII office immediately to regularise your situation."
                                    : "You must validate your visa online before " + deadline.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) + "."}
                            </p>
                        </div>
                    </div>
                );
                return null;
            })()}
        </div>
    );
}

/* ─── Section: Emergency contact ───────────────────────────────────── */
function SectionEmergency({ draft, onChange }: { draft: UserProfile; onChange: (k: keyof UserProfile, v: string) => void }) {
    return (
        <div className="space-y-5">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-azure-50 border border-azure-100 text-azure-700 text-sm">
                <Shield className="w-4 h-4 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                    Emergency contact details are stored locally in your browser and are never shared with third parties.
                    They&apos;re here as a handy reference in case you need them quickly.
                </p>
            </div>
            <FieldRow label="Contact name" icon={User}>
                <Input placeholder="Anna Andersson" value={draft.emergencyContactName} onChange={(e) => onChange("emergencyContactName", e.target.value)} />
            </FieldRow>
            <div className="grid grid-cols-2 gap-4">
                <FieldRow label="Phone number" icon={Phone} hint="Include country code">
                    <Input type="tel" placeholder="+46 70 000 00 00" value={draft.emergencyContactPhone} onChange={(e) => onChange("emergencyContactPhone", e.target.value)} />
                </FieldRow>
                <FieldRow label="Relationship">
                    <Input placeholder="Mother / Father / Friend…" value={draft.emergencyContactRelation} onChange={(e) => onChange("emergencyContactRelation", e.target.value)} />
                </FieldRow>
            </div>
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
export function ProfilePage({ hasEmailPasswordIdentity }: { hasEmailPasswordIdentity: boolean }) {
    const { profile, saveProfile, hydrated } = useProfile();
    const [activeSection, setActiveSection] = useState("personal");
    const [draft, setDraft] = useState<UserProfile>(profile);
    const [toast, setToast] = useState<"saved" | "error" | null>(null);
    const [dirty, setDirty] = useState(false);

    /* Sync once profile loads from localStorage */
    useEffect(() => {
        if (hydrated) setDraft(profile);
    }, [hydrated, profile]);

    function handleChange(key: keyof UserProfile, value: string) {
        setDraft((prev) => ({ ...prev, [key]: value }));
        setDirty(true);
    }

    function handleSave() {
        try {
            saveProfile(draft);
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
        emergency: { done: comp.emergency, total: comp.emergencyTotal },
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
                        <div className="w-16 h-16 rounded-full bg-forest-50 border-2 border-forest-100 flex items-center justify-center text-xl font-semibold text-forest-600">
                            {initials}
                        </div>
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
                            {draft.studyLevel && (
                                <span className="text-[13px] text-muted-foreground flex items-center gap-1">
                                    <GraduationCap className="w-3.5 h-3.5" />
                                    {STUDY_LEVELS.find((l) => l.value === draft.studyLevel)?.label}
                                </span>
                            )}
                            {draft.nationality && (
                                <span className="text-[13px] text-muted-foreground flex items-center gap-1">
                                    <Globe className="w-3.5 h-3.5" /> {draft.nationality}
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
                                        <span className="text-[11px] text-muted-foreground">{c.done}/{c.total}</span>
                                        {complete && <CheckCircle2 className="w-3.5 h-3.5 text-forest-500" />}
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
                                            const s = SECTIONS.find((s) => s.id === activeSection)!;
                                            return <><s.icon className="w-4.5 h-4.5 text-muted-foreground" /> {s.label} information</>;
                                        })()}
                                    </CardTitle>
                                    <CardDescription className="mt-1">
                                        {activeSection === "personal" && "Your basic personal information"}
                                        {activeSection === "academic" && "Your university and study details"}
                                        {activeSection === "stay" && "Your visa type, dates, and French address"}
                                        {activeSection === "emergency" && "A trusted contact in case of emergency"}
                                    </CardDescription>
                                </div>
                                <div className={cn(
                                    "text-xs font-medium px-2.5 py-1 rounded-full",
                                    sectionCompletionMap[activeSection].done === sectionCompletionMap[activeSection].total
                                        ? "bg-forest-50 text-forest-600"
                                        : "bg-muted text-muted-foreground"
                                )}>
                                    {sectionCompletionMap[activeSection].done}/{sectionCompletionMap[activeSection].total} filled
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {activeSection === "personal" && <SectionPersonal draft={draft} onChange={handleChange} />}
                            {activeSection === "academic" && <SectionAcademic draft={draft} onChange={handleChange} />}
                            {activeSection === "stay" && <SectionStay draft={draft} onChange={handleChange} />}
                            {activeSection === "emergency" && <SectionEmergency draft={draft} onChange={handleChange} />}

                            <div className="flex justify-end mt-8 pt-6 border-t border-border">
                                <Button onClick={handleSave} className="gap-2">
                                    <Save className="w-4 h-4" />
                                    Save changes
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="mt-8 border-border/60">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-serif font-light tracking-tight flex items-center gap-2">
                            <KeyRound className="w-4 h-4 text-muted-foreground" />
                            Account security
                        </CardTitle>
                        <CardDescription>
                            Change your password. If you signed up with Google only, set a password here to enable email sign-in as well.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <UpdatePasswordForm
                            variant="embedded"
                            next="/profile"
                            requireCurrentPasswordField={hasEmailPasswordIdentity}
                            submitLabel="Update password"
                        />
                    </CardContent>
                </Card>
            </div>

            <SaveToast state={toast} />
        </div>
    );
}
