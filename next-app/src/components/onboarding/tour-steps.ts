export type TourRole = "ADMIN" | "STUDENT" | "PARENT";

export type TourStep = {
  /** Valeur de l'attribut data-tour visé ; sans cible, la bulle est centrée */
  target?: string;
  title: string;
  text: string;
};

const HELP_STEP_TEXT = {
  vous: "Ce bouton relance la visite quand vous voulez. Bonne découverte !",
  tu: "Ce bouton relance la visite quand tu veux. Bonne découverte !",
};

const adminSteps: TourStep[] = [
  {
    title: "Bienvenue sur EduCraft 👋",
    text: "Un tour rapide des principaux espaces, en moins d'une minute. Vous pouvez le passer à tout moment.",
  },
  {
    target: "nav-dashboard",
    title: "Tableau de bord",
    text: "Votre point de départ : la liste « Premiers pas » vous guide pour mettre la classe en place, puis les résultats, les copies à corriger et les élèves à aider apparaissent ici.",
  },
  {
    target: "nav-eleves",
    title: "Élèves",
    text: "Créez les comptes un par un ou importez une liste (CSV, Excel ou copier-coller). Avec l'e-mail d'un parent, son accès est créé et lui est envoyé.",
  },
  {
    target: "nav-groupes",
    title: "Groupes",
    text: "Un groupe par classe ou par niveau. C'est dans la fiche d'un groupe que vous attribuez leçons, exercices et contrôles à ses élèves.",
  },
  {
    target: "nav-lecons",
    title: "Leçons",
    text: "Vos cours, rangés par matière. Depuis le menu « … » d'une leçon, ajoutez-lui un exercice ou un contrôle.",
  },
  {
    target: "nav-exercices",
    title: "Exercices",
    text: "Pour s'entraîner : ils ne sont pas notés et les élèves peuvent réessayer autant qu'ils veulent.",
  },
  {
    target: "nav-controles",
    title: "Contrôles",
    text: "Pour évaluer : ils sont notés et peuvent avoir une date d'ouverture et de clôture.",
  },
  {
    target: "header-notifications",
    title: "Notifications",
    text: "Vous êtes prévenu dès qu'un élève rend une copie.",
  },
  { target: "header-help", title: "Besoin d'aide ?", text: HELP_STEP_TEXT.vous },
];

const studentSteps: TourStep[] = [
  {
    title: "Bienvenue sur EduCraft 👋",
    text: "On fait un petit tour pour que tu saches où tout se trouve. Tu peux le passer quand tu veux.",
  },
  {
    target: "nav-dashboard",
    title: "Tableau de bord",
    text: "Ta progression par matière, tes dernières notes et tes badges.",
  },
  {
    target: "nav-lecons",
    title: "Mes leçons",
    text: "Les leçons données par ton professeur, à relire quand tu veux.",
  },
  {
    target: "nav-entrainements",
    title: "Exercices",
    text: "Pour t'entraîner : ils ne sont pas notés et tu peux recommencer autant de fois que tu veux.",
  },
  {
    target: "nav-controles-a-faire",
    title: "Contrôles à faire",
    text: "Les contrôles notés que ton professeur t'a donnés. Fais attention à la date limite !",
  },
  {
    target: "nav-controles-faits",
    title: "Contrôles faits",
    text: "Tes notes et les corrections de tes contrôles.",
  },
  {
    target: "header-notifications",
    title: "Notifications",
    text: "Ici, tu es prévenu d'un nouveau contrôle ou d'une nouvelle note.",
  },
  { target: "header-help", title: "Besoin d'aide ?", text: HELP_STEP_TEXT.tu },
];

const parentSteps: TourStep[] = [
  {
    title: "Bienvenue sur EduCraft 👋",
    text: "Cet espace vous permet de suivre le travail de votre enfant, en lecture seule. Voici où trouver l'essentiel.",
  },
  {
    target: "nav-enfants",
    title: "Mes enfants",
    text: "Choisissez un enfant pour voir ses notes, ses contrôles à venir et ses copies corrigées.",
  },
  {
    target: "nav-parametres",
    title: "Paramètres",
    text: "Vous recevez un e-mail à chaque nouvelle note : vous pouvez le désactiver ici.",
  },
  { target: "header-help", title: "Besoin d'aide ?", text: HELP_STEP_TEXT.vous },
];

export const TOUR_STEPS: Record<TourRole, TourStep[]> = {
  ADMIN: adminSteps,
  STUDENT: studentSteps,
  PARENT: parentSteps,
};

export const isTourRole = (role: unknown): role is TourRole =>
  role === "ADMIN" || role === "STUDENT" || role === "PARENT";
