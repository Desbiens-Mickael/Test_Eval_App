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

/** Note arrondie au centième, comme les notes automatiques */
export const roundReviewNote = (note: number) => Math.round(note * 100) / 100;
