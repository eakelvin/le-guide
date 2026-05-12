"use client";

import {
    User, GraduationCap, MapPin, Save,
    CheckCircle2, AlertCircle, ChevronRight, Pencil,
    Calendar, Phone, Globe, Building2, Mail,
    Clock, KeyRound,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { UserProfile, ProfileSectionProps } from "@/types";
import { CountryCombobox } from "@/components/ui/CountryCombobox";
import { StudentTypeCombobox } from "@/components/ui/StudentTypeCombobox";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast as showToast } from "react-hot-toast";

/* ─── Sub-components ───────────────────────────────────────────────── */
export function FieldRow({ label, icon: Icon, children, hint }: {
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
export function SaveToast({ state }: { state: "saved" | "error" | null }) {
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
export function SectionPersonal({ draft, onChange }: { draft: UserProfile; onChange: (k: keyof UserProfile, v: string) => void }) {
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
export function SectionAcademic({ draft, onChange }: ProfileSectionProps) {
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

export function YesNoChoice({ value, onPick }: { value: UserProfile["alreadyInFrance"]; onPick: (v: Exclude<UserProfile["alreadyInFrance"], "">) => void }) {
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
export function SectionStay({ draft, onChange }: ProfileSectionProps) {
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
export function ProfilePasswordToast() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (searchParams.get("passwordUpdated") !== "1") return;
        showToast.success("Password updated successfully.");
        router.replace("/profile", { scroll: false });
    }, [router, searchParams]);

    return null;
}