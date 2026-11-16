"use server";

import { closeExpiredControlsSafeData } from "@/data/exercice/control-closure.data";
import { getGroupByStudentIdData } from "@/data/group.data";
import {
  getLessonActivitiesForStudentData,
  getLessonInGroupData,
} from "@/data/lesson/lesson-activities.data";
import { currentUser } from "@/lib/auth";
import { buildLessonActivities } from "@/lib/lesson-activities";

const UNAUTHORIZED = "Action non autorisée !";
const NOT_FOUND = "Cette leçon n'existe pas !";

/**
 * Exercices et contrôles d'une leçon que le professeur a attribués au groupe
 * de l'élève connecté, avec son avancement.
 */
export const getLessonActivitiesAction = async (lessonId: string) => {
  const student = await currentUser();
  if (!student?.id || student.role !== "STUDENT") {
    return { error: UNAUTHORIZED, data: null };
  }

  try {
    const group = await getGroupByStudentIdData(student.id);
    if (!group) return { error: NOT_FOUND, data: null };

    // La leçon elle-même doit être attribuée au groupe de l'élève
    const lesson = await getLessonInGroupData(lessonId, group.id);
    if (!lesson) return { error: NOT_FOUND, data: null };

    // Un contrôle dont la date de clôture est passée reçoit d'abord sa note
    await closeExpiredControlsSafeData();

    const rows = await getLessonActivitiesForStudentData(
      lessonId,
      group.id,
      student.id
    );
    return { success: "Activités trouvées", data: buildLessonActivities(rows) };
  } catch (error) {
    console.error("Error fetching lesson activities:", error);
    return {
      error: "Une erreur est survenue lors de la recherche des exercices",
      data: null,
    };
  }
};
