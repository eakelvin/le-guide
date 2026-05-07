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
        q: "Is ArriveFrance free to use?",
        a: "Yes, completely free. ArriveFrance is a student-built guide with no fees, no subscription, and no ads. Progress is saved locally in your browser — no account required to get started.",
    },
    {
        q: "I'm over 28 — does the healthcare guide still apply to me?",
        a: "Students under 28 are automatically enrolled in the régime général étudiant. If you're 28 or older, the process is slightly different — you may need to register via your employer (for PhD students with contracts) or as an independent resident. Check ameli.fr directly for your specific status.",
    },
];

export const HOW_STEPS = [
    { num: "1", title: "Set up your profile", desc: "Tell us your arrival date, university, and nationality. We personalise your checklist based on your situation." },
    { num: "2", title: "Follow your steps", desc: "Each process is broken into clear steps with exact documents needed, tips, deadlines, and official links." },
    { num: "3", title: "Track your progress", desc: "Check off documents and steps as you go. Progress is saved automatically — pick up where you left off." },
    { num: "4", title: "Stay ahead of deadlines", desc: "Urgency indicators and deadline tracking make sure nothing slips through the cracks." },
];