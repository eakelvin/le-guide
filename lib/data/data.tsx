export const PERKS = [
    {
        icon: "🗂",
        title: "5 admin processes covered",
        desc: "Visa, housing, healthcare, banking & transport — all in one place.",
    },
    {
        icon: "✅",
        title: "Step-by-step checklists",
        desc: "Exact documents, tips, and deadlines for each step.",
    },
    {
        icon: "📊",
        title: "Progress tracking",
        desc: "Your progress is saved and synced across devices.",
    },
    {
        icon: "⚠️",
        title: "Deadline alerts",
        desc: "Never miss an OFII window or CAF submission date.",
    },
];

export const steps = [
    { label: "Visa Validation (OFII)", pct: 25, color: "#F0997B" },
    { label: "Housing & CAF", pct: 40, color: "#97C459" },
    { label: "Healthcare (CPAM)", pct: 0, color: "#85B7EB" },
    { label: "Banking", pct: 0, color: "#AFA9EC" },
    { label: "Transportation", pct: 0, color: "#EF9F27" },
];

export const TESTIMONIALS = [
    {
        quote: "I had no idea OFII validation was separate from having a valid visa. LeGuide caught it for me with two months to spare.",
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

export const FAQS = [
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
        q: "Is LeGuide free to use?",
        a: "Yes, completely free. LeGuide is a student-built guide with no fees, no subscription, and no ads. Progress is saved locally in your browser — no account required to get started.",
    },
    {
        q: "I'm over 28 — does the healthcare guide still apply to me?",
        a: "Students under 28 are automatically enrolled in the régime général étudiant. If you're 28 or older, the process is slightly different — you may need to register via your employer (for PhD students with contracts) or as an independent resident. Check ameli.fr directly for your specific status.",
    },
];

export const HOW_STEPS = [
    { num: "1", title: "Set up your profile", desc: "Tell us your arrival date, university, and country. We personalise your checklist based on your situation." },
    { num: "2", title: "Follow your steps", desc: "Each process is broken into clear steps with exact documents needed, tips, deadlines, and official links." },
    { num: "3", title: "Track your progress", desc: "Check off documents and steps as you go. Progress is saved automatically — pick up where you left off." },
    { num: "4", title: "Stay ahead of deadlines", desc: "Urgency indicators and deadline tracking make sure nothing slips through the cracks." },
];

export const PROC_CARDS = [
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