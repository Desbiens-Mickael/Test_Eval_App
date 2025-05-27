// Variantes d'animation pour les conteneurs
export const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// Variantes d'animation pour les éléments individuels
export const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut", // Courbe d'animation (démarrage rapide, fin lente)
    },
  },
};

// Variantes d'animation pour les champs de saisie
export const inputVariants = {
  // État initial du champ
  initial: {
    scale: 1,
    borderColor: "hsl(var(--primary) / 0.5)",
  },
  // État quand le champ a le focus
  focus: {
    scale: 1.02,
    borderColor: "hsl(var(--primary))",
    boxShadow: "0 0 0 3px hsl(var(--primary) / 0.1)",
    transition: { duration: 0.2 },
  },
  // État au survol
  hover: {
    scale: 1.02,
    borderColor: "hsl(var(--primary) / 0.8)",
    transition: { duration: 0.2 },
  },
};
