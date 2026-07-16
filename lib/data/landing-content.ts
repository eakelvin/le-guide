import type { AppLocale } from "@/i18n/routing";

export type LandingFaq = { q: string; a: string };
export type LandingTestimonial = {
  quote: string;
  name: string;
  role: string;
  initials: string;
  bg: string;
  text: string;
};
export type LandingHowStep = { num: string; title: string; desc: string };
export type LandingProcCardText = {
  title: string;
  steps: string;
  desc: string;
};

const EN = {
  processesEyebrow: "5 essential processes",
  processesTitleLine1: "Everything you need,",
  processesTitleLine2: "step by step",
  processesSubtitle:
    "Every major administrative task a student in France faces — broken into clear, actionable steps with documents, tips, and links.",
  howEyebrow: "How it works",
  howTitle: "Four steps to administrative",
  howTitleEmphasis: "clarity",
  howSubtitle:
    "No more lost in translation. No more missing documents. No more missed deadlines.",
  testimonialsEyebrow: "Student voices",
  testimonialsTitleLine1: "From 40+ countries,",
  testimonialsTitleLine2: "one shared experience",
  faqEyebrow: "Questions",
  faqTitle: "Common questions",
  procCards: [
    {
      title: "Visa Validation",
      steps: "4 steps",
      desc: "Register your long-stay visa with OFII within 3 months of arrival. Mandatory for all non-EU students.",
    },
    {
      title: "Housing & CAF",
      steps: "5 steps",
      desc: "Apply for up to €200/month in housing aid from the government. File your dossier correctly the first time.",
    },
    {
      title: "Healthcare",
      steps: "4 steps",
      desc: "Register with CPAM, get your Carte Vitale, and declare a médecin traitant to be fully reimbursed.",
    },
    {
      title: "Banking",
      steps: "3 steps",
      desc: "Open a French bank account in week one. Required for CAF payments, rent, and most French services.",
    },
    {
      title: "Transportation",
      steps: "3 steps",
      desc: "Get 50% off Île-de-France transport with the Imagine R student pass or a monthly Navigo card.",
    },
  ] satisfies LandingProcCardText[],
  howSteps: [
    {
      num: "1",
      title: "Set up your profile",
      desc: "Tell us your arrival date, university, and country. We personalise your checklist based on your situation.",
    },
    {
      num: "2",
      title: "Follow your steps",
      desc: "Each process is broken into clear steps with exact documents needed, tips, deadlines, and official links.",
    },
    {
      num: "3",
      title: "Track your progress",
      desc: "Check off documents and steps as you go. Progress is saved automatically — pick up where you left off.",
    },
    {
      num: "4",
      title: "Stay ahead of deadlines",
      desc: "Urgency indicators and deadline tracking make sure nothing slips through the cracks.",
    },
  ] satisfies LandingHowStep[],
  testimonials: [
    {
      quote:
        "I had no idea OFII validation was separate from having a valid visa. LeGuide caught it for me with two months to spare.",
      name: "Mia Andersson",
      role: "Sciences Po, Sweden",
      initials: "MA",
      bg: "bg-forest-50",
      text: "text-forest-600",
    },
    {
      quote:
        "The CAF guide saved me so much stress. I knew exactly what to upload, in what order, and my application was approved in 3 weeks.",
      name: "Yuki Kobayashi",
      role: "Sorbonne, Japan",
      initials: "YK",
      bg: "bg-azure-50",
      text: "text-azure-600",
    },
    {
      quote:
        "The tip about opening a traditional French bank account before applying to CAF was a lifesaver — Revolut alone doesn't work.",
      name: "Lucas Pereira",
      role: "Polytechnique, Brazil",
      initials: "LP",
      bg: "bg-coral-50",
      text: "text-coral-600",
    },
  ] satisfies LandingTestimonial[],
  faqs: [
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
      a: "Yes, completely free. LeGuide is a student-built guide with no fees, no subscription, and no ads.",
    },
    {
      q: "I'm over 28 — does the healthcare guide still apply to me?",
      a: "Students under 28 are automatically enrolled in the régime général étudiant. If you're 28 or older, the process is slightly different — you may need to register via your employer (for PhD students with contracts) or as an independent resident. Check ameli.fr directly for your specific status.",
    },
  ] satisfies LandingFaq[],
} as const;

const FR = {
  processesEyebrow: "5 démarches essentielles",
  processesTitleLine1: "Tout ce dont vous avez besoin,",
  processesTitleLine2: "étape par étape",
  processesSubtitle:
    "Chaque démarche administrative qu'un étudiant en France doit accomplir — décortiquée en étapes claires avec documents, conseils et liens officiels.",
  howEyebrow: "Comment ça marche",
  howTitle: "Quatre étapes vers une",
  howTitleEmphasis: "clarté administrative",
  howSubtitle:
    "Fini les pertes en traduction. Fini les documents oubliés. Fini les délais manqués.",
  testimonialsEyebrow: "Témoignages",
  testimonialsTitleLine1: "De plus de 40 pays,",
  testimonialsTitleLine2: "une expérience commune",
  faqEyebrow: "Questions",
  faqTitle: "Questions fréquentes",
  procCards: [
    {
      title: "Validation du visa",
      steps: "4 étapes",
      desc: "Enregistrez votre visa long séjour auprès de l'OFII dans les 3 mois suivant votre arrivée. Obligatoire pour tous les étudiants hors UE.",
    },
    {
      title: "Logement & CAF",
      steps: "5 étapes",
      desc: "Demandez jusqu'à 200 €/mois d'aide au logement. Constituez votre dossier correctement dès la première fois.",
    },
    {
      title: "Santé",
      steps: "4 étapes",
      desc: "Inscrivez-vous à la CPAM, obtenez votre Carte Vitale et déclarez un médecin traitant pour être remboursé.",
    },
    {
      title: "Banque",
      steps: "3 étapes",
      desc: "Ouvrez un compte bancaire français dès la première semaine. Requis pour la CAF, le loyer et la plupart des démarches.",
    },
    {
      title: "Transport",
      steps: "3 étapes",
      desc: "Bénéficiez de -50 % sur les transports en Île-de-France avec Imagine R ou un forfait Navigo mensuel.",
    },
  ] satisfies LandingProcCardText[],
  howSteps: [
    {
      num: "1",
      title: "Configurez votre profil",
      desc: "Indiquez votre date d'arrivée, votre université et votre pays. Nous personnalisons votre checklist selon votre situation.",
    },
    {
      num: "2",
      title: "Suivez vos étapes",
      desc: "Chaque démarche est découpée en étapes claires avec les documents exacts, conseils, délais et liens officiels.",
    },
    {
      num: "3",
      title: "Suivez votre progression",
      desc: "Cochez documents et étapes au fur et à mesure. Votre avancement est sauvegardé automatiquement.",
    },
    {
      num: "4",
      title: "Anticipez les délais",
      desc: "Les indicateurs d'urgence et le suivi des échéances vous évitent les oublis.",
    },
  ] satisfies LandingHowStep[],
  testimonials: [
    {
      quote:
        "Je ne savais pas que la validation OFII était distincte d'un visa valide. LeGuide m'a alerté avec deux mois d'avance.",
      name: "Mia Andersson",
      role: "Sciences Po, Suède",
      initials: "MA",
      bg: "bg-forest-50",
      text: "text-forest-600",
    },
    {
      quote:
        "Le guide CAF m'a évité beaucoup de stress. Je savais exactement quoi envoyer et dans quel ordre — dossier validé en 3 semaines.",
      name: "Yuki Kobayashi",
      role: "Sorbonne, Japon",
      initials: "YK",
      bg: "bg-azure-50",
      text: "text-azure-600",
    },
    {
      quote:
        "Le conseil d'ouvrir un compte bancaire traditionnel avant la CAF m'a sauvé — Revolut seul ne suffit pas.",
      name: "Lucas Pereira",
      role: "Polytechnique, Brésil",
      initials: "LP",
      bg: "bg-coral-50",
      text: "text-coral-600",
    },
  ] satisfies LandingTestimonial[],
  faqs: [
    {
      q: "Dois-je vraiment valider mon visa si j'ai déjà un visa long séjour dans mon passeport ?",
      a: "Oui — la téléprocédure OFII en ligne est une obligation légale distincte du visa apposé dans votre passeport. Même si votre visa est valide, vous devez valider en ligne dans les 3 mois suivant votre première entrée en France. L'omettre peut compromettre le renouvellement de votre séjour.",
    },
    {
      q: "Puis-je demander la CAF avant d'avoir un compte bancaire français ?",
      a: "Non. La CAF verse l'aide au logement uniquement sur un compte bancaire français (RIB). Vous ne pouvez pas être payé sur un compte étranger ni sur une néobanque comme Revolut enregistrée à l'étranger. Ouvrez d'abord un compte traditionnel — La Banque Postale et LCL sont adaptés aux étudiants — puis faites votre demande CAF.",
    },
    {
      q: "Combien de temps pour obtenir une Carte Vitale ?",
      a: "En général 3 à 6 mois après l'inscription à la CPAM. En attendant, téléchargez une attestation de droits sur ameli.fr — elle prouve votre couverture et est acceptée en pharmacie et chez le médecin.",
    },
    {
      q: "LeGuide est-il gratuit ?",
      a: "Oui, entièrement gratuit. LeGuide est un guide créé par des étudiants, sans frais, sans abonnement et sans publicité.",
    },
    {
      q: "J'ai plus de 28 ans — le guide santé s'applique-t-il encore ?",
      a: "Les étudiants de moins de 28 ans sont automatiquement affiliés au régime général étudiant. Au-delà, la procédure diffère — inscription via l'employeur (doctorants sous contrat) ou en tant que résident indépendant. Consultez ameli.fr pour votre situation.",
    },
  ] satisfies LandingFaq[],
} as const;

const CONTENT = { en: EN, fr: FR } as const;

export function getLandingContent(locale: AppLocale) {
  return CONTENT[locale] ?? CONTENT.fr;
}
