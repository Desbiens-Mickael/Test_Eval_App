import { z } from "zod";

export const TEACHER_COMMENT_MAX_LENGTH = 1000;

/**
 * Relecture d'une copie par le professeur : note ajustée et commentaire.
 * La borne haute de la note (le coefficient de la copie) est vérifiée
 * par `buildExerciceReviewSchema`, qui la connaît.
 */
export const exerciceReviewShema = z.object({
  note: z.coerce
    .number({ invalid_type_error: "La note doit être un nombre" })
    .min(0, "La note ne peut pas être négative"),
  comment: z
    .string()
    .trim()
    .max(
      TEACHER_COMMENT_MAX_LENGTH,
      `Le commentaire ne peut pas dépasser ${TEACHER_COMMENT_MAX_LENGTH} caractères`
    ),
});

export const buildExerciceReviewSchema = (coeficient: number) =>
  exerciceReviewShema.refine((data) => data.note <= coeficient, {
    message: `La note ne peut pas dépasser ${coeficient}`,
    path: ["note"],
  });

export type ExerciceReviewInput = z.infer<typeof exerciceReviewShema>;

export const QUESTION_COMMENT_MAX_LENGTH = 500;

/**
 * Correction d'une copie « Réponse libre » : des points et un commentaire
 * facultatif par question, plus un commentaire général.
 * `maxPoints` donne le barème de chaque question, dans l'ordre.
 */
export const buildFreeResponseReviewSchema = (maxPoints: number[]) =>
  z.object({
    reviews: z
      .array(
        z.object({
          // Un champ laissé vide n'est pas un 0 : la question doit être notée
          points: z.preprocess(
            (value) =>
              value === "" || value === null || value === undefined
                ? undefined
                : Number(value),
            z
              .number({
                required_error: "Notez cette question",
                invalid_type_error: "Les points doivent être un nombre",
              })
              .min(0, "Les points ne peuvent pas être négatifs")
              .refine((p) => Number.isInteger(p * 4), "Les points vont par quart de point")
          ),
          comment: z
            .string()
            .trim()
            .max(
              QUESTION_COMMENT_MAX_LENGTH,
              `Le commentaire ne peut pas dépasser ${QUESTION_COMMENT_MAX_LENGTH} caractères`
            ),
        })
      )
      .length(maxPoints.length, "Chaque question doit être notée")
      .superRefine((reviews, ctx) => {
        reviews.forEach((review, index) => {
          if (review.points > maxPoints[index]) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: [index, "points"],
              message: `Cette question est notée sur ${maxPoints[index]}`,
            });
          }
        });
      }),
    comment: exerciceReviewShema.shape.comment,
  });

export type FreeResponseReviewInput = z.infer<ReturnType<typeof buildFreeResponseReviewSchema>>;

/** Points et commentaire enregistrés pour une question de réponse libre */
export type QuestionReview = { points: number; comment: string | null };

/** Note de la copie : les points obtenus ramenés sur le coefficient */
export const freeResponseNote = (
  reviews: { points: number }[],
  maxPoints: number[],
  coeficient: number
) => {
  const total = maxPoints.reduce((sum, p) => sum + p, 0);
  if (total === 0) return 0;
  const obtained = reviews.reduce((sum, r) => sum + r.points, 0);
  return roundReviewNote((obtained / total) * coeficient);
};

/** Note arrondie au centième, comme les notes automatiques */
export const roundReviewNote = (note: number) => Math.round(note * 100) / 100;
