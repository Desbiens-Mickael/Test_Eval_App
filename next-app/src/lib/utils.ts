import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// capitalize une string
export const capitalize = (word: string) => {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
};

// genere les initials d'un utilisateur
export const generateUserInitials = (fullName: string) => {
  return fullName
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
};

// convertit une string en slug
export const stringToSlug = (str: string) => {
  return str
    .toLowerCase()
    .normalize("NFD") // Décompose les caractères accentués en caractères de base + diacritiques
    .replace(/[\u0300-\u036f]/g, "") // Supprime les diacritiques
    .replace(/[^a-z0-9\s-]/g, "") // Supprime les caractères non-alphanumériques sauf espaces et tirets
    .replace(/\s+/g, "-") // Remplace les espaces par des tirets
    .replace(/-+/g, "-") // Remplace les tirets multiples par un seul
    .trim(); // Supprime les tirets en début/fin
};

// genere un mot de passe temporaire
export const generateTemporaryPassword = (length = 8) => {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*!";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};

// calcule la note d'un exercice
export const calculateNote = ({
  level,
  maxCorrectAnswers,
  correctAnswers,
}: {
  level: string;
  maxCorrectAnswers: number;
  correctAnswers: number;
}) => {
  const coefMap: Record<string, number> = {
    Facile: 5,
    Difficile: 10,
    "Très difficile": 20,
  };

  const coeficient = coefMap[level] ?? 5;

  if (maxCorrectAnswers === 0) {
    return {
      note: 0,
      coeficient,
    };
  }

  const result = (correctAnswers / maxCorrectAnswers) * coeficient;

  return {
    note: Number(result.toFixed(2)),
    coeficient,
  };
};

// formate une date au format français jj/mm/yyyy
export const formatDate = (date: Date | string): string => {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
};
