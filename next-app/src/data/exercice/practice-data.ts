import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

/** Essais et correction d'un élève sur un exercice d'entraînement */
export const getPracticeStateData = async (studentId: string, exerciceId: string) => {
  const [attempts, correction] = await Promise.all([
    prisma.practiceAttempt.findMany({
      where: { studentId, exerciceId },
      select: { id: true, note: true, coeficient: true, response: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.practiceCorrection.findUnique({
      where: { studentId_exerciceId: { studentId, exerciceId } },
      select: { revealedAt: true },
    }),
  ]);
  return { attempts, correctionSeenAt: correction?.revealedAt ?? null };
};

/**
 * Enregistre un essai, sauf si la correction a déjà été vue.
 * La vérification et l'insertion sont faites dans une même transaction
 * pour qu'un essai envoyé en même temps que l'affichage de la correction
 * ne passe pas.
 */
export const createPracticeAttemptData = async (data: {
  studentId: string;
  exerciceId: string;
  response: Prisma.InputJsonValue;
  note: number;
  coeficient: number;
}) => {
  return await prisma.$transaction(
    async (tx) => {
      const correction = await tx.practiceCorrection.findUnique({
        where: {
          studentId_exerciceId: { studentId: data.studentId, exerciceId: data.exerciceId },
        },
        select: { id: true },
      });
      if (correction) return null;
      return await tx.practiceAttempt.create({ data });
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
  );
};

/** Marque la correction comme vue (sans effet si elle l'était déjà) */
export const revealPracticeCorrectionData = async (studentId: string, exerciceId: string) => {
  return await prisma.practiceCorrection.upsert({
    where: { studentId_exerciceId: { studentId, exerciceId } },
    create: { studentId, exerciceId },
    update: {},
    select: { revealedAt: true },
  });
};

/** Exercices d'entraînement attribués à un groupe, avec les essais de l'élève */
export const getPracticeExercisesForStudentData = async (
  groupId: string,
  studentId: string,
  subject?: string
) => {
  return await prisma.exercice.findMany({
    where: {
      kind: "PRACTICE",
      groups: { some: { id: groupId } },
      lesson: { LessonSubject: { label: subject } },
    },
    select: {
      id: true,
      title: true,
      description: true,
      lesson: { select: { LessonSubject: { select: { label: true, color: true } } } },
      level: { select: { label: true, color: true } },
      type: { select: { name: true } },
      practiceAttempts: {
        where: { studentId },
        select: { note: true, coeficient: true, createdAt: true },
      },
      practiceCorrections: {
        where: { studentId },
        select: { revealedAt: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

/** Type d'un exercice (contrôle ou entraînement), sans contrôle d'accès */
export const getExerciceKindData = async (exerciceId: string) => {
  const exercice = await prisma.exercice.findUnique({
    where: { id: exerciceId },
    select: { kind: true },
  });
  return exercice?.kind ?? null;
};

/** Nombre de copies et d'essais déjà rendus sur un exercice */
export const countExerciceSubmissionsData = async (exerciceId: string) => {
  const [results, attempts] = await Promise.all([
    prisma.studentExercice.count({ where: { exerciceId } }),
    prisma.practiceAttempt.count({ where: { exerciceId } }),
  ]);
  return results + attempts;
};

/**
 * Entraînements attribués au groupe d'un élève, avec tous ses essais,
 * pour le suivi du professeur. Null si l'élève n'est pas un élève de ce professeur.
 */
export const getStudentPracticeTrackingData = async (studentId: string, teacherId: string) => {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: { professorId: true, groupId: true },
  });
  if (!student || student.professorId !== teacherId) return null;
  if (!student.groupId) return [];

  return await prisma.exercice.findMany({
    where: { kind: "PRACTICE", groups: { some: { id: student.groupId } } },
    select: {
      id: true,
      title: true,
      lesson: { select: { LessonSubject: { select: { label: true, color: true } } } },
      type: { select: { name: true } },
      practiceAttempts: {
        where: { studentId },
        select: { note: true, coeficient: true, createdAt: true },
      },
      practiceCorrections: {
        where: { studentId },
        select: { revealedAt: true },
      },
    },
  });
};
