import { prisma } from "@/lib/db";

/**
 * Données brutes de la progression d'un élève : ses copies, les exercices
 * attribués à son groupe et la couleur de chaque matière.
 */
export const getStudentProgressRawData = async (studentId: string) => {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: { name: true, groupId: true },
  });
  if (!student) return null;

  const [results, assigned, subjects] = await Promise.all([
    prisma.studentExercice.findMany({
      where: { studentId },
      select: {
        id: true,
        exerciceId: true,
        subject: true,
        note: true,
        coeficient: true,
        createdAt: true,
        exercice: { select: { title: true } },
      },
      orderBy: { createdAt: "asc" },
    }),
    student.groupId
      ? prisma.exercice.findMany({
          // Seuls les contrôles comptent (les entraînements ne sont pas notés)
          where: { kind: "CONTROL", groups: { some: { id: student.groupId } } },
          select: {
            id: true,
            lesson: { select: { LessonSubject: { select: { label: true } } } },
          },
        })
      : Promise.resolve([]),
    prisma.lessonSubject.findMany({ select: { label: true, color: true } }),
  ]);

  return {
    studentName: student.name,
    results: results.map((r) => ({
      id: r.id,
      exerciceId: r.exerciceId,
      exerciceTitle: r.exercice?.title ?? null,
      subject: r.subject,
      note: r.note,
      coeficient: r.coeficient,
      createdAt: r.createdAt,
    })),
    assigned: assigned.map((e) => ({ id: e.id, subject: e.lesson.LessonSubject.label })),
    subjectColors: Object.fromEntries(subjects.map((s) => [s.label, s.color])),
  };
};
