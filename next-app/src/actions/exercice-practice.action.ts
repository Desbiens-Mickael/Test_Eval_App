"use server";

import { getExerciceByIdData } from "@/data/exercice/exercice-data";
import {
  createPracticeAttemptData,
  getPracticeExercisesForStudentData,
  getPracticeStateData,
  revealPracticeCorrectionData,
} from "@/data/exercice/practice-data";
import { getGroupByStudentIdData } from "@/data/group.data";
import { currentUser } from "@/lib/auth";
import { formatExercice } from "@/lib/exercice-format";
import { gradeExercice } from "@/lib/exercice-grading";
import { summarizePractice } from "@/lib/practice";
import {
  globalExerciceCorectionShema,
  globalExerciceCorectionType,
} from "@/shema-zod/exercice-corection.shema";
import { Prisma } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";

/**
 * Exercices d'entraînement : non notés, essais illimités.
 *
 * Après chaque essai, l'élève ne reçoit que sa note (jamais la correction).
 * Quand il choisit d'afficher la correction, les essais sont terminés.
 * Chaque essai est enregistré pour le suivi du professeur, sans compter
 * dans la moyenne.
 */

export type PracticeAttemptResult = {
  note: number;
  coeficient: number;
  attempt: number;
  bestPercent: number;
};

export type PracticeCorrectionView = {
  type: string;
  /** Contenu avec les solutions */
  content: JsonValue;
  /** Réponse du dernier essai */
  response: JsonValue;
  note: number;
  coeficient: number;
};

const UNAUTHORIZED = "Action non autorisée !";
const NOT_FOUND = "Entraînement non trouvé";
const CORRECTION_SEEN =
  "Tu as déjà vu la correction de cet entraînement : tu ne peux plus faire d'essai.";

/** Élève connecté et exercice d'entraînement attribué à son groupe */
const loadPractice = async (exerciceId: string) => {
  const student = await currentUser();
  if (!student?.id || student.role !== "STUDENT") {
    return { error: UNAUTHORIZED } as const;
  }

  const [exercice, group] = await Promise.all([
    getExerciceByIdData(exerciceId),
    getGroupByStudentIdData(student.id),
  ]);
  if (
    !exercice ||
    exercice.kind !== "PRACTICE" ||
    !group ||
    !exercice.groups?.some((g) => g.id === group.id)
  ) {
    return { error: NOT_FOUND } as const;
  }

  return { studentId: student.id, exercice } as const;
};

const correctionOf = (
  exercice: { type: { name: string }; content: JsonValue },
  last: { note: number; coeficient: number; response: JsonValue }
): PracticeCorrectionView => ({
  type: exercice.type.name,
  content: exercice.content,
  response: last.response,
  note: last.note,
  coeficient: last.coeficient,
});

/**
 * Un entraînement pour l'élève : l'exercice (sans les solutions) et ses essais.
 * La correction n'est renvoyée que si l'élève a déjà choisi de la voir.
 */
export const getPracticeAction = async (exerciceId: string) => {
  try {
    const loaded = await loadPractice(exerciceId);
    if ("error" in loaded) return { error: loaded.error, data: null };

    const { exercice, studentId } = loaded;
    const state = await getPracticeStateData(studentId, exerciceId);
    const summary = summarizePractice(state.attempts, state.correctionSeenAt);
    const last = state.attempts[state.attempts.length - 1];

    return {
      success: "Entraînement trouvé",
      data: {
        exercice: formatExercice(exercice, { withSolutions: false }),
        summary,
        attempts: state.attempts.map((a) => ({
          note: a.note,
          coeficient: a.coeficient,
          createdAt: a.createdAt.toISOString(),
        })),
        correction:
          state.correctionSeenAt && last ? correctionOf(exercice, last) : null,
      },
    };
  } catch (error) {
    console.error("Error fetching practice:", error);
    return {
      error: "Une erreur est survenue lors de la recherche de l'entraînement",
      data: null,
    };
  }
};

/** Corrige et enregistre un essai. Renvoie la note seule, jamais la correction. */
export const submitPracticeAttemptAction = async (data: globalExerciceCorectionType) => {
  const validated = globalExerciceCorectionShema.safeParse(data);
  if (!validated.success) {
    return { error: "Données non valide !" };
  }

  try {
    const loaded = await loadPractice(validated.data.exerciceId);
    if ("error" in loaded) return { error: loaded.error };

    const { exercice, studentId } = loaded;
    let result: { note: number; coeficient: number };
    try {
      result = gradeExercice({
        type: exercice.type.name,
        level: exercice.level.label,
        content: exercice.content,
        response: validated.data.response,
      });
    } catch {
      return { error: "Données non valide !" };
    }

    const created = await createPracticeAttemptData({
      studentId,
      exerciceId: exercice.id,
      response: validated.data.response as Prisma.InputJsonValue,
      ...result,
    });
    if (!created) return { error: CORRECTION_SEEN };

    const state = await getPracticeStateData(studentId, exercice.id);
    const summary = summarizePractice(state.attempts, state.correctionSeenAt);
    const practice: PracticeAttemptResult = {
      ...result,
      attempt: summary.attempts,
      bestPercent: summary.bestPercent ?? 0,
    };

    // `data: null` : pas de copie notée, donc pas de redirection vers une correction
    return { success: "Essai enregistré", data: null, practice };
  } catch (error) {
    console.error("Error saving practice attempt:", error);
    return {
      error: "Une erreur est survenue lors de l'enregistrement de l'essai",
    };
  }
};

/**
 * Affiche la correction du dernier essai.
 * Définitif : l'élève ne pourra plus faire d'essai sur cet entraînement.
 */
export const revealPracticeCorrectionAction = async (exerciceId: string) => {
  try {
    const loaded = await loadPractice(exerciceId);
    if ("error" in loaded) return { error: loaded.error };

    const { exercice, studentId } = loaded;
    const state = await getPracticeStateData(studentId, exerciceId);
    const last = state.attempts[state.attempts.length - 1];
    if (!last) {
      return { error: "Fais au moins un essai avant de voir la correction." };
    }

    await revealPracticeCorrectionData(studentId, exerciceId);
    return { success: "Correction affichée", correction: correctionOf(exercice, last) };
  } catch (error) {
    console.error("Error revealing practice correction:", error);
    return {
      error: "Une erreur est survenue lors de l'affichage de la correction",
    };
  }
};

/** Entraînements attribués au groupe de l'élève, avec son avancement */
export const getPracticeListAction = async (subject?: string) => {
  const student = await currentUser();
  if (!student?.id || student.role !== "STUDENT") {
    return { error: UNAUTHORIZED, data: null };
  }

  try {
    const group = await getGroupByStudentIdData(student.id);
    if (!group) return { success: "Aucun groupe", data: [] };

    const exercises = await getPracticeExercisesForStudentData(group.id, student.id, subject);
    return {
      success: "Entraînements trouvés",
      data: exercises.map((e) => ({
        id: e.id,
        title: e.title,
        description: e.description,
        subject: e.lesson.LessonSubject.label,
        subjectColor: e.lesson.LessonSubject.color,
        level: e.level.label,
        levelColor: e.level.color,
        type: e.type.name,
        summary: summarizePractice(
          e.practiceAttempts,
          e.practiceCorrections[0]?.revealedAt ?? null
        ),
      })),
    };
  } catch (error) {
    console.error("Error fetching practice list:", error);
    return {
      error: "Une erreur est survenue lors de la recherche des entraînements",
      data: null,
    };
  }
};
