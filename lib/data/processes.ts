import type { Process } from "@/types";

export const PROCESSES: Process[] = [
  {
    id: "visa",
    title: "Visa Validation (OFII)",
    subtitle: "Mandatory within 3 months of first entry to France",
    colorKey: "coral",
    steps: [
      {
        id: "v1",
        title: "Validate your visa online at OFII",
        description:
          "Go to the official OFII website and fill in the téléprocédure form within 3 months of arriving in France. This is a separate legal requirement from your visa sticker.",
        tags: [
          { variant: "urgent", text: "3-month deadline" },
          { variant: "time", text: "20 min online" },
        ],
        tip: {
          variant: "urgent",
          message:
            "You must do this even if you already have a valid visa sticker. The online validation is a separate legal requirement.",
        },
        documents: [
          "Passport",
          "Long-stay visa (copy)",
          "French address in France",
          "Email address",
        ],
        link: {
          url: "https://administration-etrangers-en-france.interieur.gouv.fr",
          label: "OFII téléprocédure portal",
        },
        defaultDone: true,
      },
      {
        id: "v2",
        title: "Receive your OFII appointment letter",
        description:
          "After submitting online, OFII will send a convocation letter to your French address with your appointment date.",
        tags: [{ variant: "time", text: "4–8 weeks wait" }],
        tip: {
          variant: "tip",
          message:
            "If you haven't received a letter after 6 weeks, contact your local OFII office directly.",
        },
        documents: [],
      },
      {
        id: "v3",
        title: "Attend your OFII medical appointment",
        description:
          "Bring all required documents. You will have a medical exam and your visa will be validated with an OFII stamp.",
        tags: [
          { variant: "docs", text: "5 documents required" },
          { variant: "time", text: "Half-day" },
        ],
        tip: {
          variant: "tip",
          message:
            "Bring originals AND photocopies. The OFII office may not have a photocopier.",
        },
        documents: [
          "Original passport",
          "Convocation letter",
          "Proof of address (< 3 months old)",
          "2 passport photos",
          "Proof of enrollment (certificate from university)",
        ],
      },
      {
        id: "v4",
        title: "Receive OFII stamp & keep your documents",
        description:
          "Your passport will receive an OFII vignette stamp. Store digitally — many French services will ask for it.",
        tags: [{ variant: "time", text: "Same day" }],
        tip: {
          variant: "tip",
          message:
            "Scan your passport immediately after. The OFII stamp is proof of legal stay.",
        },
        documents: [],
      },
    ],
  },
  {
    id: "housing",
    title: "Housing & CAF",
    subtitle: "Apply for housing aid — up to €200/month for students",
    colorKey: "forest",
    steps: [
      {
        id: "h1",
        title: "Sign your lease and get your attestation",
        description:
          "Before applying for CAF, you need a signed lease (bail) or attestation from your residence (CROUS/private).",
        tags: [{ variant: "docs", text: "Lease required" }],
        tip: {
          variant: "tip",
          message:
            'CROUS residences provide a "certificat de logement" — this replaces a standard lease for CAF.',
        },
        documents: [
          "Signed lease or CROUS attestation",
          "Landlord name & address",
          "Rent amount",
        ],
        defaultDone: true,
      },
      {
        id: "h2",
        title: "Open a French bank account (required for CAF)",
        description:
          "CAF payments are made exclusively to French bank accounts (RIB/IBAN). You must have one before applying.",
        tags: [{ variant: "time", text: "Open bank first" }],
        tip: {
          variant: "warn",
          message:
            "CAF cannot pay to foreign bank accounts. Banking is a prerequisite here.",
        },
        documents: [],
        defaultDone: true,
      },
      {
        id: "h3",
        title: "Create your CAF account online",
        description:
          "Create an account on caf.fr. Select 'Etudiant' as your situation and fill in the ALS form.",
        tags: [
          { variant: "time", text: "45 min" },
          { variant: "cost", text: "Free" },
        ],
        tip: {
          variant: "tip",
          message:
            "Apply as soon as you move in — aid is calculated from your first full month of tenancy, not your application date.",
        },
        documents: [
          "French RIB (bank details)",
          "Lease or CROUS attestation",
          "Tax return or income proof",
          "Passport or titre de séjour",
        ],
        link: { url: "https://www.caf.fr", label: "Apply on caf.fr" },
      },
      {
        id: "h4",
        title: "Submit supporting documents",
        description:
          "Upload all required documents in your CAF dossier. CAF will review and request anything missing.",
        tags: [{ variant: "time", text: "2–6 weeks review" }],
        tip: {
          variant: "tip",
          message:
            "Documents must be in French or accompanied by a certified translation. Photos of documents are accepted.",
        },
        documents: [],
      },
      {
        id: "h5",
        title: "Receive your CAF allocation",
        description:
          'Once approved, CAF pays monthly directly into your bank account. Check your "Espace Mon Compte" for updates.',
        tags: [
          { variant: "time", text: "6–10 weeks total" },
          { variant: "cost", text: "Up to €200/mo" },
        ],
        tip: {
          variant: "tip",
          message:
            "First payment may include retroactive months. Keep your situation updated.",
        },
        documents: [],
      },
    ],
  },
  {
    id: "health",
    title: "Healthcare (CPAM)",
    subtitle: "Get your Carte Vitale and access the French healthcare system",
    colorKey: "azure",
    steps: [
      {
        id: "he1",
        title: "Register on ameli.fr",
        description:
          "Create your account on ameli.fr. As a student under 28, you are automatically covered under the national scheme (régime général étudiant).",
        tags: [
          { variant: "time", text: "20 min online" },
          { variant: "cost", text: "Free" },
        ],
        tip: {
          variant: "tip",
          message:
            "Students over 28 or PhD students may have different rules — check your eligibility on ameli.fr.",
        },
        documents: [
          "Passport or titre de séjour",
          "Enrollment certificate",
          "French address",
          "French bank RIB",
        ],
        link: { url: "https://www.ameli.fr", label: "Register on ameli.fr" },
      },
      {
        id: "he2",
        title: "Submit documents to your local CPAM",
        description:
          "After creating an account, you must send physical or scanned documents to your local CPAM office.",
        tags: [
          { variant: "docs", text: "4 documents required" },
          { variant: "time", text: "2–4 weeks processing" },
        ],
        tip: {
          variant: "tip",
          message:
            "Send via your ameli.fr messaging system — faster than postal mail and creates a paper trail.",
        },
        documents: [
          "Passport or titre de séjour (copy)",
          "Proof of enrollment",
          "Proof of French address",
          "Birth certificate with translation if non-EU",
        ],
      },
      {
        id: "he3",
        title: "Choose a médecin traitant (GP)",
        description:
          "Declare a primary care doctor (médecin traitant) on ameli.fr. Required to be reimbursed at full rate.",
        tags: [{ variant: "time", text: "10 min online" }],
        tip: {
          variant: "tip",
          message:
            "Use doctolib.fr to find a GP accepting new patients near your address.",
        },
        documents: [],
        link: {
          url: "https://www.doctolib.fr",
          label: "Find a doctor on Doctolib",
        },
      },
      {
        id: "he4",
        title: "Receive your Carte Vitale",
        description:
          "After 3–6 months, you will receive a Carte Vitale (green health card). Present it at every medical appointment.",
        tags: [{ variant: "time", text: "3–6 months wait" }],
        tip: {
          variant: "tip",
          message:
            "While waiting, download an attestation de droits from ameli.fr as proof of insurance.",
        },
        documents: [],
      },
    ],
  },
  {
    id: "bank",
    title: "Banking",
    subtitle:
      "Open a French bank account — needed for CAF, rent, and everyday life",
    colorKey: "violet",
    steps: [
      {
        id: "b1",
        title: "Choose your bank",
        description:
          "As a student, you have several options: traditional banks (BNP, Société Générale), or online banks (Boursorama, N26, Revolut).",
        tags: [{ variant: "cost", text: "Often free for students" }],
        tip: {
          variant: "tip",
          message:
            "Online banks are easiest to open but may not be accepted by CAF. Open a real French account (BNP, LCL, La Banque Postale) for official purposes.",
        },
        documents: [],
      },
      {
        id: "b2",
        title: "Gather documents and apply",
        description:
          "Visit a branch or apply online. La Banque Postale and LCL have strong student programs. BNP Paribas has English-speaking advisors in major cities.",
        tags: [
          { variant: "docs", text: "5 documents" },
          { variant: "time", text: "30 min + 5–10 days" },
        ],
        tip: {
          variant: "tip",
          message:
            "French banks are notoriously slow. Apply the first week you arrive.",
        },
        documents: [
          "Passport",
          "Proof of enrollment (letter from university)",
          "Proof of address in France",
          "Visa or titre de séjour",
          "€100–300 initial deposit",
        ],
      },
      {
        id: "b3",
        title: "Get your RIB and activate card",
        description:
          "Once your account is open, download your RIB (bank details document). Share it with CAF, your landlord, and any employer.",
        tags: [{ variant: "time", text: "5–10 business days" }],
        tip: {
          variant: "tip",
          message:
            "Your RIB is not the same as your card number. Download it from your banking app.",
        },
        documents: [],
      },
    ],
  },
  {
    id: "transport",
    title: "Transportation",
    subtitle:
      "Get 50% off all Île-de-France transport with Imagine R or Navigo",
    colorKey: "gold",
    steps: [
      {
        id: "t1",
        title: "Get an Imagine R pass (under 26, student)",
        description:
          "If you are under 26 and studying in Île-de-France, the Imagine R card gives you unlimited travel on all zones for ~€350/year instead of ~€700.",
        tags: [
          { variant: "cost", text: "~€350/year" },
          { variant: "time", text: "Apply by September" },
        ],
        tip: {
          variant: "tip",
          message:
            "Imagine R runs September to August. If you arrive in January, you pay a prorated rate.",
        },
        documents: [
          "Enrollment certificate",
          "Passport photo (digital)",
          "French address",
          "Payment card",
        ],
        link: {
          url: "https://www.imagine-r.com",
          label: "Apply at imagine-r.com",
        },
      },
      {
        id: "t2",
        title: "Or get a monthly Navigo Mois (all ages)",
        description:
          "If over 26 or starting mid-year, buy a Navigo Mois at any RATP station. Zones 1–2 cover all of Paris (€86.40/month).",
        tags: [{ variant: "cost", text: "€86.40/mo zones 1–2" }],
        tip: {
          variant: "tip",
          message:
            "Top up your Navigo every month on the 20th for the next month, or enable auto-renewal online.",
        },
        documents: ["Passport photo", "Payment card"],
      },
      {
        id: "t3",
        title: "Register your card for loss protection",
        description:
          "Register your Navigo or Imagine R card on the Navigo portal. If lost or stolen, your balance can be transferred to a new card.",
        tags: [
          { variant: "time", text: "5 min" },
          { variant: "cost", text: "Free" },
        ],
        tip: {
          variant: "tip",
          message:
            "Without registration, a lost Navigo means losing all your paid balance — no refund.",
        },
        documents: [],
        link: { url: "https://www.navigo.fr", label: "Register at navigo.fr" },
      },
    ],
  },
];

export const PROCESS_MAP = Object.fromEntries(PROCESSES.map((p) => [p.id, p]));

export const DEADLINES = [
  { label: "OFII validation", daysLeft: 3, variant: "urgent" as const },
  { label: "CAF dossier", daysLeft: 14, variant: "warn" as const },
  { label: "Health insurance", daysLeft: 30, variant: "neutral" as const },
];
