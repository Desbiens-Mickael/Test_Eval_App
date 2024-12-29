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

export const multipleChoiceShema = z.object({
  question: z.string().min(1, "La question ne peut pas etre vide"),
  answers: z
    .array(
      z.object({
        answer: z.string().min(1, "La réponse ne peut pas etre vide"),
        isCorrect: z.boolean(),
      })
    )
    .nonempty("Chaque réponse doit avoir une valeur"),
});

export const contentGapFillSchema = z
  .object({
    text: z
      .array(z.string().min(1, "Le contenu de l'exercice est requis"))
      .nonempty("Le contenu de l'exercice est requis"),
    answers: z
      .array(
        z.object({
          answer: z.string().min(1, "La réponse ne peut pas etre vide"),
          placeholder: z.string().min(1, "Le contenu de l'exercice est requis"),
          position: z.number().min(0, "La position doit être positive"),
        })
      )
      .nonempty("Le contenu de l'exercice est requis"),
  })
  .required();

// Schéma des differents types pour la création des leçons
export const contentCardSchema = z
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
  });

export const contentMultipleChoiceShema = z
  .array(multipleChoiceShema)
  .nonempty("Le contenu de l'exercice est requis")
  .superRefine((content, ctx) => {
    const hasInvalidColumnOrCards = content.some(
      (item) =>
        item.question.trim() === "" ||
        item.answers.length === 0 ||
        item.answers.some((answer) => answer.answer.trim() === "")
    );
    if (hasInvalidColumnOrCards) {
      // Ajoute un message d'erreur personnalisé si une colonne ou une carte est invalide
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Le contenu de l'exercice est invalide. Veuillez corriger les questions ou les réponses.",
      });
    }
  });

export const contentTrueOrFalseSchema = z
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
          "Le contenu de l'exercice est invalide. Veuillez corriger les questions ou les réponses.",
      });
    }
  });

export const createExerciceBaseSchema = z
  .object({
    title: z.string().min(1, "Le titre est requis"),
    description: z.string().min(1, "La description est requise"),
    exerciceTypeId: z.string().min(1, "Le sujet est requis"),
    exerciceLevelId: z.string().min(1, "Le niveau est requis"),
  })
  .required();

const contentSchema = z.union([
  contentCardSchema,
  contentMultipleChoiceShema,
  contentGapFillSchema,
  contentTrueOrFalseSchema,
]);

export const globalExerciceSchema = createExerciceBaseSchema.extend({
  content: contentSchema,
});

// Définition des types d'entrée
export type columnInput = z.infer<typeof columnSchema>;
export type trueOrFalseInput = z.infer<typeof trueOrFalseShema>;
export type multipleChoiceInput = z.infer<typeof multipleChoiceShema>;
export type contentGapFillInput = z.infer<typeof contentGapFillSchema>;
export type contentInput = z.infer<typeof contentSchema>;
export type createExerciceFormInput = z.infer<typeof globalExerciceSchema>;
