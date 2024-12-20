import { z } from "zod";

// Schéma des differents types de base pour la création des leçons
const columnSchema = z.object({
  column: z.string().min(1, "La colonne ne peut pas etre vide"),
  cards: z
    .array(z.string().min(1, "Les cartes doivent contenir des valeurs"))
    .nonempty("Chaque colonne doit avoir au moins une carte"),
});

export const trueOrFalseShema = z.object({
  question: z.string().min(1, "La question ne peut pas etre vide"),
  answer: z.boolean(),
});

// Schéma des differents types pour la création des leçons
export const contentCardSchema = z
  .object({
    content: z
      .array(columnSchema)
      .nonempty("Le contenu de l'exercice est requis")
      // Effectue une validation supplémentaire pour vérifier la validité du contenu
      .superRefine((content, ctx) => {
        // Vérifie si une colonne ou une carte est invalide
        const hasInvalidColumnOrCards = content.some(
          (item) =>
            item.column.trim() === "" ||
            item.cards.length === 0 ||
            item.cards.some((card) => card.trim() === "")
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
    content: z
      .array(z.string().min(1, "Le contenu de l'exercice est requis"))
      .nonempty("Le contenu de l'exercice est requis"),
  })
  .required();

export const contentFillBlankSchema = z
  .object({
    content: z
      .array(z.string().min(1, "Le contenu de l'exercice est requis"))
      .nonempty("Le contenu de l'exercice est requis"),
  })
  .required();

export const contentTrueOrFalseSchema = z
  .object({
    content: z
      .array(trueOrFalseShema)
      .nonempty("Le contenu de l'exercice est requis")
      .superRefine((content, ctx) => {
        // Vérifie si une colonne ou une carte est invalide
        const hasInvalidColumnOrCards = content.some(
          (item) => item.question.trim() === ""
        );
        if (hasInvalidColumnOrCards) {
          // Ajoute un message d'erreur personnalisé si une colonne ou une carte est invalide
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "Le contenu de l'exercice est invalide. Veuillez corriger les questions ou les réesponses.",
          });
        }
      }),
  })
  .required();

export const createExerciceBaseSchema = z
  .object({
    title: z.string().min(1, "Le titre est requis"),
    description: z.string().min(1, "La description est requise"),
    exerciceTypeId: z.string().min(1, "Le sujet est requis"),
    exerciceLevelId: z.string().min(1, "Le niveau est requis"),
  })
  .required();

const contentSchema = z.union([
  contentCardSchema.shape.content,
  contentListSchema.shape.content,
  contentFillBlankSchema.shape.content,
  contentTrueOrFalseSchema.shape.content,
]);

export const globalExerciceSchema = createExerciceBaseSchema.extend({
  content: contentSchema,
});

// Définition des types d'entrée
export type columnInput = z.infer<typeof columnSchema>;
export type trueOrFalseInput = z.infer<typeof trueOrFalseShema>;
export type contentInput = z.infer<typeof contentSchema>;

export type createExerciceFormInput = z.infer<typeof globalExerciceSchema>;
