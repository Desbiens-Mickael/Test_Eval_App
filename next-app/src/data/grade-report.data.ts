import { prisma } from "@/lib/db";

/** Données du relevé d'un groupe (uniquement si le groupe appartient au professeur) */
export const getGroupGradeReportData = async (groupId: string, teacherId: string) => {
  const group = await prisma.group.findUnique({
    where: { id: groupId, authorId: teacherId },
    select: {
      name: true,
      students: { select: { id: true, name: true, identifier: true } },
      // Seuls les contrôles figurent au relevé de notes
      exercices: {
        where: { kind: "CONTROL" },
        select: { id: true, title: true, lesson: { select: { LessonSubject: { select: { label: true } } } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });
  if (!group) return null;

  const results = await prisma.studentExercice.findMany({
    where: {
      studentId: { in: group.students.map((s) => s.id) },
      exerciceId: { in: group.exercices.map((e) => e.id) },
    },
    select: { studentId: true, exerciceId: true, note: true, coeficient: true },
  });

  return {
    groupName: group.name,
    students: group.students,
    exercises: group.exercices.map((e) => ({
      id: e.id,
      title: e.title,
      subject: e.lesson.LessonSubject.label,
    })),
    results,
  };
};

/** Données du relevé d'un élève (uniquement si c'est un élève du professeur) */
export const getStudentGradeReportData = async (studentId: string, teacherId: string) => {
  const student = await prisma.student.findUnique({
    where: { id: studentId, professorId: teacherId },
    select: {
      name: true,
      identifier: true,
      groupStudent: { select: { name: true } },
      studentExercices: {
        select: {
          subject: true,
          note: true,
          coeficient: true,
          autoNote: true,
          teacherComment: true,
          createdAt: true,
          exercice: { select: { title: true } },
        },
      },
    },
  });
  if (!student) return null;

  return {
    student: {
      name: student.name,
      identifier: student.identifier,
      groupName: student.groupStudent?.name ?? null,
    },
    results: student.studentExercices.map((r) => ({
      exerciceTitle: r.exercice?.title ?? null,
      subject: r.subject,
      note: r.note,
      coeficient: r.coeficient,
      autoNote: r.autoNote,
      teacherComment: r.teacherComment,
      createdAt: r.createdAt,
    })),
  };
};
