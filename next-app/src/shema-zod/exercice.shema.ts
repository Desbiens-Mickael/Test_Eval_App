import { z } from "zod";

export const createExerciceStep1Schema = z
  .object({
    title: z.string().min(1, "Le titre est requis"),
    description: z.string().min(1, "La description est requise"),
    exerciceTypeId: z.string().min(1, "Le sujet est requis"),
    exerciceLevelId: z.string().min(1, "Le niveau est requis"),
  })
  .required();

const columnSchema = z.object({
  column: z.string().min(1, "La colonne ne peut pas etre vide"),
  cards: z
    .array(z.string().min(1, "Les cartes doivent contenir des valeurs"))
    .nonempty("Chaque colonne doit avoir au moins une carte"),
});

export const contentCardSchema = z
  .object({
    content: z
      .array(columnSchema)
      .nonempty("Le contenu de l'exercice est requis")
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

export const contentListSchema = z
  .object({
    content: z.array(z.string().min(1, "Le contenu de l'exercice est requis")),
  })
  .required();

export const contentFillBlankSchema = z
  .object({
    content: z.array(z.string().min(1, "Le contenu de l'exercice est requis")),
  })
  .required();

export const contentTrueOrFalseSchema = z
  .object({
    content: z.array(z.string().min(1, "Le contenu de l'exercice est requis")),
  })
  .required();

export const exerciseTypes = {
  Carte: contentCardSchema,
  "Texte à trou": contentFillBlankSchema,
  "Choix multiple": contentListSchema,
  "Vrai ou faux": contentTrueOrFalseSchema,
};

/**
 * Retourne le schéma approprié en fonction du type d'exercice
 * @param type [string] - le type d'exercice
 * @returns le schéma correspondant au type d'exercice
 */
export const getStep2Shema = (type: string) =>
  exerciseTypes[type as keyof typeof exerciseTypes] || z.object({});

// Définition des types d'entrée
export type columnInput = z.infer<typeof columnSchema>;

export type createExerciceStep1FormInput = z.infer<
  typeof createExerciceStep1Schema
>;

export type createExerciceStep2FormInput = z.infer<
  | typeof contentCardSchema
  | typeof contentListSchema
  | typeof contentFillBlankSchema
  | typeof contentTrueOrFalseSchema
>;

export type createExerciceFormInput = createExerciceStep1FormInput &
  createExerciceStep2FormInput;
