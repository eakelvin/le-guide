import type { BlogCategory, BlogPost } from "@/types/blog";

export const BLOG_CATEGORIES: BlogCategory[] = [
  {
    id: "admin",
    label: "Administrative steps",
    description: "Walkthroughs for the checklist items: visa, CAF, housing, banking, and more.",
  },
  {
    id: "general",
    label: "General knowledge",
    description: "Rights, paperwork, and everyday student life in France.",
  },
  {
    id: "alternance",
    label: "Alternance",
    description: "Apprenticeship and professionalisation contracts (work-study).",
  },
  {
    id: "stage",
    label: "Internships (stage)",
    description: "Conventions de stage, duration, pay, and international placements.",
  },
  {
    id: "work",
    label: "Working while studying",
    description: "Student jobs, hours, and residence permit considerations.",
  },
];

const EDITORIAL_POSTS: BlogPost[] = [
  {
    slug: "alternance-apprentissage-vs-professionnalisation",
    title: "Alternance: apprenticeship vs professionalisation contract",
    excerpt:
      "Two main work-study routes in France — who signs what, typical profiles, and how they differ from a simple student job.",
    category: "alternance",
    readingMinutes: 8,
    updated: "2026-05-01",
    sections: [
      {
        heading: "What “alternance” means",
        paragraphs: [
          "In France, alternance (work-study) usually means you split time between a school or training centre and a company. The company pays you and you have a real employment contract, not just a student internship.",
          "For international students, eligibility depends on your residence status, your institution, and the type of contract. Always confirm with your school’s alternance office and HR before you sign.",
        ],
      },
      {
        heading: "Contrat d’apprentissage (apprenticeship)",
        paragraphs: [
          "Typically used for vocational diplomas (CAP, BTS, licences pro, some masters) registered with France Compétences. You are an apprenti: part of your training is delivered by the company and part by the school.",
          "An OPCO (skills operator) is involved; contributions are shared between the state and the employer. Minimum pay is set by law (grille nationale) according to your age and year in the programme — your school can give you the exact figure for your cohort.",
        ],
      },
      {
        heading: "Contrat de professionnalisation",
        paragraphs: [
          "Often used for job-seekers or people upskilling, but also for some student pathways. The goal is rapid entry into a specific role. Rules and funding differ from apprenticeship; the contract must match an eligible training plan.",
          "Do not assume “alternance” is one single contract: the label on the paperwork (apprentissage vs professionnalisation) changes social contributions, who pays what, and sometimes maximum duration.",
        ],
      },
      {
        heading: "Practical checklist",
        paragraphs: [
          "Confirm your titre de séjour allows the contract type your employer proposes.",
          "Get the convention tripartite (you, school, company) signed before the start date.",
          "Ask HR for the OPCO name, pay schedule, and trial period rules in writing.",
        ],
      },
    ],
  },
  {
    slug: "alternance-remuneration-et-droits",
    title: "Alternance pay, social cover, and student benefits",
    excerpt:
      "How remuneration grids work at a high level, CPAM vs mutuelle, and what changes when you become a salarié en alternance.",
    category: "alternance",
    readingMinutes: 7,
    updated: "2026-05-01",
    sections: [
      {
        heading: "Minimum pay",
        paragraphs: [
          "Apprentices receive a legal percentage of the SMIC (or conventional minimum) based on age and progression in the programme. Professionalisation contracts follow their own minima — your offer letter should state gross monthly pay clearly.",
          "Bonuses and benefits (tickets restaurant, transport) may be contractual; check your collective agreement (convention collective) if one applies.",
        ],
      },
      {
        heading: "Social security",
        paragraphs: [
          "As an alternant you are generally covered as an employee for work accidents and health through the general social security regime for salaried workers, with CPAM handling much of the admin.",
          "You may still need complementary health insurance (mutuelle) for optics, dental, or better hospital coverage — many employers offer a plan after the trial period.",
        ],
      },
      {
        heading: "CAF and housing aid",
        paragraphs: [
          "Paid alternance income counts in CAF simulations. Report changes in income and household promptly in your CAF account to avoid repayments.",
          "If you were receiving APL or ALS as a full-time student, recalculate after your first payslips; entitlements often change.",
        ],
      },
    ],
  },
  {
    slug: "stage-convention-duree-gratification",
    title: "Internships in France: convention de stage, length, and gratification",
    excerpt:
      "When a convention is mandatory, how long stages can run, and when employers must pay a gratification.",
    category: "stage",
    readingMinutes: 9,
    updated: "2026-05-01",
    sections: [
      {
        heading: "Convention de stage obligatoire",
        paragraphs: [
          "For a mandatory internship that counts toward your degree, French law requires a tripartite agreement between you, your school, and the host organisation (convention de stage). Without it, the host should not have you “working” as an intern.",
          "The convention fixes dates, missions, supervision, insurance, and sometimes remote-work clauses. Never start full-time presence on site before all three signatures unless your school explicitly allows a phased start.",
        ],
      },
      {
        heading: "Duration and full-time equivalence",
        paragraphs: [
          "Limits exist on how many hours or consecutive weeks you can be in stage depending on your level (bac+2, bac+3, etc.) and your school’s rules. Exceeding them can block validation of your year.",
          "If you extend the internship, sign an addendum (avenant) through your school — verbal extensions are risky for insurance and degree credit.",
        ],
      },
      {
        heading: "Gratification (internship pay)",
        paragraphs: [
          "Beyond a legal duration threshold (in effect from 2 months of full-time presence in the same host organisation, subject to updates in law), a minimum gratification per hour applies. Verify the current hourly rate on service-public or your school’s internship office.",
          "Shorter stages may be unpaid if under the threshold, but the convention still protects you (hours, tutor, insurance).",
        ],
      },
      {
        heading: "Common mistakes",
        paragraphs: [
          "Treating a long unpaid “trial” as a stage without a convention — risky for you and the company.",
          "Signing a freelance or service contract instead of a stage when the work is clearly curricular — can invalidate student social status; ask your international office.",
        ],
      },
    ],
  },
  {
    slug: "stage-etranger-teletravail",
    title: "Stage abroad, hybrid work, and insurance",
    excerpt:
      "What to clarify when part of your internship happens outside France or remotely for a foreign HQ.",
    category: "stage",
    readingMinutes: 6,
    updated: "2026-05-01",
    sections: [
      {
        heading: "Physical mobility",
        paragraphs: [
          "If you leave France during your titre de séjour, check validity dates and any préfecture conditions. Your school may require the foreign host to appear on the convention or an addendum.",
          "Health and liability insurance for travel should be named in the convention; Erasmus+ or campus schemes sometimes bundle coverage.",
        ],
      },
      {
        heading: "Remote work for a non-French entity",
        paragraphs: [
          "Hybrid or full-remote stages are increasingly accepted if the educational tutor can supervise learning outcomes. The legal employer of record for the convention is usually still the French signatory organisation.",
          "Tax and social security for cross-border remote setups get complex fast — involve your school’s legal contact early.",
        ],
      },
    ],
  },
  {
    slug: "travailler-avec-un-titre-etudiant",
    title: "Working in France on a student residence permit",
    excerpt:
      "Annual hour caps, autorisation provisoire de travail (APT), and when a real job contract replaces student rules.",
    category: "work",
    readingMinutes: 8,
    updated: "2026-05-01",
    sections: [
      {
        heading: "Standard student work rule",
        paragraphs: [
          "Many student residence permits allow salaried work up to 964 hours per year (equivalent part-time), inside French labour law. The counter resets on a fixed date — confirm on your titre or with the préfecture.",
          "Employers may request an autorisation provisoire de travail (APT) for certain contracts; processing times vary by department.",
        ],
      },
      {
        heading: "Alternance and CDI while studying",
        paragraphs: [
          "An alternance contract is not “964h student work” — it is a full employment contract with its own regime. Your permit must explicitly allow that contract type.",
          "Switching from student status to salarié status is a residence permit change: plan months ahead with HR and legal counsel.",
        ],
      },
      {
        heading: "Pôle emploi and unemployment",
        paragraphs: [
          "Student jobs rarely open full unemployment rights. If you finish a degree and hold a recherche d’emploi / jeune diplômé status, different rules apply — see official Pôle emploi guidance for your situation.",
        ],
      },
    ],
  },
  {
    slug: "vie-etudiante-droit-au-compte-et-assurances",
    title: "Student essentials: bank account, insurance, and mail",
    excerpt:
      "Why a French IBAN matters beyond CAF, and how to stay reachable for administration (téléprocédures, courriers).",
    category: "general",
    readingMinutes: 6,
    updated: "2026-05-01",
    sections: [
      {
        heading: "Right to a basic payment account",
        paragraphs: [
          "EU law gives residents a right to a basic payment account. In practice, banks ask for proof of address, visa, and sometimes enrollment; expect 1–2 weeks of back-and-forth.",
          "A French IBAN is required for CAF, many employers, and most rent payments — plan this before you lock in housing timelines.",
        ],
      },
      {
        heading: "Insurance bundles",
        paragraphs: [
          "Renters’ insurance (assurance habitation) is mandatory for many leases and cheap compared to deposit disputes.",
          "Civil liability (responsabilité civile vie privée) is often included in student mutual offers — check if it covers internships abroad.",
        ],
      },
      {
        heading: "Staying reachable",
        paragraphs: [
          "Create forwarding rules for university email; many préfecture notifications still arrive by physical mail to your declared address.",
          "Update your address in ANTS / messagerie when you move — missed courriers are a top cause of expired titres.",
        ],
      },
    ],
  },
  {
    slug: "comprendre-les-guichets-unica-etudiant",
    title: "Messagerie étudiante, CVEC, and campus portals",
    excerpt:
      "How French universities centralise enrollment proof, fees, and sometimes health declarations.",
    category: "general",
    readingMinutes: 5,
    updated: "2026-05-01",
    sections: [
      {
        heading: "CVEC (Contribution vie étudiante)",
        paragraphs: [
          "Most students pay the CVEC via the CROUS portal before final enrollment. Keep the certificate PDF — préfectures and banks sometimes ask for it.",
        ],
      },
      {
        heading: "Enrollment certificates",
        paragraphs: [
          "Banks and CAF often want an attestation de scolarité less than 3 months old. Download it from your academic portal rather than scanning an old PDF.",
        ],
      },
      {
        heading: "Digital identity",
        paragraphs: [
          "France Connect and university SSO are converging on some campuses. Enable 2FA where offered so you do not lose access during renewal season.",
        ],
      },
    ],
  },
  // cdd vs cdi
];

export const CHECKLIST_GUIDE_POSTS: BlogPost[] = [
  {
    slug: "getting-a-sim-card",
    title: "Getting a SIM Card",
    excerpt:
      "A French SIM card helps you access mobile data, calls, SMS, and important verification services after arriving in France.",
    category: "admin",
    readingMinutes: 4,
    updated: "2026-06-07",
    sections: [
      {
        heading: "Overview",
        paragraphs: [
          "Many students buy the first SIM card they find when they arrive in France. Later, they discover that the network coverage is poor or that they're paying more than necessary.",
          "The good news is that you can switch (port) your number to another provider later if you're unhappy with your current network.",
        ],
      },
      {
        heading: "Which SIM card should you choose?",
        paragraphs: [
          "There is no perfect option for everyone, but these are some popular choices:",
        ],
        bullets: [
          {
            label: "Free",
            href: "https://mobile.free.fr/",
            description:
              "One of the most affordable options. Sign-up is simple and usually requires fewer documents.",
          },
          {
            label: "SFR",
            href: "https://www.sfr.fr/offre-mobile",
            description:
              "Quite expensive, good network coverage depending on your location, but may require more documents during registration.",
          },
          {
            label: "Lebara",
            href: "https://www.lebara.fr/fr/prepaye.html?gad_campaignid=1690636271&gad_source=1&gbraid=0AAAAADe1imN2kbBJykQDMzd_gO66njSgx&gclid=Cj0KCQjwio_RBhDMARIsAJPveNPxcHzKFCE9mXLNQHzJatEFlZ5Y1eA9n7lZZXLtdSiRZfabPLIEze0aAv4zEALw_wcB&loopcd=SEg%7Cc%7Cg%7Clebara%7C765841309184%7Ce&utm_campaign=Brand&utm_medium=cpc&utm_source=google",
            description:
              "Budget-friendly and popular among international students.",
          },
          {
            label: "Orange",
            href: "https://boutique.orange.fr/mobile/offres?internet=false",
            description:
              "Generally offers excellent coverage across France, but plans tend to be more expensive.",
          },
          {
            label: "Lyca Mobile",
            href: "https://www.lycamobile.fr/abo/fr/bundles/sim-only-deals/#1-mois",
            description: "Affordable and widely used by students.",
          },
          {
            label: "Bouygues Télécom",
            href: "https://www.bouyguestelecom.fr/forfaits-mobiles/sans-engagement",
            description: "Good network coverage, but may require more documents during registration.",
          },
        ],
      },
    ],
    recommendation: "If you're looking for a low-cost option to get started, Free is usually the easiest and most affordable choice. You can always switch providers later if another network works better in your area.",
    warning: "Be aware that some plans may automatically change to a more expensive offer after a year, so review your plan from time to time to avoid unexpected charges."
  },
  {
    slug: "finding-accommodation",
    title: "Finding Accommodation in France",
    excerpt:
      "Find and secure accommodation before applying for housing aid (CAF).",
    category: "admin",
    readingMinutes: 4,
    updated: "2026-06-04",
    sections: [
      {
        heading: "Overview",
        paragraphs: [
          "Finding accommodation is one of the biggest challenges for international students in France. It's not always easy to secure housing, so start your search as early as possible.",
          "Where you live can also affect how quickly certain administrative procedures are processed. Some areas have faster paperwork processing than others, which can make settling in easier.",
          "Most students spend between €500 and €700 per month on accommodation, depending on the city and type of housing.",
          "Shared Housing (Colocation): If you live in a shared apartment, you may need additional documents to prove your address when completing administrative procedures. Make sure to keep copies of all housing-related documents.",
        ],
      },
      {
        heading: "Housing Options",
        paragraphs: [
          "There are many housing platforms and student communities that can help you find accommodation. Many students also find it easier to secure housing after arriving in France rather than from abroad.",
        ],
        bullets: [
          "Student residences",
          "Private rentals",
          "Shared housing (colocation)",
          "Staying with a family friend or relative",
        ],
      },
    ],
    recommendation: "",
    warning: ""
  },
  {
    slug: "opening-an-online-bank-account",
    title: "Opening an online bank account",
    excerpt:
      "(Optional but Useful). Opening an online bank account is a crucial step for international students. It allows you to manage your finances and make payments.",
    category: "admin",
    readingMinutes: 3,
    updated: "2026-06-04",
    sections: [
      {
        heading: "Overview",
        paragraphs: [
          "In France, online banks and traditional banks are not the same.",
          "Traditional banks usually have physical branches and are often required for certain services, such as applying for housing, loans, or other administrative procedures. However, opening an account can take several days or weeks.",
          "Online banks are faster to set up and can help you manage your finances while waiting for your traditional bank account.",
          "An online bank account allows you to receive money, make payments, and pay for certain administrative procedures, including visa validation.",
          "If you have friends who already use an online bank, ask whether they have a referral code before creating your account. Many online banks offer referral programs that reward both the referrer and the new customer with a cash bonus or other incentives after the account is opened and the eligibility conditions are met."
        ],
      },
    ],
    recommendation: "Open an online bank account shortly after arriving in France, then open a traditional bank account when you have the required documents and proof of address.",
    warning: ""
  },
  {
    slug: "navigo-transport",
    title: "Get a Navigo Transport Pass",
    excerpt:
      "It allows you to use public transport (metro, bus, RER) in the Île-de-France region, including Paris.",
    category: "admin",
    readingMinutes: 3,
    updated: "2026-06-04",
    sections: [
      {
        heading: "Overview",
        paragraphs: [
          "If you live in the Paris region, the Navigo Pass is the easiest way to access public transport, including the metro, bus, tram, and train.",
          "Students under 26 years old may be eligible for discounted transport passes. Check the official transport website for the latest eligibility requirements and pricing.",
          "When you first arrive, you can also download the official Île-de-France Mobilités app to buy and validate tickets directly from your phone. This is often faster and more convenient than buying tickets at stations."
        ],
      },
      {
        heading: "Tips",
        paragraphs: [ 
        ],
        bullets: [
          "For new comers, use the mobile app to buy and validate tickets.",
          "Under 26 and studying in Île-de-France: Check if you qualify for the Imagine R Student Pass.",
          "Using transport occasionally: Consider Navigo Liberté+, which lets you pay only for the journeys you make."
        ],
      },
    ],
    recommendation: "A monthly or annual Navigo pass is usually the best value if you plan to use public transport every day.",
    warning: "Travelling without a valid ticket can result in an on-the-spot fine if you are inspected by transport officers."
  },
  {
    slug: "validating-your-visa",
    title: "Validating your visa",
    excerpt:
      "Visa validation is required to activate your long-stay visa and legally stay in France as a student.",
    category: "admin",
    readingMinutes: 4,
    updated: "2026-06-04",
    sections: [
      {
        heading: "Overview",
        paragraphs: [
          "If you arrived in France with a VLS-TS (Long-Stay Visa), you must validate it within 3 months of your arrival. This is one of the most important administrative steps to complete after arriving in France.",
          "Visa validation is completed online through the French government's immigration platform. During the process, you will need information from your visa and passport, your address in France, and a payment method to pay the required tax.",
        ],
      },
      {
        heading: "",
        paragraphs: [
        ],
        bullets: [
        ],
      },
    ],
    recommendation: "Do not wait until the last minute. Complete your visa validation within your first few weeks in France to avoid unnecessary stress and administrative issues.",
    warning: "Missing the 3-month deadline can put you in an irregular immigration situation and may affect your ability to travel or complete future residence permit procedures."
  },
  {
    slug: "traditional-bank-account",
    title: "Opening a Traditional Bank Account",
    excerpt:
      "Open a traditional French bank account to access long-term banking services, salary payments, and administrative processes.",
    category: "admin",
    readingMinutes: 4,
    updated: "2026-06-04",
    sections: [
      {
        heading: "Overview",
        paragraphs: [
          "Traditional banks are widely accepted for official procedures and are often preferred by employers, landlords, and government agencies. They also provide documents such as a French RIB (bank account details), which you will need for many administrative tasks."
        ],
      },
      {
        heading: "Why Open a Traditional Bank Account?",
        paragraphs: [
        ],
        bullets: [
          "Receive your salary",
          "Pay rent and utility bills",
          "Set up direct debits",
          "Receive CAF housing assistance payments",
          "Complete administrative procedures",
          "Access additional banking services if needed"
        ],
      },
    ],
    recommendation: "",
    warning: "Keep a digital copy of your RIB. You will be asked for it frequently when setting up services in France."
  },
  {
    slug: "social-security",
    title: "Register for public health system",
    excerpt:
      "Register with the French health insurance system to access medical care and healthcare reimbursements while studying in France.",
    category: "admin",
    readingMinutes: 4,
    updated: "2026-06-04",
    sections: [
      {
        heading: "Overview",
        paragraphs: [
          "As a non-working student, you can apply online through the official Ameli platform. Once registered, you can access healthcare coverage while waiting for your physical card.",
          "You will first receive an “attestation de droits”, which serves as temporary proof of coverage and is accepted until your official card arrives.",
        ],
      },
      {
        heading: "Why Register with Ameli?",
        paragraphs: [
        ],
        bullets: [
          "You need it to access healthcare services in France",
          "Employers often ask for your Social Security number before hiring you",
          "It is required for many administrative processes",
        ],
      },
    ],
    recommendation: "Use your traditional bank account when registering, as it is required for healthcare reimbursements and official verification processes.",
    warning: "Do not wait for your physical documents to arrive before starting the process — the online attestation is enough for most early procedures."
  },
  {
    slug: "apply-for-caf-housing-aid",
    title: "Apply for CAF Housing Aid (CAF)",
    excerpt:
      "Apply for housing assistance from CAF after securing accommodation in France.",
    category: "admin",
    readingMinutes: 4,
    updated: "2026-06-04",
    sections: [
      {
        heading: "Overview",
        paragraphs: [
          "CAF is a French housing support system that helps students reduce their monthly rent through government aid.",
          "CAF (Caisse d’Allocations Familiales) is a French government service that helps people pay part of their rent. Many international students in France are eligible to apply.",
          "If you qualify, CAF provides monthly financial housing support that is paid directly into your bank account. This helps reduce your rent costs while studying in France.",
          "The amount varies depending on your rent, city, and personal situation. Most students receive between €100 and €300 per month, sometimes more.",
          "You should apply as soon as you have your rental contract and address in France. Payments usually start after your application is approved and are not always fully backdated.",
          "CAF is not automatic—you must apply yourself, and although processing can take several weeks or months, payments usually start after approval, and you do not need to be working to qualify.",
        ],
      },
      {
        heading: "",
        paragraphs: [
        ],
        bullets: [
        ],
      },
    ],
    recommendation: "It is strongly recommended to apply early, as CAF can significantly reduce your monthly living costs in France.",
    warning: ""
  },
  {
    slug: "declaration-of-tax",
    title: "French Tax Declaration",
    excerpt:
      "Declare your annual income to the French tax authorities, even if you have no income.",
    category: "admin",
    readingMinutes: 4,
    updated: "2026-06-04",
    sections: [
      {
        heading: "Overview",
        paragraphs: [
          "Many international students do not realize that they should declare their taxes in France, even if they are not working.",
          "Tax declarations become important later when applying for administrative procedures such as citizenship, long-term residency, and other official requests that may require proof of your financial history in France.",
          "Having little or no income does not necessarily mean you can ignore tax declarations. Check your obligations each year to make sure you remain compliant with French regulations."
        ],
      },
      {
        heading: "Why Declare Your Taxes?",
        paragraphs: [
          "",
        ],
        bullets: [
          "Creates an official tax record in France",
          "Can be useful for citizenship and residency applications",
          "Helps demonstrate your financial history",
          "Required if you earn income in France",
        ],
      },
    ],
    recommendation: "Do not wait until you start working. Learn about the tax declaration process early and complete any required tax filings on time to avoid complications in the future.",
    warning: ""
  },
];

/** All posts (editorial + checklist-item walkthroughs) reachable at `/guides/[slug]`. */
export const BLOG_POSTS: BlogPost[] = [...CHECKLIST_GUIDE_POSTS, ...EDITORIAL_POSTS];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

/** Cheap existence check for the "Read full guide" link in the checklist view. */
export function hasGuideForSlug(slug: string): boolean {
  return BLOG_POSTS.some((p) => p.slug === slug);
}

/**
 * True when the slug corresponds to one of the curated checklist-step walkthroughs
 * (i.e. a guide that maps 1:1 to a `ChecklistItem.slug`). Used by the guide page to
 * deep-link readers back to that step in the dashboard.
 */
export function isChecklistGuideSlug(slug: string): boolean {
  return CHECKLIST_GUIDE_POSTS.some((p) => p.slug === slug);
}

export function getPostsByCategory(category: string | null): BlogPost[] {
  if (!category || category === "all") return BLOG_POSTS;
  return BLOG_POSTS.filter((p) => p.category === category);
}

export function categoryMeta(id: string) {
  return BLOG_CATEGORIES.find((c) => c.id === id);
}
