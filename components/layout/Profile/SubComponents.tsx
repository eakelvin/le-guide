"use client";

import {
    User, GraduationCap, MapPin,
    CheckCircle2, AlertCircle,
    Calendar, Phone, Globe, Building2, Mail,
    Clock,
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
import { useLocale, useTranslations } from "next-intl";

export function FieldRow({ label, icon: Icon, children, hint, required }: {
    label: string; icon?: React.FC<{ className?: string }>;
    children: React.ReactNode; hint?: string; required?: boolean;
}) {
    return (
        <div className="min-w-0 space-y-1.5">
            <Label className="flex items-center gap-1.5 text-[13px] text-sand-700">
                {Icon && <Icon className="w-3.5 h-3.5 text-muted-foreground" />}
                {label}
                {required ? <span className="text-coral-600" aria-hidden>*</span> : null}
            </Label>
            {children}
            {hint && <p className="text-[11px] text-muted-foreground leading-relaxed">{hint}</p>}
        </div>
    );
}

export function SaveToast({ state }: { state: "saved" | "error" | null }) {
    const t = useTranslations("profile");
    if (!state) return null;
    return (
        <div className={cn(
            "fixed inset-x-4 bottom-24 z-50 flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-medium shadow-lg transition-all animate-fade-up md:inset-x-auto md:bottom-6 md:right-6",
            state === "saved"
                ? "bg-forest-50 text-forest-600 border-forest-200"
                : "bg-coral-50 text-coral-600 border-coral-200"
        )}>
            {state === "saved"
                ? <><CheckCircle2 className="w-4 h-4 shrink-0" /> {t("savedToast")}</>
                : <><AlertCircle className="w-4 h-4 shrink-0" /> {t("saveErrorToast")}</>
            }
        </div>
    );
}

export function SectionPersonal({ draft, onChange }: { draft: UserProfile; onChange: (k: keyof UserProfile, v: string) => void }) {
    const t = useTranslations("profile");
    return (
        <div className="min-w-0 space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FieldRow label={t("firstName")} icon={User} required>
                    <Input
                        placeholder={t("placeholderFirstName")}
                        value={draft.firstName}
                        onChange={(e) => onChange("firstName", e.target.value)}
                        autoComplete="given-name"
                        required
                        aria-required
                    />
                </FieldRow>
                <FieldRow label={t("lastName")} required>
                    <Input
                        placeholder={t("placeholderLastName")}
                        value={draft.lastName}
                        onChange={(e) => onChange("lastName", e.target.value)}
                        autoComplete="family-name"
                        required
                        aria-required
                    />
                </FieldRow>
            </div>
            <FieldRow label={t("emailAddress")} icon={Mail} required>
                <Input
                    type="email"
                    placeholder={t("placeholderEmail")}
                    value={draft.email}
                    onChange={(e) => onChange("email", e.target.value)}
                    autoComplete="email"
                    required
                    aria-required
                />
            </FieldRow>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FieldRow label={t("phoneNumber")} icon={Phone} hint={t("phoneHint")}>
                    <Input type="tel" placeholder={t("placeholderPhone")} value={draft.phone} onChange={(e) => onChange("phone", e.target.value)} autoComplete="tel" />
                </FieldRow>
                <FieldRow label={t("dateOfBirth")} icon={Calendar}>
                    <Input type="date" value={draft.dateOfBirth} onChange={(e) => onChange("dateOfBirth", e.target.value)} />
                </FieldRow>
            </div>
            <FieldRow label={t("country")} icon={Globe} hint={t("countryHint")} required>
                <CountryCombobox
                    id="profile-country"
                    value={draft.country}
                    onChange={(v) => onChange("country", v)}
                />
            </FieldRow>
        </div>
    );
}

export function SectionAcademic({ draft, onChange }: ProfileSectionProps) {
    const t = useTranslations("profile");
    return (
        <div className="min-w-0 space-y-5">
            <FieldRow label={t("studentType")} icon={GraduationCap} hint={t("studentTypeHint")} required>
                <StudentTypeCombobox
                    id="profile-student-type"
                    value={draft.studentType}
                    onChange={(v) => onChange("studentType", v)}
                />
            </FieldRow>

            <FieldRow label={t("university")} icon={Building2} required>
                <Input
                    placeholder={t("placeholderUniversity")}
                    value={draft.university}
                    onChange={(e) => onChange("university", e.target.value)}
                    required
                    aria-required
                />
            </FieldRow>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FieldRow label={t("program")} icon={GraduationCap} required>
                    <Input
                        placeholder={t("placeholderProgram")}
                        value={draft.program}
                        onChange={(e) => onChange("program", e.target.value)}
                        required
                        aria-required
                    />
                </FieldRow>
                <FieldRow label={t("academicYear")} icon={Clock} required>
                    <Input
                        placeholder={t("placeholderAcademicYear")}
                        value={draft.academicYear}
                        onChange={(e) => onChange("academicYear", e.target.value)}
                        required
                        aria-required
                    />
                </FieldRow>
            </div>
            <FieldRow label={t("campusCity")} icon={MapPin} required>
                <Input
                    placeholder={t("placeholderCity")}
                    value={draft.campusCity}
                    onChange={(e) => onChange("campusCity", e.target.value)}
                    required
                    aria-required
                />
            </FieldRow>
        </div>
    );
}

export function YesNoChoice({ value, onPick }: { value: UserProfile["alreadyInFrance"]; onPick: (v: Exclude<UserProfile["alreadyInFrance"], "">) => void }) {
    const t = useTranslations("common");
    return (
        <div className="grid max-w-md grid-cols-2 gap-2">
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
                    {v === "yes" ? t("yes") : t("no")}
                </button>
            ))}
        </div>
    );
}

export function SectionStay({ draft, onChange }: ProfileSectionProps) {
    const t = useTranslations("profile");
    const locale = useLocale();

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label className="text-[13px] text-sand-700">
                    {t("alreadyInFrance")}
                    <span className="ml-1 text-coral-600" aria-hidden>*</span>
                </Label>
                <YesNoChoice
                    value={draft.alreadyInFrance}
                    onPick={(v) => onChange("alreadyInFrance", v)}
                />
            </div>

            {draft.alreadyInFrance === "yes" && (
                <div className="space-y-5 border-t border-border pt-5">
                    <FieldRow label={t("arrivedWhen")} icon={Calendar} hint={t("arrivedWhenHint")} required>
                        <Input
                            type="date"
                            value={draft.arrivalDate}
                            onChange={(e) => onChange("arrivalDate", e.target.value)}
                            required
                            aria-required
                        />
                    </FieldRow>
                    <FieldRow label={t("whichCity")} icon={MapPin} required>
                        <Input
                            placeholder={t("placeholderCity")}
                            value={draft.addressCity}
                            onChange={(e) => onChange("addressCity", e.target.value)}
                            autoComplete="address-level2"
                            required
                            aria-required
                        />
                    </FieldRow>
                </div>
            )}

            {draft.alreadyInFrance === "no" && (
                <div className="space-y-5 border-t border-border pt-5">
                    <FieldRow label={t("planArriveWhen")} icon={Calendar} hint={t("planArriveHint")} required>
                        <Input
                            type="date"
                            value={draft.arrivalDate}
                            onChange={(e) => onChange("arrivalDate", e.target.value)}
                            required
                            aria-required
                        />
                    </FieldRow>
                </div>
            )}

            <div className="space-y-2 border-t border-border pt-5">
                <Label className="text-[13px] text-sand-700">
                    {t("hasAccommodation")}
                    <span className="ml-1 text-coral-600" aria-hidden>*</span>
                </Label>
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
                    const dateLocale = locale === "fr" ? "fr-FR" : "en-GB";
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
                                    {isPast
                                        ? t("ofiiWindowPassed")
                                        : t("ofiiDeadlineInDays", { count: daysLeft })}
                                </p>
                                <p className="mt-0.5 text-[12px] opacity-80">
                                    {isPast
                                        ? t("ofiiContactOffice")
                                        : t("ofiiValidateBefore", {
                                            date: deadline.toLocaleDateString(dateLocale, {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            }),
                                        })}
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

export function ProfilePasswordToast() {
    const t = useTranslations("profile");
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (searchParams.get("passwordUpdated") !== "1") return;
        showToast.success(t("passwordUpdatedToast"));
        router.replace("/profile", { scroll: false });
    }, [router, searchParams, t]);

    return null;
}
