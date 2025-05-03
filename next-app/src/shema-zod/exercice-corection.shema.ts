import { z } from "zod";

export const exerciceCorectionBaseShema = z.object({
  exerciceId: z.string(),
  note: z.number(),
  coeficient: z.number(),
});

export const gapFillTextResponseShema = z.record(
  z.union([z.number(), z.string().transform(Number)]),
  z.string().min(1, "La réponse ne peut pas être vide")
);

export const cardResponseShema = z.object({
  column: z.number(),
  card: z.number(),
});

export const multipleChoiceResponseShema = z.object({
  question: z.number(),
  answer: z.number(),
});

export const trueOrFalseResponseShema = z.object({
  question: z.number(),
  answer: z.boolean(),
});

const responseSchema = z.union([
  gapFillTextResponseShema,
  cardResponseShema,
  multipleChoiceResponseShema,
  trueOrFalseResponseShema,
]);

export const globalExerciceCorectionShema = exerciceCorectionBaseShema.extend({
  response: responseSchema,
});

export type gapFillTextResponseType = z.infer<typeof gapFillTextResponseShema>;
export type cardResponseType = z.infer<typeof cardResponseShema>;
export type multipleChoiceResponseType = z.infer<
  typeof multipleChoiceResponseShema
>;
export type trueOrFalseResponseType = z.infer<typeof trueOrFalseResponseShema>;
export type globalExerciceCorectionType = z.infer<
  typeof globalExerciceCorectionShema
>;
