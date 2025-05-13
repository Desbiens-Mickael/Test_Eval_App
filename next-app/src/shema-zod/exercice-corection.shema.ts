import { z } from "zod";

// Schéma de base pour la correction des exercices
export const exerciceCorectionBaseShema = z.object({
  exerciceId: z.string(),
  note: z.number(),
  coeficient: z.number(),
});

// Schéma de la réponse pour le texte à trou
export const gapFillTextResponseShema = z.record(
  z.union([z.number(), z.string().transform(Number)]),
  z.string().min(1, "La réponse ne peut pas être vide")
);

// Schéma de la réponse pour les vrai ou faux
export const trueOrFalseResponseShema = z.array(
  z.object({
    index: z.number(),
    answer: z.boolean().nullable(),
  })
);

// Schéma de la réponse pour les choix multiples
const multipleChoiceResponseItemShema = z.object({
  questionIndex: z.number(),
  selectedAnswers: z.array(z.number()),
});

export const multipleChoiceResponseShema = z.array(
  multipleChoiceResponseItemShema
);

// Schéma de la réponse pour les cartes
const cardResponseItemShema = z.object({
  column: z.string(),
  cards: z.array(z.object({ id: z.string(), content: z.string() })),
});

export const cardResponseShema = z.array(cardResponseItemShema);

// Schéma de la réponse pour tout les types d'exercices possible
const responseSchema = z.union([
  gapFillTextResponseShema,
  trueOrFalseResponseShema,
  multipleChoiceResponseShema,
  cardResponseShema,
]);

export const globalExerciceCorectionShema = exerciceCorectionBaseShema.extend({
  response: responseSchema,
});

// Types dérivés des schémas
export type gapFillTextResponseType = z.infer<typeof gapFillTextResponseShema>;
export type multipleChoiceResponseItemType = z.infer<
  typeof multipleChoiceResponseItemShema
>;
export type multipleChoiceResponseType = z.infer<
  typeof multipleChoiceResponseShema
>;
export type trueOrFalseResponseType = z.infer<typeof trueOrFalseResponseShema>;
export type cardResponseItemType = z.infer<typeof cardResponseItemShema>;
export type cardResponseType = z.infer<typeof cardResponseShema>;
export type globalExerciceCorectionType = z.infer<
  typeof globalExerciceCorectionShema
>;
