"use client";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { PROC_CARDS } from "@/lib/data/data";
import { getLandingContent } from "@/lib/data/landing-content";
import type { AppLocale } from "@/i18n/routing";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function Hero() {
    const t = useTranslations("landing");
    return (
        <section className="relative flex min-h-screen flex-col justify-center overflow-hidden pb-20 pt-[100px]">
            {/* Background blobs */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -right-48 -top-24 h-[600px] w-[600px] rounded-full bg-forest-100 opacity-35 blur-[80px]" />
                <div className="absolute -bottom-20 -left-24 h-[400px] w-[400px] rounded-full bg-coral-100 opacity-35 blur-[80px]" />
            </div>

            <div className="relative z-10 mx-auto grid max-w-[1120px] grid-cols-1 items-center gap-10 px-6 md:px-12 lg:grid-cols-[1fr_minmax(0,380px)]">
                {/* Left */}
                <div>
                    <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-sand-200 bg-card px-3.5 py-1.5 text-xs font-medium text-sand-600 shadow-xs">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-forest-400" />
                        🇫🇷 &nbsp;{t("badge")}
                    </div>

                    <h1 className="font-heading mb-6 max-w-[820px] text-[clamp(40px,6vw,72px)] font-light leading-[1.08] tracking-[-0.04em] text-sand-800">
                        {t("heroTitleLine1")}<br />
                        {t("heroTitleLine2")}<br />
                        <em className="italic text-forest-900">{t("heroTitleEmphasis")}</em>
                    </h1>

                    <p className="text-lg text-sand-600 leading-relaxed max-w-[520px] mb-10">
                        {t("heroSubtitle")}
                    </p>

                    <div className="flex flex-wrap items-center gap-3.5">
                        <Button
                            size="lg"
                            className="h-auto gap-2 rounded-full bg-forest-900 px-7 py-3.5 text-[15px] text-white hover:bg-forest-800 hover:-translate-y-0.5"
                            asChild
                        >
                            <Link href="/dashboard" className="no-underline">
                                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                                    <path d="M10 2L2 7v11h6v-4h4v4h6V7L10 2z" />
                                </svg>
                                {t("startChecklist")}
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="h-auto rounded-full border-sand-200 bg-transparent px-6 py-3.5 text-[15px] text-sand-800 shadow-none hover:-translate-y-0.5 hover:bg-card"
                            asChild
                        >
                            <a href="#how" className="no-underline">
                                {t("seeHowItWorks")}
                            </a>
                        </Button>
                    </div>

                    {/* Social proof */}
                    {/* <div className="flex items-center gap-5 mt-14 pt-8 border-t border-sand-100">
                        <div className="flex">
                            {[
                                { initials: "MA", bg: "bg-forest-50", text: "text-forest-600" },
                                { initials: "YK", bg: "bg-azure-50", text: "text-azure-600" },
                                { initials: "LP", bg: "bg-coral-50", text: "text-coral-600" },
                                { initials: "SR", bg: "bg-violet-50", text: "text-violet-600" },
                                { initials: "BN", bg: "bg-gold-50", text: "text-gold-600" },
                            ].map((av, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "w-8 h-8 rounded-full border-2 border-sand-50 flex items-center justify-center text-[11px] font-medium",
                                        i > 0 && "-ml-2", av.bg, av.text
                                    )}
                                >
                                    {av.initials}
                                </div>
                            ))}
                        </div>
                        <p className="text-[13px] text-sand-600">
                            <strong className="text-sand-800">1,200+ students</strong> arrived in France with LeGuide this year
                        </p>
                    </div> */}
                </div>

                {/* Right — floating UI preview */}
                <div className="flex flex-col gap-2.5">
                    <div className="animate-landing-float rounded-xl border border-sand-200 bg-card p-5 shadow-xs ring-1 ring-border/60">
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="w-9 h-9 rounded-lg bg-coral-50 flex items-center justify-center">
                                <svg className="h-[18px] w-[18px] text-coral-600" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <rect x="3" y="4" width="14" height="12" rx="2" /><path d="M3 8h14M7 12h2M11 12h2" />
                                </svg>
                            </div>
                            <div>
                                <div className="text-sm font-medium">{t("previewOfiiTitle")}</div>
                                <div className="text-[11.5px] text-coral-600">{t("previewDaysRemaining", { days: 87 })}</div>
                            </div>
                        </div>
                        {[
                            { num: "✓", done: true, label: t("previewStep1") },
                            { num: "2", active: true, label: t("previewStep2"), tag: { text: t("previewStep2Tag"), bg: "bg-gold-50", col: "text-gold-600" } },
                            { num: "3", label: t("previewStep3") },
                        ].map((step, i) => (
                            <div key={i} className={cn("flex gap-2.5 items-start py-2.5", i < 2 && "border-b border-sand-100")}>
                                <div className={cn(
                                    "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0 mt-0.5",
                                    step.done ? "bg-forest-600 text-white" :
                                        step.active ? "bg-forest-50 text-forest-600 border border-forest-400" :
                                            "bg-sand-50 text-sand-400 border border-sand-200"
                                )}>{step.num}</div>
                                <div>
                                    <div className={cn("text-[12.5px] leading-snug", step.done ? "line-through text-sand-400" : step.active ? "font-medium" : "text-sand-700")}>
                                        {step.label}
                                    </div>
                                    {step.tag && (
                                        <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full mt-1 inline-block", step.tag.bg, step.tag.col)}>
                                            {step.tag.text}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-2">
                        {[
                            { icon: "🏠", label: "CAF", pct: 40, color: "#3B6D11" },
                            { icon: "➕", label: "CPAM", pct: 0, color: "#185FA5" },
                        ].map((card) => (
                            <div key={card.label} className="flex-1 bg-white border border-sand-200 rounded-lg px-3 py-2.5 flex items-center justify-between animate-[float_4s_ease-in-out_0.5s_infinite]">
                                <div className="flex items-center gap-2 text-[12px] font-medium text-sand-800">
                                    <span>{card.icon}</span> {card.label}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-16 h-1 bg-sand-100 rounded-full overflow-hidden">
                                        <div className="h-full rounded-full" style={{ width: `${card.pct}%`, background: card.color }} />
                                    </div>
                                    <span className="text-[11px] font-medium" style={{ color: card.pct > 0 ? card.color : "#A09890" }}>{card.pct}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </section>
    );
}

export function UrgencyBanner() {
    const t = useTranslations("landing");
    return (
        <div className="border-y border-coral-200/80 bg-coral-50 py-4">
            <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-center gap-2.5 px-6 text-[14px] text-coral-700 md:px-12">
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 1L1 18h18L10 1zm0 3l7 13H3l7-13zm-1 5v4h2v-4h-2zm0 5v2h2v-2h-2z" />
                </svg>
                <strong>{t("urgencyTitle")}</strong> {t("urgencyBody")}
                <Link href="/dashboard" className="text-coral-600 underline font-medium">
                    {t("urgencyCta")} →
                </Link>
            </div>
        </div>
    );
}

export function Processes() {
    const locale = useLocale() as AppLocale;
    const content = getLandingContent(locale);

    return (
        <section id="processes" className="py-24">
            <div className="mx-auto max-w-[1120px] px-6 md:px-12">
                <div className="mb-3.5 text-[11px] font-medium uppercase tracking-[2px] text-forest-600">
                    {content.processesEyebrow}
                </div>
                <div className="mb-14 flex flex-wrap items-end justify-between gap-4">
                    <h2 className="font-heading text-[clamp(30px,4vw,48px)] font-light leading-[1.15] tracking-tight text-sand-800">
                        {content.processesTitleLine1}
                        <br />
                        {content.processesTitleLine2}
                    </h2>
                    <p className="max-w-[540px] text-[16px] leading-relaxed text-sand-600">
                        {content.processesSubtitle}
                    </p>
                </div>

                <div className="grid divide-y divide-sand-100 overflow-hidden rounded-xl border border-sand-200 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 xl:divide-x xl:divide-y-0">
                    {PROC_CARDS.map((card, index) => {
                        const text = content.procCards[index];
                        if (!text) return null;
                        return (
                        <Link
                            key={text.title}
                            href="/dashboard"
                            className="block bg-card p-7 no-underline transition-colors hover:bg-sand-50"
                        >
                            <div
                                className={cn(
                                    "mb-3.5 flex h-11 w-11 items-center justify-center rounded-lg",
                                    card.iconBg,
                                )}
                            >
                                {card.icon}
                            </div>
                            <h3 className="text-[15px] font-medium text-sand-800 mb-1.5">{text.title}</h3>
                            <p className="text-[13px] text-sand-500 leading-relaxed">{text.desc}</p>
                            <div className={cn("text-[11.5px] font-medium mt-2.5", card.stepColor)}>{text.steps} →</div>
                        </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export function HowItWorks() {
    const locale = useLocale() as AppLocale;
    const content = getLandingContent(locale);

    return (
        <section id="how" className="bg-sand-800 py-24">
            <div className="mx-auto max-w-[1120px] px-6 md:px-12">
                <div className="mb-3.5 text-[11px] font-medium uppercase tracking-[2px] text-forest-400">
                    {content.howEyebrow}
                </div>
                <div className="mb-14 flex flex-wrap items-end justify-between gap-4">
                    <h2 className="font-heading text-[clamp(30px,4vw,48px)] font-light leading-[1.15] tracking-tight text-white">
                        {content.howTitle}{" "}
                        <em className="italic text-forest-400">{content.howTitleEmphasis}</em>
                    </h2>
                    <p className="max-w-[500px] text-[16px] leading-relaxed text-white/55">
                        {content.howSubtitle}
                    </p>
                </div>

                <div className="relative grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-0">
                    <div className="absolute left-[12.5%] right-[12.5%] top-[22px] hidden h-px bg-white/10 lg:block" />
                    {content.howSteps.map((step) => (
                        <div key={step.num} className="relative z-10 px-0 lg:px-5">
                            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 font-heading text-[17px] font-normal text-white/80">
                                {step.num}
                            </div>
                            <h3 className="text-[15px] font-medium text-white mb-2">{step.title}</h3>
                            <p className="text-[13px] text-white/50 leading-relaxed">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function Testimonials() {
    const locale = useLocale() as AppLocale;
    const content = getLandingContent(locale);

    return (
        <section className="bg-card py-24">
            <div className="mx-auto max-w-[1120px] px-6 md:px-12">
                <div className="mb-3.5 text-[11px] font-medium uppercase tracking-[2px] text-forest-600">{content.testimonialsEyebrow}</div>
                <h2 className="font-heading mb-14 text-[clamp(30px,4vw,48px)] font-light leading-[1.15] tracking-tight text-sand-800">
                    {content.testimonialsTitleLine1}
                    <br />
                    {content.testimonialsTitleLine2}
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {content.testimonials.map((t) => (
                        <div key={t.name} className="rounded-xl border border-sand-100 bg-sand-50 p-6 shadow-xs">
                            <div className="mb-3 text-[12px] tracking-wider text-amber-500">★★★★★</div>
                            <p className="mb-5 text-[15px] font-light italic leading-relaxed text-sand-800">&ldquo;{t.quote}&rdquo;</p>
                            <div className="flex items-center gap-2.5">
                                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-medium", t.bg, t.text)}>
                                    {t.initials}
                                </div>
                                <div>
                                    <div className="text-[13px] font-medium text-sand-800">{t.name}</div>
                                    <div className="text-[11.5px] text-sand-500">{t.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function FAQ() {
    const locale = useLocale() as AppLocale;
    const content = getLandingContent(locale);

    return (
        <section id="faq" className="py-24">
            <div className="mx-auto max-w-[720px] px-6 md:px-12">
                <div className="mb-3.5 text-[11px] font-medium uppercase tracking-[2px] text-forest-600">{content.faqEyebrow}</div>
                <h2 className="font-heading mb-12 text-[clamp(30px,4vw,48px)] font-light leading-[1.15] tracking-tight text-sand-800">
                    {content.faqTitle}
                </h2>
                <Accordion type="single" collapsible defaultValue="item-0" className="border-t border-sand-100">
                    {content.faqs.map((faq, i) => (
                        <AccordionItem key={faq.q} value={`item-${i}`} className="border-sand-100">
                            <AccordionTrigger className="py-5 text-left text-[15px] font-medium text-sand-800 hover:no-underline [&>svg]:text-sand-400">
                                {faq.q}
                            </AccordionTrigger>
                            <AccordionContent className="text-[14px] leading-relaxed text-sand-600">
                                {faq.a}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}

export function CTASection() {
    const t = useTranslations("landing");
    return (
        <section className="relative overflow-hidden bg-forest-900 py-24 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(255,255,255,0.06)_0%,transparent_60%)]" />
            <div className="relative z-10 mx-auto max-w-[1120px] px-6 md:px-12">
                <div className="mb-3.5 text-[11px] font-medium uppercase tracking-[2px] text-white/45">{t("ctaEyebrow")}</div>
                <h2 className="font-heading mb-4 text-[clamp(32px,5vw,56px)] font-light leading-[1.1] tracking-[-0.04em] text-white">
                    {t("ctaTitle")}
                </h2>
                <p className="mx-auto mb-9 max-w-[480px] text-[17px] leading-relaxed text-white/60">
                    {t("ctaSubtitle")}
                </p>
                <Button
                    size="lg"
                    className="h-auto rounded-full bg-white px-8 py-3.5 text-[15px] font-medium text-forest-900 shadow-none hover:-translate-y-0.5 hover:bg-forest-50"
                    asChild
                >
                    <Link href="/dashboard" className="no-underline">
                        {t("ctaButton")} →
                    </Link>
                </Button>
            </div>
        </section>
    );
}