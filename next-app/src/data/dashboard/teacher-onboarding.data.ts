import { prisma } from "@/lib/db";

export type TeacherOnboarding = {
  hasStudents: boolean;
  hasGroupWithStudents: boolean;
  hasLessons: boolean;
  hasExercices: boolean;
  hasAssignments: boolean;
  hasSubmissions: boolean;
};

/**
 * Avancement des « Premiers pas » d'un professeur : chaque étape est cochée
 * d'après ses vraies données, sans rien stocker de plus.
 */
export const getTeacherOnboardingData = async (
  teacherId: string
): Promise<TeacherOnboarding> => {
  const [students, groupsWithStudents, lessons, exercices, assignedGroups, submissions] =
    await Promise.all([
      prisma.student.count({ where: { professorId: teacherId } }),
      prisma.group.count({
        where: { authorId: teacherId, students: { some: {} } },
      }),
      prisma.lesson.count({ where: { authorId: teacherId } }),
      prisma.exercice.count({ where: { authorId: teacherId } }),
      prisma.group.count({
        where: {
          authorId: teacherId,
          OR: [{ lessons: { some: {} } }, { exercices: { some: {} } }],
        },
      }),
      prisma.studentExercice.count({
        where: { student: { professorId: teacherId } },
      }),
    ]);

  return {
    hasStudents: students > 0,
    hasGroupWithStudents: groupsWithStudents > 0,
    hasLessons: lessons > 0,
    hasExercices: exercices > 0,
    hasAssignments: assignedGroups > 0,
    hasSubmissions: submissions > 0,
  };
};
