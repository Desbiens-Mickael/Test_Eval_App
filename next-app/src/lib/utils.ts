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

// melange un array de manière aleatoire
export const shuffleArray = <T>(array: T[]): T[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};
