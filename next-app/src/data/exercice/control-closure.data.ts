import { prisma } from "@/lib/db";
import { publishNotification } from "@/lib/notification-hub";
import { calculateNote } from "@/lib/utils";
import { NotificationType } from "@prisma/client";
import { notifyParentsOfResultsSafe } from "@/data/parent-notify.data";

/**
 * Clôture des contrôles dont la date de clôture est passée.
 *
 * Il n'y a pas de tâche planifiée : la clôture est traitée au moment où une
 * page qui en dépend est consultée (liste des contrôles, notes, notifications…).
 * Chaque contrôle n'est traité qu'une fois grâce à `closedAt`, posé de façon
 * atomique avant le reste du traitement.
 *
 * Pour chaque contrôle clos :
 * - chaque élève (actif) d'un groupe attribué qui n'a pas rendu sa copie
 *   reçoit une copie « non rendue » notée 0 ;
 * - les élèves de ces groupes sont notifiés que les notes sont disponibles.
 *
 * @returns le nombre de contrôles clôturés pendant cet appel
 */
export const closeExpiredControlsData = async (now: Date = new Date()) => {
  const expired = await prisma.exercice.findMany({
    where: { kind: "CONTROL", closedAt: null, closesAt: { lte: now } },
    select: { id: true },
  });

  let closed = 0;
  for (const { id } of expired) {
    if (await closeControlData(id, now)) closed++;
  }
  return closed;
};

/** Clôture un contrôle. Renvoie false s'il était déjà clos (ou en cours). */
const closeControlData = async (exerciceId: string, now: Date) => {
  const result = await closeControlTransaction(exerciceId, now);
  // Après la validation de la transaction : les élèves connectés sont
  // prévenus que leurs résultats sont disponibles
  if (result.notifiedStudentIds.length) {
    publishNotification(result.notifiedStudentIds.map((id) => ({ kind: "student", id })));
  }
  // Les parents sont prévenus par e-mail des notes désormais visibles
  await notifyParentsOfResultsSafe(
    result.gradedStudentIds.map((studentId) => ({ studentId, title: result.title }))
  );
  return result.closed;
};

const closeControlTransaction = async (
  exerciceId: string,
  now: Date
): Promise<{
  closed: boolean;
  notifiedStudentIds: string[];
  /** Élèves dont la note est désormais visible (sans les copies à corriger) */
  gradedStudentIds: string[];
  title: string;
}> => {
  return prisma.$transaction(async (tx) => {
    // Réservation : un seul appel concurrent passe cette mise à jour
    const claimed = await tx.exercice.updateMany({
      where: { id: exerciceId, closedAt: null },
      data: { closedAt: now },
    });
    if (claimed.count === 0)
      return { closed: false, notifiedStudentIds: [], gradedStudentIds: [], title: "" };

    const exercice = await tx.exercice.findUniqueOrThrow({
      where: { id: exerciceId },
      select: {
        id: true,
        title: true,
        authorId: true,
        level: { select: { label: true } },
        lesson: { select: { LessonSubject: { select: { label: true } } } },
        groups: { select: { id: true } },
      },
    });

    const groupIds = exercice.groups.map((g) => g.id);
    const students = groupIds.length
      ? await tx.student.findMany({
          where: { groupId: { in: groupIds }, disabledAt: null },
          select: { id: true },
        })
      : [];
    if (students.length === 0)
      return { closed: true, notifiedStudentIds: [], gradedStudentIds: [], title: exercice.title };

    const submitted = await tx.studentExercice.findMany({
      where: { exerciceId, studentId: { in: students.map((s) => s.id) } },
      select: { studentId: true, pendingReview: true },
    });
    // Réponse libre pas encore corrigée : pas de note à annoncer
    const pendingIds = new Set(submitted.filter((s) => s.pendingReview).map((s) => s.studentId));
    const submittedIds = new Set(submitted.map((s) => s.studentId));
    const missing = students.filter((s) => !submittedIds.has(s.id));

    if (missing.length) {
      const { coeficient } = calculateNote({
        level: exercice.level.label,
        correctAnswers: 0,
        maxCorrectAnswers: 0,
      });
      await tx.studentExercice.createMany({
        data: missing.map((s) => ({
          studentId: s.id,
          exerciceId,
          subject: exercice.lesson.LessonSubject.label,
          response: [],
          note: 0,
          autoNote: 0,
          coeficient,
          isMissing: true,
        })),
        skipDuplicates: true,
      });
    }

    const notification = await tx.notification.create({
      data: {
        type: NotificationType.RESULTS,
        message: exercice.title,
        exerciseId: exerciceId,
        createdByTeacherId: exercice.authorId,
      },
    });
    await tx.studentNotification.createMany({
      data: students.map((s) => ({
        studentId: s.id,
        notificationId: notification.id,
      })),
      skipDuplicates: true,
    });

    return {
      closed: true,
      notifiedStudentIds: students.map((s) => s.id),
      gradedStudentIds: students.map((s) => s.id).filter((id) => !pendingIds.has(id)),
      title: exercice.title,
    };
  });
};

/**
 * Comme `closeExpiredControlsData`, mais une erreur n'empêche jamais la page
 * appelante de s'afficher (elle sera retentée au prochain appel).
 */
export const closeExpiredControlsSafeData = async () => {
  try {
    await closeExpiredControlsData();
  } catch (error) {
    console.error("Error closing expired controls:", error);
  }
};
