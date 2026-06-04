import type { BlogPost } from "@/types/blog";

/**
 * One blog stub per checklist item slug. The route at `/guides/[slug]` reads
 * these alongside the editorial posts in `lib/blog.ts` — students get a place
 * to read more detail on each administrative step.
 *
 * To add real content: edit the `sections` array of the matching post below.
 * Slugs are intentionally kept identical to `checklist_items.slug` so the
 * "Read full guide" link in `ChecklistItemView` resolves directly.
 */
export const CHECKLIST_GUIDE_POSTS: BlogPost[] = [
  {
    slug: "getting-a-sim-card",
    title: "Getting a SIM Card",
    excerpt:
      "A French SIM card helps you access mobile data, calls, SMS, and important verification services after arriving in France.",
    category: "admin",
    readingMinutes: 3,
    updated: "2026-06-04",
    sections: [
      {
        heading: "Overview",
        paragraphs: [
          "A French SIM card helps you access mobile data, calls, SMS, and important verification services after arriving in France.",
          "You will need a French phone number for banking, deliveries, verification codes, and administrative services.",
        ],
      },
    ],
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
          "Find and secure accommodation before applying for housing aid (CAF).",
          "You need a valid accommodation contract before applying for CAF housing aid.",
        ],
      },
    ],
  },
  {
    slug: "opening-an-online-bank-account",
    title: "Opening an online bank account",
    excerpt:
      "Opening an online bank account is a crucial step for international students. It allows you to manage your finances and make payments.",
    category: "admin",
    readingMinutes: 3,
    updated: "2026-06-04",
    sections: [
      {
        heading: "Overview",
        paragraphs: [
          "Opening an online bank account is a crucial step for international students. It allows you to manage your finances and make payments.",
          "An online bank account allows you to pay visa-validation fees, receive money, and make transactions immediately while waiting for a traditional French bank account.",
        ],
      },
    ],
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
          "The Navigo pass lets you use public transport (metro, bus, RER) in the Île-de-France region, including Paris.",
          "Public transport is the main way to travel in Paris and Île-de-France. The Navigo pass gives you unlimited access to metro, bus, and RER at a fixed monthly cost, making daily life significantly easier and cheaper.",
        ],
      },
    ],
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
          "Visa validation is required to activate your long-stay visa and legally stay in France as a student.",
          "Without validation, your visa may become invalid and you could lose legal residency status in France.",
        ],
      },
    ],
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
          "Open a traditional French bank account to access long-term banking services, salary payments, and administrative processes.",
          "Traditional bank accounts are required for long-term financial stability, salary payments, rental contracts, and administrative procedures in France.",
        ],
      },
    ],
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
          "Register with the French health insurance system to access medical care and healthcare reimbursements while studying in France.",
          "Health insurance is required to access medical care and receive reimbursements for healthcare expenses in France.",
        ],
      },
    ],
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
          "Apply for housing assistance from CAF after securing accommodation in France.",
          "CAF helps reduce your monthly rent by providing housing financial support.",
        ],
      },
    ],
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
          "Declare your annual income to the French tax authorities, even if you have no income.",
          "Tax declaration is a legal requirement in France, even for students with no income. It is used to calculate eligibility for housing aid and official documentation.",
        ],
      },
    ],
  },
];
