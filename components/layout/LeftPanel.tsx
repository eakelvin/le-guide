"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Logo } from "@/components/brand/Logo";

const PREVIEW_STEPS = [
    { labelKey: "panelStepVisa" as const, pct: 25, color: "#F0997B" },
    { labelKey: "panelStepHousing" as const, pct: 40, color: "#97C459" },
    { labelKey: "panelStepHealthcare" as const, pct: 0, color: "#85B7EB" },
    { labelKey: "panelStepBanking" as const, pct: 0, color: "#AFA9EC" },
    { labelKey: "panelStepTransport" as const, pct: 0, color: "#EF9F27" },
];

const REGISTER_PERKS = [
    { icon: "🗂", titleKey: "panelPerk1Title" as const, descKey: "panelPerk1Desc" as const },
    { icon: "✅", titleKey: "panelPerk2Title" as const, descKey: "panelPerk2Desc" as const },
    { icon: "📊", titleKey: "panelPerk3Title" as const, descKey: "panelPerk3Desc" as const },
    { icon: "⚠️", titleKey: "panelPerk4Title" as const, descKey: "panelPerk4Desc" as const },
];

export function LoginPanel() {
    const t = useTranslations("auth");

    return (
        <div className="hidden lg:flex flex-col justify-between bg-forest-900 text-white p-12 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute w-[500px] h-[500px] rounded-full opacity-10 bg-white blur-[120px] -top-40 -left-40" />
                <div className="absolute w-[300px] h-[300px] rounded-full opacity-10 bg-white blur-[80px] bottom-0 right-0" />
                <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                            <circle cx="2" cy="2" r="1.5" fill="white" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#dots)" />
                </svg>
            </div>

            <div className="relative z-10">
                <Link href="/" className="text-white no-underline">
                    <Logo href={null} size="lg" tone="inverse" />
                    <div className="text-white/40 text-xs mt-1 tracking-widest uppercase">
                        {t("panelTagline")}
                    </div>
                </Link>
            </div>

            <div className="relative z-10 space-y-4">
                <div className="text-white/50 text-xs tracking-widest uppercase mb-6">
                    {t("panelProgressOverview")}
                </div>

                <div className="bg-white/8 backdrop-blur-sm border border-white/10 rounded-2xl p-5 space-y-4">
                    {PREVIEW_STEPS.map((step) => (
                        <div key={step.labelKey}>
                            <div className="flex justify-between items-center mb-1.5">
                                <span className="text-[13px] text-white/80">{t(step.labelKey)}</span>
                                <span className="text-[12px] font-medium" style={{ color: step.pct > 0 ? step.color : "rgba(255,255,255,0.3)" }}>
                                    {step.pct}%
                                </span>
                            </div>
                            <div className="h-[3px] bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-700"
                                    style={{ width: `${step.pct}%`, background: step.color }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex items-start gap-3 bg-coral-600/20 border border-coral-400/30 rounded-xl p-4">
                    <div className="w-6 h-6 rounded-full bg-coral-400/30 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-coral-200 text-xs font-bold">!</span>
                    </div>
                    <div>
                        <p className="text-coral-200 text-sm font-medium">{t("panelOfiiTitle")}</p>
                        <p className="text-coral-300/70 text-xs mt-0.5 leading-relaxed">
                            {t("panelOfiiBody")}
                        </p>
                    </div>
                </div>
            </div>

            <div className="relative z-10">
                <blockquote className="text-white/60 text-sm leading-relaxed italic font-serif font-light">
                    &ldquo;{t("panelLoginQuote")}&rdquo;
                </blockquote>
                <div className="flex items-center gap-2.5 mt-4">
                    <div className="w-7 h-7 rounded-full bg-forest-50 flex items-center justify-center text-[10px] font-medium text-forest-600">
                        YK
                    </div>
                    <div>
                        <p className="text-white/70 text-xs font-medium">{t("panelLoginQuoteAuthor")}</p>
                        <p className="text-white/40 text-xs">{t("panelLoginQuoteRole")}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function RegisterPanel() {
    const t = useTranslations("auth");

    const stats = [
        { value: "1,200+", labelKey: "panelStatStudents" as const },
        { value: "40+", labelKey: "panelStatNationalities" as const },
        { value: "Free", labelKey: "panelStatFree" as const },
    ];

    return (
        <div className="hidden lg:flex flex-col justify-between bg-forest-900 text-white p-12 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute w-[500px] h-[500px] rounded-full opacity-10 bg-white blur-[120px] -top-40 -right-40" />
                <div className="absolute w-[300px] h-[300px] rounded-full opacity-10 bg-white blur-[80px] bottom-0 left-0" />
                <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="dots2" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                            <circle cx="2" cy="2" r="1.5" fill="white" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#dots2)" />
                </svg>
            </div>

            <div className="relative z-10">
                <Link href="/" className="text-white no-underline">
                    <Logo href={null} size="lg" tone="inverse" />
                    <div className="text-white/40 text-xs mt-1 tracking-widest uppercase">
                        {t("panelTagline")}
                    </div>
                </Link>
            </div>

            <div className="relative z-10 space-y-3">
                <p className="text-white/50 text-xs tracking-widest uppercase mb-6">
                    {t("panelEverythingIncluded")}
                </p>
                {REGISTER_PERKS.map((p) => (
                    <div
                        key={p.titleKey}
                        className="flex items-start gap-3.5 bg-white/6 border border-white/10 rounded-xl p-4"
                    >
                        <span className="text-xl mt-0.5 shrink-0">{p.icon}</span>
                        <div>
                            <p className="text-[13.5px] font-medium text-white/90">{t(p.titleKey)}</p>
                            <p className="text-[12px] text-white/50 mt-0.5 leading-relaxed">{t(p.descKey)}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="relative z-10 flex gap-8">
                {stats.map((s) => (
                    <div key={s.labelKey}>
                        <p className="text-xl font-serif font-light text-[#9ECC60]">{s.value}</p>
                        <p className="text-[11px] text-white/40 mt-0.5">{t(s.labelKey)}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
