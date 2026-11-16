import { randomInt } from "crypto";

/**
 * Mots de passe des élèves : lisibles et faciles à recopier pour un enfant
 * (pas de caractères ambigus comme l/1 ou O/0), tirés avec un générateur
 * cryptographique. Format : Animal-Qualité-123, par ex. « Tigre-Rapide-482 ».
 * 40 × 30 × 900 ≈ 1 million de combinaisons, complétées par la limitation
 * des tentatives de connexion.
 */
const ANIMALS = [
  "Abeille", "Aigle", "Baleine", "Castor", "Chat", "Cheval", "Chouette",
  "Cygne", "Dauphin", "Ecureuil", "Elephant", "Faucon", "Girafe", "Gorille",
  "Hibou", "Herisson", "Jaguar", "Kangourou", "Koala", "Lapin", "Lezard",
  "Lion", "Loup", "Loutre", "Lynx", "Manchot", "Marmotte", "Mouette",
  "Panda", "Panthere", "Papillon", "Perroquet", "Phoque", "Pingouin",
  "Renard", "Requin", "Tigre", "Tortue", "Toucan", "Zebre",
];

const QUALITIES = [
  "Agile", "Brave", "Calme", "Curieux", "Doux", "Drole", "Fier", "Fort",
  "Fute", "Gentil", "Geant", "Joyeux", "Leger", "Libre", "Magique", "Malin",
  "Patient", "Poli", "Rapide", "Rieur", "Ruse", "Sage", "Souple", "Subtil",
  "Tenace", "Timide", "Vaillant", "Vif", "Zen", "Habile",
];

export const generateStudentPassword = () => {
  const animal = ANIMALS[randomInt(ANIMALS.length)];
  const quality = QUALITIES[randomInt(QUALITIES.length)];
  const number = randomInt(100, 1000);
  return `${animal}-${quality}-${number}`;
};

export const STUDENT_PASSWORD_PATTERN = /^[A-Za-z]+-[A-Za-z]+-\d{3}$/;
