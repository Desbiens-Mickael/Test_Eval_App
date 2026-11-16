"use server";

import { getStudentPracticeTrackingData } from "@/data/exercice/practice-data";
import { currentUser } from "@/lib/auth";
import { buildPracticeTracking } from "@/lib/practice-tracking";

/**
 * Suivi des entraînements d'un élève (courbe des essais par exercice).
 * Réservé au professeur de l'élève.
 */
export const getStudentPracticeTrackingAction = async (studentId: string) => {
  const user = await currentUser();
  if (!user?.id || user.role !== "ADMIN") {
    return { error: "Action non autorisée !", data: null };
  }

  try {
    const exercises = await getStudentPracticeTrackingData(studentId, user.id);
    if (!exercises) return { error: "Élève non trouvé", data: null };

    return {
      success: "Suivi trouvé",
      data: buildPracticeTracking(
        exercises.map((e) => ({
          id: e.id,
          title: e.title,
          subject: e.lesson.LessonSubject.label,
          subjectColor: e.lesson.LessonSubject.color,
          type: e.type.name,
          attempts: e.practiceAttempts,
          correctionSeenAt: e.practiceCorrections[0]?.revealedAt ?? null,
        }))
      ),
    };
  } catch (error) {
    console.error("Error building practice tracking:", error);
    return {
      error: "Une erreur est survenue lors du calcul du suivi des exercices",
      data: null,
    };
  }
};
