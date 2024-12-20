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
}