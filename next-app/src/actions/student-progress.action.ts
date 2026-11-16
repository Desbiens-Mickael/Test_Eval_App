"use server";

import { closeExpiredControlsSafeData } from "@/data/exercice/control-closure.data";
import { getStudentProgressRawData } from "@/data/dashboard/student-progress.data";
import { currentUser } from "@/lib/auth";
import { buildStudentProgress } from "@/lib/student-progress";

/**
 * Progression de l'élève connecté (réussite par matière, historique, badges).
 * Un élève ne peut consulter que sa propre progression.
 */
export const getStudentProgressAction = async () => {
  const user = await currentUser();
  if (!user?.id || user.role !== "STUDENT") {
    return { error: "Action non autoriser !" as const };
  }

  try {
    await closeExpiredControlsSafeData();
    const raw = await getStudentProgressRawData(user.id);
    if (!raw) return { error: "Élève introuvable." as const };

    return {
      success: true as const,
      data: {
        studentName: raw.studentName,
        progress: buildStudentProgress(raw),
      },
    };
  } catch (error) {
    console.error("Error building student progress:", error);
    return {
      error: "Une erreur est survenue lors du calcul de ta progression." as const,
    };
  }
};
