import { prisma } from "@/lib/db";

/**
 * Données brutes du tableau de bord d'un professeur :
 * ses groupes, ses élèves et toutes les copies rendues par ses élèves.
 */
export const getTeacherDashboardRawData = async (teacherId: string) => {
  const [groups, students, results, toReview] = await Promise.all([
    prisma.group.findMany({
      where: { authorId: teacherId },
      select: {
        id: true,
        name: true,
        students: { select: { id: true } },
        // Seuls les contrôles comptent (les entraînements ne sont pas notés)
        exercices: { where: { kind: "CONTROL" }, select: { id: true } },
      },
      orderBy: { name: "asc" },
    }),
    prisma.student.findMany({
      where: { professorId: teacherId },
      select: { id: true, name: true, image: true, groupId: true },
    }),
    prisma.studentExercice.findMany({
      // Une réponse libre pas encore corrigée n'a pas de note
      where: { student: { professorId: teacherId }, pendingReview: false },
      select: {
        id: true,
        studentId: true,
        exerciceId: true,
        subject: true,
        note: true,
        coeficient: true,
        createdAt: true,
        exercice: { select: { title: true } },
      },
      orderBy: { createdAt: "asc" },
    }),
    // Réponses libres rendues, en attente de la note du professeur
    prisma.studentExercice.findMany({
      where: { student: { professorId: teacherId }, pendingReview: true },
      select: {
        id: true,
        studentId: true,
        exerciceId: true,
        createdAt: true,
        exercice: { select: { title: true } },
      },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  return {
    groups: groups.map((g) => ({
      id: g.id,
      name: g.name,
      studentIds: g.students.map((s) => s.id),
      exerciceIds: g.exercices.map((e) => e.id),
    })),
    students,
    results: results.map((r) => ({
      id: r.id,
      studentId: r.studentId,
      exerciceId: r.exerciceId,
      exerciceTitle: r.exercice?.title ?? null,
      subject: r.subject,
      note: r.note,
      coeficient: r.coeficient,
      createdAt: r.createdAt,
    })),
    toReview: toReview.map((r) => ({
      id: r.id,
      studentId: r.studentId,
      exerciceId: r.exerciceId,
      exerciceTitle: r.exercice?.title ?? null,
      createdAt: r.createdAt,
    })),
  };
};
