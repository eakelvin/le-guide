"use client";

import Link from "next/link";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ─── NAV ─────────────────────────────────────────────────────────────── */
function Nav() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b border-border bg-background/90 px-6 backdrop-blur-md supports-[backdrop-filter]:bg-background/75 md:h-[60px] md:px-12">
            <Link
                href="/"
                className="font-heading text-[18px] font-normal tracking-tight text-sand-800 no-underline"
            >
                Arrive<span className="text-forest-900">France</span>
            </Link>
            <div className="flex items-center gap-4 md:gap-7">
                <div className="hidden items-center gap-7 md:flex">
                    <a
                        href="#processes"
                        className="text-[13.5px] text-sand-600 transition-colors no-underline hover:text-sand-800"
                    >
                        Processes
                    </a>
                    <a
                        href="#how"
                        className="text-[13.5px] text-sand-600 transition-colors no-underline hover:text-sand-800"
                    >
                        How it works
                    </a>
                    <a
                        href="#faq"
                        className="text-[13.5px] text-sand-600 transition-colors no-underline hover:text-sand-800"
                    >
                        FAQ
                    </a>
                    <Link
                        href="/guides"
                        className="text-[13.5px] text-sand-600 transition-colors no-underline hover:text-sand-800"
                    >
                        Guides
                    </Link>
                </div>
                <Button size="sm" className="rounded-full bg-forest-900 px-5 text-[13px] text-white hover:bg-forest-800" asChild>
                    <Link href="/dashboard">Start free →</Link>
                </Button>
            </div>
        </nav>
    );
}

/* ─── HERO ─────────────────────────────────────────────────────────────── */
function Hero() {
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
                        🇫🇷 &nbsp;Built for international students in France
                    </div>

                    <h1 className="font-heading mb-6 max-w-[820px] text-[clamp(40px,6vw,72px)] font-light leading-[1.08] tracking-[-0.04em] text-sand-800">
                        Navigate France<br />
                        without the<br />
                        <em className="italic text-forest-900">administrative fog</em>
                    </h1>

                    <p className="text-lg text-sand-600 leading-relaxed max-w-[520px] mb-10">
                        Visa validation, CAF housing aid, healthcare, banking, transport — every step explained, tracked, and simplified in one place.
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
                                Start your checklist
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="h-auto rounded-full border-sand-200 bg-transparent px-6 py-3.5 text-[15px] text-sand-800 shadow-none hover:-translate-y-0.5 hover:bg-card"
                            asChild
                        >
                            <a href="#how" className="no-underline">
                                See how it works
                            </a>
                        </Button>
                    </div>

                    {/* Social proof */}
                    <div className="flex items-center gap-5 mt-14 pt-8 border-t border-sand-100">
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
                            <strong className="text-sand-800">1,200+ students</strong> arrived in France with ArriveFrance this year
                        </p>
                    </div>
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
                                <div className="text-sm font-medium">Visa Validation (OFII)</div>
                                <div className="text-[11.5px] text-coral-600">⚠ 87 days remaining</div>
                            </div>
                        </div>
                        {[
                            { num: "✓", done: true, label: "Submit online téléprocédure" },
                            { num: "2", active: true, label: "Wait for appointment letter", tag: { text: "4–8 weeks", bg: "bg-gold-50", col: "text-gold-600" } },
                            { num: "3", label: "Attend OFII medical visit" },
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

/* ─── URGENCY BANNER ──────────────────────────────────────────────────── */
function UrgencyBanner() {
    return (
        <div className="border-y border-coral-200/80 bg-coral-50 py-4">
            <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-center gap-2.5 px-6 text-[14px] text-coral-700 md:px-12">
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 1L1 18h18L10 1zm0 3l7 13H3l7-13zm-1 5v4h2v-4h-2zm0 5v2h2v-2h-2z" />
                </svg>
                <strong>OFII deadline:</strong> Your visa must be validated within 3 months of arriving — don&apos;t miss it.
                <Link href="/dashboard" className="text-coral-600 underline font-medium">
                    Start validation →
                </Link>
            </div>
        </div>
    );
}

/* ─── PROCESSES ───────────────────────────────────────────────────────── */
const PROC_CARDS = [
    {
        icon: (
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="4" width="14" height="12" rx="2" />
                <path d="M3 8h14M7 12h2M11 12h2" />
            </svg>
        ),
        iconBg: "bg-coral-50 text-coral-600",
        stepColor: "text-coral-600",
        title: "Visa Validation",
        steps: "4 steps",
        desc: "Register your long-stay visa with OFII within 3 months of arrival. Mandatory for all non-EU students.",
    },
    {
        icon: (
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 10L10 3l7 7v7a1 1 0 01-1 1H4a1 1 0 01-1-1v-7z" />
                <path d="M8 17v-6h4v6" />
            </svg>
        ),
        iconBg: "bg-forest-50 text-forest-600",
        stepColor: "text-forest-600",
        title: "Housing & CAF",
        steps: "5 steps",
        desc: "Apply for up to €200/month in housing aid from the government. File your dossier correctly the first time.",
    },
    {
        icon: (
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M10 3v14M3 10h14" />
            </svg>
        ),
        iconBg: "bg-azure-50 text-azure-600",
        stepColor: "text-azure-600",
        title: "Healthcare",
        steps: "4 steps",
        desc: "Register with CPAM, get your Carte Vitale, and declare a médecin traitant to be fully reimbursed.",
    },
    {
        icon: (
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="6" width="16" height="12" rx="2" />
                <path d="M2 10h16M6 15h2" />
            </svg>
        ),
        iconBg: "bg-violet-50 text-violet-600",
        stepColor: "text-violet-600",
        title: "Banking",
        steps: "3 steps",
        desc: "Open a French bank account in week one. Required for CAF payments, rent, and most French services.",
    },
    {
        icon: (
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 10h12M4 10a4 4 0 014-4h4a4 4 0 014 4v4H4v-4z" />
                <circle cx="7" cy="15" r="1.5" />
                <circle cx="13" cy="15" r="1.5" />
            </svg>
        ),
        iconBg: "bg-gold-50 text-gold-600",
        stepColor: "text-gold-600",
        title: "Transportation",
        steps: "3 steps",
        desc: "Get 50% off Île-de-France transport with the Imagine R student pass or a monthly Navigo card.",
    },
];

function Processes() {
    return (
        <section id="processes" className="py-24">
            <div className="mx-auto max-w-[1120px] px-6 md:px-12">
                <div className="mb-3.5 text-[11px] font-medium uppercase tracking-[2px] text-forest-600">
                    5 essential processes
                </div>
                <div className="mb-14 flex flex-wrap items-end justify-between gap-4">
                    <h2 className="font-heading text-[clamp(30px,4vw,48px)] font-light leading-[1.15] tracking-tight text-sand-800">
                        Everything you need,
                        <br />
                        step by step
                    </h2>
                    <p className="max-w-[540px] text-[16px] leading-relaxed text-sand-600">
                        Every major administrative task a student in France faces — broken into clear, actionable steps with
                        documents, tips, and links.
                    </p>
                </div>

                <div className="grid divide-y divide-sand-100 overflow-hidden rounded-xl border border-sand-200 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 xl:divide-x xl:divide-y-0">
                    {PROC_CARDS.map((card) => (
                        <Link
                            key={card.title}
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
                            <h3 className="text-[15px] font-medium text-sand-800 mb-1.5">{card.title}</h3>
                            <p className="text-[13px] text-sand-500 leading-relaxed">{card.desc}</p>
                            <div className={cn("text-[11.5px] font-medium mt-2.5", card.stepColor)}>{card.steps} →</div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ─── HOW IT WORKS ────────────────────────────────────────────────────── */
const HOW_STEPS = [
    { num: "1", title: "Set up your profile", desc: "Tell us your arrival date, university, and nationality. We personalise your checklist based on your situation." },
    { num: "2", title: "Follow your steps", desc: "Each process is broken into clear steps with exact documents needed, tips, deadlines, and official links." },
    { num: "3", title: "Track your progress", desc: "Check off documents and steps as you go. Progress is saved automatically — pick up where you left off." },
    { num: "4", title: "Stay ahead of deadlines", desc: "Urgency indicators and deadline tracking make sure nothing slips through the cracks." },
];

function HowItWorks() {
    return (
        <section id="how" className="bg-sand-800 py-24">
            <div className="mx-auto max-w-[1120px] px-6 md:px-12">
                <div className="mb-3.5 text-[11px] font-medium uppercase tracking-[2px] text-forest-400">
                    How it works
                </div>
                <div className="mb-14 flex flex-wrap items-end justify-between gap-4">
                    <h2 className="font-heading text-[clamp(30px,4vw,48px)] font-light leading-[1.15] tracking-tight text-white">
                        Four steps to administrative <em className="italic text-forest-400">clarity</em>
                    </h2>
                    <p className="max-w-[500px] text-[16px] leading-relaxed text-white/55">
                        No more lost in translation. No more missing documents. No more missed deadlines.
                    </p>
                </div>

                <div className="relative grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-0">
                    <div className="absolute left-[12.5%] right-[12.5%] top-[22px] hidden h-px bg-white/10 lg:block" />
                    {HOW_STEPS.map((step) => (
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

/* ─── TESTIMONIALS ────────────────────────────────────────────────────── */
const TESTIMONIALS = [
    {
        quote: "I had no idea OFII validation was separate from having a valid visa. ArriveFrance caught it for me with two months to spare.",
        name: "Mia Andersson", role: "Sciences Po, Sweden", initials: "MA", bg: "bg-forest-50", text: "text-forest-600",
    },
    {
        quote: "The CAF guide saved me so much stress. I knew exactly what to upload, in what order, and my application was approved in 3 weeks.",
        name: "Yuki Kobayashi", role: "Sorbonne, Japan", initials: "YK", bg: "bg-azure-50", text: "text-azure-600",
    },
    {
        quote: "The tip about opening a traditional French bank account before applying to CAF was a lifesaver — Revolut alone doesn't work.",
        name: "Lucas Pereira", role: "Polytechnique, Brazil", initials: "LP", bg: "bg-coral-50", text: "text-coral-600",
    },
];

function Testimonials() {
    return (
        <section className="bg-card py-24">
            <div className="mx-auto max-w-[1120px] px-6 md:px-12">
                <div className="mb-3.5 text-[11px] font-medium uppercase tracking-[2px] text-forest-600">Student voices</div>
                <h2 className="font-heading mb-14 text-[clamp(30px,4vw,48px)] font-light leading-[1.15] tracking-tight text-sand-800">
                    From 40+ countries,
                    <br />
                    one shared experience
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {TESTIMONIALS.map((t) => (
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

/* ─── FAQ ─────────────────────────────────────────────────────────────── */
const FAQS = [
    {
        q: "Do I really need to validate my visa if I already have a long-stay visa sticker?",
        a: "Yes — the online OFII téléprocédure is a completely separate legal requirement from having a visa sticker in your passport. Even if your visa is valid and current, you must complete the online validation within 3 months of your first entry to France. Skipping this can affect your ability to renew your stay.",
    },
    {
        q: "Can I apply for CAF before I have a French bank account?",
        a: "No. CAF (Caisse d'Allocations Familiales) pays housing aid exclusively to French bank accounts using your RIB. You cannot receive payments to a foreign account or an e-money app like Revolut registered abroad. Open a traditional French account first — La Banque Postale and LCL are student-friendly — then apply to CAF.",
    },
    {
        q: "How long does it take to get a Carte Vitale?",
        a: "Typically 3–6 months after registering with CPAM. In the meantime, download an attestation de droits from your ameli.fr account — this proves your insurance coverage and is accepted at pharmacies and doctors' offices.",
    },
    {
        q: "Is ArriveFrance free to use?",
        a: "Yes, completely free. ArriveFrance is a student-built guide with no fees, no subscription, and no ads. Progress is saved locally in your browser — no account required to get started.",
    },
    {
        q: "I'm over 28 — does the healthcare guide still apply to me?",
        a: "Students under 28 are automatically enrolled in the régime général étudiant. If you're 28 or older, the process is slightly different — you may need to register via your employer (for PhD students with contracts) or as an independent resident. Check ameli.fr directly for your specific status.",
    },
];

function FAQ() {
    return (
        <section id="faq" className="py-24">
            <div className="mx-auto max-w-[720px] px-6 md:px-12">
                <div className="mb-3.5 text-[11px] font-medium uppercase tracking-[2px] text-forest-600">Questions</div>
                <h2 className="font-heading mb-12 text-[clamp(30px,4vw,48px)] font-light leading-[1.15] tracking-tight text-sand-800">
                    Common questions
                </h2>
                <Accordion type="single" collapsible defaultValue="item-0" className="border-t border-sand-100">
                    {FAQS.map((faq, i) => (
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

/* ─── CTA SECTION ─────────────────────────────────────────────────────── */
function CTASection() {
    return (
        <section className="relative overflow-hidden bg-forest-900 py-24 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(255,255,255,0.06)_0%,transparent_60%)]" />
            <div className="relative z-10 mx-auto max-w-[1120px] px-6 md:px-12">
                <div className="mb-3.5 text-[11px] font-medium uppercase tracking-[2px] text-white/45">Get started today</div>
                <h2 className="font-heading mb-4 text-[clamp(32px,5vw,56px)] font-light leading-[1.1] tracking-[-0.04em] text-white">
                    Your first 90 days in France,
                    <br />
                    handled.
                </h2>
                <p className="mx-auto mb-9 max-w-[480px] text-[17px] leading-relaxed text-white/60">
                    Don&apos;t let paperwork define your first semester. Start your personalised checklist in under 2 minutes.
                </p>
                <Button
                    size="lg"
                    className="h-auto rounded-full bg-white px-8 py-3.5 text-[15px] font-medium text-forest-900 shadow-none hover:-translate-y-0.5 hover:bg-forest-50"
                    asChild
                >
                    <Link href="/dashboard" className="no-underline">
                        Start your checklist — it&apos;s free →
                    </Link>
                </Button>
            </div>
        </section>
    );
}

/* ─── FOOTER ──────────────────────────────────────────────────────────── */
function Footer() {
    return (
        <footer className="bg-sand-800 py-12">
            <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-5 px-6 md:px-12">
                <div className="font-heading text-[16px] font-normal text-white/75">
                    Arrive<span className="text-forest-400">France</span>
                </div>
                <div className="flex flex-wrap gap-6 text-[13px]">
                    <Link href="/guides" className="text-white/40 no-underline transition-colors hover:text-white/75">
                        Guides
                    </Link>
                    {["Visa", "Housing", "Healthcare", "Banking", "Transport"].map((l) => (
                        <Link
                            key={l}
                            href="/dashboard"
                            className="text-white/40 no-underline transition-colors hover:text-white/75"
                        >
                            {l}
                        </Link>
                    ))}
                </div>
                <div className="text-[12px] text-white/40">
                    © 2026 ArriveFrance. Made with ♥ for international students.
                </div>
            </div>
        </footer>
    );
}

/* ─── ASSEMBLED PAGE ──────────────────────────────────────────────────── */
export function LandingPage() {
    return (
        <div className="min-h-screen bg-canvas text-foreground">
            <Nav />
            <Hero />
            <UrgencyBanner />
            <Processes />
            <HowItWorks />
            <Testimonials />
            <FAQ />
            <CTASection />
            <Footer />
        </div>
    );
}
