import { z } from "zod";

export const createExerciceStep1Schema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  exerciceTypeId: z.string().min(1, "Le sujet est requis"),
  exerciceLevelId: z.string().min(1, "Le niveau est requis"),
});

export const createExerciceStep2Schema = z
  .object({
    content: z
      .array(
        z.object({
          // Définit la colonne de l'exercice
          column: z.string().min(1, "La colonne ne peut pas être vide"), // Empêche les colonnes vides
          // Définit les cartes de l'exercice sous forme de tableau de chaînes
          cards: z
            .array(z.string().min(1, "Les cartes doivent contenir des valeurs"))
            .nonempty("Chaque colonne doit avoir au moins une carte"), // Assure que `cards` n'est pas vide
        })
      )
      // Vérifie que le contenu n'est pas vide
      .nonempty("Le contenu de l'exercice ne peut pas etre vide")
      // Effectue une validation supplémentaire pour vérifier la validité du contenu
      .superRefine((content, ctx) => {
        // Vérifie si une colonne ou une carte est invalide
        const hasInvalidColumnOrCards = content.some(
          (item) => item.column === "" || item.cards.some((card) => card === "")
        );
        if (hasInvalidColumnOrCards) {
          // Ajoute un message d'erreur personnalisé si une colonne ou une carte est invalide
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "Le contenu de l'exercice est invalide. Veuillez corriger les colonnes ou les cartes.",
          });
        }
      }),
  })
  .required();

export const exerciseTypes = {
  Carte: createExerciceStep2Schema,
  "Texte à trou": z.object({}),
  "Choix multiple": z.object({}),
  "Vrai ou faux": z.object({}),
};

/**
 * Retourne le schéma approprié en fonction du type d'exercice
 * @param type [string] - le type d'exercice
 * @returns le schéma correspondant au type d'exercice
 */
export const getStep2Shema = (type: string) =>
  exerciseTypes[type as keyof typeof exerciseTypes] || z.object({});

// Définit le type d'entrée pour le formulaire d'exercice
export type createExerciceStep1FormInput = z.infer<
  typeof createExerciceStep1Schema
>;
export type createExerciceStep2FormInput = z.infer<
  typeof createExerciceStep2Schema
>;

export type createExerciceFormInput = createExerciceStep1FormInput &
  createExerciceStep2FormInput;
