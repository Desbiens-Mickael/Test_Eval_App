import { prisma } from "@/lib/db";

/**
 * Exercices et contrôles d'une leçon attribués au groupe de l'élève,
 * avec ce que l'élève en a déjà fait.
 */
export const getLessonActivitiesForStudentData = async (
  lessonId: string,
  groupId: string,
  studentId: string
) => {
  return await prisma.exercice.findMany({
    where: { lessonID: lessonId, groups: { some: { id: groupId } } },
    select: {
      id: true,
      title: true,
      kind: true,
      opensAt: true,
      closesAt: true,
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
      studentExercices: {
        where: { studentId },
        select: { id: true, note: true, coeficient: true, isMissing: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });
};

export type LessonActivityRow = Awaited<
  ReturnType<typeof getLessonActivitiesForStudentData>
>[number];

/**
 * La leçon si elle est attribuée au groupe donné, sinon null.
 * Sert à proposer « Revoir la leçon » depuis un exercice.
 */
export const getLessonInGroupData = async (lessonId: string, groupId: string) => {
  return await prisma.lesson.findFirst({
    where: { id: lessonId, groups: { some: { id: groupId } } },
    select: { id: true, title: true },
  });
};
